from django.utils import timezone
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from hrmsApps.accounts.models import User
from hrmsApps.accounts.permissions import IsAdminRole

from .models import Leave
from .serializers import LeaveReviewSerializer, LeaveSerializer


class LeaveListCreateView(generics.ListCreateAPIView):
    """Employee: list own leaves + apply for new leave. Admin: list all (filterable by status)."""

    serializer_class = LeaveSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Leave.objects.select_related("employee", "reviewed_by").all()
        if user.role != User.Role.ADMIN:
            qs = qs.filter(employee=user)
        else:
            employee_id = self.request.query_params.get("employee")
            if employee_id:
                qs = qs.filter(employee_id=employee_id)
        status_param = self.request.query_params.get("status")
        if status_param:
            qs = qs.filter(status=status_param)
        return qs

    def perform_create(self, serializer):
        serializer.save(employee=self.request.user)


class LeaveDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = LeaveSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == User.Role.ADMIN:
            return Leave.objects.all()
        return Leave.objects.filter(employee=user)


class LeaveReviewView(APIView):
    """Admin approves/rejects a leave request."""

    permission_classes = [IsAdminRole]

    def post(self, request, pk):
        try:
            leave = Leave.objects.get(pk=pk)
        except Leave.DoesNotExist:
            return Response({"detail": "Leave request not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = LeaveReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        leave.status = serializer.validated_data["status"]
        leave.admin_remarks = serializer.validated_data.get("admin_remarks", "")
        leave.reviewed_by = request.user
        leave.reviewed_on = timezone.now()
        leave.save()

        return Response(LeaveSerializer(leave).data)

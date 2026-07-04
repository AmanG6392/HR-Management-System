from datetime import date as date_cls

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from hrmsApps.accounts.models import User
from hrmsApps.accounts.permissions import IsAdminRole

from .models import Attendance
from .serializers import AttendanceSerializer, BulkAttendanceSerializer


class AttendanceListView(generics.ListAPIView):
    """Admin sees all (filterable by employee/month/year). Employee sees only their own."""

    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Attendance.objects.select_related("employee", "marked_by").all()
        if user.role != User.Role.ADMIN:
            qs = qs.filter(employee=user)
        else:
            employee_id = self.request.query_params.get("employee")
            if employee_id:
                qs = qs.filter(employee_id=employee_id)

        month = self.request.query_params.get("month")
        year = self.request.query_params.get("year")
        if month and year:
            qs = qs.filter(date__month=month, date__year=year)
        return qs.order_by("-date")


class MarkAttendanceView(APIView):
    """Admin marks/updates attendance for a single employee on a date (upsert)."""

    permission_classes = [IsAdminRole]

    def post(self, request):
        serializer = AttendanceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        employee = serializer.validated_data["employee"]
        date_val = serializer.validated_data["date"]
        record, _created = Attendance.objects.update_or_create(
            employee=employee,
            date=date_val,
            defaults={
                "status": serializer.validated_data.get("status", Attendance.Status.PRESENT),
                "remarks": serializer.validated_data.get("remarks", ""),
                "marked_by": request.user,
            },
        )
        return Response(AttendanceSerializer(record).data, status=status.HTTP_200_OK)


class BulkMarkAttendanceView(APIView):
    """Admin marks attendance for many employees on one date in a single request."""

    permission_classes = [IsAdminRole]

    def post(self, request):
        serializer = BulkAttendanceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        date_val = serializer.validated_data["date"]
        results = []
        for item in serializer.validated_data["records"]:
            record, _created = Attendance.objects.update_or_create(
                employee_id=item["employee"],
                date=date_val,
                defaults={
                    "status": item["status"],
                    "remarks": item.get("remarks", ""),
                    "marked_by": request.user,
                },
            )
            results.append(AttendanceSerializer(record).data)
        return Response(results, status=status.HTTP_200_OK)


class MonthlySummaryView(APIView):
    """Per-employee summary counts for a given month/year. Defaults to current month."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today = date_cls.today()
        month = int(request.query_params.get("month", today.month))
        year = int(request.query_params.get("year", today.year))

        qs = Attendance.objects.filter(date__month=month, date__year=year)
        if user.role != User.Role.ADMIN:
            qs = qs.filter(employee=user)
        else:
            employee_id = request.query_params.get("employee")
            if employee_id:
                qs = qs.filter(employee_id=employee_id)

        summary = {
            "present": qs.filter(status=Attendance.Status.PRESENT).count(),
            "absent": qs.filter(status=Attendance.Status.ABSENT).count(),
            "half_day": qs.filter(status=Attendance.Status.HALF_DAY).count(),
            "on_leave": qs.filter(status=Attendance.Status.ON_LEAVE).count(),
            "month": month,
            "year": year,
        }
        return Response(summary)

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from hrmsApps.accounts.models import User
from hrmsApps.accounts.permissions import IsAdminRole

from .models import Document
from .serializers import DocumentSerializer


class DocumentListCreateView(generics.ListCreateAPIView):
    """Admin: issue letters for any employee + view all. Employee: view own only."""

    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Document.objects.select_related("employee", "issued_by").all()
        if user.role != User.Role.ADMIN:
            qs = qs.filter(employee=user)
        else:
            employee_id = self.request.query_params.get("employee")
            if employee_id:
                qs = qs.filter(employee_id=employee_id)
            doc_type = self.request.query_params.get("doc_type")
            if doc_type:
                qs = qs.filter(doc_type=doc_type)
        return qs

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAdminRole()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(issued_by=self.request.user)


class DocumentDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == User.Role.ADMIN:
            return Document.objects.all()
        return Document.objects.filter(employee=user)

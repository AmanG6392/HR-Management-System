from rest_framework import serializers

from hrmsApps.accounts.serializers import UserSerializer
from .models import Document


class DocumentSerializer(serializers.ModelSerializer):
    employee_detail = UserSerializer(source="employee", read_only=True)

    class Meta:
        model = Document
        fields = [
            "id", "employee", "employee_detail", "doc_type", "title",
            "content", "file", "issued_date", "issued_by",
        ]
        read_only_fields = ["id", "issued_date", "issued_by"]

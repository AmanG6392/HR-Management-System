from rest_framework import serializers

from hrmsApps.accounts.serializers import UserSerializer
from .models import Leave


class LeaveSerializer(serializers.ModelSerializer):
    employee_detail = UserSerializer(source="employee", read_only=True)
    total_days = serializers.ReadOnlyField()

    class Meta:
        model = Leave
        fields = [
            "id", "employee", "employee_detail", "leave_type", "start_date", "end_date",
            "reason", "status", "applied_on", "reviewed_by", "reviewed_on",
            "admin_remarks", "total_days",
        ]
        read_only_fields = ["id", "status", "applied_on", "reviewed_by", "reviewed_on", "employee"]

    def validate(self, attrs):
        if attrs["end_date"] < attrs["start_date"]:
            raise serializers.ValidationError("End date cannot be before start date.")
        return attrs


class LeaveReviewSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=[Leave.Status.APPROVED, Leave.Status.REJECTED])
    admin_remarks = serializers.CharField(required=False, allow_blank=True, default="")

from rest_framework import serializers

from hrmsApps.accounts.serializers import UserSerializer
from .models import Attendance


class AttendanceSerializer(serializers.ModelSerializer):
    employee_detail = UserSerializer(source="employee", read_only=True)

    class Meta:
        model = Attendance
        fields = [
            "id", "employee", "employee_detail", "date", "status",
            "remarks", "marked_by", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "marked_by", "created_at", "updated_at"]


class BulkAttendanceItemSerializer(serializers.Serializer):
    employee = serializers.IntegerField()
    status = serializers.ChoiceField(choices=Attendance.Status.choices)
    remarks = serializers.CharField(required=False, allow_blank=True, default="")


class BulkAttendanceSerializer(serializers.Serializer):
    date = serializers.DateField()
    records = BulkAttendanceItemSerializer(many=True)

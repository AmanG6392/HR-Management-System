from rest_framework import serializers

from .models import Holiday


class HolidaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Holiday
        fields = ["id", "name", "date", "description", "created_by", "created_at"]
        read_only_fields = ["id", "created_by", "created_at"]

from django.contrib import admin

from .models import Attendance


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ("employee", "date", "status", "marked_by")
    list_filter = ("status", "date")
    search_fields = ("employee__username", "employee__employee_id")

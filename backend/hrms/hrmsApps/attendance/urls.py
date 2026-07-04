from django.urls import path

from .views import (
    AttendanceListView,
    BulkMarkAttendanceView,
    MarkAttendanceView,
    MonthlySummaryView,
)

urlpatterns = [
    path("", AttendanceListView.as_view(), name="attendance_list"),
    path("mark/", MarkAttendanceView.as_view(), name="attendance_mark"),
    path("bulk-mark/", BulkMarkAttendanceView.as_view(), name="attendance_bulk_mark"),
    path("summary/", MonthlySummaryView.as_view(), name="attendance_summary"),
]

from django.urls import path

from .views import AdminDashboardView, EmployeeDashboardView

urlpatterns = [
    path("admin/", AdminDashboardView.as_view(), name="admin_dashboard"),
    path("employee/", EmployeeDashboardView.as_view(), name="employee_dashboard"),
]

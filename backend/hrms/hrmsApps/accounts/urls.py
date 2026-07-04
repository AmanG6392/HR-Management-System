from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    ChangePasswordView,
    EmployeeDetailView,
    EmployeeListCreateView,
    EmployeeLookupListView,
    LoginView,
    MeView,
)

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("me/", MeView.as_view(), name="me"),
    path("change-password/", ChangePasswordView.as_view(), name="change_password"),
    path("employees/", EmployeeListCreateView.as_view(), name="employee_list_create"),
    path("employees/lookup/", EmployeeLookupListView.as_view(), name="employee_lookup"),
    path("employees/<int:pk>/", EmployeeDetailView.as_view(), name="employee_detail"),
]

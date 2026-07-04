from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    list_display = ("username", "employee_id", "email", "role", "department", "designation", "is_active_employee")
    list_filter = ("role", "department", "is_active_employee")
    fieldsets = DjangoUserAdmin.fieldsets + (
        ("HRMS Info", {
            "fields": (
                "role", "employee_id", "phone", "department", "designation",
                "date_of_joining", "profile_photo", "is_active_employee",
            )
        }),
    )

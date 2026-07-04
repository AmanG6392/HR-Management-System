import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models


def generate_employee_id():
    return f"EMP{uuid.uuid4().hex[:6].upper()}"


class User(AbstractUser):
    """
    Custom user model. role decides Admin vs Employee dashboards/permissions.
    """

    class Role(models.TextChoices):
        ADMIN = "admin", "Admin"
        EMPLOYEE = "employee", "Employee"

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.EMPLOYEE)
    employee_id = models.CharField(max_length=20, unique=True, default=generate_employee_id)
    phone = models.CharField(max_length=20, blank=True)
    department = models.CharField(max_length=100, blank=True)
    designation = models.CharField(max_length=100, blank=True)
    date_of_joining = models.DateField(null=True, blank=True)
    profile_photo = models.ImageField(upload_to="profile_photos/", null=True, blank=True)
    is_active_employee = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.employee_id})"

    @property
    def is_admin_role(self):
        return self.role == self.Role.ADMIN

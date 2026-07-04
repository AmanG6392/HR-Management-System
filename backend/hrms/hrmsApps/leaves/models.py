from django.conf import settings
from django.db import models


class Leave(models.Model):
    class LeaveType(models.TextChoices):
        CASUAL = "casual", "Casual Leave"
        SICK = "sick", "Sick Leave"
        EARNED = "earned", "Earned Leave"
        UNPAID = "unpaid", "Unpaid Leave"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    employee = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="leaves"
    )
    leave_type = models.CharField(max_length=20, choices=LeaveType.choices, default=LeaveType.CASUAL)
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    applied_on = models.DateTimeField(auto_now_add=True)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="leaves_reviewed",
    )
    reviewed_on = models.DateTimeField(null=True, blank=True)
    admin_remarks = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ["-applied_on"]

    @property
    def total_days(self):
        return (self.end_date - self.start_date).days + 1

    def __str__(self):
        return f"{self.employee} - {self.leave_type} ({self.status})"

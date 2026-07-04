from django.conf import settings
from django.db import models


class Holiday(models.Model):
    name = models.CharField(max_length=150)
    date = models.DateField()
    description = models.CharField(max_length=255, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="holidays_created"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["date"]

    def __str__(self):
        return f"{self.name} - {self.date}"

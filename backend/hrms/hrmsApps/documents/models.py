from django.conf import settings
from django.db import models


class Document(models.Model):
    class DocType(models.TextChoices):
        OFFER_LETTER = "offer_letter", "Offer Letter"
        EXPERIENCE_LETTER = "experience_letter", "Experience Letter"
        RECOMMENDATION_LETTER = "recommendation_letter", "Recommendation Letter"

    employee = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="documents"
    )
    doc_type = models.CharField(max_length=30, choices=DocType.choices)
    title = models.CharField(max_length=200)
    content = models.TextField(help_text="Generated/edited letter body text.")
    file = models.FileField(upload_to="documents/", null=True, blank=True)
    issued_date = models.DateField(auto_now_add=True)
    issued_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="documents_issued"
    )

    class Meta:
        ordering = ["-issued_date"]

    def __str__(self):
        return f"{self.get_doc_type_display()} - {self.employee}"

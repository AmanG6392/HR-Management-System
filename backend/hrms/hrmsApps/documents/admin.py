from django.contrib import admin

from .models import Document


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ("employee", "doc_type", "title", "issued_date")
    list_filter = ("doc_type",)

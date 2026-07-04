from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("hrmsApps.accounts.urls")),
    path("api/attendance/", include("hrmsApps.attendance.urls")),
    path("api/leaves/", include("hrmsApps.leaves.urls")),
    path("api/holidays/", include("hrmsApps.holidays.urls")),
    path("api/documents/", include("hrmsApps.documents.urls")),
    path("api/dashboard/", include("hrmsApps.dashboard.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

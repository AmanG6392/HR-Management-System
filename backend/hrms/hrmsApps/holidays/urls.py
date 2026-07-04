from django.urls import path

from .views import HolidayDetailView, HolidayListCreateView

urlpatterns = [
    path("", HolidayListCreateView.as_view(), name="holiday_list_create"),
    path("<int:pk>/", HolidayDetailView.as_view(), name="holiday_detail"),
]

from django.urls import path

from .views import LeaveDetailView, LeaveListCreateView, LeaveReviewView

urlpatterns = [
    path("", LeaveListCreateView.as_view(), name="leave_list_create"),
    path("<int:pk>/", LeaveDetailView.as_view(), name="leave_detail"),
    path("<int:pk>/review/", LeaveReviewView.as_view(), name="leave_review"),
]

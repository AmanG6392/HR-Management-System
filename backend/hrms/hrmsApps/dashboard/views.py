from datetime import date as date_cls, timedelta

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from hrmsApps.accounts.models import User
from hrmsApps.accounts.permissions import IsAdminRole
from hrmsApps.accounts.serializers import UserSerializer
from hrmsApps.attendance.models import Attendance
from hrmsApps.attendance.serializers import AttendanceSerializer
from hrmsApps.holidays.models import Holiday
from hrmsApps.holidays.serializers import HolidaySerializer
from hrmsApps.leaves.models import Leave
from hrmsApps.leaves.serializers import LeaveSerializer


class AdminDashboardView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        today = date_cls.today()

        total_employees = User.objects.filter(role=User.Role.EMPLOYEE, is_active_employee=True).count()

        today_qs = Attendance.objects.filter(date=today)
        present_today = today_qs.filter(status=Attendance.Status.PRESENT).count()
        absent_today = today_qs.filter(status=Attendance.Status.ABSENT).count()
        on_leave_today = today_qs.filter(status=Attendance.Status.ON_LEAVE).count()
        marked_today = today_qs.count()
        not_marked_today = max(total_employees - marked_today, 0)

        pending_leaves = Leave.objects.filter(status=Leave.Status.PENDING).count()
        recent_leave_requests = Leave.objects.filter(status=Leave.Status.PENDING).order_by("-applied_on")[:5]

        upcoming_holidays = Holiday.objects.filter(date__gte=today).order_by("date")[:5]

        # Per-employee attendance summary for current month
        month_qs = Attendance.objects.filter(date__month=today.month, date__year=today.year)
        per_employee = []
        for employee in User.objects.filter(role=User.Role.EMPLOYEE, is_active_employee=True):
            emp_qs = month_qs.filter(employee=employee)
            per_employee.append({
                "employee": UserSerializer(employee).data,
                "present": emp_qs.filter(status=Attendance.Status.PRESENT).count(),
                "absent": emp_qs.filter(status=Attendance.Status.ABSENT).count(),
                "half_day": emp_qs.filter(status=Attendance.Status.HALF_DAY).count(),
                "on_leave": emp_qs.filter(status=Attendance.Status.ON_LEAVE).count(),
            })

        return Response({
            "total_employees": total_employees,
            "today": {
                "present": present_today,
                "absent": absent_today,
                "on_leave": on_leave_today,
                "not_marked": not_marked_today,
            },
            "pending_leaves_count": pending_leaves,
            "recent_leave_requests": LeaveSerializer(recent_leave_requests, many=True).data,
            "upcoming_holidays": HolidaySerializer(upcoming_holidays, many=True).data,
            "employee_attendance_summary": per_employee,
        })


class EmployeeDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today = date_cls.today()

        month_qs = Attendance.objects.filter(employee=user, date__month=today.month, date__year=today.year)
        attendance_summary = {
            "present": month_qs.filter(status=Attendance.Status.PRESENT).count(),
            "absent": month_qs.filter(status=Attendance.Status.ABSENT).count(),
            "half_day": month_qs.filter(status=Attendance.Status.HALF_DAY).count(),
            "on_leave": month_qs.filter(status=Attendance.Status.ON_LEAVE).count(),
        }

        leave_qs = Leave.objects.filter(employee=user)
        leave_summary = {
            "pending": leave_qs.filter(status=Leave.Status.PENDING).count(),
            "approved": leave_qs.filter(status=Leave.Status.APPROVED).count(),
            "rejected": leave_qs.filter(status=Leave.Status.REJECTED).count(),
        }
        recent_leaves = leave_qs.order_by("-applied_on")[:5]

        upcoming_holidays = Holiday.objects.filter(date__gte=today).order_by("date")[:5]

        today_attendance = Attendance.objects.filter(employee=user, date=today).first()

        return Response({
            "attendance_summary": attendance_summary,
            "leave_summary": leave_summary,
            "recent_leaves": LeaveSerializer(recent_leaves, many=True).data,
            "upcoming_holidays": HolidaySerializer(upcoming_holidays, many=True).data,
            "today_status": AttendanceSerializer(today_attendance).data if today_attendance else None,
        })

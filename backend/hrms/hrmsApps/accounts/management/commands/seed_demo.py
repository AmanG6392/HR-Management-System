from datetime import date, timedelta

from django.core.management.base import BaseCommand

from hrmsApps.accounts.models import User
from hrmsApps.holidays.models import Holiday


class Command(BaseCommand):
    help = "Seeds demo admin + employee accounts and a couple of holidays."

    def handle(self, *args, **options):
        if not User.objects.filter(username="admin").exists():
            admin = User.objects.create_superuser(
                username="admin", email="admin@hrms.local", password="Admin@123",
                first_name="HR", last_name="Admin",
            )
            admin.role = User.Role.ADMIN
            admin.department = "Human Resources"
            admin.designation = "HR Manager"
            admin.save()
            self.stdout.write(self.style.SUCCESS("Created admin (username=admin, password=Admin@123)"))
        else:
            self.stdout.write("Admin already exists, skipping.")

        if not User.objects.filter(username="employee1").exists():
            emp = User.objects.create_user(
                username="employee1", email="employee1@hrms.local", password="Employee@123",
                first_name="John", last_name="Doe",
            )
            emp.role = User.Role.EMPLOYEE
            emp.department = "Engineering"
            emp.designation = "Software Engineer"
            emp.date_of_joining = date.today() - timedelta(days=200)
            emp.save()
            self.stdout.write(self.style.SUCCESS("Created employee (username=employee1, password=Employee@123)"))
        else:
            self.stdout.write("Demo employee already exists, skipping.")

        admin_user = User.objects.filter(role=User.Role.ADMIN).first()
        if not Holiday.objects.exists() and admin_user:
            Holiday.objects.create(name="New Year", date=date(date.today().year, 1, 1), created_by=admin_user)
            Holiday.objects.create(name="Independence Day", date=date(date.today().year, 8, 15), created_by=admin_user)
            self.stdout.write(self.style.SUCCESS("Seeded sample holidays."))

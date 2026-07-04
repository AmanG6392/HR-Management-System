# HRMS Backend (Django REST API)

## Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cd hrms
python manage.py makemigrations accounts attendance leaves holidays documents dashboard
python manage.py migrate
python manage.py seed_demo       # creates admin/admin's password + a demo employee + holidays
python manage.py runserver
```

Demo logins (from `seed_demo`):
- Admin: `admin` / `Admin@123`
- Employee: `employee1` / `Employee@123`

## API Base
`http://127.0.0.1:8000/api/`

- `POST /api/auth/login/` -> {access, refresh, user}
- `POST /api/auth/token/refresh/`
- `GET/PATCH /api/auth/me/`
- `POST /api/auth/change-password/`
- `GET/POST /api/auth/employees/` (admin)
- `GET /api/auth/employees/lookup/` (admin, dropdown list)
- `GET/PUT/PATCH/DELETE /api/auth/employees/<id>/` (admin)

- `GET /api/attendance/` (filters: employee, month, year)
- `POST /api/attendance/mark/` (admin, single upsert)
- `POST /api/attendance/bulk-mark/` (admin, bulk upsert for a date)
- `GET /api/attendance/summary/` (filters: employee, month, year)

- `GET/POST /api/leaves/`
- `GET/DELETE /api/leaves/<id>/`
- `POST /api/leaves/<id>/review/` (admin: approve/reject)

- `GET/POST /api/holidays/` (POST = admin only)
- `GET/PUT/PATCH/DELETE /api/holidays/<id>/`

- `GET/POST /api/documents/` (POST = admin only, issues offer/experience/recommendation letters)
- `GET/DELETE /api/documents/<id>/`

- `GET /api/dashboard/admin/`
- `GET /api/dashboard/employee/`

## Notes
- CORS is open to `http://localhost:5173` (Vite dev server) by default — adjust `CORS_ALLOWED_ORIGINS` env var in production.
- Set `DJANGO_DEBUG=False` and a real `DJANGO_SECRET_KEY` + `DJANGO_ALLOWED_HOSTS` before deploying.
- For full production setup (Postgres, gunicorn, nginx, HTTPS, env vars) see `../DEPLOYMENT.md`.

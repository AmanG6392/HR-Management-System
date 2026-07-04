# Orbit HRMS — Frontend (React + Vite + Tailwind)

A responsive, role-based HR management UI (Admin console + Employee portal) that talks
to the Django REST backend over axios + JWT.

## Setup
```bash
cd frontend
npm install
cp .env.example .env      # point VITE_API_BASE_URL at your backend
npm run dev                # http://localhost:5173
```

## Build for production
```bash
npm run build              # outputs to dist/
npm run preview            # sanity-check the production build locally
```

## Project structure
```
src/
  api/            axios client (with JWT refresh interceptor) + endpoint modules
  components/     shared UI: AppShell (sidebar/topbar), StatCard, Modal, etc.
  context/        AuthContext (login/session), ToastContext (notifications)
  pages/admin/    Admin console screens
  pages/employee/ Employee portal screens
  routes/         route guards (ProtectedRoute, RoleRoute, GuestRoute)
  utils/          formatting + error-message helpers
```

## Connecting to the backend
The frontend never hardcodes the API host — it reads `VITE_API_BASE_URL` from `.env`
(see `.env.example`). In production, set this to your deployed API's URL, e.g.
`https://api.yourcompany.com/api`, and make sure that backend's `CORS_ALLOWED_ORIGINS`
includes your frontend's deployed origin.

Demo logins (created by the backend's `seed_demo` management command):
- Admin: `admin` / `Admin@123`
- Employee: `employee1` / `Employee@123`

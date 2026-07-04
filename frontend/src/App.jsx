import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { GuestRoute, ProtectedRoute, RoleRoute } from "./routes/ProtectedRoute";
import { PageLoader } from "./components/Spinner";

import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminAttendance from "./pages/admin/Attendance";
import AdminLeaves from "./pages/admin/Leaves";
import AdminHolidays from "./pages/admin/Holidays";
import AdminDocuments from "./pages/admin/Documents";
import AdminEmployees from "./pages/admin/Employees";
import AdminProfile from "./pages/admin/Profile";

import EmployeeDashboard from "./pages/employee/Dashboard";
import EmployeeAttendance from "./pages/employee/Attendance";
import EmployeeLeaves from "./pages/employee/Leaves";
import EmployeeHolidays from "./pages/employee/Holidays";
import EmployeeDocuments from "./pages/employee/Documents";
import EmployeeProfile from "./pages/employee/Profile";

function RootRedirect() {
  const { loading, isAuthenticated, user } = useAuth();
  if (loading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={user?.role === "admin" ? "/admin" : "/employee"} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<RootRedirect />} />

            <Route element={<GuestRoute />}>
              <Route path="/login" element={<Login />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<RoleRoute role="admin" />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/attendance" element={<AdminAttendance />} />
                <Route path="/admin/leaves" element={<AdminLeaves />} />
                <Route path="/admin/holidays" element={<AdminHolidays />} />
                <Route path="/admin/documents" element={<AdminDocuments />} />
                <Route path="/admin/employees" element={<AdminEmployees />} />
                <Route path="/admin/profile" element={<AdminProfile />} />
              </Route>

              <Route element={<RoleRoute role="employee" />}>
                <Route path="/employee" element={<EmployeeDashboard />} />
                <Route path="/employee/attendance" element={<EmployeeAttendance />} />
                <Route path="/employee/leaves" element={<EmployeeLeaves />} />
                <Route path="/employee/holidays" element={<EmployeeHolidays />} />
                <Route path="/employee/documents" element={<EmployeeDocuments />} />
                <Route path="/employee/profile" element={<EmployeeProfile />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

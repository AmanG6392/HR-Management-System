import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PageLoader } from "../components/Spinner";

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <PageLoader label="Checking your session..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function RoleRoute({ role }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (user?.role !== role) {
    return <Navigate to={user?.role === "admin" ? "/admin" : "/employee"} replace />;
  }
  return <Outlet />;
}

export function GuestRoute() {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return <PageLoader />;
  if (isAuthenticated) return <Navigate to={user?.role === "admin" ? "/admin" : "/employee"} replace />;
  return <Outlet />;
}

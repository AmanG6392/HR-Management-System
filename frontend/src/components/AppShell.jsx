import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, CalendarCheck, CalendarDays, FileText, Users,
  Menu, X, LogOut, ChevronDown, Settings,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import SealAvatar from "./SealAvatar";

const ADMIN_NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/admin/leaves", label: "Leave Requests", icon: CalendarDays },
  { to: "/admin/holidays", label: "Holidays", icon: CalendarDays },
  { to: "/admin/documents", label: "Documents", icon: FileText },
  { to: "/admin/employees", label: "Employees", icon: Users },
];

const EMPLOYEE_NAV = [
  { to: "/employee", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/employee/attendance", label: "My Attendance", icon: CalendarCheck },
  { to: "/employee/leaves", label: "My Leaves", icon: CalendarDays },
  { to: "/employee/holidays", label: "Holidays", icon: CalendarDays },
  { to: "/employee/documents", label: "My Documents", icon: FileText },
];

export default function AppShell({ children, title, subtitle }) {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const nav = isAdmin ? ADMIN_NAV : EMPLOYEE_NAV;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-ink-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-ink-100 bg-white transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2.5 border-b border-ink-100 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 font-display text-base font-bold text-white">
            O
          </div>
          <div>
            <p className="font-display text-base font-bold leading-tight text-ink-800">Orbit HRMS</p>
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-400">
              {isAdmin ? "Admin Console" : "Employee Portal"}
            </p>
          </div>
          <button
            className="ml-auto rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-ink-500 hover:bg-ink-50 hover:text-ink-700"
                }`
              }
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-ink-100 p-3">
          <NavLink
            to={isAdmin ? "/admin/profile" : "/employee/profile"}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-500 hover:bg-ink-50 hover:text-ink-700"
          >
            <Settings className="h-4.5 w-4.5" />
            Profile & Settings
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50"
          >
            <LogOut className="h-4.5 w-4.5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-ink-100 bg-white/80 px-4 py-3.5 backdrop-blur-md sm:px-6">
          <button
            className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-lg font-bold text-ink-800 sm:text-xl">{title}</h1>
            {subtitle && <p className="truncate text-xs text-ink-400 sm:text-sm">{subtitle}</p>}
          </div>

          <div className="relative">
            <button
              onClick={() => setProfileOpen((o) => !o)}
              className="flex items-center gap-2 rounded-xl border border-ink-100 px-2 py-1.5 hover:bg-ink-50"
            >
              <SealAvatar name={user?.full_name || user?.username} size="sm" tone={isAdmin ? "gold" : "brand"} />
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-semibold leading-tight text-ink-700">
                  {user?.full_name || user?.username}
                </span>
                <span className="block text-[11px] font-mono text-ink-400">{user?.employee_id}</span>
              </span>
              <ChevronDown className="h-4 w-4 text-ink-400" />
            </button>
            {profileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 z-20 mt-2 w-48 animate-scale-in rounded-xl border border-ink-100 bg-white py-1.5 shadow-soft">
                  <NavLink
                    to={isAdmin ? "/admin/profile" : "/employee/profile"}
                    className="block px-3.5 py-2 text-sm text-ink-600 hover:bg-ink-50"
                    onClick={() => setProfileOpen(false)}
                  >
                    Profile & Settings
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-3.5 py-2 text-left text-sm text-red-500 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:py-8">
          <div className="mx-auto max-w-7xl animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}

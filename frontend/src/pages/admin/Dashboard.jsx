import { useEffect, useState } from "react";
import { Users, UserCheck, UserX, CalendarClock, PartyPopper } from "lucide-react";
import AppShell from "../../components/AppShell";
import StatCard from "../../components/StatCard";
import { PageLoader } from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import { dashboardApi } from "../../api/endpoints";
import { formatDate } from "../../utils/format";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi
      .admin()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AppShell title="Dashboard"><PageLoader /></AppShell>;

  return (
    <AppShell title={`Good day, ${user?.first_name || "Admin"}`} subtitle="Here's what's happening across your team today.">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active Employees" value={data.total_employees} icon={Users} tone="brand" />
        <StatCard label="Present Today" value={data.today.present} icon={UserCheck} tone="emerald" />
        <StatCard label="Absent Today" value={data.today.absent} icon={UserX} tone="red" />
        <StatCard label="Pending Leaves" value={data.pending_leaves_count} icon={CalendarClock} tone="gold" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-ink-800">Recent Leave Requests</h2>
            <Link to="/admin/leaves" className="text-sm font-semibold text-brand-600 hover:underline">
              View all
            </Link>
          </div>
          {data.recent_leave_requests.length === 0 ? (
            <EmptyState icon={CalendarClock} title="No pending requests" description="All leave requests are reviewed." />
          ) : (
            <div className="divide-y divide-ink-100">
              {data.recent_leave_requests.map((lv) => (
                <div key={lv.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink-700">
                      {lv.employee_detail.full_name}
                    </p>
                    <p className="text-xs text-ink-400">
                      {formatDate(lv.start_date)} – {formatDate(lv.end_date)} · {lv.total_days} day(s)
                    </p>
                  </div>
                  <StatusBadge status={lv.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-ink-800">Upcoming Holidays</h2>
            <Link to="/admin/holidays" className="text-sm font-semibold text-brand-600 hover:underline">
              Manage
            </Link>
          </div>
          {data.upcoming_holidays.length === 0 ? (
            <EmptyState icon={PartyPopper} title="No upcoming holidays" />
          ) : (
            <ul className="space-y-3">
              {data.upcoming_holidays.map((h) => (
                <li key={h.id} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-gold-50 text-gold-700">
                    <span className="text-[10px] font-bold uppercase leading-none">
                      {formatDate(h.date, { month: "short" }).split(" ")[1]}
                    </span>
                    <span className="text-sm font-bold leading-none">
                      {new Date(h.date).getDate()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink-700">{h.name}</p>
                    <p className="truncate text-xs text-ink-400">{h.description || "Holiday"}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="card mt-5 p-5">
        <h2 className="mb-4 font-display text-base font-bold text-ink-800">
          Employee Attendance — This Month
        </h2>
        {data.employee_attendance_summary.length === 0 ? (
          <EmptyState icon={Users} title="No employees yet" description="Add employees to start tracking attendance." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400">
                  <th className="py-2 pr-4 font-semibold">Employee</th>
                  <th className="py-2 pr-4 font-semibold">Present</th>
                  <th className="py-2 pr-4 font-semibold">Absent</th>
                  <th className="py-2 pr-4 font-semibold">Half Day</th>
                  <th className="py-2 pr-4 font-semibold">On Leave</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {data.employee_attendance_summary.map((row) => (
                  <tr key={row.employee.id}>
                    <td className="py-2.5 pr-4 font-medium text-ink-700">{row.employee.full_name}</td>
                    <td className="py-2.5 pr-4 text-emerald-600">{row.present}</td>
                    <td className="py-2.5 pr-4 text-red-600">{row.absent}</td>
                    <td className="py-2.5 pr-4 text-amber-600">{row.half_day}</td>
                    <td className="py-2.5 pr-4 text-sky-600">{row.on_leave}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}

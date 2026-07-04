import { useEffect, useState } from "react";
import { CalendarCheck, CalendarDays, Clock3, PartyPopper } from "lucide-react";
import AppShell from "../../components/AppShell";
import StatCard from "../../components/StatCard";
import { PageLoader } from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import { dashboardApi } from "../../api/endpoints";
import { formatDate, titleCase } from "../../utils/format";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.employee().then((res) => setData(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <AppShell title="Dashboard"><PageLoader /></AppShell>;

  return (
    <AppShell title={`Hi, ${user?.first_name || "there"}`} subtitle="Here's your snapshot for this month.">
      <div className="mb-5 card flex flex-col items-start justify-between gap-3 bg-gradient-to-br from-brand-600 to-brand-800 p-5 text-white sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
            <Clock3 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-white/70">Today's status</p>
            <p className="font-display text-base font-bold">
              {data.today_status ? titleCase(data.today_status.status) : "Not marked yet"}
            </p>
          </div>
        </div>
        <Link to="/employee/leaves" className="btn-secondary !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
          Apply for Leave
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Present" value={data.attendance_summary.present} icon={CalendarCheck} tone="emerald" />
        <StatCard label="Absent" value={data.attendance_summary.absent} icon={CalendarCheck} tone="red" />
        <StatCard label="Half Day" value={data.attendance_summary.half_day} icon={CalendarCheck} tone="gold" />
        <StatCard label="On Leave" value={data.attendance_summary.on_leave} icon={CalendarCheck} tone="sky" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-ink-800">Recent Leave Applications</h2>
            <Link to="/employee/leaves" className="text-sm font-semibold text-brand-600 hover:underline">View all</Link>
          </div>
          {data.recent_leaves.length === 0 ? (
            <EmptyState icon={CalendarDays} title="No leave applications yet" />
          ) : (
            <div className="divide-y divide-ink-100">
              {data.recent_leaves.map((lv) => (
                <div key={lv.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink-700">{titleCase(lv.leave_type)}</p>
                    <p className="text-xs text-ink-400">{formatDate(lv.start_date)} – {formatDate(lv.end_date)}</p>
                  </div>
                  <StatusBadge status={lv.status} />
                </div>
              ))}
            </div>
          )}
          <div className="mt-3 grid grid-cols-3 gap-2 border-t border-ink-100 pt-3 text-center text-xs">
            <div><p className="font-display text-lg font-bold text-gold-600">{data.leave_summary.pending}</p><p className="text-ink-400">Pending</p></div>
            <div><p className="font-display text-lg font-bold text-emerald-600">{data.leave_summary.approved}</p><p className="text-ink-400">Approved</p></div>
            <div><p className="font-display text-lg font-bold text-red-600">{data.leave_summary.rejected}</p><p className="text-ink-400">Rejected</p></div>
          </div>
        </div>

        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-ink-800">Upcoming Holidays</h2>
            <Link to="/employee/holidays" className="text-sm font-semibold text-brand-600 hover:underline">View all</Link>
          </div>
          {data.upcoming_holidays.length === 0 ? (
            <EmptyState icon={PartyPopper} title="No upcoming holidays" />
          ) : (
            <ul className="space-y-3">
              {data.upcoming_holidays.map((h) => (
                <li key={h.id} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-gold-50 text-gold-700">
                    <span className="text-[10px] font-bold uppercase leading-none">{formatDate(h.date, { month: "short" }).split(" ")[1]}</span>
                    <span className="text-sm font-bold leading-none">{new Date(h.date).getDate()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink-700">{h.name}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppShell>
  );
}

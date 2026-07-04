import { useEffect, useMemo, useState } from "react";
import { CalendarCheck } from "lucide-react";
import AppShell from "../../components/AppShell";
import { PageLoader } from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import { attendanceApi } from "../../api/endpoints";
import { MONTH_NAMES } from "../../utils/format";

export default function EmployeeAttendance() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      attendanceApi.list({ month, year }),
      attendanceApi.summary({ month, year }),
    ])
      .then(([listRes, summaryRes]) => {
        setRecords(listRes.data.results ?? listRes.data);
        setSummary(summaryRes.data);
      })
      .finally(() => setLoading(false));
  }, [month, year]);

  const years = useMemo(() => {
    const y = new Date().getFullYear();
    return [y - 1, y, y + 1];
  }, []);

  return (
    <AppShell title="My Attendance" subtitle="View your attendance history month by month.">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <select className="input w-auto" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {MONTH_NAMES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
          <select className="input w-auto" value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <PageLoader />
      ) : (
        <>
          <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Present", value: summary?.present, tone: "text-emerald-600 bg-emerald-50" },
              { label: "Absent", value: summary?.absent, tone: "text-red-600 bg-red-50" },
              { label: "Half Day", value: summary?.half_day, tone: "text-amber-600 bg-amber-50" },
              { label: "On Leave", value: summary?.on_leave, tone: "text-sky-600 bg-sky-50" },
            ].map((s) => (
              <div key={s.label} className={`card p-4 text-center ${s.tone}`}>
                <p className="font-display text-2xl font-bold">{s.value ?? 0}</p>
                <p className="text-xs font-medium">{s.label}</p>
              </div>
            ))}
          </div>

          {records.length === 0 ? (
            <EmptyState icon={CalendarCheck} title="No attendance records" description="Nothing recorded for this month yet." />
          ) : (
            <div className="card overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-ink-50/70">
                  <tr className="text-xs uppercase tracking-wide text-ink-400">
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-50">
                  {records.map((r) => (
                    <tr key={r.id}>
                      <td className="px-5 py-3 text-ink-600">{r.date}</td>
                      <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                      <td className="px-5 py-3 text-ink-500">{r.remarks || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}

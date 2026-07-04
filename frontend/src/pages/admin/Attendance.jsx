import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, Save } from "lucide-react";
import AppShell from "../../components/AppShell";
import { PageLoader } from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import { attendanceApi, employeesApi } from "../../api/endpoints";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage } from "../../utils/errors";
import { MONTH_NAMES } from "../../utils/format";

const STATUS_OPTIONS = [
  { value: "present", label: "Present" },
  { value: "absent", label: "Absent" },
  { value: "half_day", label: "Half Day" },
  { value: "on_leave", label: "On Leave" },
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function AdminAttendance() {
  const toast = useToast();
  const [employees, setEmployees] = useState([]);
  const [date, setDate] = useState(todayISO());
  const [statusMap, setStatusMap] = useState({});
  const [remarksMap, setRemarksMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [history, setHistory] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    employeesApi.lookup().then((res) => {
      setEmployees(res.data.results ?? res.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!date) return;
    setLoading(true);
    attendanceApi
      .list({ month: date.slice(5, 7), year: date.slice(0, 4) })
      .then((res) => {
        const records = res.data.results ?? res.data;
        const sMap = {};
        const rMap = {};
        records
          .filter((r) => r.date === date)
          .forEach((r) => {
            sMap[r.employee] = r.status;
            rMap[r.employee] = r.remarks;
          });
        setStatusMap(sMap);
        setRemarksMap(rMap);
      })
      .finally(() => setLoading(false));
  }, [date]);

  useEffect(() => {
    setHistoryLoading(true);
    attendanceApi
      .list({ month, year })
      .then((res) => setHistory(res.data.results ?? res.data))
      .finally(() => setHistoryLoading(false));
  }, [month, year]);

  const handleSaveAll = async () => {
    if (employees.length === 0) return;
    setSaving(true);
    try {
      const records = employees.map((emp) => ({
        employee: emp.id,
        status: statusMap[emp.id] || "present",
        remarks: remarksMap[emp.id] || "",
      }));
      await attendanceApi.bulkMark({ date, records });
      toast.success(`Attendance saved for ${date}.`);
      setMonth(Number(date.slice(5, 7)));
      setYear(Number(date.slice(0, 4)));
    } catch (err) {
      toast.error(extractErrorMessage(err, "Could not save attendance."));
    } finally {
      setSaving(false);
    }
  };

  const years = useMemo(() => {
    const y = new Date().getFullYear();
    return [y - 1, y, y + 1];
  }, []);

  return (
    <AppShell title="Attendance" subtitle="Mark daily attendance and review monthly history.">
      <div className="card p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-brand-500" />
            <h2 className="font-display text-base font-bold text-ink-800">Mark Attendance</h2>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="date"
              className="input w-auto"
              value={date}
              max={todayISO()}
              onChange={(e) => setDate(e.target.value)}
            />
            <button className="btn-primary" onClick={handleSaveAll} disabled={saving || loading}>
              <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save All"}
            </button>
          </div>
        </div>

        {loading ? (
          <PageLoader />
        ) : employees.length === 0 ? (
          <EmptyState icon={CalendarCheck} title="No employees to mark" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400">
                  <th className="py-2.5 pr-4 font-semibold">Employee</th>
                  <th className="py-2.5 pr-4 font-semibold">Status</th>
                  <th className="py-2.5 pr-4 font-semibold">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td className="py-2.5 pr-4 font-medium text-ink-700">{emp.full_name}</td>
                    <td className="py-2.5 pr-4">
                      <select
                        className="input w-40"
                        value={statusMap[emp.id] || "present"}
                        onChange={(e) => setStatusMap({ ...statusMap, [emp.id]: e.target.value })}
                      >
                        {STATUS_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2.5 pr-4">
                      <input
                        className="input"
                        placeholder="Optional remarks"
                        value={remarksMap[emp.id] || ""}
                        onChange={(e) => setRemarksMap({ ...remarksMap, [emp.id]: e.target.value })}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card mt-5 p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-base font-bold text-ink-800">Monthly History</h2>
          <div className="flex gap-2">
            <select className="input w-auto" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
              {MONTH_NAMES.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
            <select className="input w-auto" value={year} onChange={(e) => setYear(Number(e.target.value))}>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {historyLoading ? (
          <PageLoader />
        ) : history.length === 0 ? (
          <EmptyState icon={CalendarCheck} title="No attendance records" description="Nothing marked for this month yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400">
                  <th className="py-2.5 pr-4 font-semibold">Date</th>
                  <th className="py-2.5 pr-4 font-semibold">Employee</th>
                  <th className="py-2.5 pr-4 font-semibold">Status</th>
                  <th className="py-2.5 pr-4 font-semibold">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {history.map((r) => (
                  <tr key={r.id}>
                    <td className="py-2.5 pr-4 text-ink-600">{r.date}</td>
                    <td className="py-2.5 pr-4 font-medium text-ink-700">{r.employee_detail?.full_name}</td>
                    <td className="py-2.5 pr-4"><StatusBadge status={r.status} /></td>
                    <td className="py-2.5 pr-4 text-ink-500">{r.remarks || "—"}</td>
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

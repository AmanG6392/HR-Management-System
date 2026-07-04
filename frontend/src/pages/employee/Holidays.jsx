import { useEffect, useState } from "react";
import { PartyPopper } from "lucide-react";
import AppShell from "../../components/AppShell";
import { PageLoader } from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import { holidaysApi } from "../../api/endpoints";
import { formatDate } from "../../utils/format";

export default function EmployeeHolidays() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    holidaysApi.list().then((res) => setHolidays(res.data.results ?? res.data)).finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <AppShell title="Holidays" subtitle="Official holiday calendar.">
      {loading ? (
        <PageLoader />
      ) : holidays.length === 0 ? (
        <EmptyState icon={PartyPopper} title="No holidays scheduled" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {holidays.map((h) => {
            const isPast = h.date < today;
            return (
              <div key={h.id} className={`card flex items-center gap-4 p-5 ${isPast ? "opacity-60" : ""}`}>
                <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-gold-50 text-gold-700">
                  <span className="text-[10px] font-bold uppercase leading-none">
                    {formatDate(h.date, { month: "short" }).split(" ")[1]}
                  </span>
                  <span className="text-xl font-bold leading-none">{new Date(h.date).getDate()}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display font-bold text-ink-800">{h.name}</p>
                  <p className="truncate text-xs text-ink-400">{h.description || formatDate(h.date)}</p>
                </div>
                {isPast && <span className="badge bg-ink-100 text-ink-500">Past</span>}
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}

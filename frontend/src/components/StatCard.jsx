export default function StatCard({ label, value, icon: Icon, tone = "brand", hint }) {
  const tones = {
    brand: "bg-brand-50 text-brand-600",
    gold: "bg-gold-50 text-gold-700",
    emerald: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    sky: "bg-sky-50 text-sky-600",
  };
  return (
    <div className="card flex items-center gap-4 p-5 transition hover:shadow-soft">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
        {Icon && <Icon className="h-5 w-5" />}
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
        <p className="font-display text-2xl font-bold text-ink-800">{value}</p>
        {hint && <p className="truncate text-xs text-ink-400">{hint}</p>}
      </div>
    </div>
  );
}

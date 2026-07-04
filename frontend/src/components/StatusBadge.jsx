const STYLES = {
  present: "bg-emerald-50 text-emerald-700",
  approved: "bg-emerald-50 text-emerald-700",
  absent: "bg-red-50 text-red-700",
  rejected: "bg-red-50 text-red-700",
  pending: "bg-gold-50 text-gold-700",
  half_day: "bg-amber-50 text-amber-700",
  on_leave: "bg-sky-50 text-sky-700",
  default: "bg-ink-100 text-ink-600",
};

export default function StatusBadge({ status, children }) {
  const style = STYLES[status] || STYLES.default;
  return <span className={`badge ${style}`}>{children || status?.replace("_", " ")}</span>;
}

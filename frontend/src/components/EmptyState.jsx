export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-ink-200 bg-ink-50/50 px-6 py-14 text-center animate-fade-in">
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink-400 shadow-card">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <div>
        <p className="font-display text-base font-semibold text-ink-700">{title}</p>
        {description && <p className="mt-1 max-w-sm text-sm text-ink-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

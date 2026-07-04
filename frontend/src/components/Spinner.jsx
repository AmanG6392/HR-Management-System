export default function Spinner({ className = "h-5 w-5", label }) {
  return (
    <div className="flex items-center justify-center gap-2 text-ink-400">
      <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}

export function PageLoader({ label = "Loading..." }) {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <Spinner className="h-8 w-8" label={label} />
    </div>
  );
}

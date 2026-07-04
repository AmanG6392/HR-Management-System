import { initials } from "../utils/format";

/**
 * Signature visual element: a stamped-seal style badge, echoing the
 * official-document motif (offer letters, seals) the HR workflow centers on.
 */
export default function SealAvatar({ name, size = "md", tone = "brand" }) {
  const sizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-16 w-16 text-lg" };
  const tones = {
    brand: "from-brand-500 to-brand-700 ring-brand-100",
    gold: "from-gold-400 to-gold-600 ring-gold-100",
  };
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${tones[tone]} font-display font-semibold text-white ring-4 ${sizes[size]}`}
      style={{
        backgroundImage:
          tone === "gold"
            ? "conic-gradient(from 0deg, #dfa936, #c8932b, #f3d98c, #dfa936)"
            : "conic-gradient(from 0deg, #6478f5, #283190, #4357e0, #6478f5)",
      }}
    >
      <span className="rounded-full bg-ink-900/10 px-1">{initials(name) || "?"}</span>
    </div>
  );
}

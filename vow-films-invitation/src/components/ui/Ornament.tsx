/** A hairline with a small diamond — the one decorative motif used across the site. */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 text-gold ${className}`} aria-hidden="true">
      <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold/70 sm:w-24" />
      <span className="block h-1.5 w-1.5 rotate-45 border border-gold" />
      <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold/70 sm:w-24" />
    </div>
  );
}

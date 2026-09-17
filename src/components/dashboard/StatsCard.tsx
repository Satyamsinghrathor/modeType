type StatCardProps = {
  label: string;
  best: string | number;
  avg: string | number;
  low: string | number;
};

export default function StatCard({
  label,
  best,
  avg,
  low,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] px-5 py-5 transition-colors hover:border-[var(--text-faint)]">
      <div className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </div>

      <div className="mt-4 grid grid-cols-3">
        {/* Best */}
        <div className="text-center">
          <div className="font-sans text-2xl font-medium text-[var(--text-primary)]">
            {best}
          </div>
          <div className="mt-1 text-xs text-[var(--text-muted)]">
            best
          </div>
        </div>

        {/* Average */}
        <div className="text-center">
          <div className="font-sans text-2xl font-medium text-[var(--accent)]">
            {avg}
          </div>
          <div className="mt-1 text-xs text-[var(--text-muted)]">
            avg
          </div>
        </div>

        {/* Low */}
        <div className="text-center">
          <div className="font-sans text-2xl font-medium text-[var(--text-primary)]">
            {low}
          </div>
          <div className="mt-1 text-xs text-[var(--text-muted)]">
            low
          </div>
        </div>
      </div>
    </div>
  );
}
type StatCardProps = {
  label: string;
  value: string | number;
  subValue?: string;
};

export default function StatCard({ label, value, subValue }: StatCardProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] px-5 py-5 transition-colors hover:border-[var(--text-faint)]">
      <div className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </div>

      <div className="mt-2 break-all font-sans text-2xl font-medium text-[var(--accent)]">
        {value}
      </div>

      {subValue && (
        <div className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
          {subValue}
        </div>
      )}
    </div>
  );
}

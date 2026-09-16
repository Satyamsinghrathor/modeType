import type { TypingTestResult } from "../../models/testResultType";

function formatDate(iso: string) {
  const d = new Date(iso);

  return (
    d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
    " " +
    d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
  );
}

const columns = [
  "wpm",
  "raw wpm",
  "accuracy",
  "clean acc",
  "consistency",
  "chars",
  "mode",
  "type",
  "date",
];

export default function RecentTestsTable({
  results,
}: {
  results: TypingTestResult[];
}) {
  if (results.length === 0) {
    return (
      <p className="text-sm text-[var(--text-muted)]">
        No tests yet — take a test to see it here.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)]">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] text-[var(--text-muted)]">
            {columns.map((col) => (
              <th key={col} className="px-4 py-3 font-normal uppercase tracking-wide">
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="text-[var(--text-primary)]">
          {results.map((r) => {
            const totalChars = Math.round(r.wordsTyped * 5);

            return (
              <tr
                key={r.id}
                className="border-b border-[var(--border-soft)] last:border-0"
              >
                <td className="px-4 py-3 font-medium text-[var(--accent)]">
                  {Math.round(r.wpm)}
                </td>
                <td className="px-4 py-3">{Math.round(r.rawwpm)}</td>
                <td className="px-4 py-3">{Math.round(r.accuracy)}%</td>
                <td className="px-4 py-3">{Math.round(r.rawaccuracy)}%</td>
                <td className="px-4 py-3">{Math.round(r.consistency)}%</td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">
                  {totalChars}/{r.skipped}/{r.errors}
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">
                  {r.mode} {r.selector ?? "—"}
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">
                  {r.type}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-[var(--text-secondary)]">
                  {formatDate(r.date)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
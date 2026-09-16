import { useMemo } from "react";
import { useTestResults } from "../../hooks/useTestResults";
import { getOverallStats, TIME_SELECTORS, WORD_SELECTORS } from "../../utils/aggregateStats";
import StatCard from "./StatCard";
import RecentTestsTable from "./RecentTestsTable";

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export default function Dashboard() {
  const results = useTestResults();
  const stats = useMemo(() => getOverallStats(results), [results]);

  if (results.length === 0) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-lg text-[var(--text-secondary)]">
          No tests taken yet.
        </p>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Complete a typing test to start building your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-sans text-2xl font-semibold text-[var(--text-primary)]">
        dashboard
      </h1>

      {/* Overview */}
      <section className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="total tests" value={stats.totalTests} />
        <StatCard
          label="total typing time"
          value={formatDuration(stats.totalTypingTime)}
        />
        <StatCard
          label="highest consistency"
          value={`${Math.round(stats.highestConsistency)}%`}
        />
        <StatCard
          label="average consistency"
          value={`${Math.round(stats.averageConsistency)}%`}
          subValue={`last 10: ${Math.round(stats.averageConsistencyLast10)}%`}
        />
      </section>

      {/* Personal bests by time */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm uppercase tracking-wide text-[var(--text-muted)]">
          highest wpm — time mode
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {TIME_SELECTORS.map((sec) => (
            <StatCard
              key={sec}
              label={`${sec}s`}
              value={
                stats.highestWpmByTime[sec] != null
                  ? Math.round(stats.highestWpmByTime[sec]!)
                  : "—"
              }
            />
          ))}
        </div>
      </section>

      {/* Personal bests by word count */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm uppercase tracking-wide text-[var(--text-muted)]">
          highest wpm — words mode
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {WORD_SELECTORS.map((count) => (
            <StatCard
              key={count}
              label={`${count} words`}
              value={
                stats.highestWpmByWords[count] != null
                  ? Math.round(stats.highestWpmByWords[count]!)
                  : "—"
              }
            />
          ))}
        </div>
      </section>

      {/* Averages comparison */}
      <section className="mb-8 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)]">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--text-muted)]">
              <th className="px-5 py-3 font-normal uppercase tracking-wide">
                metric
              </th>
              <th className="px-5 py-3 font-normal uppercase tracking-wide">
                highest
              </th>
              <th className="px-5 py-3 font-normal uppercase tracking-wide">
                average
              </th>
              <th className="px-5 py-3 font-normal uppercase tracking-wide">
                avg (last 10)
              </th>
            </tr>
          </thead>

          <tbody className="text-[var(--text-primary)]">
            <tr className="border-b border-[var(--border-soft)]">
              <td className="px-5 py-3 text-[var(--text-secondary)]">wpm</td>
              <td className="px-5 py-3 font-medium text-[var(--accent)]">
                {Math.round(stats.highestWpm)}
              </td>
              <td className="px-5 py-3">{Math.round(stats.averageWpm)}</td>
              <td className="px-5 py-3">
                {Math.round(stats.averageWpmLast10)}
              </td>
            </tr>

            <tr className="border-b border-[var(--border-soft)]">
              <td className="px-5 py-3 text-[var(--text-secondary)]">
                raw wpm
              </td>
              <td className="px-5 py-3 font-medium text-[var(--accent)]">
                {Math.round(stats.highestRawWpm)}
              </td>
              <td className="px-5 py-3">{Math.round(stats.averageRawWpm)}</td>
              <td className="px-5 py-3">
                {Math.round(stats.averageRawWpmLast10)}
              </td>
            </tr>

            <tr>
              <td className="px-5 py-3 text-[var(--text-secondary)]">
                accuracy
              </td>
              <td className="px-5 py-3 font-medium text-[var(--accent)]">
                {Math.round(stats.highestAcc)}%
              </td>
              <td className="px-5 py-3">{Math.round(stats.averageAcc)}%</td>
              <td className="px-5 py-3">
                {Math.round(stats.averageAccLast10)}%
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Recent tests */}
      <section>
        <h2 className="mb-3 text-sm uppercase tracking-wide text-[var(--text-muted)]">
          last 10 tests
        </h2>
        <RecentTestsTable results={results.slice(0, 10)} />
      </section>
    </div>
  );
}
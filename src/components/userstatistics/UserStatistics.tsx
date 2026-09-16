import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTestResults } from "../../hooks/useTestResults";
import testTypes from "../../models/testType";
import {
  getDailyAverages,
  getFilteredSummary,
  TIME_SELECTORS,
  WORD_SELECTORS,
  type Range,
  type StatFilter,
} from "../../utils/aggregateStats";
import StatCard from "../dashboard/StatCard";

const RANGES: { id: Range; label: string }[] = [
  { id: "week", label: "week" },
  { id: "month", label: "month" },
  { id: "year", label: "year" },
];

function FilterGroup({
  options,
  active,
  onSelect,
}: {
  options: { id: string; label: string }[];
  active: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt.id)}
          className={`rounded-md px-3 py-2 text-sm transition ${
            active === opt.id
              ? "bg-[var(--bg-elevated)] text-[var(--accent)]"
              : "text-[var(--text-muted)] hover:bg-[var(--bg-elevated)]/50 hover:text-[var(--text-secondary)]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function UserStatistics() {
  const results = useTestResults();

  const [range, setRange] = useState<Range>("week");
  const [type, setType] = useState<string>("all");
  const [mode, setMode] = useState<string>("all");
  const [selector, setSelector] = useState<number | "all">("all");

  const selectorOptions =
    mode === "time" ? TIME_SELECTORS : mode === "words" ? WORD_SELECTORS : [];

  function onModeChange(next: string) {
    setMode(next);
    setSelector("all");
  }

  const filter: StatFilter = { type, mode, selector };

  const dailyAverages = useMemo(
    () => getDailyAverages(results, range, filter),
    [results, range, type, mode, selector]
  );

  const summary = useMemo(
    () => getFilteredSummary(results, range, filter),
    [results, range, type, mode, selector]
  );

  const chartData = dailyAverages.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
  }));

  if (results.length === 0) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-lg text-[var(--text-secondary)]">
          No tests taken yet.
        </p>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Complete a typing test to start building your statistics.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-6 font-sans text-2xl font-semibold text-[var(--text-primary)]">
        user statistics
      </h1>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3">
        <div className="border-r border-[var(--border)] pr-3">
          <FilterGroup
            options={RANGES}
            active={range}
            onSelect={(id) => setRange(id as Range)}
          />
        </div>

        <div className="border-r border-[var(--border)] pr-3">
          <FilterGroup
            options={[
              { id: "all", label: "all types" },
              ...testTypes.map((t) => ({ id: t, label: t })),
            ]}
            active={type}
            onSelect={setType}
          />
        </div>

        <div className={selectorOptions.length > 0 ? "border-r border-[var(--border)] pr-3" : ""}>
          <FilterGroup
            options={[
              { id: "all", label: "all modes" },
              { id: "time", label: "time" },
              { id: "words", label: "words" },
            ]}
            active={mode}
            onSelect={onModeChange}
          />
        </div>

        {selectorOptions.length > 0 && (
          <FilterGroup
            options={[
              { id: "all", label: "all" },
              ...selectorOptions.map((s) => ({ id: String(s), label: String(s) })),
            ]}
            active={String(selector)}
            onSelect={(id) => setSelector(id === "all" ? "all" : Number(id))}
          />
        )}
      </div>

      {/* Graph */}
      <div className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] p-5">
        <div className="mb-4 text-sm uppercase tracking-wide text-[var(--text-muted)]">
          average wpm per day
        </div>

        {chartData.length === 0 ? (
          <div className="flex h-[280px] items-center justify-center text-sm text-[var(--text-muted)]">
            no tests match these filters in this range
          </div>
        ) : (
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke="var(--border-soft)" strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  stroke="var(--text-muted)"
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    color: "var(--text-primary)",
                  }}
                  labelStyle={{ color: "var(--text-secondary)" }}
                  formatter={(value: number) => [Math.round(value), "avg wpm"]}
                />
                <Line
                  type="monotone"
                  dataKey="avgWpm"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "var(--accent)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Summary for the selected range + filters */}
      <div className="mb-3 text-sm uppercase tracking-wide text-[var(--text-muted)]">
        {summary.count} test{summary.count === 1 ? "" : "s"} in this range
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="wpm (real)"
          value={Math.round(summary.wpmReal.best)}
          subValue={`low ${Math.round(summary.wpmReal.low)} · avg ${Math.round(
            summary.wpmReal.avg
          )}`}
        />
        <StatCard
          label="wpm (raw)"
          value={Math.round(summary.wpmRaw.best)}
          subValue={`low ${Math.round(summary.wpmRaw.low)} · avg ${Math.round(
            summary.wpmRaw.avg
          )}`}
        />
        <StatCard
          label="accuracy (real)"
          value={`${Math.round(summary.accReal.best)}%`}
          subValue={`low ${Math.round(summary.accReal.low)}% · avg ${Math.round(
            summary.accReal.avg
          )}%`}
        />
        <StatCard
          label="accuracy (clean)"
          value={`${Math.round(summary.accClean.best)}%`}
          subValue={`low ${Math.round(summary.accClean.low)}% · avg ${Math.round(
            summary.accClean.avg
          )}%`}
        />
      </div>
    </div>
  );
}
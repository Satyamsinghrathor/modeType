import type { TypingTestResult } from "../models/testResultType";

export type Range = "day" | "week" | "month" | "year";

const RANGE_DAYS: Record<Range, number> = {
  day: 1,
  week: 7,
  month: 30,
  year: 365,
};

export const TIME_SELECTORS = [15, 30, 60, 120];
export const WORD_SELECTORS = [10, 25, 50, 100];

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function lastN<T>(items: T[], n: number): T[] {
  // testStorage prepends new results, so index 0 is the most recent test.
  return items.slice(0, n);
}

/* =========================================================
   OVERALL / ALL-TIME STATS (used by the Dashboard)
========================================================= */

export type OverallStats = {
  totalTests: number;
  totalTypingTime: number;

  highestWpm: number;
  averageWpm: number;
  averageWpmLast10: number;

  highestRawWpm: number;
  averageRawWpm: number;
  averageRawWpmLast10: number;

  highestAcc: number;
  averageAcc: number;
  averageAccLast10: number;

  highestConsistency: number;
  averageConsistency: number;
  averageConsistencyLast10: number;

  highestWpmByTime: Record<number, number | null>;
  highestWpmByWords: Record<number, number | null>;
};

export function getOverallStats(results: TypingTestResult[]): OverallStats {
  const last10 = lastN(results, 10);

  const wpmValues = results.map((r) => r.wpm);
  const rawWpmValues = results.map((r) => r.rawwpm);
  const accValues = results.map((r) => r.accuracy);
  const consistencyValues = results.map((r) => r.consistency);

  const highestWpmByTime: Record<number, number | null> = {};
  for (const sec of TIME_SELECTORS) {
    const matches = results.filter(
      (r) => r.mode === "time" && r.selector === sec
    );
    highestWpmByTime[sec] = matches.length
      ? Math.max(...matches.map((r) => r.wpm))
      : null;
  }

  const highestWpmByWords: Record<number, number | null> = {};
  for (const count of WORD_SELECTORS) {
    const matches = results.filter(
      (r) => r.mode === "words" && r.selector === count
    );
    highestWpmByWords[count] = matches.length
      ? Math.max(...matches.map((r) => r.wpm))
      : null;
  }

  return {
    totalTests: results.length,
    totalTypingTime: results.reduce((sum, r) => sum + r.elapsedTime, 0),

    highestWpm: results.length ? Math.max(...wpmValues) : 0,
    averageWpm: average(wpmValues),
    averageWpmLast10: average(last10.map((r) => r.wpm)),

    highestRawWpm: results.length ? Math.max(...rawWpmValues) : 0,
    averageRawWpm: average(rawWpmValues),
    averageRawWpmLast10: average(last10.map((r) => r.rawwpm)),

    highestAcc: results.length ? Math.max(...accValues) : 0,
    averageAcc: average(accValues),
    averageAccLast10: average(last10.map((r) => r.accuracy)),

    highestConsistency: results.length ? Math.max(...consistencyValues) : 0,
    averageConsistency: average(consistencyValues),
    averageConsistencyLast10: average(last10.map((r) => r.consistency)),

    highestWpmByTime,
    highestWpmByWords,
  };
}

/* =========================================================
   FILTERED / RANGE STATS (used by User Statistics)
========================================================= */

export type StatFilter = {
  type: string | "all";
  mode: string | "all";
  selector: number | "all";
};

function matchesFilter(r: TypingTestResult, filter: StatFilter): boolean {
  if (filter.type !== "all" && r.type !== filter.type) return false;
  if (filter.mode !== "all" && r.mode !== filter.mode) return false;
  if (filter.selector !== "all" && r.selector !== filter.selector)
    return false;
  return true;
}

function filterByRange(
  results: TypingTestResult[],
  range: Range,
  filter: StatFilter
): TypingTestResult[] {
  const now = new Date();

  if (range === "day") {
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );

    return results.filter((r) => {
      const date = new Date(r.date).getTime();

      return (
        matchesFilter(r, filter) &&
        date >= startOfDay.getTime() &&
        date < endOfDay.getTime()
      );
    });
  }

  const cutoff =
    Date.now() - RANGE_DAYS[range] * 24 * 60 * 60 * 1000;

  return results.filter(
    (r) => matchesFilter(r, filter) && new Date(r.date).getTime() >= cutoff
  );
}

export type DailyAverage = {
  date: string; // YYYY-MM-DD
  avgWpm: number;
  tests: number;
};

export function getDailyAverages(
  results: TypingTestResult[],
  range: Range,
  filter: StatFilter
): DailyAverage[] {
  const filtered = filterByRange(results, range, filter);

  const buckets = new Map<string, number[]>();

  for (const r of filtered) {
    const day = r.date.slice(0, 10);
    const bucket = buckets.get(day) ?? [];
    bucket.push(r.wpm);
    buckets.set(day, bucket);
  }

  return Array.from(buckets.entries())
    .map(([date, wpms]) => ({
      date,
      avgWpm: average(wpms),
      tests: wpms.length,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

type MinMaxAvg = { best: number; low: number; avg: number };

function summarize(values: number[]): MinMaxAvg {
  if (values.length === 0) return { best: 0, low: 0, avg: 0 };

  return {
    best: Math.max(...values),
    low: Math.min(...values),
    avg: average(values),
  };
}

export type RangeSummary = {
  count: number;
  wpmReal: MinMaxAvg;
  wpmRaw: MinMaxAvg;
  accReal: MinMaxAvg;
  accClean: MinMaxAvg;
};

export function getFilteredSummary(
  results: TypingTestResult[],
  range: Range,
  filter: StatFilter
): RangeSummary {
  const filtered = filterByRange(results, range, filter);

  return {
    count: filtered.length,
    wpmReal: summarize(filtered.map((r) => r.wpm)),
    wpmRaw: summarize(filtered.map((r) => r.rawwpm)),
    accReal: summarize(filtered.map((r) => r.accuracy)),
    accClean: summarize(filtered.map((r) => r.rawaccuracy)),
  };
}

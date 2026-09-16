import { TypingTestResultSchema, type TypingTestResult } from "../models/testResultType";

const STORAGE_KEY = "typing-test-results";

export function getTestResults(): TypingTestResult[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      console.warn("Invalid typing test data: not an array");
      return [];
    }

    // Validate each record on its own rather than the array as a whole.
    // A single legacy/malformed record (e.g. saved before a field like
    // `selector` existed) would otherwise fail the whole-array parse and
    // wipe out someone's entire test history.
    const results: TypingTestResult[] = [];
    let skipped = 0;

    for (const item of parsed) {
      const result = TypingTestResultSchema.safeParse(item);

      if (result.success) {
  results.push(result.data);
} else {
  skipped++;

  console.error("Invalid typing test record:", item);
  console.error("Zod errors:", result.error.issues);
}}

    if (skipped > 0) {
      console.warn(`Skipped ${skipped} invalid typing test record(s)`);
    }

    return results;
  } catch {
    return [];
  }
}

export { STORAGE_KEY };

export function saveTestResult(
  result: Omit<TypingTestResult, "id" | "date">
): TypingTestResult {
  const results = getTestResults();

  const newResult: TypingTestResult = {
    ...result,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([newResult, ...results])
  );

  return newResult;
}

export function clearTestResults() {
  localStorage.removeItem(STORAGE_KEY);
}
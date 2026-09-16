import { useEffect, useState } from "react";
import { getTestResults, STORAGE_KEY } from "../localstorage/testStorage";
import type { TypingTestResult } from "../models/testResultType";

/**
 * Reads typing test history from localStorage and keeps it up to date:
 * - re-reads when this tab regains focus/visibility (e.g. coming back to
 *   the Dashboard after finishing another test)
 * - re-reads when another tab/window writes to the same localStorage key
 */
export function useTestResults(): TypingTestResult[] {
  const [results, setResults] = useState<TypingTestResult[]>(() =>
    getTestResults()
  );

  useEffect(() => {
    function refresh() {
      setResults(getTestResults());
    }

    function onStorage(e: StorageEvent) {
      if (e.key === null || e.key === STORAGE_KEY) {
        refresh();
      }
    }

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);

    // Catch anything that changed between the initial useState() read and
    // this effect attaching (e.g. a test finishing right as this page loads).
    refresh();

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  return results;
}
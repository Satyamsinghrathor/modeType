import { z } from "zod";

export const TypingTestResultSchema = z.object({
  id: z.string(),
  wpm: z.number().nonnegative(),
  rawwpm: z.number().nonnegative(),

  accuracy: z.number().min(0).max(100),
  rawaccuracy: z.number().min(0).max(100),

  errors: z.number().int().nonnegative(),
  skipped: z.number().int().nonnegative(),

  elapsedTime: z.number().positive(),
  wordsTyped: z.number().int().nonnegative(),

  wrongWords: z.array(z.string()),
  wrongLetters: z.array(z.string()),

  date: z.iso.datetime(),

  wpms: z.array(z.number().nonnegative()),
  consistency: z.number().min(0).max(100),

  mode: z.string(),
  type: z.string(),

  /*
   * The duration (in seconds, for "time" mode) or word count
   * (for "words" mode) the test was configured with, e.g. 15/30/60/120
   * or 10/25/50/100. Needed to break stats down by test length
   * (highest wpm at 60s, highest wpm at 25 words, etc).
   *
   * Optional: test results saved before this field existed won't have
   * it. Those older results still count toward overall stats - they
   * just won't show up in the "highest wpm at 60s" style breakdowns.
   */
  selector: z.number().positive().optional(),
});

export type TypingTestResult = z.infer<typeof TypingTestResultSchema>;
export function calculateResult({
  currentIndex,
  errors,
  skipped,
  elapsedTime,
  textArray,
  wpms
}: {
  currentIndex: number;
  errors: number;
  skipped: number;
  elapsedTime: number;
  textArray: number[],
  wpms: number[]
}) {
  const wordsTyped = currentIndex / 5;

  let rawError = 0;
  
  textArray.forEach((text) => {
    if(text !== 1) {
      rawError += 1;
    }
  })

  const wpm = ((currentIndex - rawError)/5)/(elapsedTime/60)

  const rawwpm =
    elapsedTime > 0
      ? (wordsTyped ) / (elapsedTime / 60)
      : 0;

  const accuracy =
    currentIndex > 0
      ? ((currentIndex - errors - skipped) / currentIndex) * 100
      : 100;

  const rawAcc = currentIndex > 0 ? ((currentIndex - rawError) / currentIndex) * 100 : 100

  const consistency = calculateConsistency(wpms)


  return {
    rawwpm,
    wpm,
    rawAcc,
    accuracy,
    wordsTyped,
    errors,
    skipped,
    elapsedTime,
    consistency
  };
}


function calculateConsistency(wpms: number[]) {
  if (wpms.length === 0) return 0;

  const mean = wpms.reduce((sum, wpm) => sum + wpm, 0) / wpms.length;

  const variance =
    wpms.reduce((sum, wpm) => sum + Math.pow(wpm - mean, 2), 0) /
    wpms.length;

  const standardDeviation = Math.sqrt(variance);

  // Convert variation into a 0–100 consistency score
  const consistency = Math.max(
    0,
    100 - (standardDeviation / mean) * 100
  );

  return consistency;
}
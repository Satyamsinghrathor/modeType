const STORAGE_KEY = "typing-mistake-stats";

export type MistakeStats = {
  words: Record<string, number>;
  letters: Record<string, number>;
};

function getMistakeStats(): MistakeStats {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return {
        words: {},
        letters: {},
      };
    }

    return JSON.parse(stored);
  } catch {
    return {
      words: {},
      letters: {},
    };
  }
}

export function saveMistakes(
  wrongWords: string[],
  wrongLetters: string[]
) {
  const stats = getMistakeStats();

  for (const word of wrongWords) {
    stats.words[word] = (stats.words[word] ?? 0) + 1;
  }

  for (const letter of wrongLetters) {
    stats.letters[letter] = (stats.letters[letter] ?? 0) + 1;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function getMistakeStatistics(): MistakeStats {
  return getMistakeStats();
}

export function clearMistakeStatistics() {
  localStorage.removeItem(STORAGE_KEY);
}
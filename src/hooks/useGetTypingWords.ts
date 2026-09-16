import { Strings } from "../data/Strings";
import { getMistakeStatistics } from "../localstorage/mistakeStorage";

type GetTypingWordsProps = {
  mode: string;
  timeOrWords: number;
  type: string;
};

const words = Strings.split(/\s+/);

function getTypingWords({
  mode,
  timeOrWords,
  type,
}: GetTypingWordsProps) {
  const numberOfWords =
    mode === "time"
      ? timeOrWords * 5
      : timeOrWords + 3;

  // Practice mistakes
  if (type === "practice mistakes") {
    const mistakeStats = getMistakeStatistics();

    const sortedWords = Object.entries(mistakeStats.words)
      .sort((a, b) => b[1] - a[1]);

    // No mistake data yet
    if (sortedWords.length === 0) {
      return Array.from(
        { length: numberOfWords },
        () => words[Math.floor(Math.random() * words.length)]
      );
    }

    const typingWords: string[] = [];

    let index = 0;

    while (typingWords.length < numberOfWords) {
      typingWords.push(sortedWords[index][0]);

      index++;

      // Start again when we reach the end
      if (index >= sortedWords.length) {
        index = 0;
      }
    }

    return typingWords;
  }

  // Normal typing test
  const typingWords: string[] = [];

  for (let i = 0; i < numberOfWords; i++) {
    const index = Math.floor(Math.random() * words.length);
    typingWords.push(words[index]);
  }

  return typingWords;
}

export default getTypingWords;
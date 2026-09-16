import { useEffect, useRef, useState } from "react";

export function useTypingTest(text: string) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [textArray, setTextArray] = useState<number[]>([]);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [startedTimer, setStartedTimer] = useState(false);

  const [wrongWords, setWrongWords] = useState<string[]>([]);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);

  /*
   * Refs
   */
  const currentIndexRef = useRef(0);
  const textRef = useRef(text);
  const startTimeRef = useRef<number | null>(null);

  /*
   * WPM history
   *
   * Index = second
   * Value = WPM at that second
   *
   * Example:
   * [0, 42, 48, 51, 55]
   */
  const wpms = useRef<number[]>([]);
  const lastRecordedSecondRef = useRef(-1);

  /*
   * Keep latest index available to keyboard listener
   */
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  /*
   * Keep latest text available to keyboard listener
   */
  useEffect(() => {
    textRef.current = text;
  }, [text]);

  /*
   * Restart test
   */
  function restartTest() {
    currentIndexRef.current = 0;
    startTimeRef.current = null;

    wpms.current = [];
    lastRecordedSecondRef.current = -1;

    setCurrentIndex(0);
    setErrors(0);
    setSkipped(0);
    setTextArray([]);

    setElapsedTime(0);
    setStartedTimer(false);

    setWrongWords([]);
    setWrongLetters([]);
  }

  /*
   * Get WPM history after test finishes
   *
   * This function reads the ref outside of render.
   */
  function getWpms() {
    return [...wpms.current];
  }

  /*
   * Timer
   */
  useEffect(() => {
    if (!startedTimer || startTimeRef.current === null) {
      return;
    }

    const interval = setInterval(() => {
      if (startTimeRef.current === null) {
        return;
      }

      const elapsed =
        (Date.now() - startTimeRef.current) / 1000;

      /*
       * Update displayed elapsed time
       */
      setElapsedTime(elapsed);

      /*
       * Record WPM once per second
       */
      const currentSecond = Math.floor(elapsed);

      if (
        currentSecond !== lastRecordedSecondRef.current
      ) {
        lastRecordedSecondRef.current = currentSecond;

        const currentWpm =
          elapsed > 0
            ? Math.round(
                (currentIndexRef.current / 5) /
                  (elapsed / 60)
              )
            : 0;

        wpms.current[currentSecond] = currentWpm;
      }
    }, 200);

    return () => {
      clearInterval(interval);
    };
  }, [startedTimer]);

  /*
   * Keyboard listener
   */
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const index = currentIndexRef.current;
      const currentText = textRef.current;

      /*
       * Tab = restart
       */
      if (e.key === "Tab") {
        e.preventDefault();
        restartTest();
        return;
      }

      /*
       * Backspace
       */
      if (e.key === "Backspace") {
        e.preventDefault();

        if (index > 0) {
          const newIndex = index - 1;

          currentIndexRef.current = newIndex;
          setCurrentIndex(newIndex);

          setTextArray((prev) => prev.slice(0, -1));
        }

        return;
      }

      /*
       * Ignore special keys
       *
       * e.key.length === 1 means:
       * a-z, A-Z, numbers, punctuation, space, etc.
       */
      if (e.key.length !== 1) {
        return;
      }

      /*
       * Don't type beyond the test
       */
      if (index >= currentText.length) {
        return;
      }

      /*
       * Start timer on first valid key
       */
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now();
        setStartedTimer(true);
      }

      /*
       * Space
       */
      if (e.key === " ") {
        setTextArray((prev) => [
          ...prev,
          currentText[index] === " " ? 1 : -1,
        ]);

        /*
         * User pressed space while the expected
         * character wasn't a space.
         */
        if (currentText[index] !== " ") {
          setSkipped((prev) => prev + 1);
        }
      }

      /*
       * Wrong character
       */
      else if (e.key !== currentText[index]) {
        setErrors((prev) => prev + 1);

        /*
         * Store the expected character
         */
        setWrongLetters((prev) => [
          ...prev,
          currentText[index],
        ]);

        /*
         * Find the word containing this error
         */
        const word = getWordAtIndex(
          currentText,
          index
        );

        setWrongWords((prev) => [
          ...prev,
          word,
        ]);

        /*
         * 0 = wrong
         */
        setTextArray((prev) => [
          ...prev,
          0,
        ]);
      }

      /*
       * Correct character
       */
      else {
        /*
         * 1 = correct
         */
        setTextArray((prev) => [
          ...prev,
          1,
        ]);
      }

      /*
       * Move to next character
       */
      const newIndex = index + 1;

      currentIndexRef.current = newIndex;
      setCurrentIndex(newIndex);
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  /*
   * Words typed
   *
   * Standard typing calculation:
   * 5 characters = 1 word
   */
  const wordsTyped = currentIndex / 5;

  /*
   * Current WPM
   */
  const wpm =
    elapsedTime > 0
      ? Math.round(
          wordsTyped / (elapsedTime / 60)
        )
      : 0;

  return {
    currentIndex,
    textArray,

    errors,
    skipped,

    wrongWords,
    wrongLetters,

    wordsTyped,

    elapsedTime,
    wpm,
    startedTimer,

    /*
     * Use this after the test finishes
     * to get the graph data.
     */
    getWpms,

    restartTest,
  };
}

/*
 * Find the complete word at a character index
 */
function getWordAtIndex(
  text: string,
  index: number
) {
  /*
   * If index points to a space,
   * move one character backwards.
   */
  if (text[index] === " ") {
    index--;
  }

  /*
   * Find beginning of word
   */
  const start =
    text.lastIndexOf(" ", index - 1) + 1;

  /*
   * Find end of word
   */
  const end =
    text.indexOf(" ", index);

  return text.slice(
    start,
    end === -1 ? text.length : end
  );
}
import { useEffect, useRef, useState } from "react";

export function useTypingTest(text: string) {
  /*
   * ==========================================
   * STATE
   * ==========================================
   */

  const [currentIndex, setCurrentIndex] = useState(0);

  /*
   * Total errors ever made.
   * NEVER decreases.
   */
  const [errors, setErrors] = useState(0);

  /*
   * Errors which are currently unresolved.
   * CAN decrease when user fixes them.
   */
  const [currentErrors, setCurrentErrors] = useState(0);

  /*
   * Total skipped characters ever made.
   * NEVER decreases.
   */
  const [skipped, setSkipped] = useState(0);

  /*
   * Skipped characters which are currently unresolved.
   * CAN decrease when user fixes them.
   */
  const [currentSkipped, setCurrentSkipped] = useState(0);

  /*
   * 0 = wrong
   * 1 = correct
   * -1 = skipped
   */
  const [textArray, setTextArray] = useState<number[]>([]);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [startedTimer, setStartedTimer] = useState(false);

  const [wrongWords, setWrongWords] = useState<string[]>([]);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);

  /*
   * ==========================================
   * REFS
   * ==========================================
   */

  const currentIndexRef = useRef(0);

  const textRef = useRef(text);

  const startTimeRef = useRef<number | null>(null);

  /*
   * Total errors.
   * Never decreases.
   */
  const errorsRef = useRef(0);

  /*
   * Currently unresolved errors.
   * Can decrease.
   */
  const currentErrorsRef = useRef(0);

  /*
   * Total skipped.
   * Never decreases.
   */
  const skippedRef = useRef(0);

  /*
   * Currently unresolved skipped.
   * Can decrease.
   */
  const currentSkippedRef = useRef(0);

  /*
   * ==========================================
   * WPM HISTORY
   * ==========================================
   *
   * wpms:
   * Corrected WPM
   *
   * rawWpms:
   * Raw WPM
   *
   * Index = second
   */

  const wpms = useRef<number[]>([]);
  const rawWpms = useRef<number[]>([]);

  const lastRecordedSecondRef = useRef(-1);

  /*
   * ==========================================
   * KEEP REFS UPDATED
   * ==========================================
   */

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  /*
   * ==========================================
   * RESTART TEST
   * ==========================================
   */

  function restartTest() {
    /*
     * Refs
     */
    currentIndexRef.current = 0;

    startTimeRef.current = null;

    errorsRef.current = 0;
    currentErrorsRef.current = 0;

    skippedRef.current = 0;
    currentSkippedRef.current = 0;

    wpms.current = [];
    rawWpms.current = [];

    lastRecordedSecondRef.current = -1;

    /*
     * State
     */
    setCurrentIndex(0);

    setErrors(0);
    setCurrentErrors(0);

    setSkipped(0);
    setCurrentSkipped(0);

    setTextArray([]);

    setElapsedTime(0);
    setStartedTimer(false);

    setWrongWords([]);
    setWrongLetters([]);
  }

  /*
   * ==========================================
   * GET WPM HISTORY
   * ==========================================
   */

  function getWpms() {
    return [...wpms.current];
  }

  function getRawWpms() {
    return [...rawWpms.current];
  }

  /*
   * ==========================================
   * TIMER
   * ==========================================
   */

  useEffect(() => {
    if (
      !startedTimer ||
      startTimeRef.current === null
    ) {
      return;
    }

    const interval = setInterval(() => {
      if (startTimeRef.current === null) {
        return;
      }

      /*
       * Elapsed time in seconds
       */
      const elapsed =
        (Date.now() - startTimeRef.current) / 1000;

      setElapsedTime(elapsed);

      /*
       * Current second
       */
      const currentSecond = Math.floor(elapsed);

      /*
       * Record only once per second
       */
      if (
        currentSecond !==
        lastRecordedSecondRef.current
      ) {
        lastRecordedSecondRef.current =
          currentSecond;

        /*
         * ======================================
         * RAW WPM
         * ======================================
         *
         * Every typed character counts.
         *
         * Errors and skipped characters
         * do NOT matter.
         */

        const rawWpm =
          elapsed > 0
            ? Math.round(
                (currentIndexRef.current / 5) /
                  (elapsed / 60)
              )
            : 0;

        /*
         * ======================================
         * CORRECTED WPM
         * ======================================
         *
         * Only currently unresolved mistakes
         * are removed.
         *
         * Historical errors do NOT affect WPM
         * after they have been fixed.
         */

        const correctedCharacters =
          Math.max(
            0,
            currentIndexRef.current -
              currentErrorsRef.current -
              currentSkippedRef.current
          );

        const currentWpm =
          elapsed > 0
            ? Math.round(
                (correctedCharacters / 5) /
                  (elapsed / 60)
              )
            : 0;

        /*
         * Store histories
         */
        wpms.current[currentSecond] =
          currentWpm;

        rawWpms.current[currentSecond] =
          rawWpm;
      }
    }, 200);

    return () => {
      clearInterval(interval);
    };
  }, [startedTimer]);

  /*
   * ==========================================
   * KEYBOARD LISTENER
   * ==========================================
   */

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const index = currentIndexRef.current;
      const currentText = textRef.current;

      /*
       * ======================================
       * TAB = RESTART
       * ======================================
       */

      if (e.key === "Tab") {
        e.preventDefault();

        restartTest();

        return;
      }

      /*
       * ======================================
       * BACKSPACE
       * ======================================
       */

      if (e.key === "Backspace") {
        e.preventDefault();

        if (index > 0) {
          const previousIndex = index - 1;

          /*
           * We need the previous result from
           * textArray.
           *
           * Use functional update so we always
           * get the latest array.
           */

          setTextArray((prev) => {
            const previousResult =
              prev[previousIndex];

            /*
             * --------------------------------
             * Previous character was WRONG
             * --------------------------------
             *
             * Historical errors stay the same.
             *
             * Only currentErrors decreases.
             */

            if (previousResult === 0) {
              const newCurrentErrors =
                Math.max(
                  0,
                  currentErrorsRef.current - 1
                );

              currentErrorsRef.current =
                newCurrentErrors;

              setCurrentErrors(
                newCurrentErrors
              );
            }

            /*
             * --------------------------------
             * Previous character was SKIPPED
             * --------------------------------
             *
             * Historical skipped count stays
             * the same.
             *
             * Only currentSkipped decreases.
             */

            else if (previousResult === -1) {
              const newCurrentSkipped =
                Math.max(
                  0,
                  currentSkippedRef.current - 1
                );

              currentSkippedRef.current =
                newCurrentSkipped;

              setCurrentSkipped(
                newCurrentSkipped
              );
            }

            /*
             * Remove previous character
             */
            return prev.slice(0, -1);
          });

          /*
           * Move backwards
           */
          const newIndex = index - 1;

          currentIndexRef.current =
            newIndex;

          setCurrentIndex(newIndex);
        }

        return;
      }

      /*
       * ======================================
       * IGNORE SPECIAL KEYS
       * ======================================
       */

      if (e.key.length !== 1) {
        return;
      }

      /*
       * ======================================
       * DON'T GO BEYOND TEXT
       * ======================================
       */

      if (index >= currentText.length) {
        return;
      }

      /*
       * ======================================
       * START TIMER
       * ======================================
       */

      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now();

        setStartedTimer(true);
      }

      /*
       * ======================================
       * SPACE
       * ======================================
       */

      if (e.key === " ") {
        e.preventDefault();

        /*
         * Correct space
         */
        if (currentText[index] === " ") {
          setTextArray((prev) => [
            ...prev,
            1,
          ]);
        }

        /*
         * Wrong space = skipped character
         */
        else {
          /*
           * Historical skipped count
           *
           * NEVER decreases.
           */
          const newSkipped =
            skippedRef.current + 1;

          skippedRef.current =
            newSkipped;

          setSkipped(newSkipped);

          /*
           * Currently unresolved skipped
           *
           * CAN decrease later.
           */
          const newCurrentSkipped =
            currentSkippedRef.current + 1;

          currentSkippedRef.current =
            newCurrentSkipped;

          setCurrentSkipped(
            newCurrentSkipped
          );

          /*
           * -1 = skipped
           */
          setTextArray((prev) => [
            ...prev,
            -1,
          ]);
        }
      }

      /*
       * ======================================
       * WRONG CHARACTER
       * ======================================
       */

      else if (
        e.key !== currentText[index]
      ) {
        /*
         * --------------------------------
         * Historical total error
         * --------------------------------
         *
         * NEVER decreases.
         */

        const newErrors =
          errorsRef.current + 1;

        errorsRef.current = newErrors;

        setErrors(newErrors);

        /*
         * --------------------------------
         * Currently unresolved error
         * --------------------------------
         *
         * CAN decrease with Backspace.
         */

        const newCurrentErrors =
          currentErrorsRef.current + 1;

        currentErrorsRef.current =
          newCurrentErrors;

        setCurrentErrors(
          newCurrentErrors
        );

        /*
         * Store expected character
         */
        setWrongLetters((prev) => [
          ...prev,
          currentText[index],
        ]);

        /*
         * Find complete word
         */
        const word =
          getWordAtIndex(
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
       * ======================================
       * CORRECT CHARACTER
       * ======================================
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
       * ======================================
       * MOVE TO NEXT CHARACTER
       * ======================================
       */

      const newIndex = index + 1;

      currentIndexRef.current =
        newIndex;

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
   * ==========================================
   * WORDS TYPED
   * ==========================================
   *
   * Standard:
   * 5 characters = 1 word
   */

  const wordsTyped =
    currentIndex / 5;

  /*
   * ==========================================
   * RAW WPM
   * ==========================================
   *
   * Includes everything typed.
   */

  const rawWpm =
    elapsedTime > 0
      ? Math.round(
          (currentIndex / 5) /
            (elapsedTime / 60)
        )
      : 0;

  /*
   * ==========================================
   * CORRECTED WPM
   * ==========================================
   *
   * Remove ONLY currently unresolved
   * errors and skipped characters.
   */

  const correctedCharacters =
    Math.max(
      0,
      currentIndex -
        currentErrors -
        currentSkipped
    );

  const wpm =
    elapsedTime > 0
      ? Math.round(
          (correctedCharacters / 5) /
            (elapsedTime / 60)
        )
      : 0;

  /*
   * ==========================================
   * RETURN
   * ==========================================
   */

  return {
    currentIndex,

    textArray,

    /*
     * Historical totals
     */
    errors,
    skipped,

    /*
     * Currently unresolved
     */
    currentErrors,
    currentSkipped,

    wrongWords,
    wrongLetters,

    wordsTyped,

    elapsedTime,

    /*
     * Corrected WPM
     */
    wpm,

    /*
     * Raw WPM
     */
    rawWpm,

    startedTimer,

    /*
     * Corrected WPM history
     */
    getWpms,

    /*
     * Raw WPM history
     */
    getRawWpms,

    restartTest,
  };
}

/*
 * ==========================================
 * FIND WORD AT INDEX
 * ==========================================
 */

function getWordAtIndex(
  text: string,
  index: number
) {
  /*
   * If index points to a space,
   * move backwards.
   */
  if (text[index] === " ") {
    index--;
  }

  /*
   * Find beginning of word
   */
  const start =
    text.lastIndexOf(
      " ",
      index - 1
    ) + 1;

  /*
   * Find end of word
   */
  const end =
    text.indexOf(" ", index);

  return text.slice(
    start,
    end === -1
      ? text.length
      : end
  );
}
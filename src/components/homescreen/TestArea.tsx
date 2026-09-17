import { useEffect, useRef, useState } from "react";

type TestAreaParams = {
  text: string;
  currentIndex: number;
  textArray: number[];
  timeorwords: number;
  mode: string;
  selector: number;
  wordsTyped: number;
  wpm: number;
  elapsedTime: number;
  timerStarted: boolean;
};

export default function TestArea({
  timeorwords,
  text,
  currentIndex,
  textArray,
  mode,
  selector,
  wordsTyped,
  wpm,
  elapsedTime,
  timerStarted,
}: TestAreaParams) {
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const [offset, setOffset] = useState(0);

  const [caretPosition, setCaretPosition] = useState({
    left: 0,
    top: 0,
  });

  /*
   * Move the text when the user reaches a new line.
   *
   * The current line stays around the 2nd visible line,
   * which keeps one extra line visible below it.
   */
  useEffect(() => {
    const currentChar = charRefs.current[currentIndex];

    if (!currentChar) return;

    const lineHeight = 54;

    const currentTop = currentChar.offsetTop;

    const newOffset = Math.max(
      0,
      currentTop - lineHeight
    );

    setOffset(newOffset);
  }, [currentIndex, text]);

  /*
   * Calculate caret position.
   */
  useEffect(() => {
    const currentChar = charRefs.current[currentIndex];

    if (!currentChar) return;

    setCaretPosition({
      left: currentChar.offsetLeft,
      top: currentChar.offsetTop,
    });
  }, [currentIndex, text]);

  return (
    <div className="w-full">
      {/* Typing viewport */}
      <div className="relative mx-auto h-[280px] w-[70vw] overflow-hidden px-8">

        {/* Header */}
        <div className="absolute left-8 right-8 top-2 z-20 flex items-center justify-between">

          {/* Timer / Words + WPM */}
          <div className="flex items-center gap-5">
            {timerStarted ? (
              <>
                <span className="text-2xl font-semibold text-[var(--caret)]">
                  {mode === "time"
                    ? `${Math.ceil(selector - elapsedTime)}s`
                    : `${Math.floor(wordsTyped)}/${selector}`}
                </span>

                <span className="text-2xl font-semibold text-[var(--caret)]">
                  {wpm} WPM
                </span>
              </>
            ) : (
              <span className="text-2xl font-semibold text-[var(--caret)]">
                {timeorwords}
                {mode === "time" ? "s" : " words"}
              </span>
            )}
          </div>

          {/* Options */}
          <div className="flex items-center gap-6 text-sm text-[var(--text-muted)]">
            {/* selector / options */}
          </div>
        </div>

        {/* Text viewport */}
        <div className="absolute inset-x-8 top-14 bottom-0 overflow-hidden">

          <div
            className="relative font-mono text-3xl leading-[1.8] tracking-wide transition-transform duration-200"
            style={{
              transform: `translateY(-${offset}px)`,
            }}
          >
            {/* Text */}
            {text.split("").map((char, index) => (
              <span
                key={index}
                ref={(el) => {
                  charRefs.current[index] = el;
                }}
                className={
                  index < currentIndex
                    ? textArray[index] === 1
                      ? "text-[var(--text-primary)]"
                      : textArray[index] === 0
                        ? "text-[var(--error)]"
                        : "text-[var(--text-secondary)]"
                    : "text-[var(--text-muted)]"
                }
              >
                {char}
              </span>
            ))}

            {/* Caret */}
            <div
              className="absolute h-12 w-[3px] bg-[var(--caret)] transition-all duration-100"
              style={{
                left: `${caretPosition.left}px`,
                top: `${caretPosition.top}px`,
              }}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
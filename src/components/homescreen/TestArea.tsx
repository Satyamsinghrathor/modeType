import { useEffect, useRef, useState } from "react";

type TestAreaParams = {
  text: string;
  currentIndex: number;
  textArray: number[];
  timeorwords: number;
  mode: string
  selector: number
  wordsTyped: number
  wpm: number
  elapsedTime: number
  timerStarted: boolean
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
  timerStarted
}: TestAreaParams) {
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const [offset, setOffset] = useState(0);


  const [caretPosition, setCaretPosition] = useState({
    left: 0,
    top: 0,
  });
  
  /*
   * Calculate where the text should be moved.
   *
   * We keep the current line around the 3rd visible line.
   */
  useEffect(() => {


    const currentChar = charRefs.current[currentIndex];

    if (!currentChar) return;

    const lineHeight = 54;

    const currentTop = currentChar.offsetTop;

    const newOffset = Math.max(
      0,
      currentTop - lineHeight * 2
    );

    setOffset(newOffset);
  }, [currentIndex, text]);

  /*
   * Calculate caret position.
   *
   * The caret is inside the same element as the text,
   * so we don't need to account for the text offset here.
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

      <div className="flext flex-row">
        {/* time / words indicator */}
        {timerStarted ? (
          <div className="mb-10 flex items-center justify-center gap-6 text-sm text-[var(--text-muted)]">
            {mode === "time" ? (
              <span>{Math.ceil(selector - elapsedTime)} seconds</span>
            ) : (
              <span>{Math.floor(wordsTyped)}/{selector} words</span>
            )
            }
            <span>{wpm}</span>
        </div>

        ) : 
          (<div className="mb-10 flex items-center justify-center gap-6 text-sm text-[var(--text-muted)]">
          <span>{timeorwords}</span>

        </div>)
        }
        {/* Options */}
        <div className="mb-10 flex items-center justify-center gap-6 text-sm text-[var(--text-muted)]">
          <span>🌐 english</span>
          <span>🎮 no quit</span>
        </div>
      </div>

      {/* Typing viewport */}
      <div className="relative mx-auto h-[220px] w-[70vw] overflow-hidden px-8">

        {/* Text + Caret move together */}
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
  );
}


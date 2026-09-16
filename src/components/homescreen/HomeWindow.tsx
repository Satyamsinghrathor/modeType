import React, { useEffect, useMemo, useRef, useState } from "react";
import TestArea from "./TestArea";
import { useTypingTest } from "../../hooks/useTypingTest";
import ToolBar from "./ToolBar";
import { calculateResult } from "../../utils/calculateResult";
import { useNavigate } from "react-router-dom";
import getTypingWords from "../../hooks/useGetTypingWords";
import { saveTestResult } from "../../localstorage/testStorage";
import { saveMistakes } from "../../localstorage/mistakeStorage";

export default function HomeWindow() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("time");
  const [type, setType] = useState("accuracy");
  const [selector, setSelector] = useState(15);

  const resultSaved = useRef(false);

  const texts = useMemo(() => {
    return getTypingWords({
      mode,
      timeOrWords: selector,
      type
    });
  }, [mode, selector,type]);

  const text = texts.join(" ");

  const {
    currentIndex,
    errors,
    skipped,
    textArray,
    elapsedTime,
    wordsTyped,
    wpm,
    startedTimer,
    wrongWords,
    wrongLetters,
    getWpms,
  } = useTypingTest(text);

  function onModeChange(mode: string) {
    setMode(mode);
    resultSaved.current = false;
  }

  function onTypeChange(type: string) {
    setType(type);
  }

  function onSelectorChange(selector: number) {
    setSelector(selector);
    resultSaved.current = false;
  }

  const testFinished =
    mode === "time"
      ? elapsedTime >= selector
      : wordsTyped >= selector;

  useEffect(() => {
    if (!testFinished || resultSaved.current) {
      return;
    }

    resultSaved.current = true;

    const wpms = getWpms();

    const {
      wpm,
      rawwpm,
      accuracy,
      rawAcc,
      consistency,
    } = calculateResult({
      currentIndex,
      errors,
      skipped,
      elapsedTime,
      textArray,
      wpms,
    });

    const result = {
      wpm,
      rawwpm,
      accuracy,
      rawaccuracy: rawAcc,
      errors,
      skipped,
      elapsedTime,
      wordsTyped: Math.floor(wordsTyped),
      wrongWords,
      wrongLetters,
      wpms,
      consistency,
      mode,
      type,
      selector,
    };


    // Save first
    saveTestResult(result);

    if(type !== "practice mistakes") {
    saveMistakes(
      result.wrongWords,
      result.wrongLetters
    );
  }
    // Then navigate
    navigate("/result", {
      state: result,
    });
  }, [
    testFinished,
    currentIndex,
    errors,
    skipped,
    elapsedTime,
    textArray,
    wordsTyped,
    wrongWords,
    wrongLetters,
    mode,
    type,
    selector,
    getWpms,
    navigate,
  ]);

  return (
    <>
      <ToolBar
        onModeChange={onModeChange}
        onTypeChange={onTypeChange}
        onSelectorChange={onSelectorChange}
      />

      <span className="text-white">{type}</span>
      <span className="text-white">{mode}</span>
      <span className="text-white">{selector}</span>

      <TestArea
        timeorwords={selector}
        text={text}
        currentIndex={currentIndex}
        textArray={textArray}
        mode={mode}
        selector={selector}
        wordsTyped={wordsTyped}
        wpm={wpm}
        elapsedTime={elapsedTime}
        timerStarted={startedTimer}
      />
    </>
  );
}
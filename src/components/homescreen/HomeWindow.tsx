import { useEffect, useMemo, useRef, useState } from "react";
import TestArea from "./TestArea";
import { useTypingTest } from "../../hooks/useTypingTest";
import ToolBar from "./ToolBar";
import { calculateResult } from "../../utils/calculateResult";
import { useNavigate } from "react-router-dom";
import getTypingWords from "../../hooks/useGetTypingWords";
import { saveTestResult } from "../../localstorage/testStorage";
import { saveMistakes } from "../../localstorage/mistakeStorage";
import type { AlertType } from "../ui/Alert";
import { getmodeTypeTime, saveModeTypeTime, type ModeTypeSelector } from "../../localstorage/modetypetimeStorage";

export default function HomeWindow() {
  const navigate = useNavigate();
const [settings, setSettings] = useState<ModeTypeSelector>(
  () => getmodeTypeTime()
);

const { mode, type, selector } = settings;

useEffect(() => {
  saveModeTypeTime(settings);
}, [settings]);

function onModeChange(mode: string) {
  setSettings(prev => ({
    ...prev,
    mode,
  }));

  resultSaved.current = false;
}

function onTypeChange(type: string) {
  setSettings(prev => ({
    ...prev,
    type,
  }));
}

function onSelectorChange(selector: number) {
  setSettings(prev => ({
    ...prev,
    selector,
  }));

  resultSaved.current = false;
}




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

     // Create alerts for this test
  const alerts: {
    type: AlertType;
    title: string;
    msg: string;
  }[] = [];

  // Save result
  if (rawAcc > 50 && consistency > 40) {
    saveTestResult(result);

    if (type !== "practice mistakes") {
      saveMistakes(
        result.wrongWords,
        result.wrongLetters
      );
    }
  } else {
    alerts.push({
      type: "error",
      title: "Error",
      msg: "Test was not saved because the test was inconsistent.",
    });
    alerts.push({
      type: "info",
      title: "notice",
      msg: "mistakes words are skipped as result is not saved"
    })
  }

    // Then navigate
    navigate("/result", {
      state: {...result , alerts},
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
  <div className="relative flex h-screen flex-col">

    {/* Toolbar */}
    <div
      className={`transition-all duration-500 ${
        startedTimer
          ? "pointer-events-none blur-sm opacity-30"
          : "blur-0 opacity-100"
      }`}
    >
      <ToolBar
        onModeChange={onModeChange}
        onTypeChange={onTypeChange}
        onSelectorChange={onSelectorChange}
        mode={mode}
        type={type}
        selector={selector}
      />
    </div>

    {/* Test area */}
    <main className="relative z-10 flex flex-1 items-center justify-center">
      <div className="-translate-y-24 w-full">
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
      </div>
    </main>
  </div>
);
}
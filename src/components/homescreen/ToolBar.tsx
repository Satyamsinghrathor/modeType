import { useState } from "react";
import testTypes from "../../models/testType";
import testModes from "../../models/testMode";



type ToolBarProps = {
  onModeChange: (mode: string) => void;
  onTypeChange: (type: string) => void;
  onSelectorChange: (selector: number) => void;
  mode: string;
  type: string;
  selector: number;
};






export default function ToolBar(
  { onModeChange, onTypeChange, onSelectorChange, mode , type , selector }: ToolBarProps
) {

  const modes = testModes;
  const types = testTypes;




  const selectors =
    mode === "time"
      ? [15, 30, 60, 120]
      : [10, 25, 50, 100];

  return (
    <div className="flex items-center gap-3 rounded-xl bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-muted)]">

      {/* Type - accuracy, burst, test wpm */}
      <div className="flex items-center gap-1 border-r border-[var(--border)] pr-3">
        {types.map((item) => (
          <button
            key={item}
            onClick={() => {

              onTypeChange(item);

            }}
            className={`
              rounded-md px-3 py-2 text-sm transition
              ${
                type === item
                  ? "bg-[var(--bg-elevated)] text-[var(--accent)]"
                  : "hover:bg-[var(--bg-elevated)]/50 hover:text-[var(--text-secondary)]"
              }
            `}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Mode - time, words */}
      <div className="flex items-center gap-1 border-r border-[var(--border)] pr-3">
        {modes.map((item) => (
          <button
            key={item}
            onClick={() => {
              
              

              onModeChange(item);
              onSelectorChange(item === "time" ? 15 : 10);
            }}
            className={`
              rounded-md px-3 py-2 text-sm transition
              ${
                mode === item
                  ? "bg-[var(--bg-elevated)] text-[var(--accent)]"
                  : "hover:bg-[var(--bg-elevated)]/50 hover:text-[var(--text-secondary)]"
              }
            `}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Selector - duration / length */}
      <div className="flex items-center gap-1">
        {selectors.map((item) => (
          <button
            key={item}
            onClick={() => {  onSelectorChange(item); }}
            className={`
              rounded-md px-3 py-2 text-sm transition
              ${
                selector === item
                  ? "bg-[var(--bg-elevated)] text-[var(--accent)]"
                  : "hover:bg-[var(--bg-elevated)]/50 hover:text-[var(--text-secondary)]"
              }
            `}
          >
            {item}
          </button>
        ))}
      </div>

    </div>
  );
}
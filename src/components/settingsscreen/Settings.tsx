import { useState } from "react";
import { themes } from "../../theme/themes";
import { useTheme } from "../../theme/ThemeContext";
import {
  getmodeTypeTime,
  saveModeTypeTime,
} from "../../localstorage/modetypetimeStorage";

export default function Settings() {
  const { theme, setTheme } = useTheme();

  const [showWpm, setShowWpm] = useState(
    getmodeTypeTime().showWpm
  );

  const handleWpmToggle = () => {
    const current = getmodeTypeTime();

    const updated = {
      ...current,
      showWpm: !current.showWpm,
    };

    saveModeTypeTime(updated);
    setShowWpm(updated.showWpm);
  };

  return (
    <main className="min-h-screen w-full bg-[var(--bg-primary)]">
      <div className="mx-auto w-full max-w-5xl px-6 py-10">

        {/* Page heading */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            Settings
          </h1>

          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Customize your typing experience.
          </p>
        </div>

        {/* Appearance */}
        <section className="mb-10">
          <h2 className="mb-5 text-lg font-medium text-[var(--text-primary)]">
            Appearance
          </h2>

          <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">

            {/* Theme */}
            <div className="flex items-center justify-between gap-8 py-5">
              <div>
                <h3 className="text-sm font-medium text-[var(--text-primary)]">
                  Theme
                </h3>

                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Choose the color theme for the application.
                </p>
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
                      theme === t.id
                        ? "border-[var(--accent)] bg-[var(--bg-elevated)] text-[var(--accent)]"
                        : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
                    }`}
                  >
                    <span
                      className="h-3 w-3 rounded-full border border-[var(--border)]"
                      style={{ backgroundColor: t.swatch }}
                    />

                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Typing */}
        <section className="mb-10">
          <h2 className="mb-5 text-lg font-medium text-[var(--text-primary)]">
            Typing
          </h2>

          <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">

            {/* WPM */}
            <div className="flex items-center justify-between py-5">
              <div>
                <h3 className="text-sm font-medium text-[var(--text-primary)]">
                  Show WPM
                </h3>

                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Show your current words per minute while typing.
                </p>
              </div>

<button
  onClick={handleWpmToggle}
  className={`relative h-6 w-11 rounded-full transition ${
    showWpm
      ? "bg-[var(--accent)]"
      : "bg-[var(--bg-elevated)]"
  }`}
>
  <span
    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
      showWpm
        ? "right-1"
        : "left-1"
    }`}
  />
</button>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
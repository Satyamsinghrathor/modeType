import {
  BarChart3,
  RotateCcw,
  ChevronRight,
  TriangleAlert,
  List,
  Rewind,
  Download,
} from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { useNavigate} from "react-router-dom";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Alert, { type AlertData } from "../ui/Alert";

type TestResultProps = {
  wpm: number;
  rawwpm: number;
  accuracy: number;
  rawaccuracy: number;
  currentErrors: number;
  currentSkipped: number;
  errors: number;
  skipped: number;
  elapsedTime: number;
  wordsTyped: number;
  wrongWords: string[];
  wrongLetters: string[];
  wpms: number[];
  rawWpms: number[];
  consistency: number;
  mode: string;
  type: string;
  selector: number;
  resultSaved: boolean;
  alerts: AlertData[];
  sessionTime: number;
};

export default function TestResult({
  wpm,
  rawwpm,
  accuracy,
  rawaccuracy,
  currentErrors,
  currentSkipped,
  errors,
  skipped,
  elapsedTime,
  wordsTyped,
  wrongWords,
  wrongLetters,
  wpms,
  rawWpms,
  consistency,
  mode,
  type,
  selector,
  alerts,
  sessionTime
}: TestResultProps) {

  const navigate = useNavigate()

    useEffect(() => {
      function handleKeyDown(e: KeyboardEvent) {

        if (e.key === "Tab") {
        e.preventDefault();
        navigate("/")
        return;
      }

      if(e.key == " "){
        e.preventDefault()
        return;
      }
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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const characters = wordsTyped * 5;

  const characterStats = `${characters}/${currentErrors}/${currentSkipped}/0`;

  const chartData = wpms.map((value, index) => ({
    second: index + 1,
    wpm: value,
    rawWpm: rawWpms[index] ?? 0,
  }));

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] px-4 py-8 font-mono text-[var(--text-muted)] sm:px-6 lg:px-8">
      <main className="mx-auto max-w-[1400px]">

      <div className="fixed right-7 top-12 z-50 flex flex-col gap-3">
        {alerts.map((alert, index) => (
          <Alert
            key={index}
            type={alert.type}
            title={alert.title}
          >
            {alert.msg}
          </Alert>
        ))}
      </div>
        {/* ================= MAIN CARD ================= */}

        <section className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-secondary)] p-5 shadow-xl sm:p-7 lg:p-8">
          {/* ================= TOP SECTION ================= */}

          <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
            {/* ================= LEFT STATS ================= */}

            <div className="flex flex-row gap-10 lg:block lg:pt-3">
              {/* WPM */}

              <div>
                <div className="text-base uppercase tracking-wide text-[var(--text-muted)]">
                  wpm
                </div>

                <div className="mt-1 font-sans text-6xl font-semibold leading-none text-[var(--accent)] sm:text-7xl">
                  {Math.round(wpm)}
                </div>
              </div>

              {/* ACCURACY */}

              <div className="lg:mt-8">
                <div className="text-base uppercase tracking-wide text-[var(--text-muted)]">
                  accuracy
                </div>

                <div className="mt-1 font-sans text-6xl font-semibold leading-none text-[var(--accent)] sm:text-7xl">
                  {Math.round(accuracy)}%
                </div>
              </div>

              {/* TEST INFO */}

              <div className="hidden lg:block">
                <div className="my-8 h-px bg-[var(--border)]" />

                <div>
                  <div className="mb-3 text-sm uppercase tracking-wide text-[var(--text-muted)]">
                    test type
                  </div>

                  <div className="space-y-1.5 text-sm text-[var(--accent)]">
                    <div>{mode} {selector}</div>
                    <div>{type}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= GRAPH ================= */}

            <div
              className="
                relative
                flex
                min-h-[300px]
                items-center
                justify-center
                overflow-hidden
                rounded-xl
                border
                border-[var(--border)]
                bg-[var(--bg-tertiary)]
                p-4
              "
            >
              {chartData.length > 1 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={chartData}>
                    <CartesianGrid
                      stroke="var(--border-soft)"
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="second"
                      stroke="var(--text-muted)"
                      tick={{ fontSize: 12 }}
                      label={{
                        value: "seconds",
                        position: "insideBottom",
                        offset: -5,
                        fill: "var(--text-muted)",
                        fontSize: 11,
                      }}
                    />

                    <YAxis
                      stroke="var(--text-muted)"
                      tick={{ fontSize: 12 }}
                    />

                    <Tooltip
                      contentStyle={{
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        color: "var(--text-primary)",
                      }}
                      formatter={(value: number, name: string) => [
                        Math.round(value),
                        name === "wpm" ? "WPM" : "Raw WPM",
                      ]}
                      labelFormatter={(label) =>
                        `second ${label}`
                      }
                    />

                    {/* Corrected WPM */}
                    <Line
                      type="monotone"
                      dataKey="wpm"
                      name="wpm"
                      stroke="var(--accent)"
                      strokeWidth={2}
                      dot={false}
                    />

                    {/* Raw WPM */}
                    <Line
                      type="monotone"
                      dataKey="rawWpm"
                      name="rawWpm"
                      stroke="var(--accent)"
                      strokeWidth={2}
                      strokeDasharray="6 4"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="relative z-10 text-center">
                  <BarChart3
                    size={52}
                    strokeWidth={1.5}
                    className="mx-auto mb-4 text-[var(--text-muted)]"
                  />

                  <div className="font-sans text-lg text-[var(--text-secondary)]">
                    not enough data for a graph
                  </div>

                  <div className="mt-2 text-xs text-[var(--text-muted)]">
                    tests under a couple of seconds won't have a WPM curve
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ================= MOBILE TEST INFO ================= */}

          <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] p-5 lg:hidden">
            <div className="mb-3 text-sm uppercase tracking-wide">
              test type
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--accent)]">
              <span>{mode} {selector}</span>
              <span>{type}</span>
              <span>english</span>
            </div>
          </div>

          {/* ================= METRICS ================= */}

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric
              label="raw"
              value={`${Math.round(rawwpm)} wpm`}
              subValue={`clean accuracy ${Math.round(rawaccuracy)}%`}
            />

            <Metric
              label="characters"
              value={characterStats}
              subValue="correct / errors / skipped / extra"
            />

            <Metric
              label="consistency"
              value={Math.ceil(consistency)}
              subValue="calculated from WPM data"
            />

            <Metric
              label="time"
              value={formatTime(elapsedTime)}
              subValue={`${formatElapsedTime(sessionTime)} session`}
            />
          </div>

          {/* ================= ERROR SUMMARY ================= */}

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoCard
              icon={<TriangleAlert size={18} />}
              label="errors"
              value={errors}
            />

            <InfoCard
              icon={<List size={18} />}
              label="skipped"
              value={skipped}
            />
          </div>

          {/* ================= WRONG LETTERS ================= */}

          {wrongLetters.length > 0 && (
            <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] p-5">
              <div className="mb-3 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <TriangleAlert size={16} />
                <span>mistakes</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {wrongLetters.map((letter, index) => (
                  <span
                    key={`${letter}-${index}`}
                    className="rounded-md border border-[var(--accent-soft)] bg-[var(--bg-elevated)] px-2.5 py-1 text-sm text-[var(--accent)]"
                  >
                    {letter}
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* ================= WRONG WORDS ================= */}

          {wrongWords.length > 0 && (
            <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] p-5">
              <div className="mb-3 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <TriangleAlert size={16} />
                <span>mistakes</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {wrongWords.map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                    className="rounded-md border border-[var(--accent-soft)] bg-[var(--bg-elevated)] px-2.5 py-1 text-sm text-[var(--accent)]"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ================= DIVIDER ================= */}

          <div className="my-8 h-px bg-[var(--border)]" />

          {/* ================= ACTIONS ================= */}

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            <ActionButton
              icon={<RotateCcw size={21} />}
              label="restart"
              active
              onClick={() => navigate("/")}
            />

            <ActionButton
              icon={<ChevronRight size={22} />}
              label="next"
              onClick={() => navigate("/")}
            />

            <ActionButton
              icon={<TriangleAlert size={19} />}
              label="mistakes"
            />

            <ActionButton
              icon={<List size={20} />}
              label="dashboard"
              onClick={() => navigate("/dashboard")}
            />

            <ActionButton
              icon={<Rewind size={20} />}
              label="review"
            />

            <ActionButton
              icon={<Download size={19} />}
              label="export"
            />
          </div>
        </section>

        {/* ================= SHORTCUTS ================= */}

        <div className="mt-8 flex flex-col items-center gap-2 text-xs sm:text-sm">
          <Shortcut keys="tab" description="restart test" />

          <Shortcut keys="esc" description="command line" />

          <Shortcut
            keys="ctrl + shift + p"
            description="command palette"
          />
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   METRIC
========================================================= */

type MetricProps = {
  label: string;
  value: string | number;
  subValue?: string;
};

function Metric({ label, value, subValue }: MetricProps) {
  return (
    <div
      className="
        rounded-xl
        border
        border-[var(--border)]
        bg-[var(--bg-tertiary)]
        px-5
        py-5
        transition-colors
        hover:border-[var(--text-faint)]
      "
    >
      <div className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </div>

      <div className="mt-2 break-all font-sans text-3xl font-medium text-[var(--accent)]">
        {value}
      </div>

      {subValue && (
        <div className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
          {subValue}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   INFO CARD
========================================================= */

type InfoCardProps = {
  icon: ReactNode;
  label: string;
  value: number;
};

function InfoCard({ icon, label, value }: InfoCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="text-[var(--text-faint)]">{icon}</div>

        <span className="text-sm text-[var(--text-muted)]">{label}</span>
      </div>

      <span className="font-sans text-xl text-[var(--accent)]">{value}</span>
    </div>
  );
}

/* =========================================================
   ACTION BUTTON
========================================================= */

type ActionButtonProps = {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
};

function ActionButton({
  icon,
  label,
  active = false,
  onClick,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`
        group
        flex
        h-11
        min-w-11
        items-center
        justify-center
        rounded-lg
        border
        px-3
        transition-all

        ${
          active
            ? "border-[var(--accent-soft)] bg-[var(--bg-elevated)] text-[var(--accent)]"
            : "border-transparent text-[var(--text-faint)] hover:border-[var(--border)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-secondary)]"
        }
      `}
    >
      {icon}
    </button>
  );
}

/* =========================================================
   SHORTCUT
========================================================= */

type ShortcutProps = {
  keys: string;
  description: string;
};

function Shortcut({ keys, description }: ShortcutProps) {
  return (
    <div className="flex items-center gap-2">
      <kbd
        className="
          rounded-md
          border
          border-[var(--text-faint)]
          bg-[var(--text-muted)]
          px-2
          py-1
          text-[11px]
          font-sans
          font-semibold
          text-[var(--bg-primary)]
        "
      >
        {keys}
      </kbd>

      <span>— {description}</span>
    </div>
  );
}
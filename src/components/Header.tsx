import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bell,
  User,
  Keyboard,
  Crown,
  BarChart3,
  LineChart,
  Info,
  Settings,
} from "lucide-react";
import { useTheme } from "../theme/ThemeContext";
import { themes } from "../theme/themes";
import { testsDummy } from "../dummydata/testdummy";

function NavLink({
  to,
  title,
  children,
}: {
  to: string;
  title: string;
  children: ReactNode;
}) {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link
      to={to}
      title={title}
      className={
        active
          ? "text-[var(--accent)]"
          : "text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
      }
    >
      {children}
    </Link>
  );
}

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);

  function loadDummyData() {
    localStorage.setItem(
  "typing-test-results",
  JSON.stringify(testsDummy)
);
  }

  return (
    <div>
      {/* ================= HEADER ================= */}
      <header className="flex items-center justify-between px-12 py-7">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-[var(--accent)] text-[var(--accent)]">
            <Keyboard size={26} />
          </div>

          <div className="leading-none">
            <div className="ml-1 text-[11px] text-[var(--text-muted)]">
              by Satyam Singh
            </div>

            <div className="font-sans text-[30px] font-medium text-[var(--text-primary)]">
              modeType
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="mr-auto ml-8 flex items-center gap-7">
          <NavLink to="/" title="test">
            <Keyboard size={19} />
          </NavLink>

          <button onClick={() => loadDummyData()}>
            <Crown size={20} className="text-[var(--text-secondary)]" />
          </button>

          <NavLink to="/dashboard" title="dashboard">
            <BarChart3 size={20} />
          </NavLink>

          <NavLink to="/statistics" title="user statistics">
            <LineChart size={20} />
          </NavLink>

          <Info size={19} className="text-[var(--text-secondary)]" />

          {/* Theme picker */}
          <div className="relative">
            <button
              onClick={() => setSettingsOpen((open) => !open)}
              title="theme"
              className={
                settingsOpen
                  ? "text-[var(--accent)]"
                  : "text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              }
            >
              <Settings size={20} />
            </button>

            {settingsOpen && (
              <div className="absolute left-0 top-9 z-20 w-44 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-2 shadow-xl">
                <div className="mb-2 px-2 text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
                  theme
                </div>

                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setSettingsOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition ${
                      theme === t.id
                        ? "bg-[var(--bg-elevated)] text-[var(--accent)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]/60"
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
            )}
          </div>
        </nav>

        {/* User */}
        <div className="flex items-center gap-5">
          <Bell size={19} className="text-[var(--text-secondary)]" />

          <div className="flex items-center gap-2">
            <User size={18} className="text-[var(--text-secondary)]" />

            <span className="text-sm text-[var(--text-primary)]">
              satyam_0_7
            </span>

            <span className="rounded bg-[var(--bg-elevated)] px-2 py-0.5 text-xs text-[var(--text-primary)]">
              115
            </span>
          </div>
        </div>
      </header>
    </div>
  );
}

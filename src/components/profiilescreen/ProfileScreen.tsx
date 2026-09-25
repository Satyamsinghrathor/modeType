
import { useEffect, useMemo, useState } from "react";
import { useTestResults } from "../../hooks/useTestResults";
import AlertDialogBox from "../ui/AlertDialogBox";

type ProfileData = {
  username: string;
  email: string;
};

const DEFAULT_PROFILE: ProfileData = {
  username: "Satyam",
  email: "",
};

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
}

function getInitials(name: string) {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return "?";
  }

  return trimmedName
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ProfileScreen() {
  const results = useTestResults();

  const [profile, setProfile] =
    useState<ProfileData>(DEFAULT_PROFILE);

  const [isDeleting , setIsDeleting] = useState(false)

  /*
   * Load profile from localStorage
   */
  useEffect(() => {
    const savedProfile =
      localStorage.getItem("typing-profile");

    if (!savedProfile) {
      return;
    }

    try {
      const parsed = JSON.parse(savedProfile);

      setProfile({
        username:
          typeof parsed.username === "string" &&
          parsed.username.trim()
            ? parsed.username
            : DEFAULT_PROFILE.username,

        email:
          typeof parsed.email === "string"
            ? parsed.email
            : DEFAULT_PROFILE.email,
      });
    } catch {
      setProfile(DEFAULT_PROFILE);
    }
  }, []);

  /*
   * Calculate lifetime statistics
   */
  const stats = useMemo(() => {
    if (results.length === 0) {
      return {
        totalTests: 0,
        totalTime: 0,
        highestWpm: 0,
        averageWpm: 0,
        highestAccuracy: 0,
        averageAccuracy: 0,
      };
    }

    const totalTime = results.reduce(
      (sum, result) => sum + result.elapsedTime,
      0
    );

    const highestWpm = Math.max(
      ...results.map((result) => result.wpm)
    );

    const averageWpm =
      results.reduce(
        (sum, result) => sum + result.wpm,
        0
      ) / results.length;

    const highestAccuracy = Math.max(
      ...results.map((result) => result.accuracy)
    );

    const averageAccuracy =
      results.reduce(
        (sum, result) => sum + result.accuracy,
        0
      ) / results.length;

    return {
      totalTests: results.length,
      totalTime,
      highestWpm,
      averageWpm,
      highestAccuracy,
      averageAccuracy,
    };
  }, [results]);

  const initials = getInitials(profile.username);

  /*
   * Save profile
   *
   * This is ready for your future edit-profile UI.
   */
  // const saveProfile = (updatedProfile: ProfileData) => {
  //   setProfile(updatedProfile);

  //   localStorage.setItem(
  //     "typing-profile",
  //     JSON.stringify(updatedProfile)
  //   );
  // };

  const onCancel = () => {
    setIsDeleting(false)
  }
  const onSubmitClear = () => {
    localStorage.clear()
    setIsDeleting(false)
  }
  const handleOnClear = () => {
    setIsDeleting(true)
  }

  return (
    <div
      className="
        min-h-full
        w-full
        bg-[var(--bg-primary)]
        px-4
        py-8
        text-[var(--text-primary)]
        sm:px-6
        lg:px-8
      "
    >
      <div className="mx-auto max-w-4xl">

        {/* ============================== */}
        {/* Header                         */}
        {/* ============================== */}

        <div className="mb-8">
          <h1 className="text-2xl font-semibold">
            profile
          </h1>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Your account and typing overview
          </p>
        </div>

        {/* ============================== */}
        {/* Profile Card                   */}
        {/* ============================== */}

        <section
          className="
            rounded-xl
            border
            border-[var(--border)]
            bg-[var(--bg-tertiary)]
            p-6
          "
        >
          <div
            className="
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-center
            "
          >
            {/* Avatar */}

            <div
              className="
                flex
                h-20
                w-20
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-[var(--border)]
                bg-[var(--bg-elevated)]
                text-2xl
                font-semibold
                text-[var(--accent)]
              "
            >
              {initials}
            </div>

            {/* User Information */}

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-xl font-semibold">
                {profile.username}
              </h2>

              {profile.email ? (
                <p
                  className="
                    mt-1
                    truncate
                    text-sm
                    text-[var(--text-secondary)]
                  "
                >
                  {profile.email}
                </p>
              ) : (
                <p
                  className="
                    mt-1
                    text-sm
                    text-[var(--text-muted)]
                  "
                >
                  No email added
                </p>
              )}

              <p
                className="
                  mt-2
                  text-xs
                  text-[var(--text-muted)]
                "
              >
                Typing enthusiast
              </p>
            </div>

            {/* Edit Button */}

            <button
              type="button"
              onClick={() => {
                /*
                 * Edit profile UI can be added here.
                 *
                 * Example:
                 *
                 * saveProfile({
                 *   username: "New Name",
                 *   email: "new@email.com"
                 * });
                 */
              }}
              className="
                rounded-lg
                border
                border-[var(--border)]
                bg-[var(--bg-secondary)]
                px-4
                py-2
                text-sm
                font-medium
                text-[var(--text-primary)]
                transition
                hover:bg-[var(--bg-elevated)]
              "
            >
              edit profile
            </button>
          </div>
        </section>

        {/* ============================== */}
        {/* Lifetime Statistics            */}
        {/* ============================== */}

        <section className="mt-8">
          <h2
            className="
              mb-3
              text-sm
              uppercase
              tracking-wide
              text-[var(--text-muted)]
            "
          >
            lifetime statistics
          </h2>

          <div
            className="
              grid
              grid-cols-2
              gap-4
              sm:grid-cols-3
            "
          >
            <StatCard
              label="tests completed"
              value={stats.totalTests.toString()}
            />

            <StatCard
              label="typing time"
              value={formatDuration(stats.totalTime)}
            />

            <StatCard
              label="highest wpm"
              value={Math.round(stats.highestWpm).toString()}
              accent
            />

            <StatCard
              label="average wpm"
              value={Math.round(stats.averageWpm).toString()}
            />

            <StatCard
              label="highest accuracy"
              value={`${Math.round(stats.highestAccuracy)}%`}
              accent
            />

            <StatCard
              label="average accuracy"
              value={`${Math.round(stats.averageAccuracy)}%`}
            />
          </div>
        </section>

        {/* ============================== */}
        {/* Account                        */}
        {/* ============================== */}

        <section className="mt-8">
          <h2
            className="
              mb-3
              text-sm
              uppercase
              tracking-wide
              text-[var(--text-muted)]
            "
          >
            account
          </h2>

          <div
            className="
              overflow-hidden
              rounded-xl
              border
              border-[var(--border)]
              bg-[var(--bg-tertiary)]
            "
          >
            <ProfileRow
              label="username"
              value={profile.username}
            />

            <ProfileRow
              label="email"
              value={profile.email || "Not added"}
            />

            <ProfileRow
              label="storage"
              value="Local storage"
            />

            <ProfileRow
              label="tests stored"
              value={stats.totalTests.toString()}
              last
            />
          </div>
        </section>

        {/* ============================== */}
        {/* Data                           */}
        {/* ============================== */}

        <section className="mt-8">
          <h2
            className="
              mb-3
              text-sm
              uppercase
              tracking-wide
              text-[var(--text-muted)]
            "
          >
            data
          </h2>

          <div
            className="
              overflow-hidden
              rounded-xl
              border
              border-[var(--border)]
              bg-[var(--bg-tertiary)]
            "
          >
            {/* Export */}

            <button
              type="button"
              className="
                flex
                w-full
                items-center
                justify-between
                px-5
                py-4
                text-left
                transition
                hover:bg-[var(--bg-elevated)]
              "
            >
              <div>
                <p
                  className="
                    text-sm
                    font-medium
                    text-[var(--text-primary)]
                  "
                >
                  export data
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-[var(--text-muted)]
                  "
                >
                  Download your typing history
                </p>
              </div>

              <span
                className="
                  text-sm
                  text-[var(--text-secondary)]
                "
              >
                →
              </span>
            </button>

            {/* Divider */}

            <div
              className="
                border-t
                border-[var(--border-soft)]
              "
            />

            {/* Clear History */}

            <button
              onClick={() => handleOnClear()}
              type="button"
              className="
                flex
                w-full
                items-center
                justify-between
                px-5
                py-4
                text-left
                transition
                hover:bg-[var(--bg-elevated)]
              "
            >
              <div>
                <p
                  className="
                    text-sm
                    font-medium
                    text-[var(--error)]
                  "
                >
                  clear history
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-[var(--text-muted)]
                  "
                >
                  Delete all saved typing tests
                </p>
              </div>

              <span
                className="
                  text-sm
                  text-[var(--text-secondary)]
                "
              >
                →
              </span>
            </button>
          </div>
        </section>
{        isDeleting && <AlertDialogBox description="do you want to clear your typing history" onCancel={onCancel} onSubmit={onSubmitClear}/>}

      </div>
    </div>
  );
}


/* ================================== */
/* Stat Card                          */
/* ================================== */

type StatCardProps = {
  label: string;
  value: string;
  accent?: boolean;
};

function StatCard({
  label,
  value,
  accent = false,
}: StatCardProps) {
  return (
    <div
      className="
        rounded-xl
        border
        border-[var(--border)]
        bg-[var(--bg-tertiary)]
        p-5
      "
    >
      <p
        className="
          text-sm
          text-[var(--text-secondary)]
        "
      >
        {label}
      </p>

      <p
        className={`
          mt-2
          text-2xl
          font-semibold
          ${
            accent
              ? "text-[var(--accent)]"
              : "text-[var(--text-primary)]"
          }
        `}
      >
        {value}
      </p>
    </div>
  );
}


/* ================================== */
/* Profile Row                        */
/* ================================== */

type ProfileRowProps = {
  label: string;
  value: string;
  last?: boolean;
};

function ProfileRow({
  label,
  value,
  last = false,
}: ProfileRowProps) {
  return (
    <div
      className={`
        flex
        items-center
        justify-between
        gap-4
        px-5
        py-4
        ${
          !last
            ? "border-b border-[var(--border-soft)]"
            : ""
        }
      `}
    >
      <span
        className="
          text-sm
          text-[var(--text-secondary)]
        "
      >
        {label}
      </span>

      <span
        className="
          max-w-[60%]
          truncate
          text-sm
          font-medium
          text-[var(--text-primary)]
        "
      >
        {value}
      </span>
    </div>
  );
}




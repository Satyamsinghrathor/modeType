const STORAGE_KEY = "mode_type_time_storage";

export type ModeTypeSelector = {
  mode: string;
  type: string;
  selector: number;
};

const DEFAULT_VALUES: ModeTypeSelector = {
  mode: "time",
  type: "none",
  selector: 15,
};

export function getmodeTypeTime(): ModeTypeSelector {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return DEFAULT_VALUES;
  }

  try {
    const parsed = JSON.parse(stored);

    return {
      mode: parsed.mode ?? DEFAULT_VALUES.mode,
      type: parsed.type ?? DEFAULT_VALUES.type,
      selector: parsed.selector ?? DEFAULT_VALUES.selector,
    };
  } catch {
    return DEFAULT_VALUES;
  }
}

export function saveModeTypeTime(values: ModeTypeSelector) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
}
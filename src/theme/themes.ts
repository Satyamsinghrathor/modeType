export type ThemeId = "yellow" | "blue";

export type ThemeMeta = {
  id: ThemeId;
  name: string;
  /** Swatch color shown in the theme picker */
  swatch: string;
};

export const themes: ThemeMeta[] = [
  { id: "yellow", name: "Yellow (Monkeytype)", swatch: "#e2b714" },
  { id: "blue", name: "Blue (GitHub)", swatch: "#58a6ff" },
];

export const DEFAULT_THEME: ThemeId = "yellow";

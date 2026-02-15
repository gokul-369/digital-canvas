export interface ThemeClassSet {
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  textPrimary: string;
  textSecondary: string;
  borderSecondary: string;
}

export const themeFactory = (theme: "light" | "dark"): ThemeClassSet => {
  const themeFactory: Record<"light" | "dark", ThemeClassSet> = {
    light: {
      bgPrimary: "bg-bgprimary",
      bgSecondary: "bg-bgSecondary",
      bgTertiary: "bg-bgTertiary",
      textPrimary: "text-textprimary",
      textSecondary: "text-textSecondary",
      borderSecondary: "border-textSecondary",
    },
    dark: {
      bgPrimary: "bg-darkBgPrimary",
      bgSecondary: "bg-darkBgSecondary",
      bgTertiary: "bg-darkBgTertiary",
      textPrimary: "text-darkTextPrimary",
      textSecondary: "text-darkTextSecondary",
      borderSecondary: "border-darkTextSecondary",
    },
  };
  return themeFactory[theme];
};

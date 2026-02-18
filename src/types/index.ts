import type { ReactNode } from "react";

export type formField = Record<"name" | "value", string>;
export type experience = {
  company: string;
  role: string;
  duration: string;
  description: string[];
};

export type skill = {
  name: string;
  imagePath: string;
};

export type bio = {
  name: string;
  title: string;
  description: string;
};

export type theme = "light" | "dark";

export interface ThemeClassSet {
  bgPrimaryAccent: string;
  bgSecondaryAccent: string;
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  textPrimary: string;
  textSecondary: string;
  textMainAccent1: string;
  textMainAccent2: string;
  textMainAccent3: string;
  borderSecondary: string;
  headerGradient: string;
}

export interface hero {
  title: string | TrustedHTML;
  punchLine: string | ReactNode;
  shortDescription: string | ReactNode;
  longDescription: string | TrustedHTML;
}

export interface education {
  title: string;
  subTitle: string;
}

import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { bio, fields, socialLinks } from "../data";
import useTheme from "../hooks/useTheme";
import { themeFactory } from "../utils/styleFactory";
import type { JSX } from "react";

function Bio() {
  const { theme } = useTheme();
  const iconMap: Record<string, JSX.Element> = {
    LinkedIn: <LinkedInLogoIcon />,
    GitHub: <GitHubLogoIcon />,
  };

  const themeClass = themeFactory(theme);

  return (
    <section
      className={`p-5 rounded-2xl h-[calc(100%-24rem)] flex flex-col ${themeClass.bgSecondary}`}
    >
      <>
        <span className={`${themeClass.textPrimary} text-xl font-semibold`}>
          {bio.name}
        </span>
        <span className={`${themeClass.textSecondary} text-sm mt-1`}>
          {bio.title}
        </span>
        <span className={`mt-2 text-xs ${themeClass.textSecondary}`}>
          {bio.description}
        </span>
      </>

      <div className={`mt-2 ${themeClass.textSecondary}`}></div>
      <div className="mt-4">
        {fields.map((field) => (
          <div
            className="flex text-sm items-center justify-between gap-1 mt-2"
            key={field.name}
          >
            <span className={`${themeClass.textPrimary}`}>{field.name}</span>
            <span className={`${themeClass.textSecondary} text-end`}>
              {field.value}
            </span>
          </div>
        ))}
      </div>

      <div className={`mt-5 flex gap-2 ${themeClass.textSecondary}`}>
        {socialLinks.map((link) => (
          <a
            href={link.value}
            target="_blank"
            key={link.name}
            className="flex items-center gap-2"
          >
            {iconMap[link.name]}
          </a>
        ))}
      </div>
    </section>
  );
}

export default Bio;

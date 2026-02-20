import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { navLinks } from "../../data";
import useTheme from "../../hooks/useTheme";
import type { pageProp } from "../../types";
import { themeFactory } from "../../utils/styleFactory";
import { HashLink } from "react-router-hash-link";

function Nav({ theme: themeClass }: pageProp) {
  const theme = themeFactory(themeClass);
  const { toggleTheme, theme: themeName } = useTheme();

  return (
    <nav
      className="inline-flex gap-4 items-center justify-around rounded-full border border-white/15 backdrop-blur-md px-4 py-2 text-xs text-gray-200
    bg-white/5 dark:bg-white/5
    shadow-[0_8px_30px_rgba(15,23,42,0.45)]
    transition-colors duration-200
    "
    >
      <ul className="flex space-x-4">
        {navLinks.map((link) => (
          <li key={link.name}>
            <HashLink
              to={link.value}
              smooth
              className={`text-sm font-thin ${theme.textPrimary}  hover:text-indigo-500 transition-colors duration-300`}
            >
              {link.name}
            </HashLink>
          </li>
        ))}
      </ul>
      {themeName === "dark" ? (
        <SunIcon
          onClick={toggleTheme}
          className={`${theme.textPrimary} transition-transform duration-300 ease-in-out transform hover:rotate-90`}
        />
      ) : (
        <MoonIcon
          onClick={toggleTheme}
          className={`${theme.textPrimary} transition-transform duration-300 ease-in-out transform hover:rotate-45`}
        />
      )}
    </nav>
  );
}

export default Nav;

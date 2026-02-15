import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { workExperiences } from "../data";
import useTheme from "../hooks/useTheme";
import { groupExperiencesByCompany } from "../utils/groupByCompany";
import { themeFactory } from "../utils/styleFactory";

function WorkExperience() {
  const groupedExperiences = groupExperiencesByCompany(workExperiences);
  const { theme, toggleTheme } = useTheme();
  const themeClass = themeFactory(theme);

  return (
    <section
      className={`h-[85%] rounded-2xl flex flex-col overflow-auto work-experience p-5 ${themeClass.bgSecondary}
    `}
    >
      <div className="flex items-center justify-between">
        <span className={`text-lg font-semibold ${themeClass.textPrimary}`}>
          Work Experience
        </span>

        <span
          className={`p-3 rounded-full cursor-pointer hover:shadow-md transition ${themeClass.bgTertiary}`}
        >
          {theme === "light" ? (
            <SunIcon
              onClick={toggleTheme}
              className={`${themeClass.textSecondary} transition-transform duration-300 ease-in-out transform hover:rotate-90 text-yellow-400`}
            />
          ) : (
            <MoonIcon
              onClick={toggleTheme}
              className={`${themeClass.textSecondary} transition-transform duration-300 ease-in-out transform hover:rotate-45 text-neutral-600`}
            />
          )}
        </span>
      </div>

      <div className="mt-6">
        {groupedExperiences.map((group) => (
          <div key={group.company} className="mb-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className={`${themeClass.textPrimary} font-medium text-sm`}>
                  {group.company}
                </h3>
                <div className="mb-4">
                  {group.roles.map((experience, idx) => (
                    <section
                      key={idx}
                      className={`flex flex-col gap-1 pl-4 ${themeClass.borderSecondary} border-opacity-20 py-2`}
                    >
                      <span
                        className={`${themeClass.textPrimary} font-medium text-sm`}
                      >
                        {experience.role}
                      </span>
                      <span className={`${themeClass.textSecondary} text-xs`}>
                        {experience.duration}
                      </span>
                      <ul
                        className={`ml-3 mt-2 list-disc list-inside ${themeClass.textSecondary} text-xs space-y-1`}
                      >
                        {experience.description.map((point, descIdx) => (
                          <li key={descIdx}>{point}</li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WorkExperience;

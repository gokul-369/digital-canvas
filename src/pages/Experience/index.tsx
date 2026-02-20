import MovingGradient from "../../components/Backgrounds/MovingGradient";
import Testimonials from "../../components/Testimonials";
import type { pageProp } from "../../types";
import { themeFactory } from "../../utils/styleFactory";
import Awards from "../../components/Awards";
import WorkExperience from "../../components/WorkExperience/WorkExperience";

function Experience({ theme }: pageProp) {
  const themeClassSet = themeFactory(theme);
  return (
    <div className={`relative`}>
      <WorkExperience />

      <MovingGradient theme={theme} />

      <Testimonials theme={themeClassSet} />

      <Awards theme={themeClassSet} />
    </div>
  );
}

export default Experience;

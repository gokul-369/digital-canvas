import MovingGradient from "../../components/Backgrounds/MovingGradient";
import Testimonials from "../../components/Testimonials";
import type { pageProp } from "../../types";
import { themeFactory } from "../../utils/styleFactory";
import Awards from "../../components/Awards";
import WorkExperience from "../../components/WorkExperience/WorkExperience";
import Skills from "../../components/Skills";
import useNavigateTop from "../../hooks/useNavigateToTop";

function Experience({ theme }: pageProp) {
  const themeClassSet = themeFactory(theme);
  useNavigateTop();

  return (
    <section className={`relative overflow-auto`}>
      <MovingGradient />
      <WorkExperience />
      <Testimonials theme={themeClassSet} />
      <Awards theme={themeClassSet} />
      <Skills />
    </section>
  );
}

export default Experience;

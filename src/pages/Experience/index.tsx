import MovingGradient from "../../components/Backgrounds/MovingGradient";
import Testimonials from "../../components/Testimonials";
import type { pageProp } from "../../types";
import { themeFactory } from "../../utils/styleFactory";
import Awards from "../../components/Awards";

function Experience({ theme }: pageProp) {
  const themeClassSet = themeFactory(theme);
  return (
    <div className={`relative`}>
      <MovingGradient theme={theme} />
      <section className="h-dvh w-full bg-transparent flex items-center justify-center">
        Experience
      </section>

      <Testimonials theme={themeClassSet} />

      <Awards theme={themeClassSet} />
    </div>
  );
}

export default Experience;

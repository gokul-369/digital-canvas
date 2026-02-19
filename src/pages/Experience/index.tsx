import MovingGradient from "../../components/Backgrounds/MovingGradient";
import Testimonials from "../../components/Testimonials";
import type { pageProp } from "../../types";
import { themeFactory } from "../../utils/styleFactory";

function Experience({ theme }: pageProp) {
  const themeClassSet = themeFactory(theme);
  return (
    <div className="relative">
      <MovingGradient />
      <section className="h-dvh w-full bg-transparent flex items-center justify-center">
        Experience
      </section>

      <Testimonials theme={themeClassSet} />
    </div>
  );
}

export default Experience;

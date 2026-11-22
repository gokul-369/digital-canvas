import InteractiveAmbient from "../../components/Backgrounds/InteractiveAmbient";
import Testimonials from "../../components/Testimonials";
import Awards from "../../components/Awards";
import WorkExperience from "../../components/WorkExperience/WorkExperience";
import useNavigateTop from "../../hooks/useNavigateToTop";

function Experience() {
  useNavigateTop();

  return (
    <section className={`relative overflow-auto`}>
      <InteractiveAmbient variant="experience" />
      <WorkExperience />
      <Testimonials />
      <Awards />
    </section>
  );
}

export default Experience;

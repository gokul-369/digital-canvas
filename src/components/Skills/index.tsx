import SkillsPyramid from "../SkillsPyramid";
import SectionHeader from "../SectionHeader";

function Skills() {
  return (
    <section
      id="skills"
      className="flex flex-col items-center justify-center lg:px-40 md:py-32 py-12 min-h-dvh w-full"
    >
      <SectionHeader
        tag="Stack & Tooling"
        title="Technical"
        accent="wizardry"
        description="Languages, frameworks, runtime environments, and databases I rely on to turn concepts into resilient software."
      />

      <section className="flex px-4 md:px-0 py-8 md:py-0 flex-wrap mt-16 w-full">
        <SkillsPyramid />
      </section>
    </section>
  );
}

export default Skills;

import Stack from "./Stack";
import WorkExperience from "./WorkExperience";

function Main() {
  return (
    <section className={`flex flex-col w-[74%] gap-4`}>
      <WorkExperience />
      <Stack />
    </section>
  );
}

export default Main;

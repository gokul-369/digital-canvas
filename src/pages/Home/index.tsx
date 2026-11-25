import About from "../../components/About";
import Dashboard from "../../components/Dashboard";
import Hero from "../../components/Hero/Hero";
import InteractiveAmbient from "../../components/Backgrounds/InteractiveAmbient";
import useTheme from "../../hooks/useTheme";
import { themeFactory } from "../../utils/styleFactory";

function Home() {
  const { theme } = useTheme();
  const themeClass = themeFactory(theme);
  const colors =
    theme === "dark"
      ? ["#9383d2", "#8998e1", "#aba7b9"]
      : ["#cbd5e1", "#e2e8f0", "#e0e7ff"];

  return (
    <div id="#home" className="relative w-full">
      {/* Dynamic interactive ambient starfield & aurora background */}
      <InteractiveAmbient variant="home" />

      <Hero theme={themeClass} colors={colors} />
      <About theme={themeClass} />
      <Dashboard theme={themeClass} />
    </div>
  );
}

export default Home;

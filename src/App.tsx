import Main from "./components/Main";
import SideBar from "./components/SideBar";
import useTheme from "./hooks/useTheme";
import { themeFactory } from "./utils/styleFactory";

function App() {
  const { theme } = useTheme();
  const themeClass = themeFactory(theme);
  return (
    <>
      <div
        className={`${themeClass.bgPrimary} flex justify-between h-screen p-3 rounded-sm`}
      >
        <SideBar />
        <Main />
      </div>
      <footer
        className={`${themeClass.bgPrimary} py-3 text-center text-xs ${themeClass.textSecondary}`}
      >
        Hand crafted with typescript by Gokul
      </footer>
    </>
  );
}

export default App;

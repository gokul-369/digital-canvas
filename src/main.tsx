import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { HashRouter } from "react-router-dom";
import { AppRoutes } from "./routes/index.tsx";

createRoot(document.getElementById("root")!).render(
  <HashRouter basename="/">
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  </HashRouter>,
);

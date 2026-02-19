import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { BrowserRouter } from "react-router";
import { AppRoutes } from "./routes/index.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename="/">
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  </BrowserRouter>,
);

import { Route, Routes } from "react-router";
import Home from "../pages/Home";

import useTheme from "../hooks/useTheme";
import Fade from "../animations/Fade";
import Nav from "../components/Nav";
import ReactLenis from "lenis/react";
import { Loader } from "../components/Loader";

import { lazy, Suspense } from "react";

export function AppRoutes() {
  const { theme } = useTheme();

  const Experience = lazy(() => import("../pages/Experience"));
  const ImageGallery = lazy(() => import("../pages/ImageGallery"));

  return (
    <ReactLenis
      root
      options={{
        duration: 0.95,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
        smoothWheel: true,
      }}
    >
      <Fade
        className="fixed w-full flex items-center justify-center top-7 z-40"
        variant="fade-down"
        delay={100}
      >
        <Nav theme={theme} />
      </Fade>
      <Routes>
        <Route path="/" element={<Home theme={theme} />} />
        <Route
          path="/experience"
          element={
            <Suspense fallback={<Loader />}>
              <Experience theme={theme} />
            </Suspense>
          }
        />
        <Route
          path="/gallery"
          element={
            <Suspense fallback={<Loader />}>
              <ImageGallery />
            </Suspense>
          }
        />
      </Routes>
    </ReactLenis>
  );
}

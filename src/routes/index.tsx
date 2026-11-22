import { Route, Routes } from "react-router";
import Home from "../pages/Home";

import Fade from "../animations/Fade";
import Nav from "../components/Nav";
import ReactLenis, { useLenis } from "lenis/react";
import { Loader } from "../components/Loader";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import { lazy, Suspense, useEffect } from "react";
import CollaboratePanel from "../components/Collaborate";
import { useAppContext } from "../context/AppContext";
import Footer from "../components/Footer";
import CustomCursor from "../components/Cursor";

import { manifest } from "./manifest";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Experience = lazy(() => import("../pages/Experience"));
const SkillsPage = lazy(() => import("../pages/SkillsPage"));
const ImageGallery = lazy(() => import("../pages/ImageGallery"));
const BooksPage = lazy(() => import("../pages/BooksPage"));

function ScrollSync() {
  const lenis = useLenis(() => {
    ScrollTrigger.update();
  });

  useEffect(() => {
    if (lenis) {
      (window as unknown as { __lenis?: typeof lenis }).__lenis = lenis;
    }
    ScrollTrigger.refresh();
  }, [lenis]);

  return null;
}

export function AppRoutes() {
  const { isCollaborateOpen, closeCollaborate } = useAppContext();

  return (
    <ReactLenis
      root
      options={{
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.92,
        touchMultiplier: 1.5,
      }}
    >
      <CustomCursor />
      <ScrollSync />
      <CollaboratePanel isOpen={isCollaborateOpen} onClose={closeCollaborate} />
      <Analytics />
      <SpeedInsights />
      <Fade
        className="fixed w-full flex items-center justify-center top-7 z-40"
        variant="fade-down"
        delay={100}
      >
        <Nav />
      </Fade>
      <Routes>
        <Route path={manifest.home} element={<Home />} />
        <Route
          path={manifest.experience}
          element={
            <Suspense fallback={<Loader />}>
              <Experience />
            </Suspense>
          }
        />
        <Route
          path={manifest.skills}
          element={
            <Suspense fallback={<Loader />}>
              <SkillsPage />
            </Suspense>
          }
        />
        <Route
          path={manifest.gallery}
          element={
            <Suspense fallback={<Loader />}>
              <ImageGallery />
            </Suspense>
          }
        />
        <Route
          path={manifest.books}
          element={
            <Suspense fallback={<Loader />}>
              <BooksPage />
            </Suspense>
          }
        />
      </Routes>

      <Footer />
    </ReactLenis>
  );
}

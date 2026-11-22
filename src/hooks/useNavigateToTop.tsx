import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToElement } from "../utils/scroll";

export default function useNavigateTop() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      ScrollTrigger.clearScrollMemory();
      ScrollTrigger.refresh();
    } else {
      setTimeout(() => {
        scrollToElement(hash, -60);
        ScrollTrigger.refresh();
      }, 120);
    }
  }, [pathname, hash]);
}

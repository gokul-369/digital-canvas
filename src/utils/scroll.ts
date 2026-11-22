export function scrollToElement(target: string | HTMLElement, offset = -60) {
  const lenis = (
    window as unknown as {
      __lenis?: {
        scrollTo: (
          t: string | HTMLElement,
          opts?: { offset?: number; duration?: number; easing?: (t: number) => number },
        ) => void;
      };
    }
  ).__lenis;

  if (lenis) {
    lenis.scrollTo(target, {
      offset,
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    });
  } else {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (el) {
      const top =
        (el as HTMLElement).getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }
}

export const scrollWithLenis = (el: HTMLElement) => {
  scrollToElement(el, -60);
};

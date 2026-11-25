type LenisLike = {
  scrollTo: (
    t: number | string | HTMLElement,
    opts?: {
      offset?: number;
      duration?: number;
      immediate?: boolean;
      easing?: (t: number) => number;
    },
  ) => void;
};

function getLenis(): LenisLike | undefined {
  return (window as unknown as { __lenis?: LenisLike }).__lenis;
}

export function scrollToTop(immediate = false) {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(0, immediate ? { immediate: true } : { duration: 0.65 });
  }
  window.scrollTo({ top: 0, behavior: immediate ? "auto" : "smooth" });
}

export function scrollToElement(target: string | HTMLElement, offset = -60) {
  const lenis = getLenis();

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

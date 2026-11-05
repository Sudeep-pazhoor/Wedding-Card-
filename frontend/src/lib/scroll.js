import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

let lenis = null;

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return () => {};

  lenis = new Lenis({
    duration: 1.15,
    lerp: 0.09,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  });

  const onScroll = () => ScrollTrigger.update();
  lenis.on("scroll", onScroll);

  const raf = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  const refresh = () => ScrollTrigger.refresh();
  window.addEventListener("load", refresh);

  return () => {
    window.removeEventListener("load", refresh);
    gsap.ticker.remove(raf);
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollToId(id) {
  const target = document.getElementById(id);
  if (!target) return;

  if (lenis) {
    lenis.scrollTo(target, { offset: -76, duration: 1.4 });
  } else {
    target.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  }
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { duration: 1.2 });
  else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

export function pauseScroll() {
  lenis?.stop();
  document.documentElement.style.overflow = "hidden";
}

export function resumeScroll() {
  lenis?.start();
  document.documentElement.style.overflow = "";
}

export { gsap, ScrollTrigger };

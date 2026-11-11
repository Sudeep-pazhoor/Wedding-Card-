import { useEffect, useState } from "react";
import Blessings from "./components/Blessings";
import Celebration from "./components/Celebration";
import Countdown from "./components/Countdown";
import Footer from "./components/Footer";
import Gallery from "./components/Gallery";
import Hero from "./components/Hero";
import Invitation from "./components/Invitation";
import Navbar from "./components/Navbar";
import ScrollProgress from "./components/ScrollProgress";
import TopLocation from "./components/TopLocation";
import Venue from "./components/Venue";
import { content } from "./data/content";
import {
  gsap,
  initSmoothScroll,
  prefersReducedMotion,
  ScrollTrigger,
} from "./lib/scroll";

function getInitialLang() {
  try {
    const param = new URLSearchParams(window.location.search).get("lang");
    if (param === "ml" || param === "en") return param;
    const stored = window.localStorage.getItem("sn-lang");
    if (stored === "ml" || stored === "en") return stored;
  } catch {
    /* private mode */
  }
  return "en";
}

export default function App() {
  const [lang, setLang] = useState(getInitialLang);
  const copy = content[lang];

  useEffect(() => {
    const cleanup = initSmoothScroll();
    return cleanup;
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;
    document.title =
      lang === "ml"
        ? "സന്ദീപ് & നീരജ · 2027 ജനുവരി 24"
        : "Sundeep & Neeraja · 24 January 2027";

    try {
      window.localStorage.setItem("sn-lang", lang);
      const url = new URL(window.location.href);
      if (lang === "ml") url.searchParams.set("lang", "ml");
      else url.searchParams.delete("lang");
      window.history.replaceState({}, "", url);
    } catch {
      /* ignore */
    }
  }, [lang]);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    let context;
    const frame = window.requestAnimationFrame(() => {
      context = gsap.context(() => {
        gsap.utils.toArray("[data-reveal]").forEach((element) => {
          if (element.dataset.revealed === "true") return;

          gsap.fromTo(
            element,
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: element,
                start: "top 88%",
                once: true,
                onEnter: () => {
                  element.dataset.revealed = "true";
                },
              },
            }
          );
        });

        ScrollTrigger.refresh();
      });
    });

    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      window.cancelAnimationFrame(frame);
      context?.revert();
    };
  }, [lang]);

  return (
    <div className="app" id="top" data-lang={lang}>
      <a className="skip-link" href="#invitation">
        {lang === "ml" ? "ക്ഷണത്തിലേക്ക് പോകുക" : "Skip to invitation"}
      </a>

      <ScrollProgress />
      <Navbar
        copy={copy}
        lang={lang}
        onToggleLang={() => setLang((current) => (current === "en" ? "ml" : "en"))}
      />

      <main id="main">
        <TopLocation copy={copy} lang={lang} />
        <Hero copy={copy} />
        <Countdown copy={copy} />
        <Invitation copy={copy} />
        <Celebration copy={copy} />
        <Venue copy={copy} />
        <Gallery copy={copy} />
        <Blessings copy={copy} lang={lang} />
      </main>

      <Footer copy={copy} />
    </div>
  );
}

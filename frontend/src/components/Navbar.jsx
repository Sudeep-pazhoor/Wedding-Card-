import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { Lotus } from "./Ornaments";
import { pauseScroll, resumeScroll, scrollToId } from "../lib/scroll";

const links = [
  { id: "invitation", key: "invitation" },
  { id: "celebration", key: "celebration" },
  { id: "venue", key: "venue" },
  { id: "gallery", key: "gallery" },
  { id: "blessings", key: "blessings" },
];

export default function Navbar({ copy, lang, onToggleLang }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [showAlert, setShowAlert] = useState(true);
  const [alertFading, setAlertFading] = useState(false);
  const iframeRef = useRef(null);

  const sendYouTubeCommand = (func, args = []) => {
    try {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: "command",
            func,
            args,
          }),
          "*"
        );
      }
    } catch {
      /* ignore cross-origin errors */
    }
  };

  const handleIframeLoad = () => {
    const play = () => {
      sendYouTubeCommand("listening");
      sendYouTubeCommand("setVolume", [100]);
      sendYouTubeCommand("unMute");
      sendYouTubeCommand("playVideo");
    };
    play();
    window.setTimeout(play, 600);
    window.setTimeout(play, 1500);
  };

  const toggleAudio = () => {
    if (isPlaying) {
      sendYouTubeCommand("pauseVideo");
      setIsPlaying(false);
    } else {
      sendYouTubeCommand("unMute");
      sendYouTubeCommand("playVideo");
      setIsPlaying(true);
    }
  };

  // Browser Autoplay Policy: if unmuted audio is blocked until user interaction,
  // ensure the first touch, click, scroll or keypress un-mutes and plays.
  useEffect(() => {
    const onFirstInteraction = () => {
      sendYouTubeCommand("unMute");
      sendYouTubeCommand("playVideo");
    };

    const opts = { capture: true, passive: true, once: true };
    window.addEventListener("pointerdown", onFirstInteraction, opts);
    window.addEventListener("touchstart", onFirstInteraction, opts);
    window.addEventListener("click", onFirstInteraction, opts);
    window.addEventListener("keydown", onFirstInteraction, opts);
    window.addEventListener("scroll", onFirstInteraction, opts);

    return () => {
      window.removeEventListener("pointerdown", onFirstInteraction, opts);
      window.removeEventListener("touchstart", onFirstInteraction, opts);
      window.removeEventListener("click", onFirstInteraction, opts);
      window.removeEventListener("keydown", onFirstInteraction, opts);
      window.removeEventListener("scroll", onFirstInteraction, opts);
    };
  }, []);

  // 5-7 seconds alert description: fades out at 5.8s and unmounts at 6.4s
  useEffect(() => {
    const fadeTimer = window.setTimeout(() => {
      setAlertFading(true);
    }, 5800);

    const hideTimer = window.setTimeout(() => {
      setShowAlert(false);
    }, 6400);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -52% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) pauseScroll();
    else resumeScroll();
    return () => resumeScroll();
  }, [menuOpen]);

  const go = (event, id) => {
    event.preventDefault();
    setMenuOpen(false);
    window.setTimeout(() => scrollToId(id), menuOpen ? 120 : 0);
  };

  return (
    <>
      <header className={`site-nav ${scrolled ? "is-scrolled" : ""} ${menuOpen ? "is-open" : ""}`}>
        <div className="site-nav__inner">
          <a
            className="brand"
            href="#top"
            onClick={(event) => {
              event.preventDefault();
              scrollToId("top");
            }}
            aria-label={`${copy.brands.monogram} — Sundeep & Neeraja`}
          >
            <span className="brand__seal">
              <Lotus />
            </span>
            <span className="brand__text">
              <strong>{copy.brands.monogram}</strong>
              <small>{copy.brands.tagline}</small>
            </span>
          </a>

          <nav className="site-nav__links" aria-label="Primary">
            {links.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={active === link.id ? "is-active" : ""}
                onClick={(event) => go(event, link.id)}
              >
                {copy.nav[link.key]}
              </a>
            ))}
          </nav>

          <div className="site-nav__actions">
            <button
              type="button"
              className={`audio-toggle ${isPlaying ? "is-playing" : "is-paused"}`}
              onClick={toggleAudio}
              aria-label={isPlaying ? (copy.audio?.pause || "Pause music") : (copy.audio?.play || "Play music")}
              title={isPlaying ? (copy.audio?.pause || "Pause music") : (copy.audio?.play || "Play music")}
            >
              <Icon name={isPlaying ? "pause" : "play"} size={13} />
              <span className="audio-toggle__text">
                {isPlaying ? (copy.audio?.label || "Music") : (copy.audio?.play || "Play")}
              </span>
              <span className="audio-toggle__bars" aria-hidden="true">
                <span className="bar bar--1" />
                <span className="bar bar--2" />
                <span className="bar bar--3" />
              </span>
            </button>

            <button
              type="button"
              className="lang-toggle"
              onClick={onToggleLang}
              aria-label={copy.switchAria}
              lang={lang === "en" ? "ml" : "en"}
            >
              <Icon name="globe" size={15} />
              <span>{copy.switchLabel}</span>
            </button>

            <a
              href="#blessings"
              className="btn btn--small btn--maroon site-nav__cta"
              onClick={(event) => go(event, "blessings")}
            >
              {copy.nav.cta}
            </a>

            <button
              type="button"
              className="menu-toggle"
              aria-label={menuOpen ? copy.nav.close : copy.nav.menu}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className={`menu-toggle__icon ${menuOpen ? "is-open" : ""}`}>
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </header>

      {showAlert && (
        <aside
          className={`audio-alert ${alertFading ? "is-fading" : ""}`}
          role="status"
          aria-live="polite"
        >
          <div className="audio-alert__content">
            <div className="audio-alert__icon-wrap">
              <Icon name="music" size={18} />
            </div>
            <div className="audio-alert__text">
              <strong className="audio-alert__title">
                {copy.audio?.alertTitle || "Background Music"}
              </strong>
              <p className="audio-alert__desc">
                {copy.audio?.alertDesc || "You can pause or play the melody anytime from the header button."}
              </p>
            </div>
            <div className="audio-alert__actions">
              <button
                type="button"
                className="audio-alert__btn-toggle"
                onClick={toggleAudio}
                aria-label={isPlaying ? (copy.audio?.pause || "Pause music") : (copy.audio?.play || "Play music")}
              >
                <Icon name={isPlaying ? "pause" : "play"} size={13} />
                <span>{isPlaying ? (copy.audio?.pauseBtn || "Pause") : (copy.audio?.play || "Play")}</span>
              </button>
              <button
                type="button"
                className="audio-alert__btn-close"
                onClick={() => setShowAlert(false)}
                aria-label={copy.audio?.dismiss || "Dismiss notification"}
                title={copy.audio?.dismiss || "Dismiss notification"}
              >
                <Icon name="close" size={14} />
              </button>
            </div>
          </div>
          <div className="audio-alert__bar" aria-hidden="true" />
        </aside>
      )}

      {/* Hidden YouTube background audio iframe */}
      <div
        className="audio-player-host"
        aria-hidden="true"
        style={{
          position: "fixed",
          width: "1px",
          height: "1px",
          left: "-9999px",
          top: "-9999px",
          opacity: 0,
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: -1,
        }}
      >
        <iframe
          ref={iframeRef}
          width="200"
          height="200"
          src="https://www.youtube.com/embed/Rgfv9rwU_vM?enablejsapi=1&autoplay=1&start=8&loop=1&playlist=Rgfv9rwU_vM&playsinline=1&controls=0"
          title="Wedding Background Music"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          onLoad={handleIframeLoad}
        />
      </div>

      <div
        id="mobile-menu"
        className={`mobile-menu ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-modal="true"
        aria-label={copy.nav.menu}
      >
        <div className="mobile-menu__inner">
          <p className="mobile-menu__kicker">{copy.hero.shloka}</p>
          <nav aria-label="Mobile">
            {links.map((link, index) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                style={{ "--i": index }}
                onClick={(event) => go(event, link.id)}
                tabIndex={menuOpen ? 0 : -1}
              >
                <span className="mobile-menu__num">0{index + 1}</span>
                {copy.nav[link.key]}
                <Icon name="arrowRight" size={18} />
              </a>
            ))}
          </nav>
          <div className="mobile-menu__foot">
            <div className="mobile-menu__actions-row">
              <button
                type="button"
                className={`audio-toggle audio-toggle--mobile ${isPlaying ? "is-playing" : "is-paused"}`}
                onClick={toggleAudio}
                tabIndex={menuOpen ? 0 : -1}
                aria-label={isPlaying ? (copy.audio?.pause || "Pause music") : (copy.audio?.play || "Play music")}
              >
                <Icon name={isPlaying ? "pause" : "play"} size={14} />
                <span>{isPlaying ? (copy.audio?.pause || "Pause music") : (copy.audio?.play || "Play music")}</span>
                <span className="audio-toggle__bars" aria-hidden="true">
                  <span className="bar bar--1" />
                  <span className="bar bar--2" />
                  <span className="bar bar--3" />
                </span>
              </button>

              <button
                type="button"
                className="lang-toggle"
                onClick={() => {
                  onToggleLang();
                  setMenuOpen(false);
                }}
                tabIndex={menuOpen ? 0 : -1}
              >
                <Icon name="globe" size={15} />
                {copy.switchLabel}
              </button>
            </div>
            <p>{copy.brands.tagline}</p>
          </div>
        </div>
      </div>
    </>
  );
}

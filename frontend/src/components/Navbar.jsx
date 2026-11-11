import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { Lotus } from "./Ornaments";
import { pauseScroll, resumeScroll, scrollToId } from "../lib/scroll";

const links = [
  { id: "venue", key: "venue" },
  { id: "invitation", key: "invitation" },
  { id: "celebration", key: "celebration" },
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
  const isMapSilencedRef = useRef(false);
  const isUserPausedRef = useRef(false);
  const gestureCleanedRef = useRef(false);

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

  const playAudio = (force = false) => {
    if (isMapSilencedRef.current && !force) return;
    if (isUserPausedRef.current && !force) return;

    sendYouTubeCommand("listening");
    sendYouTubeCommand("setVolume", [100]);
    sendYouTubeCommand("unMute");
    sendYouTubeCommand("playVideo");
    setIsPlaying(true);
  };

  const handleIframeLoad = () => {
    if (isUserPausedRef.current) return;
    playAudio();
    window.setTimeout(() => {
      if (!isUserPausedRef.current) playAudio();
    }, 300);
    window.setTimeout(() => {
      if (!isUserPausedRef.current) playAudio();
    }, 900);
    window.setTimeout(() => {
      if (!isUserPausedRef.current) playAudio();
    }, 2000);
  };

  const toggleAudio = (e) => {
    if (e) e.stopPropagation();
    if (isPlaying) {
      // User paused: mark paused so scroll or click anywhere will NEVER play music
      isUserPausedRef.current = true;
      sendYouTubeCommand("pauseVideo");
      setIsPlaying(false);
    } else {
      // User explicitly clicked the button to resume music
      isUserPausedRef.current = false;
      isMapSilencedRef.current = false;
      playAudio(true);
    }
  };

  // Autoplay on load/refresh: triggers immediately on mount and retries to catch iframe readiness.
  // Also listens to YouTube postMessage events, and as a fallback attaches passive page listeners
  // so an early gesture un-mutes if blocked by browser autoplay policy.
  // CRITICAL: Once user pauses the music, it will ONLY turn on when the user presses the button itself.
  useEffect(() => {
    playAudio();
    const t1 = window.setTimeout(() => {
      if (!isUserPausedRef.current) playAudio();
    }, 250);
    const t2 = window.setTimeout(() => {
      if (!isUserPausedRef.current) playAudio();
    }, 650);
    const t3 = window.setTimeout(() => {
      if (!isUserPausedRef.current) playAudio();
    }, 1400);
    const t4 = window.setTimeout(() => {
      if (!isUserPausedRef.current) playAudio();
    }, 2800);

    const onMessage = (event) => {
      try {
        if (!event.data || isUserPausedRef.current) return;
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data.event === "onReady" || data.info?.playerState === 2 || data.info?.playerState === -1) {
          playAudio();
        }
      } catch {
        /* ignore non-json messages */
      }
    };
    window.addEventListener("message", onMessage);

    const removeGestureListeners = () => {
      if (gestureCleanedRef.current) return;
      gestureCleanedRef.current = true;
      window.removeEventListener("pointerdown", onAnyGesture);
      window.removeEventListener("touchstart", onAnyGesture);
      window.removeEventListener("scroll", onAnyGesture);
      window.removeEventListener("keydown", onAnyGesture);
    };

    const onAnyGesture = (e) => {
      // If user paused the music, never resume on scroll/click
      if (isUserPausedRef.current) {
        removeGestureListeners();
        return;
      }

      const target = e?.target;
      const isMapTarget =
        target &&
        typeof target.closest === "function" &&
        target.closest(
          "[data-no-audio], .top-location, .venue-map, .venue-map__link, .venue__actions a"
        );

      if (isMapTarget) {
        isMapSilencedRef.current = true;
        sendYouTubeCommand("pauseVideo");
        setIsPlaying(false);
        return;
      }

      playAudio();
      removeGestureListeners();
    };

    window.addEventListener("pointerdown", onAnyGesture, { passive: true });
    window.addEventListener("touchstart", onAnyGesture, { passive: true });
    window.addEventListener("scroll", onAnyGesture, { passive: true });
    window.addEventListener("keydown", onAnyGesture, { passive: true });

    const onSilence = () => {
      isMapSilencedRef.current = true;
      sendYouTubeCommand("pauseVideo");
      setIsPlaying(false);
    };
    window.addEventListener("sn:silence-music", onSilence);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
      window.removeEventListener("message", onMessage);
      removeGestureListeners();
      window.removeEventListener("sn:silence-music", onSilence);
    };
  }, []);

  // 10 seconds alert description: fades out at 9.4s and unmounts at 10s
  useEffect(() => {
    const fadeTimer = window.setTimeout(() => {
      setAlertFading(true);
    }, 9400);

    const hideTimer = window.setTimeout(() => {
      setShowAlert(false);
    }, 10000);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 32);
          ticking = false;
        });
        ticking = true;
      }
    };
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
              <span className="audio-toggle__dot" aria-hidden="true" />
              <Icon name={isPlaying ? "pause" : "play"} size={13} />
              <span className="audio-toggle__text">
                {copy.audio?.label || "Music"}
              </span>
              <span className="audio-toggle__badge" aria-hidden="true">
                {isPlaying ? "ON" : "OFF"}
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
                {copy.audio?.alertDesc || "Click anywhere to play music. To pause, click the header button."}
              </p>
            </div>
            <div className="audio-alert__actions">
              <button
                type="button"
                className={`audio-alert__btn-toggle ${isPlaying ? "is-playing" : "is-paused"}`}
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
          src="https://www.youtube.com/embed/Rgfv9rwU_vM?enablejsapi=1&autoplay=1&mute=0&start=8&loop=1&playlist=Rgfv9rwU_vM&playsinline=1&controls=0"
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
                <span className="audio-toggle__dot" aria-hidden="true" />
                <Icon name={isPlaying ? "pause" : "play"} size={14} />
                <span>{copy.audio?.label || "Music"}</span>
                <span className="audio-toggle__badge" aria-hidden="true">
                  {isPlaying ? "ON" : "OFF"}
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

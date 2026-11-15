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

const DRIVE_AUDIO_URL =
  "https://drive.usercontent.google.com/download?id=1lcojotj6w265Ryu3u7dHA7GHMAdo08DC&export=download";
const DRIVE_AUDIO_FALLBACK =
  "https://drive.google.com/uc?export=download&id=1lcojotj6w265Ryu3u7dHA7GHMAdo08DC";

export default function Navbar({ copy, lang, onToggleLang }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [alertFading, setAlertFading] = useState(false);
  const audioRef = useRef(null);
  const isUserPausedRef = useRef(false);

  const playAudio = (force = false) => {
    if (isUserPausedRef.current && !force) return;
    const audio = audioRef.current;
    if (!audio) return;

    try {
      audio.volume = 1;
      const promise = audio.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Autoplay policy awaiting user activation
            setIsPlaying(false);
          });
      }
    } catch {
      /* ignore sync error */
    }
  };

  const pauseAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      try {
        audio.pause();
      } catch {
        /* ignore */
      }
    }
    setIsPlaying(false);
  };

  const toggleAudio = (e) => {
    if (e) {
      if (typeof e.preventDefault === "function") e.preventDefault();
      if (typeof e.stopPropagation === "function") e.stopPropagation();
    }
    if (isPlaying) {
      // User paused: mark paused so scroll or click anywhere will NEVER play music
      isUserPausedRef.current = true;
      pauseAudio();
    } else {
      // User explicitly clicked the button to resume music
      isUserPausedRef.current = false;
      playAudio(true);
    }
  };

  // Autoplay on load/restart: triggers immediately on mount and on early gestures.
  // Plays smoothly on all devices (desktop and mobile) from same-origin optimized audio.
  // CRITICAL: Once user pauses the music, it will ONLY turn on when the user presses the button itself.
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 1;
    }

    // Attempt autoplay immediately
    playAudio();

    // Additional retries shortly after mount (for environments permitting delayed playback)
    const t1 = window.setTimeout(() => {
      if (!isUserPausedRef.current) playAudio();
    }, 150);
    const t2 = window.setTimeout(() => {
      if (!isUserPausedRef.current) playAudio();
    }, 500);
    const t3 = window.setTimeout(() => {
      if (!isUserPausedRef.current) playAudio();
    }, 1200);

    const onPlay = () => setIsPlaying(true);
    const onPause = () => {
      if (audio && audio.paused) {
        setIsPlaying(false);
      }
    };
    const onEnded = () => {
      if (audio && !isUserPausedRef.current) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    };
    const onError = (e) => {
      console.warn("Audio element error encountered:", e);
      setIsPlaying(false);
    };

    if (audio) {
      audio.addEventListener("playing", onPlay);
      audio.addEventListener("play", onPlay);
      audio.addEventListener("pause", onPause);
      audio.addEventListener("ended", onEnded);
      audio.addEventListener("error", onError);
    }

    const onAnyGesture = (e) => {
      // If user deliberately paused the music, never resume on touch or click
      if (isUserPausedRef.current) return;

      const target = e?.target;
      // Do not trigger from clicks on toggle buttons or close buttons
      if (
        target &&
        typeof target.closest === "function" &&
        target.closest(".audio-toggle, .audio-alert__btn-toggle, .audio-alert__btn-close")
      ) {
        return;
      }

      const isMapAction =
        target &&
        typeof target.closest === "function" &&
        target.closest(".top-location__map, .top-location__btn-maps");

      if (isMapAction) {
        pauseAudio();
        return;
      }

      playAudio();
    };

    const gestureEvents = [
      "pointerdown",
      "touchstart",
      "touchend",
      "click",
      "keydown",
      "scroll",
    ];

    gestureEvents.forEach((evt) => {
      window.addEventListener(evt, onAnyGesture, { passive: true, capture: true });
    });

    const onSilence = () => {
      pauseAudio();
    };
    window.addEventListener("sn:silence-music", onSilence);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      if (audio) {
        audio.removeEventListener("playing", onPlay);
        audio.removeEventListener("play", onPlay);
        audio.removeEventListener("pause", onPause);
        audio.removeEventListener("ended", onEnded);
        audio.removeEventListener("error", onError);
      }
      gestureEvents.forEach((evt) => {
        window.removeEventListener(evt, onAnyGesture, { capture: true });
      });
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
                {isPlaying
                  ? (copy.audio?.alertDesc || "Wedding melody is playing. You can pause or play anytime using the header button.")
                  : (copy.audio?.alertDescTap || "Tap anywhere or click Play to listen to the wedding melody.")}
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
                <span>{isPlaying ? (copy.audio?.pauseBtn || "Pause") : (copy.audio?.playBtn || "Play")}</span>
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

      {/* Background audio player */}
      <audio
        ref={audioRef}
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        style={{ display: "none" }}
      >
        <source src="/audio/kanjanam-peyyunna.mp3" type="audio/mpeg" />
        <source src="/audio/kanjanam-peyyunna.flac" type="audio/flac" />
        <source src={DRIVE_AUDIO_URL} type="audio/flac" />
        <source src={DRIVE_AUDIO_FALLBACK} type="audio/flac" />
      </audio>

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

import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import {
  CornerFlourish,
  Divider,
  FloatingPetals,
  OmCircle,
  PalmSpray,
  RotatingSeal,
} from "./Ornaments";
import { SITE } from "../data/content";
import { gsap, prefersReducedMotion, scrollToId } from "../lib/scroll";

export default function Hero({ copy }) {
  const heroRef = useRef(null);
  const [photoReady, setPhotoReady] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero__frame", { opacity: 0, duration: 1.6 }, 0)
        .from(".hero__shloka-wrap", { opacity: 0, y: 18, duration: 0.8, delay: 0.1 }, 0.1)
        .from(".hero__eyebrow", { opacity: 0, y: 12, duration: 0.7 }, 0.45)
        .from(".hero__kicker", { opacity: 0, y: 12, duration: 0.7 }, 0.55)
        .from(
          ".hero__name",
          { opacity: 0, y: 48, duration: 1.15, stagger: 0.14 },
          0.62
        )
        .from(
          ".hero__with",
          { opacity: 0, scale: 0.86, duration: 0.8 },
          0.86
        )
        .from(".hero__divider", { opacity: 0, scaleX: 0.6, duration: 0.9 }, 1)
        .from(".hero__meta > *", { opacity: 0, y: 14, duration: 0.7, stagger: 0.1 }, 1.05)
        .from(".hero__actions > *", { opacity: 0, y: 14, duration: 0.7, stagger: 0.1 }, 1.18)
        .from(".hero__note", { opacity: 0, duration: 0.8 }, 1.4)
        .from(".hero__scroll", { opacity: 0, y: 10, duration: 0.8 }, 1.5)
        .from(".hero__seal", { opacity: 0, scale: 0.88, duration: 1 }, 1.2)
        .from(".hero__palm", { opacity: 0, duration: 1.8, stagger: 0.2 }, 0.3);

      gsap.to(".hero__mandala", {
        yPercent: 10,
        rotate: 12,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".hero__content", {
        yPercent: -7,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "35% top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="top" ref={heroRef} aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__wash" />
        <img
          src="/images/hero.jpg"
          alt=""
          className={`hero__photo ${photoReady ? "is-ready" : ""}`}
          onLoad={() => setPhotoReady(true)}
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
          draggable="false"
        />
        <div className="hero__mandala">
          <svg viewBox="0 0 600 600" fill="none" aria-hidden="true">
            <g stroke="currentColor" strokeWidth=".7">
              <circle cx="300" cy="300" r="290" />
              <circle cx="300" cy="300" r="230" />
              <circle cx="300" cy="300" r="120" />
              {Array.from({ length: 24 }, (_, i) => (
                <g key={i} transform={`rotate(${i * 15} 300 300)`}>
                  <path d="M300 10c18 34 18 70 0 104-18-34-18-70 0-104Z" />
                  <path d="M300 300V150" opacity=".45" />
                </g>
              ))}
            </g>
          </svg>
        </div>
        <PalmSpray side="left" className="hero__palm hero__palm--left" />
        <PalmSpray side="right" className="hero__palm hero__palm--right" />
        <FloatingPetals />
      </div>

      <div className="hero__frame" aria-hidden="true">
        <CornerFlourish className="hero__corner hero__corner--tl" />
        <CornerFlourish className="hero__corner hero__corner--tr" />
        <CornerFlourish className="hero__corner hero__corner--bl" />
        <CornerFlourish className="hero__corner hero__corner--br" />
      </div>

      <div className="hero__content">
        <div className="hero__shloka-wrap">
          <OmCircle />
          <p className="hero__shloka" lang="ml">
            {copy.hero.shloka}
          </p>
        </div>

        <p className="hero__eyebrow">{copy.hero.eyebrow}</p>

        <h1 className="hero__title" id="hero-title">
          <span className="hero__kicker">{copy.hero.kicker}</span>
          <span className="hero__name">{copy.hero.groom}</span>
          <span className="hero__with">
            <span className="hero__with-line" aria-hidden="true" />
            {copy.hero.with}
            <span className="hero__with-line" aria-hidden="true" />
          </span>
          <span className="hero__name">{copy.hero.bride}</span>
        </h1>

        <Divider className="hero__divider" />

        <div className="hero__meta">
          <span className="hero__meta-item">
            <Icon name="calendar" size={17} />
            {copy.hero.date}
          </span>
          <span className="hero__meta-dot" aria-hidden="true" />
          <a
            className="hero__meta-item hero__meta-link"
            href={SITE.mapsUrl}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="mapPin" size={17} />
            {copy.hero.place}
          </a>
        </div>

        <div className="hero__actions">
          <a
            className="btn btn--maroon"
            href="#blessings"
            onClick={(event) => {
              event.preventDefault();
              scrollToId("blessings");
            }}
          >
            {copy.hero.primaryCta}
            <Icon name="heart" size={17} />
          </a>
          <a
            className="btn btn--ghost"
            href="#invitation"
            onClick={(event) => {
              event.preventDefault();
              scrollToId("invitation");
            }}
          >
            {copy.hero.secondaryCta}
            <Icon name="arrowRight" size={17} />
          </a>
        </div>
      </div>

      <p className="hero__note">{copy.hero.note}</p>

      <RotatingSeal text={copy.hero.seal} className="hero__seal" />

      <button
        type="button"
        className="hero__scroll"
        onClick={() => scrollToId("invitation")}
      >
        <span>{copy.hero.scroll}</span>
        <span className="hero__scroll-line" aria-hidden="true">
          <i />
        </span>
      </button>
    </section>
  );
}

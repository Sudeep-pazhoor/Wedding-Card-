import { useEffect, useMemo, useRef, useState } from "react";
import { fetchBlessings } from "../lib/api";
import { prefersReducedMotion } from "../lib/scroll";
import { Icon } from "./Icon";
import { SectionHeading } from "./Ornaments";

function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "♡";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function formatDate(iso, lang) {
  if (!iso) return "";
  try {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat(lang === "ml" ? "ml-IN" : "en-GB", {
      day: "numeric",
      month: "short",
    }).format(date);
  } catch {
    return "";
  }
}

function BlessingCard({ item, copy, lang }) {
  const option = copy.blessings.attendingOptions?.find(
    (choice) => choice.value === item.attending
  );
  const roleLabel =
    option?.label ||
    (item.attending === "blessings"
      ? (lang === "ml" ? "മനസ്സിൽ ഒപ്പം" : "Joining in spirit")
      : (lang === "ml" ? "സ്നേഹാശംസകൾ" : "Warm wishes"));

  const dateStr = item.createdAt ? formatDate(item.createdAt, lang) : "";

  return (
    <article className="blessing-card">
      <span className="blessing-card__mark" aria-hidden="true">
        “
      </span>
      <p className="blessing-card__message" title={item.message}>
        {item.message}
      </p>
      <footer className="blessing-card__foot">
        <span className="blessing-card__avatar" aria-hidden="true">
          {initials(item.name)}
        </span>
        <span className="blessing-card__by">
          <strong>{item.name}</strong>
          <small>
            {roleLabel}
            {dateStr && ` · ${dateStr}`}
          </small>
        </span>
        <Icon name="heart" size={15} className="blessing-card__heart" />
      </footer>
    </article>
  );
}

function MarqueeRow({ items, copy, lang, speed = 75 }) {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const isInteractingRef = useRef(false);
  const isDraggingRef = useRef(false);
  const resumeTimerRef = useRef(null);
  const lastTimeRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const animIdRef = useRef(null);
  const singleWRef = useRef(0);

  // When there are 5 or more cards (like the cards in database), use the exact list in order.
  // When there are fewer than 5 cards, repeat until >= 5 so the single-row track loops smoothly without gaps.
  const displayItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    if (items.length >= 5) return items;
    let list = items;
    while (list.length < 5) {
      list = [...list, ...items];
    }
    return list;
  }, [items]);

  // 2 identical groups for seamless transform wrapping
  const groups = [0, 1];

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track || displayItems.length === 0) return;

    if (prefersReducedMotion()) return;

    lastTimeRef.current = performance.now();

    const measureWidth = () => {
      if (track) {
        singleWRef.current = track.scrollWidth / 2;
      }
    };
    measureWidth();
    const timer = window.setTimeout(measureWidth, 250);
    window.addEventListener("resize", measureWidth, { passive: true });

    const step = (now) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;
      let singleW = singleWRef.current;
      if (singleW <= 0) {
        singleW = track.scrollWidth / 2;
        singleWRef.current = singleW;
      }

      if (singleW > 0) {
        if (!isInteractingRef.current) {
          // If there is flick momentum, smoothly decelerate it
          if (Math.abs(velocityRef.current) > 8) {
            offsetRef.current -= velocityRef.current * dt;
            velocityRef.current *= 0.92;
          } else {
            velocityRef.current = 0;
            offsetRef.current += speed * dt;
          }
        }

        // Seamless infinite wrap-around
        while (offsetRef.current >= singleW) offsetRef.current -= singleW;
        while (offsetRef.current < 0) offsetRef.current += singleW;

        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }

      animIdRef.current = requestAnimationFrame(step);
    };

    animIdRef.current = requestAnimationFrame(step);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", measureWidth);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      window.clearTimeout(resumeTimerRef.current);
    };
  }, [displayItems, speed]);

  const onDragStart = (clientX) => {
    isInteractingRef.current = true;
    isDraggingRef.current = true;
    window.clearTimeout(resumeTimerRef.current);
    velocityRef.current = 0;
    lastPointerXRef.current = clientX;
    lastPointerTimeRef.current = performance.now();
  };

  const onDragMove = (clientX) => {
    if (!isDraggingRef.current || !trackRef.current) return;
    const now = performance.now();
    const dx = clientX - lastPointerXRef.current;
    const dt = (now - lastPointerTimeRef.current) / 1000;
    if (dt > 0.005) {
      velocityRef.current = dx / dt;
    }
    lastPointerXRef.current = clientX;
    lastPointerTimeRef.current = now;

    offsetRef.current -= dx;
    let singleW = singleWRef.current;
    if (singleW <= 0 && trackRef.current) {
      singleW = trackRef.current.scrollWidth / 2;
      singleWRef.current = singleW;
    }
    if (singleW > 0) {
      while (offsetRef.current >= singleW) offsetRef.current -= singleW;
      while (offsetRef.current < 0) offsetRef.current += singleW;
      trackRef.current.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    }
  };

  const onDragEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      isInteractingRef.current = false;
      lastTimeRef.current = performance.now();
    }, 1500);
  };

  // Mouse drag handling
  const handlePointerDown = (e) => {
    if (e.pointerType === "touch") return;
    if (e.button !== undefined && e.button !== 0) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    onDragStart(e.clientX);
  };

  const handlePointerMove = (e) => {
    if (e.pointerType === "touch") return;
    onDragMove(e.clientX);
  };

  const handlePointerUp = (e) => {
    if (e.pointerType === "touch") return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    onDragEnd();
  };

  // Touch swipe handling for mobile
  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length > 0) {
      onDragStart(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches.length > 0) {
      onDragMove(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    onDragEnd();
  };

  const handleMouseEnter = () => {
    isInteractingRef.current = true;
    window.clearTimeout(resumeTimerRef.current);
  };

  const handleMouseLeave = () => {
    if (!isDraggingRef.current) {
      resumeTimerRef.current = window.setTimeout(() => {
        isInteractingRef.current = false;
        lastTimeRef.current = performance.now();
      }, 700);
    }
  };

  return (
    <div
      ref={wrapRef}
      data-lenis-prevent
      className="marquee"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      role="region"
      aria-label={copy.blessings.wallTitle}
    >
      <div ref={trackRef} className="marquee__track">
        {groups.map((group) => (
          <div
            className="marquee__group"
            key={group}
            aria-hidden={group > 0 ? "true" : undefined}
            role={group === 0 ? "list" : undefined}
          >
            {displayItems.map((item, idx) => (
              <div role="listitem" key={`${group}-${item._id || idx}-${idx}`}>
                <BlessingCard item={item} copy={copy} lang={lang} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Blessings({ copy, lang }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchBlessings().then((result) => {
      if (!active) return;
      setMessages(result.messages);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="section blessings" id="blessings" aria-labelledby="blessings-title">
      <div className="blessings__glow" aria-hidden="true" />
      <div className="container">
        <SectionHeading
          kicker={copy.blessings.kicker}
          title={copy.blessings.title}
          subtitle={copy.blessings.subtitle}
          id="blessings-title"
        />

        <div className="blessings__meta-bar" data-reveal>
          <span className="blessings__count">
            <Icon name="heart" size={15} />
            {messages.length ? copy.blessings.count(messages.length) : copy.blessings.emptyCount}
          </span>
          <p className="blessings__hint">{copy.blessings.wallSub}</p>
        </div>
      </div>

      <div className="blessings__wall">
        {messages.length > 0 ? (
          <MarqueeRow
            items={messages}
            copy={copy}
            lang={lang}
            speed={75}
          />
        ) : (
          <div className="container">
            <div className="blessings__empty">
              <div className="blessings__empty-icon" aria-hidden="true">
                <Icon name="heart" size={22} />
              </div>
              <p className="blessings__empty-text">
                {loading ? "Loading blessings…" : copy.blessings.emptyNote}
              </p>
              <p className="blessings__empty-hint">{copy.blessings.emptyHint}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

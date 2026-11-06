import { useEffect, useMemo, useRef, useState } from "react";
import { createBlessing, fetchBlessings } from "../lib/api";
import { prefersReducedMotion } from "../lib/scroll";
import { Icon } from "./Icon";
import { OmCircle, SectionHeading } from "./Ornaments";

const NAME_LIMIT = 40;
const MESSAGE_LIMIT = 240;
const MARQUEE_LIMIT = 16;

function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "♡";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function formatDate(iso, lang) {
  try {
    return new Intl.DateTimeFormat(lang === "ml" ? "ml-IN" : "en-GB", {
      day: "numeric",
      month: "short",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

function BlessingCard({ item, copy, lang }) {
  const option = copy.blessings.attendingOptions.find(
    (choice) => choice.value === item.attending
  );

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
            {option?.label || "Blessings"}
            {item.createdAt && ` · ${formatDate(item.createdAt, lang)}`}
          </small>
        </span>
        <Icon name="heart" size={15} className="blessing-card__heart" />
      </footer>
    </article>
  );
}

function MarqueeRow({
  items,
  copy,
  lang,
  speed = 80,
  singleTrack = false,
}) {
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

  // Ensure each group has enough items to fill even wide viewports smoothly
  const displayItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    if (singleTrack) return items;
    let list = items;
    while (list.length < 4) {
      list = [...list, ...items];
    }
    return list;
  }, [items, singleTrack]);

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
    if (e.pointerType === "touch") return; // Touch is handled by touch listeners
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
      className={`marquee ${singleTrack ? "marquee--single" : ""}`}
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
            className={`marquee__group ${singleTrack ? "marquee__group--single" : ""}`}
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
  const [form, setForm] = useState({
    name: "",
    message: "",
    attending: copy.blessings.attendingOptions[0].value,
  });
  const [honeypot, setHoneypot] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);
  const [fieldError, setFieldError] = useState("");
  const formRef = useRef(null);

  useEffect(() => {
    let active = true;
    fetchBlessings().then((result) => {
      if (!active) return;
      setMessages(result.messages);
    });
    return () => {
      active = false;
    };
  }, []);

  // Show 1 horizontal flowing path when there are few cards (1-3 cards).
  // Only show the down row (second row) when more cards are found (>= 4 cards).
  const isMultiRow = messages.length >= 4;
  const isSingleTrack = messages.length < 4;

  const wallItems = useMemo(() => {
    return messages.slice(0, MARQUEE_LIMIT);
  }, [messages]);

  const split = Math.ceil(wallItems.length / 2);
  const rowOne = isMultiRow ? wallItems.slice(0, split) : wallItems;
  const rowTwo = isMultiRow ? wallItems.slice(split) : [];

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    if (fieldError) setFieldError("");
    if (status?.type === "error") setStatus(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (honeypot) return;

    const name = form.name.trim();
    const message = form.message.trim();

    if (name.length < 2 || message.length < 2) {
      setFieldError(copy.blessings.validation);
      return;
    }

    setSending(true);
    setFieldError("");
    setStatus(null);

    try {
      const result = await createBlessing({
        name,
        message,
        attending: form.attending,
        website: honeypot,
      });

      setMessages((current) => {
        const rest = current.filter((item) => item._id !== result.message._id);
        return [result.message, ...rest];
      });
      setForm((current) => ({ ...current, message: "" }));
      setStatus({
        type: "success",
        text: copy.blessings.success,
      });
    } catch (error) {
      setStatus({
        type: "error",
        text: error?.message || copy.blessings.error,
      });
    } finally {
      setSending(false);
    }
  };

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

        <form className="blessing-form" onSubmit={handleSubmit} ref={formRef} data-reveal noValidate>
          <div className="blessing-form__ornament" aria-hidden="true">
            <OmCircle tone="pale" />
          </div>

          <div className="blessing-form__head">
            <h3>{copy.blessings.formTitle}</h3>
            <p>{copy.blessings.formNote}</p>
          </div>

          <div className="blessing-form__row">
            <label className="field">
              <span className="field__label">
                {copy.blessings.nameLabel}
                <span className="field__required">{copy.blessings.required}</span>
              </span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={update("name")}
                placeholder={copy.blessings.namePlaceholder}
                maxLength={NAME_LIMIT}
                autoComplete="name"
                required
                aria-invalid={Boolean(fieldError)}
              />
              <span className="field__count">
                {copy.blessings.charCount(form.name.length, NAME_LIMIT)}
              </span>
            </label>
          </div>

          <fieldset className="field field--choice">
            <legend className="field__label">{copy.blessings.attendingLabel}</legend>
            <div className="choice-row">
              {copy.blessings.attendingOptions.map((option) => (
                <label className={`choice ${form.attending === option.value ? "is-selected" : ""}`} key={option.value}>
                  <input
                    type="radio"
                    name="attending"
                    value={option.value}
                    checked={form.attending === option.value}
                    onChange={update("attending")}
                  />
                  <Icon name={option.value === "attending" ? "heart" : "sparkle"} size={15} />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="field">
            <span className="field__label">
              {copy.blessings.messageLabel}
              <span className="field__required">{copy.blessings.required}</span>
            </span>
            <textarea
              name="message"
              rows={4}
              value={form.message}
              onChange={update("message")}
              placeholder={copy.blessings.messagePlaceholder}
              maxLength={MESSAGE_LIMIT}
              required
              aria-invalid={Boolean(fieldError)}
            />
            <span className="field__count">
              {copy.blessings.charCount(form.message.length, MESSAGE_LIMIT)}
            </span>
          </label>

          <label className="hp-field" aria-hidden="true">
            Website
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
            />
          </label>

          <div className="blessing-form__footer">
            <button type="submit" className="btn btn--maroon" disabled={sending}>
              {sending ? copy.blessings.sending : copy.blessings.submit}
              <Icon name={sending ? "sparkle" : "send"} size={17} />
            </button>
            {status && (
              <p
                className={`form-status form-status--${status.type}`}
                role="status"
                aria-live="polite"
              >
                <Icon name={status.type === "success" ? "check" : "sparkle"} size={16} />
                {status.text}
              </p>
            )}
            {fieldError && (
              <p className="form-status form-status--error" role="alert">
                {fieldError}
              </p>
            )}
          </div>
        </form>
      </div>

      <div className="blessings__wall">
        <div className="container blessings__wall-head">
          <div>
            <p className="eyebrow">
              <span className="eyebrow__line" aria-hidden="true" />
              {copy.blessings.wallKicker}
            </p>
            <h3>{copy.blessings.wallTitle}</h3>
            <p>{copy.blessings.wallSub}</p>
          </div>
          <span className="blessings__count">
            <Icon name="heart" size={15} />
            {messages.length ? copy.blessings.count(messages.length) : copy.blessings.emptyCount}
          </span>
        </div>

        {messages.length > 0 ? (
          <>
            <MarqueeRow
              items={rowOne}
              copy={copy}
              lang={lang}
              speed={isSingleTrack ? 85 : 80}
              singleTrack={isSingleTrack}
            />
            {isMultiRow && rowTwo.length > 0 && (
              <MarqueeRow
                items={rowTwo}
                copy={copy}
                lang={lang}
                speed={80}
                singleTrack={false}
              />
            )}
          </>
        ) : (
          <div className="container">
            <div className="blessings__empty">
              <div className="blessings__empty-icon" aria-hidden="true">
                <Icon name="heart" size={22} />
              </div>
              <p className="blessings__empty-text">{copy.blessings.emptyNote}</p>
              <p className="blessings__empty-hint">{copy.blessings.emptyHint}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

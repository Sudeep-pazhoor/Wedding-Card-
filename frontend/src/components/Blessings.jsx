import { useEffect, useMemo, useRef, useState } from "react";
import { createBlessing, fetchBlessings } from "../lib/api";
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

function MarqueeRow({ items, copy, lang, reverse = false, duration, singleTrack = false }) {
  const groups = [0, 1];
  return (
    <div className={`marquee ${reverse ? "marquee--reverse" : ""} ${singleTrack ? "marquee--single" : ""}`}>
      <div className="marquee__track" style={{ "--duration": `${duration}s` }}>
        {groups.map((group) => (
          <div
            className={`marquee__group ${singleTrack ? "marquee__group--single" : ""}`}
            key={group}
            aria-hidden={group > 0 ? "true" : undefined}
            role={group === 0 ? "list" : undefined}
          >
            {items.map((item, idx) => (
              <div role="listitem" key={`${group}-${item._id || idx}`}>
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

  // Duration adapted to number of cards for relaxed readability
  const singleDuration = messages.length === 1 ? 26 : messages.length === 2 ? 32 : 38;

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
              duration={isSingleTrack ? singleDuration : 64}
              singleTrack={isSingleTrack}
            />
            {isMultiRow && rowTwo.length > 0 && (
              <MarqueeRow
                items={rowTwo}
                copy={copy}
                lang={lang}
                reverse
                duration={78}
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

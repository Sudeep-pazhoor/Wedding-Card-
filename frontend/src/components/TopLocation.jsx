import { useState } from "react";
import { SITE } from "../data/content";
import { scrollToId } from "../lib/scroll";
import { Icon } from "./Icon";

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
      return true;
    } catch {
      return false;
    }
  }
}

export default function TopLocation({ copy }) {
  const [copied, setCopied] = useState(false);
  const t = copy.topLocation || {
    badge: "For Wedding venue · Click Here",
    kicker: "Join us at",
    title: "Hilton Convention Center",
    address: "Vettekode Road, Vayapparappadi, Manjeri, Malappuram District, Kerala",
    dateTime: "Sunday, 24 January 2027 · Muhurtham 10:00 – 10:45 am",
    clickPrompt: "Click here to open in Google Maps",
    clickBtn: "Click here for Google Maps",
    copyBtn: "Copy address",
    copiedBtn: "Address copied",
    scrollHint: "View wedding invitation & celebration details",
    tapMapHint: "Tap map to navigate",
  };

  const v = copy.venue;
  const fullAddress = `${t.title}, ${t.address}`;

  // Silence music explicitly whenever the map or its direct actions are clicked
  const handleMapAction = (e) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent("sn:silence-music"));
  };

  const handleCopy = async (e) => {
    e.stopPropagation();
    const ok = await copyText(fullAddress);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <section
      className="top-location"
      id="venue"
      aria-labelledby="top-location-title"
      data-no-audio="true"
    >
      <div className="container top-location__inner">
        {/* Header Eyebrow with Traditional Gold Accents */}
        <div className="top-location__header">
          <span className="top-location__line" aria-hidden="true" />
          <span className="top-location__badge">
            <Icon name="mapPin" size={13} />
            <span>{t.badge}</span>
          </span>
          <span className="top-location__line" aria-hidden="true" />
        </div>

        <div className="top-location__card">
          {/* Stylized Theme Map (matching physical invitation design) */}
          <a
            className="top-location__map venue-map"
            href={SITE.mapsUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`${t.title} - ${t.clickPrompt}`}
            data-no-audio="true"
            onClick={handleMapAction}
            title={t.clickPrompt}
          >
            <svg
              className="venue-map__lines"
              viewBox="0 0 620 420"
              fill="none"
              aria-hidden="true"
            >
              <g stroke="currentColor" strokeWidth=".6" opacity=".22">
                {Array.from({ length: 15 }, (_, i) => (
                  <path key={`v${i}`} d={`M${20 + i * 44} 0v420`} />
                ))}
                {Array.from({ length: 10 }, (_, i) => (
                  <path key={`h${i}`} d={`M0 ${20 + i * 44}h620`} />
                ))}
              </g>
              <g stroke="currentColor" strokeLinecap="round">
                <path
                  d="M-20 300C80 286 128 250 170 198s64-92 150-102 160 6 320-40"
                  strokeWidth="10"
                  opacity=".1"
                />
                <path
                  d="M-20 300C80 286 128 250 170 198s64-92 150-102 160 6 320-40"
                  strokeWidth="1.4"
                  opacity=".5"
                />
                <path
                  d="M90 440c20-94 66-146 140-178s128-28 192-86 100-152 100-152"
                  strokeWidth="7"
                  opacity=".08"
                />
                <path
                  d="M90 440c20-94 66-146 140-178s128-28 192-86 100-152 100-152"
                  strokeWidth="1.1"
                  opacity=".38"
                />
                <path
                  d="M-20 84c104 22 180 20 264-10S400 18 470 36s110 54 170 60"
                  strokeWidth=".9"
                  opacity=".3"
                />
                <path
                  d="M460 440c-24-88-8-150 44-208s94-86 130-104"
                  strokeWidth=".9"
                  opacity=".3"
                />
              </g>
              <g fill="currentColor" opacity=".22">
                <circle cx="112" cy="340" r="2" />
                <circle cx="206" cy="150" r="2" />
                <circle cx="412" cy="270" r="2" />
                <circle cx="510" cy="120" r="2" />
                <circle cx="300" cy="330" r="2" />
              </g>
            </svg>

            <span className="top-location__tap-pill" aria-hidden="true">
              <Icon name="external" size={13} />
              <span>{t.tapMapHint}</span>
            </span>

            <span className="venue-map__compass" aria-hidden="true">
              N
            </span>
            <span className="venue-map__pin" aria-hidden="true">
              <span className="venue-map__pulse" />
              <Icon name="mapPin" size={26} />
            </span>
            <span className="venue-map__label">
              <strong>{v.mapLabel}</strong>
              <small>{v.mapCaption}</small>
            </span>
          </a>

          {/* Details & Click Here Actions */}
          <div className="top-location__info">
            <div className="top-location__text">
              <p className="top-location__kicker">{t.kicker}</p>
              <h2 className="top-location__title" id="top-location-title">
                {t.title}
              </h2>
              <address className="top-location__address">
                <span>{t.address}</span>
              </address>
              <p className="top-location__time">
                <Icon name="calendar" size={14} />
                <span>{t.dateTime}</span>
              </p>
            </div>

            {/* Click Here Action Buttons */}
            <div className="top-location__actions">
              <a
                className="btn btn--maroon top-location__btn-maps"
                href={SITE.mapsUrl}
                target="_blank"
                rel="noreferrer"
                data-no-audio="true"
                onClick={handleMapAction}
              >
                <Icon name="mapPin" size={17} />
                <span>{t.clickBtn}</span>
              </a>

              <button
                type="button"
                className="btn btn--ghost top-location__btn-copy"
                data-no-audio="true"
                onClick={handleCopy}
              >
                <Icon name={copied ? "check" : "copy"} size={16} />
                <span>{copied ? t.copiedBtn : t.copyBtn}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll link to the rest of the wedding invitation */}
        <div className="top-location__footer">
          <a
            href="#hero"
            className="top-location__scroll-link"
            onClick={(event) => {
              event.preventDefault();
              scrollToId("hero");
            }}
          >
            <span>{t.scrollHint}</span>
            <Icon name="arrowRight" size={14} className="top-location__scroll-arrow" />
          </a>
        </div>
      </div>
    </section>
  );
}


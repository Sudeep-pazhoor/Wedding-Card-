import { useState } from "react";
import { SITE } from "../data/content";
import { Icon } from "./Icon";
import { SectionHeading } from "./Ornaments";

const QR_SOURCES = ["/images/location-qr.png", "/images/location-qr.svg"];

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

export default function Venue({ copy }) {
  const v = copy.venue;
  const [qrStep, setQrStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const fullAddress = [v.title, ...v.addressLines].join(", ");

  const handleCopy = async () => {
    const ok = await copyText(fullAddress);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <section className="section venue" id="venue" aria-labelledby="venue-title">
      <div className="container">
        <SectionHeading kicker={v.kicker} title={v.title} id="venue-title" />

        <div className="venue__grid">
          <div className="venue__main" data-reveal>
            <div className="venue-map">
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
                  <path d="M-20 300C80 286 128 250 170 198s64-92 150-102 160 6 320-40" strokeWidth="10" opacity=".1" />
                  <path d="M-20 300C80 286 128 250 170 198s64-92 150-102 160 6 320-40" strokeWidth="1.4" opacity=".5" />
                  <path d="M90 440c20-94 66-146 140-178s128-28 192-86 100-152 100-152" strokeWidth="7" opacity=".08" />
                  <path d="M90 440c20-94 66-146 140-178s128-28 192-86 100-152 100-152" strokeWidth="1.1" opacity=".38" />
                  <path d="M-20 84c104 22 180 20 264-10S400 18 470 36s110 54 170 60" strokeWidth=".9" opacity=".3" />
                  <path d="M460 440c-24-88-8-150 44-208s94-86 130-104" strokeWidth=".9" opacity=".3" />
                </g>
                <g fill="currentColor" opacity=".22">
                  <circle cx="112" cy="340" r="2" />
                  <circle cx="206" cy="150" r="2" />
                  <circle cx="412" cy="270" r="2" />
                  <circle cx="510" cy="120" r="2" />
                  <circle cx="300" cy="330" r="2" />
                </g>
              </svg>

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
              <a
                className="venue-map__link"
                href={SITE.mapsUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={v.openMaps}
              >
                <Icon name="external" size={16} />
              </a>
              <p className="visually-hidden">{v.mapAlt}</p>
            </div>

            <div className="venue__info">
              <div>
                <p className="venue__address-kicker">{v.kicker}</p>
                <h3>{v.title}</h3>
                <address>
                  {v.addressLines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </address>
                <p className="venue__note">{v.note}</p>
              </div>

              <div className="venue__actions">
                <a className="btn btn--maroon" href={SITE.mapsUrl} target="_blank" rel="noreferrer">
                  <Icon name="mapPin" size={17} />
                  {v.openMaps}
                </a>
                <button type="button" className="btn btn--ghost" onClick={handleCopy}>
                  <Icon name={copied ? "check" : "copy"} size={17} />
                  {copied ? v.copied : v.copy}
                </button>
              </div>
            </div>
          </div>

          <aside className="venue__side">
            <div className="qr-card" data-reveal>
              <div className="qr-card__frame">
                <span className="qr-card__corner qr-card__corner--tl" aria-hidden="true" />
                <span className="qr-card__corner qr-card__corner--tr" aria-hidden="true" />
                <span className="qr-card__corner qr-card__corner--bl" aria-hidden="true" />
                <span className="qr-card__corner qr-card__corner--br" aria-hidden="true" />
                {qrStep < QR_SOURCES.length ? (
                  <img
                    src={QR_SOURCES[qrStep]}
                    alt={v.qrAlt}
                    className="qr-card__img"
                    onError={() => setQrStep((step) => step + 1)}
                  />
                ) : (
                  <div className="qr-card__placeholder" aria-label={v.qrPending}>
                    <span className="qr-card__pattern" aria-hidden="true" />
                    <span>{v.qrPending}</span>
                  </div>
                )}
              </div>
              <h3>{v.qrTitle}</h3>
              <p>{v.qrNote}</p>
            </div>

            <div className="travel-card" data-reveal>
              <div className="travel-card__icon">
                <Icon name="phone" size={20} />
              </div>
              <div>
                <h3>{v.travelTitle}</h3>
                <p>{v.travelText}</p>
              </div>
              <div className="travel-card__divider" aria-hidden="true" />
              <div className="travel-card__arrive">
                <span>{v.arriveLabel}</span>
                <strong>{v.arriveText}</strong>
              </div>
              <a className="travel-card__call" href={`tel:+91${SITE.phones[0]}`}>
                <Icon name="phone" size={16} />
                +91 96333 94120
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

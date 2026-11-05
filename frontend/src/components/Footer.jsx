import { useState } from "react";
import { SITE } from "../data/content";
import { scrollToTop } from "../lib/scroll";
import { Icon } from "./Icon";
import { Divider, Lotus, OmCircle } from "./Ornaments";

export default function Footer({ copy }) {
  const [shared, setShared] = useState(false);
  const f = copy.footer;

  const share = async () => {
    const url = window.location.href.split("#")[0];
    const data = {
      title: "Sundeep weds Neeraja · 24 January 2027",
      text: "Join us in celebrating the wedding of Sundeep and Neeraja.",
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(url);
      setShared(true);
      window.setTimeout(() => setShared(false), 2400);
    } catch {
      /* sharing dismissed — nothing to do */
    }
  };

  return (
    <footer className="site-footer" aria-label="Wedding invitation footer">
      <div className="footer__orb footer__orb--one" aria-hidden="true" />
      <div className="footer__orb footer__orb--two" aria-hidden="true" />

      <div className="container footer__inner">
        <div className="footer__crest" data-reveal>
          <OmCircle tone="pale" />
          <p className="footer__shloka" lang="ml">
            {f.shloka}
          </p>
          <p className="footer__names">
            <span>{copy.hero.groom}</span>
            <i>&amp;</i>
            <span>{copy.hero.bride}</span>
          </p>
          <p className="footer__date">{copy.hero.date}</p>
        </div>

        <Divider tone="light" className="footer__divider" />

        <div className="footer__grid">
          <div className="footer__col footer__col--closing" data-reveal>
            <Lotus className="footer__lotus" />
            <p className="footer__closing">{f.closing}</p>
            <p className="footer__credit">{f.credits}</p>
          </div>

          <div className="footer__col" data-reveal>
            <p className="footer__label">{f.best}</p>
            <p className="footer__name">{f.name}</p>
            <p className="footer__phones">
              {SITE.phones.map((phone, index) => (
                <span key={phone}>
                  <a href={`tel:+91${phone}`}>{phone}</a>
                  {index === 0 && <em> · </em>}
                </span>
              ))}
            </p>
            <a
              className="footer__map"
              href={SITE.mapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="mapPin" size={15} />
              {copy.venue.title}
            </a>
          </div>

          <div className="footer__col footer__col--actions" data-reveal>
            <button type="button" className="footer__share" onClick={share}>
              <Icon name={shared ? "check" : "share"} size={17} />
              {shared ? f.shareCopied : f.share}
            </button>
            <button type="button" className="footer__top" onClick={scrollToTop}>
              {f.backToTop}
              <span className="footer__top-icon">
                <Icon name="arrowUp" size={16} />
              </span>
            </button>
          </div>
        </div>

        <div className="footer__bottom">
          <span>{f.copyright}</span>
          <span className="footer__diamond" aria-hidden="true">
            ◆
          </span>
          <span>{f.shloka}</span>
        </div>
      </div>
    </footer>
  );
}

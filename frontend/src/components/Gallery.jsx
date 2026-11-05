import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { SectionHeading } from "./Ornaments";
import SmartImage from "./SmartImage";
import { pauseScroll, resumeScroll } from "../lib/scroll";

// 6 gallery photographs arranged for optimal framing:
// 3 vertical/portrait slots (1, 3, 4) and 3 normal landscape slots (2, 5, 6)
const PHOTOS = [
  "/gallery/photo-1.jpg", // Slot 1: Large feature showcase (vertical/square)
  "/gallery/photo-4.jpg", // Slot 2: Top wide banner (normal landscape)
  "/gallery/photo-2.jpg", // Slot 3: Middle-left tile (vertical portrait)
  "/gallery/photo-3.jpg", // Slot 4: Middle-right tile (vertical portrait)
  "/gallery/photo-5.jpg", // Slot 5: Bottom-left wide banner (normal landscape)
  "/gallery/photo-6.jpg", // Slot 6: Bottom-right wide banner (normal landscape)
];

export default function Gallery({ copy }) {
  const [loaded, setLoaded] = useState({});
  const [open, setOpen] = useState(null);
  const closeRef = useRef(null);
  const openerRef = useRef(null);

  useEffect(() => {
    if (open === null) return undefined;

    pauseScroll();
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(null);
      if (event.key === "ArrowRight") setOpen((current) => (current + 1) % PHOTOS.length);
      if (event.key === "ArrowLeft") setOpen((current) => (current - 1 + PHOTOS.length) % PHOTOS.length);
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", onKey);
      resumeScroll();
      openerRef.current?.focus?.();
    };
  }, [open]);

  const openPhoto = (index, event) => {
    if (!loaded[index]) return;
    openerRef.current = event.currentTarget;
    setOpen(index);
  };

  return (
    <section className="section gallery" id="gallery" aria-labelledby="gallery-title">
      <div className="container">
        <SectionHeading
          kicker={copy.gallery.kicker}
          title={copy.gallery.title}
          subtitle={copy.gallery.subtitle}
          id="gallery-title"
        />

        <div className="gallery__grid">
          {PHOTOS.map((src, index) => {
            const caption = copy.gallery.captions[index];
            const isLoaded = Boolean(loaded[index]);
            return (
              <figure
                className={`gallery__item gallery__item--${index + 1} ${isLoaded ? "" : "is-placeholder"}`}
                key={src}
                data-reveal
              >
                <button
                  type="button"
                  className="gallery__button"
                  onClick={(event) => openPhoto(index, event)}
                  aria-label={isLoaded ? `${copy.gallery.view}: ${caption}` : `${caption} — ${copy.gallery.coming}`}
                  aria-disabled={!isLoaded}
                >
                  <SmartImage
                    src={src}
                    alt={caption}
                    fallbackLabel={caption}
                    fallbackNote={copy.gallery.coming}
                    className="gallery__image"
                    onStatusChange={(status) =>
                      setLoaded((previous) => ({ ...previous, [index]: status === "loaded" }))
                    }
                  />
                  <span className="gallery__overlay" aria-hidden="true">
                    <span className="gallery__number">0{index + 1}</span>
                    <span className="gallery__caption">{caption}</span>
                    {isLoaded && (
                      <span className="gallery__zoom">
                        <Icon name="camera" size={18} />
                      </span>
                    )}
                  </span>
                </button>
              </figure>
            );
          })}
        </div>

        <p className="gallery__note" data-reveal>
          <Icon name="sparkle" size={15} /> {copy.gallery.note}
        </p>
      </div>

      {open !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={copy.gallery.captions[open]}
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(null);
          }}
        >
          <button
            type="button"
            className="lightbox__close"
            onClick={() => setOpen(null)}
            ref={closeRef}
            aria-label={copy.gallery.close}
          >
            <Icon name="close" size={22} />
          </button>
          <figure className="lightbox__figure">
            <img src={PHOTOS[open]} alt={copy.gallery.captions[open]} />
            <figcaption>
              <span>{copy.gallery.captions[open]}</span>
              <small>
                0{open + 1} / 0{PHOTOS.length}
              </small>
            </figcaption>
          </figure>
          <button
            type="button"
            className="lightbox__nav lightbox__nav--prev"
            onClick={() => setOpen((open - 1 + PHOTOS.length) % PHOTOS.length)}
            aria-label="Previous photograph"
          >
            <Icon name="arrowRight" size={22} style={{ transform: "rotate(180deg)" }} />
          </button>
          <button
            type="button"
            className="lightbox__nav lightbox__nav--next"
            onClick={() => setOpen((open + 1) % PHOTOS.length)}
            aria-label="Next photograph"
          >
            <Icon name="arrowRight" size={22} />
          </button>
        </div>
      )}
    </section>
  );
}

import { addToCalendar } from "../lib/calendar";
import { SITE } from "../data/content";
import { Icon } from "./Icon";
import { Divider, SectionHeading } from "./Ornaments";

export default function Celebration({ copy }) {
  const c = copy.celebration;

  return (
    <section className="section celebration" id="celebration" aria-labelledby="celebration-title">
      <div className="celebration__watermark" aria-hidden="true">
        <span>ॐ</span>
      </div>

      <div className="container">
        <SectionHeading
          kicker={c.kicker}
          title={c.title}
          subtitle={c.subtitle}
          tone="light"
          id="celebration-title"
        />

        <div className="celebration__grid">
          <div className="date-card" data-reveal>
            <span className="date-card__label">{c.weddingLabel}</span>
            <div className="date-card__day">{c.dateDay}</div>
            <div className="date-card__number">{c.dateNumber}</div>
            <div className="date-card__month">
              {c.dateMonth} <span>{c.dateYear}</span>
            </div>
            <p className="date-card__ml" lang="ml">
              {c.malayalamDate}
            </p>

            <Divider tone="light" className="date-card__divider" />

            <div className="date-card__actions">
              <button type="button" className="btn btn--gold" onClick={addToCalendar}>
                <Icon name="calendarPlus" size={17} />
                {c.calendar}
              </button>
              <a
                className="btn btn--ghost-light"
                href={SITE.mapsUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="mapPin" size={17} />
                {c.directions}
              </a>
            </div>

            <p className="date-card__note">{c.note}</p>
          </div>

          <div className="event-list">
            {c.events.map((event, index) => (
              <article className="event-card" key={event.title} data-reveal>
                <div className="event-card__index">0{index + 1}</div>
                <div className="event-card__icon">
                  {event.icon === "om" ? (
                    <span aria-hidden="true">ॐ</span>
                  ) : (
                    <Icon name="leaf" size={24} />
                  )}
                </div>
                <div className="event-card__body">
                  <p className="event-card__time">
                    <Icon name="clock" size={15} />
                    {event.time}
                  </p>
                  <h3>{event.title}</h3>
                  <p>{event.text}</p>
                </div>
              </article>
            ))}

            <div className="event-list__footer" data-reveal>
              <Icon name="mapPin" size={18} />
              <span>{SITE.venueQuery}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

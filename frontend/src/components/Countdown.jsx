import { useCountdown } from "../lib/useCountdown";

const order = ["days", "hours", "minutes", "seconds"];

export default function Countdown({ copy }) {
  const time = useCountdown();
  const c = copy.countdown;

  return (
    <section className="countdown-band" aria-labelledby="countdown-title">
      <div className="container countdown-band__inner">
        <div className="countdown-band__text" data-reveal>
          <p className="eyebrow">
            <span className="eyebrow__line" aria-hidden="true" />
            {c.kicker}
          </p>
          <h2 className="countdown-band__title" id="countdown-title">
            {c.title}
          </h2>
          <p className="countdown-band__subtitle">{c.subtitle}</p>
        </div>

        <div
          className={`countdown ${time.arrived ? "is-arrived" : ""}`}
          role="timer"
          aria-label={c.title}
          data-reveal
        >
          {time.arrived ? (
            <p className="countdown__arrived">{c.arrived}</p>
          ) : (
            order.map((unit) => (
              <div className="countdown__unit" key={unit}>
                <span className="countdown__number">
                  {String(time[unit]).padStart(2, "0")}
                </span>
                <span className="countdown__label">{c.units[unit]}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

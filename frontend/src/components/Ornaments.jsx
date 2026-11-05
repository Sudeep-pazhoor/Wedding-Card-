import { Icon } from "./Icon";

export function Divider({ className = "", tone = "gold" }) {
  return (
    <svg
      className={`ornament-divider ornament-divider--${tone} ${className}`}
      viewBox="0 0 240 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 12h78" stroke="currentColor" strokeWidth="1" />
      <path d="M160 12h78" stroke="currentColor" strokeWidth="1" />
      <path
        d="M120 4.5c2.4 3.8 4.6 5.6 8.5 7.5-3.9 1.9-6.1 3.7-8.5 7.5-2.4-3.8-4.6-5.6-8.5-7.5 3.9-1.9 6.1-3.7 8.5-7.5Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <circle cx="94" cy="12" r="2" fill="currentColor" />
      <circle cx="146" cy="12" r="2" fill="currentColor" />
      <path
        d="M104 12c2.2-3.2 5-4.4 8-4.4M104 12c2.2 3.2 5 4.4 8 4.4M136 12c-2.2-3.2-5-4.4-8-4.4M136 12c-2.2 3.2-5 4.4-8 4.4"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity=".75"
      />
    </svg>
  );
}

export function CornerFlourish({ className = "" }) {
  return (
    <svg
      className={`ornament-corner ${className}`}
      viewBox="0 0 150 150"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M2 148V52C2 25 25 2 52 2h96"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M10 148V56C10 32 32 10 56 10h92"
        stroke="currentColor"
        strokeWidth=".55"
        opacity=".55"
      />
      <path
        d="M24 40c18-2 32 8 36 26-17 1-30-8-36-26Zm0 0c-2-14 4-24 16-30 7 12 3 24-16 30Z"
        stroke="currentColor"
        strokeWidth=".9"
        opacity=".7"
      />
      <path
        d="M40 24c6 2 10 8 11 14M24 40c2 7 8 12 15 14"
        stroke="currentColor"
        strokeWidth=".7"
        opacity=".55"
      />
      <circle cx="56" cy="56" r="2.2" fill="currentColor" opacity=".8" />
      <path d="M56 44v-8M56 68v8M44 56h-8M68 56h8" stroke="currentColor" strokeWidth=".7" opacity=".55" />
    </svg>
  );
}

export function Mandala({ className = "", petals = 16 }) {
  const ring = Array.from({ length: petals }, (_, i) => (i * 360) / petals);
  return (
    <svg
      className={`ornament-mandala ${className}`}
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="currentColor" strokeWidth=".8">
        <circle cx="200" cy="200" r="196" opacity=".28" />
        <circle cx="200" cy="200" r="150" opacity=".38" />
        <circle cx="200" cy="200" r="96" opacity=".4" />
        <circle cx="200" cy="200" r="48" opacity=".5" />
        {ring.map((angle) => (
          <g key={angle} transform={`rotate(${angle} 200 200)`}>
            <path
              d="M200 52c10 22 10 44 0 66-10-22-10-44 0-66Z"
              opacity=".45"
            />
            <path d="M200 200v-16" opacity=".35" />
            <circle cx="200" cy="30" r="2" opacity=".65" />
          </g>
        ))}
        {ring.slice(0, 8).map((angle) => (
          <g key={`outer-${angle}`} transform={`rotate(${angle + 11} 200 200)`}>
            <path d="M200 8c14 16 18 30 0 48-18-18-14-32 0-48Z" opacity=".3" />
          </g>
        ))}
      </g>
    </svg>
  );
}

export function Lotus({ className = "" }) {
  return (
    <svg
      className={`ornament-lotus ${className}`}
      viewBox="0 0 64 40"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M32 34c-8 0-15-5-18-12 7-1 14 2 18 12Zm0 0c8 0 15-5 18-12-7-1-14 2-18 12Zm0 0c-5-5-6-13-4-20 5 5 7 12 4 20Zm0 0c5-5 6-13 4-20-5 5-7 12-4 20Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path d="M32 34c-3-9-1-17 4-23 2 8 0 16-4 23Z" stroke="currentColor" strokeWidth=".9" opacity=".7" />
    </svg>
  );
}

export function PalmSpray({ side = "left", className = "" }) {
  return (
    <svg
      className={`ornament-palm ornament-palm--${side} ${className}`}
      viewBox="0 0 260 560"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        transform={side === "right" ? "translate(260 0) scale(-1 1)" : undefined}
      >
        <path d="M198 560C186 428 148 340 112 262 88 210 72 154 74 92" opacity=".8" />
        <path d="M74 92c-6-22 2-42 18-58 12 26 8 46-18 58Z" opacity=".55" fill="currentColor" fillOpacity=".08" />
        <path d="M86 148c-20-10-32-26-34-48 24 6 38 22 34 48Z" opacity=".5" fill="currentColor" fillOpacity=".07" />
        <path d="M112 214c-28-8-46-26-52-52 32 2 54 20 52 52Z" opacity=".5" fill="currentColor" fillOpacity=".07" />
        <path d="M144 292c-34-2-58-16-72-42 38-6 66 10 72 42Z" opacity=".45" fill="currentColor" fillOpacity=".06" />
        <path d="M176 378c-38 4-66-6-84-30 38-12 70 0 84 30Z" opacity=".4" fill="currentColor" fillOpacity=".05" />
        <path d="M196 468c-38 10-64 4-82-16 34-16 64-8 82 16Z" opacity=".35" fill="currentColor" fillOpacity=".05" />
        <path d="M86 170c8-2 16-2 24 2M106 236c10-4 20-4 28 0M134 312c10-2 20 0 28 6M160 398c10 0 18 4 24 10M182 492c8 0 14 2 20 8" opacity=".4" />
      </g>
    </svg>
  );
}

export function RotatingSeal({ text, className = "" }) {
  const id = "seal-path";
  return (
    <div className={`seal ${className}`} aria-hidden="true">
      <svg viewBox="0 0 140 140" className="seal__ring">
        <defs>
          <path id={id} d="M70,70 m-53,0 a53,53 0 1,1 106,0 a53,53 0 1,1 -106,0" />
        </defs>
        <text className="seal__text">
          <textPath href={`#${id}`} startOffset="0%">
            {text}
          </textPath>
        </text>
      </svg>
      <div className="seal__center">
        <Lotus />
        <span>S &amp; N</span>
      </div>
    </div>
  );
}

export function SectionHeading({ kicker, title, subtitle, tone = "dark", align = "center", id }) {
  return (
    <header className={`section-heading section-heading--${align} section-heading--${tone}`} data-reveal>
      {kicker && (
        <p className="eyebrow">
          <span className="eyebrow__line" aria-hidden="true" />
          {kicker}
          <span className="eyebrow__line" aria-hidden="true" />
        </p>
      )}
      <h2 className="section-title" id={id}>
        {title}
      </h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
      <Divider className="section-heading__divider" tone={tone === "light" ? "light" : "gold"} />
    </header>
  );
}

export function FloatingPetals() {
  const petals = [
    { top: "18%", left: "8%", delay: "0s", size: 14, rotate: 20, dur: "16s" },
    { top: "32%", left: "88%", delay: "-3s", size: 10, rotate: -30, dur: "19s" },
    { top: "62%", left: "5%", delay: "-7s", size: 12, rotate: 60, dur: "21s" },
    { top: "74%", left: "92%", delay: "-2s", size: 15, rotate: 10, dur: "18s" },
    { top: "12%", left: "74%", delay: "-9s", size: 8, rotate: 40, dur: "24s" },
    { top: "82%", left: "18%", delay: "-5s", size: 9, rotate: -15, dur: "17s" },
    { top: "48%", left: "96%", delay: "-11s", size: 7, rotate: 70, dur: "22s" },
    { top: "44%", left: "2%", delay: "-13s", size: 8, rotate: 30, dur: "20s" },
  ];

  return (
    <div className="petals" aria-hidden="true">
      {petals.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size * 1.35,
            animationDelay: p.delay,
            animationDuration: p.dur,
            "--rotate": `${p.rotate}deg`,
          }}
        />
      ))}
    </div>
  );
}

export function OmCircle({ tone = "gold" }) {
  return (
    <span className={`om-circle om-circle--${tone}`} aria-hidden="true">
      <span className="om-circle__inner">ॐ</span>
    </span>
  );
}

export function InfoRow({ icon, children }) {
  return (
    <span className="info-row">
      <span className="info-row__icon">
        <Icon name={icon} size={17} />
      </span>
      <span>{children}</span>
    </span>
  );
}

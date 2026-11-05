import { useState } from "react";
import { Mandala } from "./Ornaments";

/**
 * Renders an image only once it loads. Until a real photograph is dropped in
 * /public, an elegant ornamental placeholder is shown instead — no broken icons.
 */
export default function SmartImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  fallbackLabel,
  fallbackNote,
  eager = false,
  onStatusChange,
  children,
}) {
  const [status, setStatus] = useState("loading");

  const update = (next) => {
    setStatus(next);
    onStatusChange?.(next);
  };

  return (
    <span className={`smart-image ${className} is-${status}`}>
      <span className="smart-image__fallback" aria-hidden={status === "loaded"}>
        <Mandala className="smart-image__mandala" />
        <span className="smart-image__fallback-text">
          <span>{fallbackLabel}</span>
          {fallbackNote && <small>{fallbackNote}</small>}
        </span>
        {children}
      </span>
      {src && (
        <img
          key={src}
          className={`smart-image__img ${imgClassName}`}
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          draggable="false"
          onLoad={() => update("loaded")}
          onError={() => update("error")}
        />
      )}
    </span>
  );
}

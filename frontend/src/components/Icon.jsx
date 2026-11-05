const paths = {
  arrowRight: "M4 12h15m0 0-6-6m6 6-6 6",
  arrowDown: "M12 4v15m0 0 6-6m-6 6-6-6",
  arrowUp: "M12 20V5m0 0-6 6m6-6 6 6",
  calendar: "M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z",
  calendarPlus: "M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm7 7v6m-3-3h6",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3 2",
  mapPin: "M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Zm-8 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  phone: "M6.6 3h3l1.5 4.5-2 1.4a12 12 0 0 0 6 6l1.4-2L21 14.4v3a2.6 2.6 0 0 1-2.8 2.6A16.5 16.5 0 0 1 3.4 5.8 2.6 2.6 0 0 1 6 3Z",
  send: "m21 3-7.2 18-4.1-7.7L3 9.2 21 3Zm-11.3 10.3L21 3",
  copy: "M9 9h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1Zm-2 6H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2",
  check: "m4 12 5 5L20 6",
  heart: "M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21l8.8-8.3a5 5 0 0 0 0-7.1Z",
  leaf: "M20 4C10 4 4 9 4 16c0 2 .6 3.4.6 3.4S8 12 18 9c-7 4-10 7-12 11M14 12c0 4-3 7-7 8",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "m6 6 12 12M18 6 6 18",
  external: "M14 4h6v6m0-6-9 9M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5",
  quote: "M9 11c0-3-2-5-5-5v4c1.2 0 2 .8 2 2v6h4v-7H9Zm10 0c0-3-2-5-5-5v4c1.2 0 2 .8 2 2v6h4v-7h-1Z",
  share: "M12 16V4m0 0L8 8m4-4 4 4M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5",
  sparkle: "M12 3c.7 4.3 2.7 6.3 7 7-4.3.7-6.3 2.7-7 7-.7-4.3-2.7-6.3-7-7 4.3-.7 6.3-2.7 7-7Z",
  camera: "M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Zm8 9a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.5 3.8 5.6 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.6-3.8-9S9.5 5.5 12 3Z",
  users: "M16 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20M9 10.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm13 9.5v-1.5a4 4 0 0 0-3-3.9M16 3.6a3.5 3.5 0 0 1 0 6.8",
  utensils: "M6 3v8m0 0v10M3 3v5a3 3 0 0 0 6 0V3m9 18V3c-2.5 1-4 4-4 8h4m0 0v10",
  play: "M6 4l14 8-14 8V4z",
  pause: "M6 4h4v16H6V4zm8 0h4v16h-4V4z",
  music: "M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
};

export function Icon({ name, size = 20, className = "", strokeWidth = 1.6, ...rest }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`icon ${className}`}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={paths[name] || paths.sparkle} />
    </svg>
  );
}

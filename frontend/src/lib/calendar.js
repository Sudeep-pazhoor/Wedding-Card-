import { SITE } from "../data/content";

function escapeIcs(value = "") {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

/** Download an .ics file so guests can add the muhurtham to any calendar. */
export function addToCalendar() {
  const start = new Date(SITE.weddingDateISO);
  const end = new Date(start.getTime() + 45 * 60 * 1000);

  const stamp = (date) =>
    date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sundeep and Neeraja//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:sundeep-neeraja-wedding-${start.getTime()}@wedding`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escapeIcs("Sundeep weds Neeraja — Muhurtham")}`,
    `LOCATION:${escapeIcs(SITE.venueQuery)}`,
    `DESCRIPTION:${escapeIcs(
      "You are warmly invited to the wedding of Sundeep and Neeraja. Muhurtham 10:00–10:45 am, lunch thereafter."
    )}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    "DESCRIPTION:Wedding tomorrow — Sundeep & Neeraja",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const blob = new Blob([lines.join("\r\n")], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Sundeep-Neeraja-Wedding.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

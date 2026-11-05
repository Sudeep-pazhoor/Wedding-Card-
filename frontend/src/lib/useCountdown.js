import { useEffect, useState } from "react";
import { SITE } from "../data/content";

const TARGET = new Date(SITE.weddingDateISO).getTime();

function remaining() {
  const distance = TARGET - Date.now();
  if (distance <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, arrived: true };
  }
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
    arrived: false,
  };
}

export function useCountdown() {
  const [time, setTime] = useState(remaining);

  useEffect(() => {
    const id = window.setInterval(() => setTime(remaining()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return time;
}

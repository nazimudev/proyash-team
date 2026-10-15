"use client";

import { useEffect, useRef, useState } from "react";
import { formatNumber } from "@/lib/impact";

/**
 * Animates ONLY a verified value. The final number is always in the DOM for
 * screen readers (and is what shows before JS / with reduced motion); the
 * animated copy is aria-hidden so assistive tech never hears intermediate numbers.
 */
export default function CountUp({ value, className = "" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf;
    let started = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          if (!started) setShown(0); // hold at 0 until it scrolls into view
          return;
        }
        if (started) return;
        started = true;
        observer.disconnect();
        const duration = 1400;
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min((now - t0) / duration, 1);
          setShown(value * (1 - Math.pow(1 - p, 3)));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  const display = Number.isInteger(value)
    ? Math.round(shown)
    : Math.round(shown * 100) / 100;
  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{formatNumber(value)}</span>
      <span aria-hidden="true">{formatNumber(display)}</span>
    </span>
  );
}

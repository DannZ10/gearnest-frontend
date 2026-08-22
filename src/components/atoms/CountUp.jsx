'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * Counts from 0 to `value` once the element scrolls into view.
 * Handles decimals and an optional prefix/suffix (e.g. "10", "K+" → 10K+).
 * Renders the final value immediately under reduced-motion.
 */
export default function CountUp({ value, decimals = 0, prefix = '', suffix = '', duration = 1400, className }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setDisplay(value);
      return;
    }

    let raf;
    let started = false;
    const run = () => {
      if (started) return;
      started = true;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        setDisplay(value * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    // If already on-screen at mount, start now — don't wait on IntersectionObserver
    // (which never fires when the tab isn't compositing). Otherwise arm the observer.
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;

    let io;
    if (inView) {
      run();
    } else {
      io = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            run();
            io.disconnect();
          }
        },
        { threshold: 0.4 }
      );
      io.observe(el);
    }

    // Safety net: never leave the number stuck below its true value.
    const fallback = setTimeout(() => setDisplay(value), duration + 600);

    return () => {
      io?.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

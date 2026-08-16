'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * Lightweight scroll-reveal: fades + rises its children into view once.
 * Honors prefers-reduced-motion via the .gn-reveal CSS.
 */
export default function Reveal({
  as: Tag = 'div',
  className = '',
  delay = 0,
  children,
  ...rest
}) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`gn-reveal ${seen ? 'gn-in' : ''} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

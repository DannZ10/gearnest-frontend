'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Backpack, MapPin, Users, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { icon: Backpack, value: '200+', label: 'Gear Premium' },
  { icon: MapPin, value: '50+', label: 'Destinasi Petualangan' },
  { icon: Users, value: '10K+', label: 'Penyewa Bahagia' },
  { icon: Star, value: '4.9/5', label: 'Rating Pelanggan' },
];

export default function StatsBar() {
  const barRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !barRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(barRef.current,
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: barRef.current, start: 'top 90%' },
        }
      );

      // Stagger individual stat items
      gsap.fromTo(barRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.5, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: barRef.current, start: 'top 85%' },
        }
      );
    }, barRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        ref={barRef}
        className="-mt-10 relative z-10 rounded-3xl bg-ink-2 gn-topo border border-white/10 shadow-xl shadow-ink/20 px-6 py-8 sm:px-10 grid grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {STATS.map((s) => (
          <div key={s.label} className="flex items-center gap-3.5">
            <span className="grid place-items-center w-11 h-11 shrink-0 rounded-xl bg-ember/15 text-ember">
              <s.icon className="w-5 h-5" />
            </span>
            <div>
              <p className="font-display font-bold text-2xl sm:text-3xl text-ember leading-none">{s.value}</p>
              <p className="text-[11px] uppercase tracking-wide text-sand/70 mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

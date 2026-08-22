'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Navigation } from 'lucide-react';

// Real open-source outdoor / gear photography (Unsplash). Swap every 30s or on click.
const IMG = 'https://images.unsplash.com/photo-';
const Q = '?w=1920&q=80&auto=format&fit=crop';
const SLIDES = [
  { src: `${IMG}1504280390367-361c6d9f38f4${Q}`, caption: 'Tenda ultralight — malam berbintang' },
  { src: `${IMG}1501555088652-021faa106b9b${Q}`, caption: 'Trekking lembah — carrier penuh' },
  { src: `${IMG}1454496522488-7a8e488e8606${Q}`, caption: 'Punggungan pagi — sepatu gunung' },
  { src: `${IMG}1522163182402-834f871fd851${Q}`, caption: 'Panjat tebing — gear teknis' },
];
const INTERVAL = 30000;

const FIELD_SPECS = [
  { value: '200+', label: 'Gear Premium' },
  { value: '50+', label: 'Titik Destinasi' },
  { value: '4.9', label: 'Rating Pendaki' },
];

export default function HeroSection() {
  const sectionRef = useRef(null);
  const tagRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const specRef = useRef(null);
  const glowRef = useRef(null);

  const [index, setIndex] = useState(0);
  const next = () => setIndex((i) => (i + 1) % SLIDES.length);
  const goTo = (i) => setIndex(i);

  // Auto-advance; re-armed whenever index changes so a manual click resets the timer.
  useEffect(() => {
    const t = setTimeout(next, INTERVAL);
    return () => clearTimeout(t);
  }, [index]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      if (glowRef.current) {
        gsap.to(glowRef.current, { y: -18, x: 14, duration: 5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      }
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo(tagRef.current?.children || [], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, 0.15)
        .fromTo(headingRef.current?.children || [], { opacity: 0, yPercent: 115 }, { opacity: 1, yPercent: 0, duration: 0.9, stagger: 0.12, ease: 'power4.out' }, 0.25)
        .fromTo(subRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6 }, 0.75)
        .fromTo(ctaRef.current?.children || [], { opacity: 0, y: 16, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1 }, 0.9)
        .fromTo(specRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 1.05);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Advance on any click that isn't on an interactive control.
  const onSectionClick = (e) => {
    if (e.target.closest('a, button')) return;
    next();
  };

  return (
    <section
      ref={sectionRef}
      onClick={onSectionClick}
      className="relative overflow-hidden bg-char text-white cursor-pointer select-none"
    >
      {/* Image carousel (crossfade + gentle zoom) */}
      <div className="absolute inset-0" aria-hidden="true">
        {SLIDES.map((s, i) => (
          <img
            key={s.src}
            src={s.src}
            alt=""
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1400ms] ease-out motion-reduce:transition-opacity ${
              i === index ? 'opacity-45 scale-100' : 'opacity-0 scale-105'
            }`}
          />
        ))}
      </div>

      <div className="absolute inset-0 gn-gridlines opacity-60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-char via-char/85 to-char/30 pointer-events-none" />
      <div ref={glowRef} className="absolute -top-32 -right-20 w-[28rem] h-[28rem] rounded-full bg-ember/25 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-24 w-[30rem] h-[30rem] rounded-full bg-trail/25 blur-[110px] pointer-events-none" />

      {/* Rotated side marker */}
      <div className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 items-center gap-3 rotate-90 origin-center text-white/40 pointer-events-none">
        <span className="font-mono text-[11px] tracking-[0.35em] uppercase">Expedition Ready</span>
        <span className="w-14 h-px bg-white/30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-0 sm:pt-24">
        <div className="max-w-4xl">
          <div ref={tagRef} className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/55">
            <span className="inline-flex items-center gap-2 text-trail-2">
              <span className="w-1.5 h-1.5 bg-trail-2 rounded-full gn-float" /> Basecamp GearNest
            </span>
            <span className="inline-flex items-center gap-1.5"><Navigation className="w-3 h-3" /> S 07.25&deg; &middot; E 112.75&deg;</span>
            <span className="hidden sm:inline">EST — MMXXVI</span>
          </div>

          <h1
            ref={headingRef}
            className="mt-7 font-display font-bold uppercase leading-[0.85] tracking-[-0.01em]"
            style={{ fontSize: 'clamp(3rem, 9.5vw, 7.5rem)' }}
          >
            <span className="block overflow-hidden"><span className="block text-white">Taklukkan</span></span>
            <span className="block overflow-hidden"><span className="block text-ember">Setiap Jalur.</span></span>
          </h1>

          <p ref={subRef} className="mt-6 max-w-lg text-white/70 text-base sm:text-lg leading-relaxed">
            Sewa perlengkapan outdoor kelas ekspedisi — tenda, carrier, sleeping bag, dan gear teknis — terawat, teruji, siap tempur untuk setiap medan.
          </p>

          <div ref={ctaRef} className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/gears" className="group">
                Jelajahi Gear
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/about" className="group">
                <span className="grid place-items-center w-6 h-6 rounded-full bg-white/15 group-hover:bg-white/25 transition-colors">
                  <Play className="w-3 h-3 fill-current" />
                </span>
                Cara Sewa
              </Link>
            </Button>
          </div>
        </div>

        {/* Field-spec strip + carousel dots */}
        <div
          ref={specRef}
          className="mt-14 sm:mt-20 border-t-2 border-white/15 flex items-stretch justify-between gap-4"
        >
          <div className="grid grid-cols-3 flex-1 divide-x divide-white/10">
            {FIELD_SPECS.map((s, i) => (
              <div key={s.label} className="py-5 sm:py-6 px-2 sm:px-6 first:pl-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[10px] text-trail-2">0{i + 1}</span>
                  <span className="font-display font-bold text-3xl sm:text-5xl leading-none text-white">{s.value}</span>
                </div>
                <p className="mt-1.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-white/50">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Carousel dots */}
          <div className="hidden sm:flex flex-col items-end justify-center gap-2.5 pl-4">
            {SLIDES.map((s, i) => (
              <button
                key={s.src}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Tampilkan slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === index ? 'w-8 bg-ember' : 'w-4 bg-white/30 hover:bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

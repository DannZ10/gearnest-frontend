'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import {
  ArrowRight, Play, ShieldCheck, Mountain, Leaf, Compass,
} from 'lucide-react';

const VALUE_PROPS = [
  { icon: ShieldCheck, title: 'Andal', desc: 'Gear berkualitas yang bisa dipercaya' },
  { icon: Mountain, title: 'Petualang', desc: 'Dibuat untuk setiap perjalanan' },
  { icon: Leaf, title: 'Rapi', desc: 'Semua tertata, setiap saat' },
  { icon: Compass, title: 'Siap', desc: 'Siap untuk apa pun' },
];

export default function HeroSection() {
  const sectionRef = useRef(null);
  const badgeRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const propsRef = useRef(null);
  const orbRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Hero image Ken Burns
      if (imgRef.current) {
        gsap.fromTo(imgRef.current,
          { scale: 1.15 },
          { scale: 1, duration: 14, ease: 'power1.out' }
        );
      }

      // Floating orb
      if (orbRef.current) {
        gsap.to(orbRef.current, {
          y: -15,
          x: 10,
          duration: 4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      }

      // Staggered text entrance
      tl.fromTo(badgeRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6 },
        0.2
      )
      .fromTo(headingRef.current?.children || [],
        { opacity: 0, y: 40, rotateX: 15 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.8, stagger: 0.12 },
        0.35
      )
      .fromTo(subRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        0.7
      )
      .fromTo(ctaRef.current?.children || [],
        { opacity: 0, y: 15, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1 },
        0.9
      )
      .fromTo(propsRef.current?.children || [],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
        1.1
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-ink text-white">
      <img
        ref={imgRef}
        src="/hero.png"
        alt=""
        aria-hidden="true"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
        className="absolute inset-0 w-full h-full object-cover opacity-45"
      />
      <div className="absolute inset-0 gn-topo opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
      <div
        ref={orbRef}
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-ember/20 blur-3xl pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div className="max-w-3xl">
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-moss/40 border border-white/10 backdrop-blur-sm"
            style={{ opacity: 0 }}
          >
            <Mountain className="w-3.5 h-3.5 text-ember" />
            <span className="text-[11px] font-display font-semibold uppercase tracking-[0.15em] text-white">
              Your Basecamp For Adventure
            </span>
          </div>

          <h1
            ref={headingRef}
            className="mt-6 font-display font-bold uppercase leading-[0.92] tracking-tight"
            style={{ fontSize: 'clamp(2.75rem, 8vw, 6rem)' }}
          >
            <span className="block text-white" style={{ opacity: 0 }}>Rent Quality Gear.</span>
            <span className="block text-ember" style={{ opacity: 0 }}>Explore More.</span>
          </h1>

          <p
            ref={subRef}
            className="mt-5 max-w-xl text-sand/90 text-base sm:text-lg leading-relaxed"
            style={{ opacity: 0 }}
          >
            Perlengkapan outdoor premium untuk trekking, camping, hiking, dan setiap petualangan di antaranya.
          </p>

          <div ref={ctaRef} className="mt-8 flex flex-wrap items-center gap-3" style={{ opacity: 0 }}>
            <Button asChild>
              <Link href="/gears" className="group">
                Jelajahi Gear
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/about" className="group">
                <span className="grid place-items-center w-6 h-6 rounded-full bg-white/15 group-hover:bg-white/25 transition-colors">
                  <Play className="w-3 h-3 fill-current" />
                </span>
                Cara Sewa
              </Link>
            </Button>
          </div>

          {/* Value props */}
          <div ref={propsRef} className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-6">
            {VALUE_PROPS.map((v) => (
              <div key={v.title} className="flex items-start gap-3" style={{ opacity: 0 }}>
                <span className="grid place-items-center w-9 h-9 shrink-0 rounded-lg bg-white/10 text-ember">
                  <v.icon className="w-4.5 h-4.5" />
                </span>
                <div>
                  <h3 className="font-display font-semibold uppercase text-sm tracking-wide text-white">{v.title}</h3>
                  <p className="text-xs text-sand/70 leading-snug">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

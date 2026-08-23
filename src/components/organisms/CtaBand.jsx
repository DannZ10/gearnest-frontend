'use client';

import React from 'react';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { Button } from '@/components/ui/button';
import { ArrowRight, Navigation } from 'lucide-react';

export default function CtaBand() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <Reveal className="relative overflow-hidden rounded-xl bg-char text-white px-7 py-14 sm:px-14 sm:py-20 border border-white/10">
        <div className="absolute inset-0 gn-topo opacity-50" />
        <div className="absolute -bottom-28 -left-20 w-[26rem] h-[26rem] rounded-full bg-ember/25 blur-[100px]" />
        <div className="absolute -top-28 -right-16 w-80 h-80 rounded-full bg-trail/25 blur-[90px]" />

        <div className="relative max-w-2xl">
          <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-trail-2 mb-5">
            <Navigation className="w-3 h-3" /> Basecamp menunggu
          </p>
          <h2
            className="font-display font-bold uppercase leading-[0.88] tracking-tight"
            style={{ fontSize: 'clamp(2.5rem, 6.5vw, 5rem)' }}
          >
            Siap Untuk<br /><span className="text-ember">Petualangan?</span>
          </h2>
          <p className="mt-5 text-white/70 max-w-md text-sm sm:text-base leading-relaxed">
            Gear terawat, harga jujur, proses cepat. Kunci perlengkapanmu hari ini dan berangkat tanpa ribet.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/gears" className="group">
                Sewa Sekarang
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/about">Pelajari Cara Sewa</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

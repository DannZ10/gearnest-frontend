'use client';

import React from 'react';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function CtaBand() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <Reveal className="relative overflow-hidden rounded-[2rem] bg-ink text-white px-8 py-14 sm:px-16 sm:py-20 text-center">
        <div className="absolute inset-0 gn-topo opacity-70" />
        <div className="absolute -bottom-24 -left-16 w-80 h-80 rounded-full bg-ember/20 blur-3xl" />
        <div className="relative">
          <h2
            className="font-display font-bold uppercase leading-[0.95] tracking-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            Ready For Your<br /><span className="text-ember">Adventure?</span>
          </h2>
          <p className="mt-4 text-sand/80 max-w-md mx-auto text-sm sm:text-base">
            Gear terawat, harga jujur, proses cepat. Basecamp-mu menunggu.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/gears" className="group">
              Sewa Sekarang
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}

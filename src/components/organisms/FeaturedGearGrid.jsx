'use client';

import React from 'react';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import GearCard from '@/components/molecules/GearCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';

export default function FeaturedGearGrid({ gears, loading, onAddToCart }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <Reveal className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-trail mb-3">// 02 — Arsenal</p>
          <h2 className="font-display font-bold uppercase text-4xl sm:text-5xl leading-[0.9] tracking-tight text-ink">
            Gear Pilihan
          </h2>
        </div>
        <Link href="/gears" className="group inline-flex items-center gap-1.5 text-sm font-display font-semibold uppercase tracking-wide text-ember">
          Lihat Semua
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </Reveal>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-md" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gears.map((gear, i) => (
            <Reveal key={gear.id} delay={(i % 4) * 70}>
              <GearCard gear={gear} onAddToCart={onAddToCart} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}

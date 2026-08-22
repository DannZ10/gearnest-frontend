'use client';

import React from 'react';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import AdventureCard from '@/components/molecules/AdventureCard';
import { ArrowRight, Mountain, Tent, Backpack, MountainSnow } from 'lucide-react';

const IMG = 'https://images.unsplash.com/photo-';
const ADVENTURES = [
  { icon: Mountain, label: 'Hiking', slug: 'hiking', img: `${IMG}1454496522488-7a8e488e8606?w=600&q=80&auto=format&fit=crop` },
  { icon: Tent, label: 'Camping', slug: 'camping', img: `${IMG}1504280390367-361c6d9f38f4?w=600&q=80&auto=format&fit=crop` },
  { icon: Backpack, label: 'Trekking', slug: 'trekking', img: `${IMG}1501555088652-021faa106b9b?w=600&q=80&auto=format&fit=crop` },
  { icon: MountainSnow, label: 'Climbing', slug: 'climbing', img: `${IMG}1522163182402-834f871fd851?w=600&q=80&auto=format&fit=crop` },
];

export default function AdventureGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <Reveal className="flex flex-wrap items-end justify-between gap-6 mb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-trail mb-3">// 01 — Medan</p>
          <h2 className="font-display font-bold uppercase text-4xl sm:text-5xl leading-[0.9] tracking-tight text-ink">
            Pilih<br />Medanmu
          </h2>
        </div>
        <div className="max-w-xs">
          <p className="text-sm text-ink/60 leading-relaxed">
            Dari trek akhir pekan sampai ekspedisi ketinggian — gear yang tepat untuk tiap kontur.
          </p>
          <Link href="/gears" className="group mt-4 inline-flex items-center gap-1.5 text-sm font-display font-semibold uppercase tracking-wide text-ember">
            Jelajahi Semua
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {ADVENTURES.map((a, i) => (
          <Reveal key={a.slug} delay={i * 80}>
            <AdventureCard {...a} index={i + 1} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import AdventureCard from '@/components/molecules/AdventureCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mountain, Tent, Backpack, MountainSnow } from 'lucide-react';

const IMG = 'https://images.unsplash.com/photo-';
const ADVENTURES = [
  { icon: Mountain, label: 'Hiking', slug: 'hiking', img: `${IMG}1454496522488-7a8e488e8606?w=600&q=80&auto=format&fit=crop`, from: 'from-moss', to: 'to-ink' },
  { icon: Tent, label: 'Camping', slug: 'camping', img: `${IMG}1504280390367-361c6d9f38f4?w=600&q=80&auto=format&fit=crop`, from: 'from-bark', to: 'to-ink' },
  { icon: Backpack, label: 'Trekking', slug: 'trekking', img: `${IMG}1501555088652-021faa106b9b?w=600&q=80&auto=format&fit=crop`, from: 'from-ink-2', to: 'to-ink' },
  { icon: MountainSnow, label: 'Climbing', slug: 'climbing', img: `${IMG}1522163182402-834f871fd851?w=600&q=80&auto=format&fit=crop`, from: 'from-sand', to: 'to-bark' },
];

export default function AdventureGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <div className="grid lg:grid-cols-4 gap-8 items-end">
        <Reveal className="lg:col-span-1">
          <h2 className="font-display font-bold uppercase text-3xl sm:text-4xl leading-[0.95] text-ink">
            Gear For<br />Every Adventure
          </h2>
          <div className="w-16 h-1 bg-ember rounded-full my-5" />
          <p className="text-sm text-ink/60 leading-relaxed">
            Dari hiking akhir pekan hingga ekspedisi ketinggian, kami punya gear yang tepat untuk perjalananmu.
          </p>
          <Button variant="link" asChild className="mt-5 p-0 text-ember">
            <Link href="/gears" className="group inline-flex items-center gap-1.5 text-sm font-display font-semibold uppercase tracking-wide">
              Jelajahi Semua
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </Reveal>

        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          {ADVENTURES.map((a, i) => (
            <Reveal key={a.slug} delay={i * 80}>
              <AdventureCard {...a} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

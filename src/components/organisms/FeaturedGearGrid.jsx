'use client';

import React from 'react';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import GearCard from '@/components/molecules/GearCard';
import SectionHeading from '@/components/atoms/SectionHeading';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function FeaturedGearGrid({ gears, loading, onAddToCart }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <Reveal className="flex items-end justify-between mb-8">
        <SectionHeading
          title="Featured Gear"
          subtitle="Peralatan paling populer & sering disewa"
        />
        <Button variant="link" asChild className="hidden sm:inline-flex p-0 text-ember">
          <Link href="/gears" className="group inline-flex items-center gap-1.5 text-sm font-display font-semibold uppercase tracking-wide">
            Lihat Semua
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </Reveal>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

'use client';

import React from 'react';
import CountUp from '@/components/atoms/CountUp';

const STATS = [
  { value: 200, suffix: '+', label: 'Gear Premium', tint: 'text-ember' },
  { value: 50, suffix: '+', label: 'Titik Destinasi', tint: 'text-trail-2' },
  { value: 10, suffix: 'K+', label: 'Penyewa Terlayani', tint: 'text-ember' },
  { value: 4.9, decimals: 1, suffix: '/5', label: 'Rating Pendaki', tint: 'text-trail-2' },
];

// Bold "by the numbers" band — count-up numerals on a dark expedition block.
export default function StatsBar() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <div className="relative overflow-hidden rounded-xl bg-char text-white border border-white/10">
        <div className="absolute inset-0 gn-gridlines opacity-50" />
        <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-trail/25 blur-[90px]" />

        <div className="relative px-6 py-9 sm:px-10 sm:py-11">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-mono text-xs text-trail-2">// STATISTIK LAPANGAN</span>
            <span className="flex-1 h-px bg-white/10" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4 divide-white/10 lg:divide-x">
            {STATS.map((s, i) => (
              <div key={s.label} className="lg:px-6 first:lg:pl-0">
                <span className="font-mono text-[10px] text-white/40">0{i + 1}</span>
                <p className={`font-display font-bold text-5xl sm:text-6xl leading-none mt-1 ${s.tint}`}>
                  <CountUp value={s.value} decimals={s.decimals || 0} suffix={s.suffix} />
                </p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/55">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

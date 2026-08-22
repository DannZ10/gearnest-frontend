'use client';

import React from 'react';
import Reveal from '@/components/Reveal';
import { Search, CalendarClock, CreditCard, Mountain } from 'lucide-react';

const STEPS = [
  { n: '01', icon: Search, title: 'Pilih Gear', desc: 'Telusuri katalog — tenda, carrier, sampai gear teknis.' },
  { n: '02', icon: CalendarClock, title: 'Atur Jadwal', desc: 'Tentukan tanggal sewa & metode antar / pickup.' },
  { n: '03', icon: CreditCard, title: 'Bayar Instan', desc: 'QRIS, transfer bank, atau e-wallet via Midtrans.' },
  { n: '04', icon: Mountain, title: 'Berangkat', desc: 'Ambil gear steril dan taklukkan medanmu.' },
];

export default function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <Reveal className="mb-10">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-trail mb-3">// 03 — Prosedur</p>
        <h2 className="font-display font-bold uppercase text-4xl sm:text-5xl leading-[0.9] tracking-tight text-ink">
          Empat Langkah Ke Lapangan
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-4 border-t-2 border-ink/15">
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 90}>
            <div className="group relative h-full p-6 md:border-r-2 border-b-2 md:border-b-0 border-ink/10 last:border-r-0 hover:bg-white transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-6xl leading-none text-ink/12 gn-stroke group-hover:text-ember/70 transition-colors">
                  {s.n}
                </span>
                <span className="grid place-items-center w-11 h-11 rounded-md bg-ink text-ember shrink-0">
                  <s.icon className="w-5 h-5" strokeWidth={2} />
                </span>
              </div>
              <h3 className="mt-6 font-display font-bold uppercase text-xl text-ink tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm text-ink/60 leading-relaxed">{s.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

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
          Alur Penyewaan
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 md:gap-4">
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 90}>
            <div className="group h-full rounded-md border-2 border-ink/10 bg-white p-6 hover:border-ember transition-colors flex flex-col gap-4">
              <span className="grid place-items-center w-11 h-11 rounded-md bg-ember/10 text-ember border border-ember/15 shrink-0 group-hover:bg-ember group-hover:text-white transition-colors">
                <s.icon className="w-5 h-5" strokeWidth={2} />
              </span>
              <div>
                <h3 className="font-display font-bold uppercase text-xl text-ink tracking-tight group-hover:text-ember transition-colors">
                  <span className="text-ember">{s.n}.</span> {s.title}
                </h3>
                <p className="mt-2 text-sm text-ink/60 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

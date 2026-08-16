'use client';

import React from 'react';
import Reveal from '@/components/Reveal';
import StepCard from '@/components/molecules/StepCard';
import SectionHeading from '@/components/atoms/SectionHeading';

const STEPS = [
  { n: '1', title: 'Pilih Peralatan', desc: 'Pilih tenda, carrier, atau perlengkapan dari katalog.' },
  { n: '2', title: 'Atur Tanggal & Delivery', desc: 'Tentukan tanggal sewa dan opsi antar / pickup.' },
  { n: '3', title: 'Bayar Otomatis', desc: 'Bayar instan via QRIS, Transfer, atau E-Wallet.' },
  { n: '4', title: 'Siap Berpetualang!', desc: 'Ambil gear bersih dan nikmati petualanganmu.' },
];

export default function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <Reveal>
        <SectionHeading
          title="How It Works"
          subtitle="4 langkah mudah memulai petualangan outdoor-mu"
          center
          className="mb-12"
        />
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 90}>
            <StepCard number={s.n} title={s.title} description={s.desc} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

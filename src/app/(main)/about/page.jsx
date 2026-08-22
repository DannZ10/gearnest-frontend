import React from 'react';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import {
  Search, CalendarCheck, CreditCard, Mountain, ShieldCheck, Truck, Store, ArrowRight,
} from 'lucide-react';

export const metadata = {
  title: 'Cara Sewa — GearNest',
  description: 'Cara menyewa alat outdoor di GearNest: pilih gear, atur jadwal & pengiriman, bayar otomatis, lalu berpetualang.',
};

const STEPS = [
  { icon: Search, n: '1', title: 'Pilih Peralatan', desc: 'Telusuri katalog, cari berdasarkan kategori atau nama, lalu masukkan gear ke keranjang.' },
  { icon: CalendarCheck, n: '2', title: 'Atur Jadwal & Delivery', desc: 'Tentukan tanggal mulai dan selesai sewa, pilih ambil sendiri (pickup) atau layanan antar.' },
  { icon: CreditCard, n: '3', title: 'Bayar Otomatis', desc: 'Bayar instan lewat Midtrans — QRIS, transfer bank, atau e-wallet. Booking langsung terkonfirmasi.' },
  { icon: Mountain, n: '4', title: 'Siap Berpetualang', desc: 'Ambil atau terima gear yang bersih dan terawat, nikmati perjalananmu, lalu kembalikan tepat waktu.' },
];

const FAQ = [
  ['Apakah gear-nya bersih dan terawat?', 'Ya. Setiap alat dibersihkan, dicek kelengkapannya, dan diperiksa kondisinya sebelum disewakan.'],
  ['Bagaimana jaminan identitasnya?', 'Kamu cukup membawa 1 dokumen identitas asli (KTP/SIM/Paspor) saat serah terima. Dokumen dikembalikan utuh saat gear selesai disewa.'],
  ['Berapa biaya pengiriman?', 'Pickup di basecamp gratis. Layanan antar dikenakan Rp 10.000 + Rp 3.000/km sesuai jarak.'],
  ['Bagaimana jika ingin membatalkan?', 'Booking berstatus pending bisa dibatalkan. Stok otomatis dikembalikan ke katalog saat pembatalan.'],
];

export default function AboutPage() {
  return (
    <div>
      {/* Header band */}
      <section className="relative overflow-hidden bg-ink text-white gn-gridlines">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-ember/20 blur-3xl pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <Reveal className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-trail-2">
            <Mountain className="w-3.5 h-3.5 text-ember" /> // Panduan Sewa
          </Reveal>
          <Reveal as="h1" delay={80} className="mt-5 font-display font-bold uppercase leading-[0.95] tracking-tight"
            style={{ fontSize: 'clamp(2.25rem, 6vw, 4rem)' }}>
            Cara Sewa di <span className="text-ember">GearNest</span>
          </Reveal>
          <Reveal as="p" delay={140} className="mt-4 max-w-xl mx-auto text-sand/85 text-sm sm:text-base">
            Empat langkah mudah dari memilih gear sampai siap berangkat. Tanpa ribet, gear terawat, harga jujur.
          </Reveal>
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 90}>
              <div className="h-full bg-white border-2 border-ink/10 rounded-md p-6 hover:-translate-y-1 transition-transform">
                <div className="flex items-center justify-between">
                  <span className="grid place-items-center w-12 h-12 rounded-md bg-ink text-ember">
                    <s.icon className="w-5 h-5" />
                  </span>
                  <span className="font-display font-bold text-5xl leading-none text-ink/15 gn-stroke">{s.n}</span>
                </div>
                <h3 className="font-display font-semibold uppercase tracking-wide text-ink text-base mt-4">{s.title}</h3>
                <p className="text-xs text-ink/60 mt-1.5 leading-relaxed">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Delivery + Identity */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Reveal className="bg-white border-2 border-ink/10 rounded-md p-7 space-y-4">
            <h2 className="font-display font-bold uppercase text-xl text-ink flex items-center gap-2">
              <Truck className="w-5 h-5 text-ember" /> Pengambilan & Pengiriman
            </h2>
            <div className="flex items-start gap-3">
              <Store className="w-5 h-5 text-moss mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-ink text-sm">Ambil Mandiri (Pickup) — Gratis</h4>
                <p className="text-xs text-ink/60">Ambil dan kembalikan gear langsung di basecamp GearNest.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-ember mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-ink text-sm">Layanan Antar</h4>
                <p className="text-xs text-ink/60">Diantar ke lokasimu. Biaya Rp 10.000 + Rp 3.000/km sesuai jarak.</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={80} className="bg-white border-2 border-ink/10 rounded-md p-7 space-y-3">
            <h2 className="font-display font-bold uppercase text-xl text-ink flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-ember" /> Jaminan Identitas
            </h2>
            <p className="text-sm text-ink/70 leading-relaxed">
              Sebagai syarat persewaan, kamu wajib membawa & menyerahkan 1 dokumen identitas asli
              (KTP / SIM / Paspor) saat serah terima gear. Dokumen disimpan aman dan dikembalikan
              utuh saat peralatan selesai disewa dan dikembalikan dalam kondisi baik.
            </p>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <Reveal className="text-center mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-trail mb-2">// Tanya Jawab</p>
          <h2 className="font-display font-bold uppercase text-4xl tracking-tight text-ink">FAQ</h2>
        </Reveal>
        <div className="space-y-3">
          {FAQ.map(([q, a], i) => (
            <Reveal key={q} delay={i * 60}>
              <details className="group bg-white border-2 border-ink/10 rounded-md p-5">
                <summary className="cursor-pointer font-semibold text-ink text-sm list-none flex items-center justify-between">
                  {q}
                  <ArrowRight className="w-4 h-4 text-ember transition-transform group-open:rotate-90" />
                </summary>
                <p className="text-xs text-ink/60 mt-2.5 leading-relaxed">{a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <Reveal className="relative overflow-hidden rounded-xl bg-ink text-white px-8 py-12 sm:px-16 text-center gn-gridlines">
          <div className="absolute -bottom-24 -left-16 w-80 h-80 rounded-full bg-ember/20 blur-3xl" />
          <div className="relative">
            <h2 className="font-display font-bold uppercase text-2xl sm:text-3xl">Siap sewa gear pertamamu?</h2>
            <p className="mt-3 text-sand/80 text-sm">Katalog lengkap menunggu. Pilih, atur tanggal, dan berangkat.</p>
            <Link href="/gears"
              className="group inline-flex items-center gap-2 mt-6 px-7 py-3.5 bg-ember hover:bg-ember-2 text-white font-display font-semibold uppercase tracking-wide rounded-md shadow-lg shadow-ember/30 transition-all">
              Jelajahi Gear <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

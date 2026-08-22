import React from 'react';
import Link from 'next/link';
import { Mountain, ShieldCheck, Truck, Headphones } from 'lucide-react';

const FEATURES = [
  { icon: ShieldCheck, title: 'Alat Terawat & Steril', desc: 'Semua gear dibersihkan & dicek sebelum disewa.' },
  { icon: Truck, title: 'Antar / Pickup', desc: 'Pilih pengiriman ke lokasimu atau ambil sendiri.' },
  { icon: Headphones, title: 'Dukungan 24/7', desc: 'Tim siap bantu konsultasi pendakian & peralatan.' },
];

export default function Footer() {
  return (
    <footer className="relative bg-char text-white/80 mt-24 overflow-hidden">
      <div className="absolute inset-0 gn-gridlines opacity-40" />

      {/* Feature highlights */}
      <div className="relative border-b-2 border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-3">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="flex items-center gap-4 p-4 rounded-md bg-white/5 border-2 border-white/10">
              <div className={`grid place-items-center w-12 h-12 shrink-0 rounded-md ${i === 1 ? 'bg-trail/15 text-trail-2' : 'bg-ember/15 text-ember'}`}>
                <f.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display font-bold text-white text-sm uppercase tracking-tight">{f.title}</h4>
                <p className="text-xs text-white/60">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main links */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <Link href="/" className="flex items-center gap-2.5 mb-4 group">
            <span className="grid place-items-center w-10 h-10 rounded-md bg-ember text-char group-hover:-translate-y-0.5 transition-transform">
              <Mountain className="w-5 h-5" strokeWidth={2.5} />
            </span>
            <span className="font-display font-bold text-xl tracking-wide text-white">
              GEAR<span className="text-ember">NEST</span>
            </span>
          </Link>
          <p className="text-xs text-white/60 leading-relaxed mb-4 max-w-xs">
            Basecamp tepercaya untuk gear terawat dan petualangan tak terlupakan. Proses mudah, pembayaran otomatis Midtrans.
          </p>
          <p className="font-mono text-[11px] text-white/40">© 2026 GearNest. All rights reserved.</p>
        </div>

        <FooterCol
          title="Navigasi"
          links={[
            ['Beranda', '/'],
            ['Katalog Gear', '/gears'],
            ['Kategori', '/categories'],
            ['Keranjang', '/cart'],
          ]}
        />
        <FooterCol
          title="Layanan"
          links={[
            ['Cara Sewa', '/about'],
            ['Jaminan Identitas', '/about'],
            ['Biaya Delivery', '/about'],
            ['Portal Member', '/login'],
          ]}
        />

        <div>
          <h4 className="font-display font-bold text-white text-sm uppercase tracking-tight mb-4">Pembayaran</h4>
          <p className="text-xs text-white/60 mb-3">Otomatis via Midtrans Snap — Bank Transfer, QRIS, & E-Wallet.</p>
          <div className="flex flex-wrap gap-2 font-mono text-[10px] font-bold text-white/70">
            {['BCA', 'Mandiri', 'BNI', 'BRI', 'QRIS', 'Gopay'].map((m) => (
              <span key={m} className="px-2 py-1 bg-white/5 border border-white/10 rounded-sm">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative border-t-2 border-white/10 py-5 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
          Your Gear. Your Nest. Your Adventure.
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="font-display font-bold text-white text-sm uppercase tracking-tight mb-4">{title}</h4>
      <ul className="space-y-2.5 text-xs">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="text-white/60 hover:text-ember transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

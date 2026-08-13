import React from 'react';
import Link from 'next/link';
import { Mountain, ShieldCheck, Truck, Headphones, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 mt-20">
      {/* Top Banner Feature Highlights */}
      <div className="border-b border-slate-900 bg-slate-900/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/50">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Alat Terawat & Steril</h4>
              <p className="text-xs text-slate-400">Semua gear dibersihkan & di-cek sebelum disewa.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/50">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Antar / Pickup</h4>
              <p className="text-xs text-slate-400">Pilih pengiriman ke rumah atau ambil sendiri.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/50">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Dukungan 24/7</h4>
              <p className="text-xs text-slate-400">Tim siap bantu konsultasi pendakian & peralatan.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-emerald-400 mb-4">
            <Mountain className="w-6 h-6 text-emerald-400" />
            <span className="text-white">GearNest</span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Platform persewaan alat outdoor premium & perlengkapan gunung terlengkap dengan proses mudah dan pembayaran otomatis Midtrans.
          </p>
          <p className="text-xs text-slate-500">© 2026 GearNest Inc. All rights reserved.</p>
        </div>

        <div>
          <h4 className="font-semibold text-white text-sm mb-4">Navigasi Utama</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/" className="hover:text-emerald-400 transition-colors">Beranda</Link></li>
            <li><Link href="/gears" className="hover:text-emerald-400 transition-colors">Katalog Alat Outdoor</Link></li>
            <li><Link href="/categories" className="hover:text-emerald-400 transition-colors">Kategori Peralatan</Link></li>
            <li><Link href="/cart" className="hover:text-emerald-400 transition-colors">Keranjang Sewa</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white text-sm mb-4">Layanan Pelanggan</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/about" className="hover:text-emerald-400 transition-colors">Syarat & Ketentuan Sewa</Link></li>
            <li><Link href="/about" className="hover:text-emerald-400 transition-colors">Jaminan Identitas</Link></li>
            <li><Link href="/about" className="hover:text-emerald-400 transition-colors">Informasi Biaya Delivery</Link></li>
            <li><Link href="/login" className="hover:text-emerald-400 transition-colors">Portal Masuk Member</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white text-sm mb-4">Metode Pembayaran</h4>
          <p className="text-xs text-slate-400 mb-3">Mendukung semua pembayaran otomatis via Midtrans Snap (Bank Transfer, QRIS, E-Wallet).</p>
          <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-300">
            <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">BCA</span>
            <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">Mandiri</span>
            <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">BNI</span>
            <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">BRI</span>
            <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">QRIS</span>
            <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">Gopay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

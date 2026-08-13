'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/axios';
import { formatRupiah } from '@/lib/format';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';
import { Mountain, Compass, ShieldCheck, ArrowRight, Star, ShoppingBag, CheckCircle, Flame } from 'lucide-react';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featuredGears, setFeaturedGears] = useState([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, gearRes] = await Promise.all([
          api.get('/categories'),
          api.get('/gears?limit=8'),
        ]);
        setCategories(catRes.data.data || []);
        setFeaturedGears(gearRes.data.data || []);
      } catch (err) {
        console.error('Failed fetching home data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleAddToCart = (gear) => {
    addItem(gear, 1);
    toast.success(`${gear.name} telah ditambahkan ke keranjang!`);
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 pt-20 pb-28 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide">
              <Flame className="w-4 h-4" /> Rental Gear Gunung & Outdoor Terlengkap
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Sewa Perlengkapan Gunung Premium Tanpa Ribet
            </h1>

            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              Tenda ultralight, carrier ergonomis, kompor portable, hingga sleeping bag suhu dingin. Bersih, terawat, dan siap mengiringi petualangan Anda.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/gears"
                className="px-6 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                Eksplor Katalog Gear <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/categories"
                className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition-all"
              >
                Lihat 14 Kategori
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Kategori Peralatan</h2>
            <p className="text-sm text-slate-400">Pilih kategori perlengkapan sesuai kebutuhan pendakian</p>
          </div>
          <Link href="/categories" className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1">
            Lihat Semua <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-28 bg-slate-900 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.slice(0, 7).map((cat) => (
              <Link
                key={cat.id}
                href={`/gears?category=${cat.slug}`}
                className="group p-4 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 rounded-2xl transition-all text-center flex flex-col items-center justify-center gap-2"
              >
                <div className="p-3 bg-emerald-500/10 text-emerald-400 group-hover:scale-110 rounded-xl transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">
                  {cat.name}
                </span>
                <span className="text-[10px] text-slate-500">{cat.gears_count || 0} unit</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Gear Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Katalog Pilihan</h2>
            <p className="text-sm text-slate-400">Peralatan paling populer dan paling sering disewa</p>
          </div>
          <Link href="/gears" className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1">
            Lihat Semua Katalog <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-slate-900 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGears.map((gear) => (
              <div
                key={gear.id}
                className="group bg-slate-900/80 border border-slate-800 hover:border-emerald-500/30 rounded-3xl overflow-hidden flex flex-col transition-all hover:shadow-xl hover:shadow-emerald-500/5"
              >
                {/* Image Placeholder / Unsplash */}
                <div className="relative h-48 bg-slate-800 overflow-hidden">
                  <img
                    src={gear.image_url || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&auto=format&fit=crop&q=80'}
                    alt={gear.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700 text-[10px] font-bold text-emerald-400">
                    {gear.brand || 'Outdoor'}
                  </div>
                  <div className="absolute top-3 right-3 bg-emerald-500/20 text-emerald-300 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-semibold border border-emerald-500/30">
                    Stok: {gear.stock_available}
                  </div>
                </div>

                {/* Info Content */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-white text-base line-clamp-1 group-hover:text-emerald-400 transition-colors">
                      {gear.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                      {gear.description || 'Peralatan outdoor berkualitas tinggi.'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Sewa / Hari</span>
                      <span className="font-extrabold text-emerald-400 text-sm">
                        {formatRupiah(gear.price_per_day)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(gear)}
                      className="p-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded-xl transition-all shadow-md shadow-emerald-500/10 active:scale-95"
                      title="Tambah ke Keranjang"
                    >
                      <ShoppingBag className="w-4 h-4 font-bold" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 sm:p-12">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Cara Sewa di GearNest</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">4 Langkah mudah untuk memulai petualangan outdoor Anda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="space-y-3 text-center">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 font-extrabold rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/20 text-lg">
                1
              </div>
              <h4 className="font-bold text-white text-sm">Pilih Peralatan</h4>
              <p className="text-xs text-slate-400">Pilih tenda, carrier, atau perlengkapan dari katalog kami.</p>
            </div>

            <div className="space-y-3 text-center">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 font-extrabold rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/20 text-lg">
                2
              </div>
              <h4 className="font-bold text-white text-sm">Atur Tanggal & Delivery</h4>
              <p className="text-xs text-slate-400">Tentukan tanggal sewa dan opsi pengiriman / pickup.</p>
            </div>

            <div className="space-y-3 text-center">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 font-extrabold rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/20 text-lg">
                3
              </div>
              <h4 className="font-bold text-white text-sm">Bayar Otomatis</h4>
              <p className="text-xs text-slate-400">Bayar instan via QRIS, Bank Transfer, atau E-Wallet Midtrans.</p>
            </div>

            <div className="space-y-3 text-center">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 font-extrabold rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/20 text-lg">
                4
              </div>
              <h4 className="font-bold text-white text-sm">Siap Naik Gunung!</h4>
              <p className="text-xs text-slate-400">Ambil/terima gear bersih dan nikmati petualangan Anda.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

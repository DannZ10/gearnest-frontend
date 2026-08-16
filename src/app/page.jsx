'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { formatRupiah } from '@/lib/format';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';
import Reveal from '@/components/Reveal';
import {
  ArrowRight, Play, ShieldCheck, Mountain, Leaf, Compass,
  Backpack, MapPin, Users, Star, Tent, MountainSnow, ShoppingBag,
} from 'lucide-react';

const VALUE_PROPS = [
  { icon: ShieldCheck, title: 'Andal', desc: 'Gear berkualitas yang bisa dipercaya' },
  { icon: Mountain, title: 'Petualang', desc: 'Dibuat untuk setiap perjalanan' },
  { icon: Leaf, title: 'Rapi', desc: 'Semua tertata, setiap saat' },
  { icon: Compass, title: 'Siap', desc: 'Siap untuk apa pun' },
];

const STATS = [
  { icon: Backpack, value: '200+', label: 'Gear Premium' },
  { icon: MapPin, value: '50+', label: 'Destinasi Petualangan' },
  { icon: Users, value: '10K+', label: 'Penyewa Bahagia' },
  { icon: Star, value: '4.9/5', label: 'Rating Pelanggan' },
];

// Free commercial-use photos (Unsplash). Gracefully fall back to the gradient if a URL fails.
const IMG = 'https://images.unsplash.com/photo-';
const ADVENTURES = [
  { icon: Mountain, label: 'Hiking', slug: 'hiking', img: `${IMG}1454496522488-7a8e488e8606?w=600&q=80&auto=format&fit=crop`, from: 'from-moss', to: 'to-ink' },
  { icon: Tent, label: 'Camping', slug: 'camping', img: `${IMG}1504280390367-361c6d9f38f4?w=600&q=80&auto=format&fit=crop`, from: 'from-bark', to: 'to-ink' },
  { icon: Backpack, label: 'Trekking', slug: 'trekking', img: `${IMG}1501555088652-021faa106b9b?w=600&q=80&auto=format&fit=crop`, from: 'from-ink-2', to: 'to-ink' },
  { icon: MountainSnow, label: 'Climbing', slug: 'climbing', img: `${IMG}1522163182402-834f871fd851?w=600&q=80&auto=format&fit=crop`, from: 'from-sand', to: 'to-bark' },
];

const STEPS = [
  { n: '1', title: 'Pilih Peralatan', desc: 'Pilih tenda, carrier, atau perlengkapan dari katalog.' },
  { n: '2', title: 'Atur Tanggal & Delivery', desc: 'Tentukan tanggal sewa dan opsi antar / pickup.' },
  { n: '3', title: 'Bayar Otomatis', desc: 'Bayar instan via QRIS, Transfer, atau E-Wallet.' },
  { n: '4', title: 'Siap Berpetualang!', desc: 'Ambil gear bersih dan nikmati petualanganmu.' },
];

export default function HomePage() {
  const [featuredGears, setFeaturedGears] = useState([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function fetchData() {
      try {
        const gearRes = await api.get('/gears?limit=8');
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
    toast.success(`${gear.name} ditambahkan ke keranjang!`);
  };

  return (
    <div>
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden bg-ink text-white">
        {/* Hero photo at /public/hero.png; falls back to gradient if missing */}
        <img
          src="/hero.png"
          alt=""
          aria-hidden="true"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="absolute inset-0 w-full h-full object-cover opacity-45 gn-kenburns"
        />
        <div className="absolute inset-0 gn-topo opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-ember/20 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-24">
          <div className="max-w-3xl">
            <Reveal className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-moss/40 border border-white/10 backdrop-blur-sm">
              <Mountain className="w-3.5 h-3.5 text-ember" />
              <span className="text-[11px] font-display font-semibold uppercase tracking-[0.15em] text-white">
                Your Basecamp For Adventure
              </span>
            </Reveal>

            <Reveal
              as="h1"
              delay={80}
              className="mt-6 font-display font-bold uppercase leading-[0.92] tracking-tight"
              style={{ fontSize: 'clamp(2.75rem, 8vw, 6rem)' }}
            >
              <span className="block text-white">Rent Quality Gear.</span>
              <span className="block text-ember">Explore More.</span>
            </Reveal>

            <Reveal as="p" delay={160} className="mt-5 max-w-xl text-sand/90 text-base sm:text-lg leading-relaxed">
              Perlengkapan outdoor premium untuk trekking, camping, hiking, dan setiap petualangan di antaranya.
            </Reveal>

            <Reveal delay={220} className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/gears"
                className="group inline-flex items-center gap-2 px-6 py-3.5 bg-ember hover:bg-ember-2 text-white font-display font-semibold uppercase tracking-wide rounded-xl shadow-lg shadow-ember/30 transition-all"
              >
                Jelajahi Gear
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/about"
                className="group inline-flex items-center gap-2.5 px-6 py-3.5 border border-white/25 hover:border-white/60 text-white font-display font-semibold uppercase tracking-wide rounded-xl transition-all"
              >
                <span className="grid place-items-center w-6 h-6 rounded-full bg-white/15 group-hover:bg-white/25 transition-colors">
                  <Play className="w-3 h-3 fill-current" />
                </span>
                Cara Sewa
              </Link>
            </Reveal>

            {/* Value props */}
            <Reveal delay={300} className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-6">
              {VALUE_PROPS.map((v) => (
                <div key={v.title} className="flex items-start gap-3">
                  <span className="grid place-items-center w-9 h-9 shrink-0 rounded-lg bg-white/10 text-ember">
                    <v.icon className="w-4.5 h-4.5" />
                  </span>
                  <div>
                    <h3 className="font-display font-semibold uppercase text-sm tracking-wide text-white">{v.title}</h3>
                    <p className="text-xs text-sand/70 leading-snug">{v.desc}</p>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================ STATS ============================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="-mt-10 relative z-10 rounded-3xl bg-ink-2 gn-topo border border-white/10 shadow-xl shadow-ink/20 px-6 py-8 sm:px-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="flex items-center gap-3.5">
              <span className="grid place-items-center w-11 h-11 shrink-0 rounded-xl bg-ember/15 text-ember">
                <s.icon className="w-5 h-5" />
              </span>
              <div>
                <p className="font-display font-bold text-2xl sm:text-3xl text-ember leading-none">{s.value}</p>
                <p className="text-[11px] uppercase tracking-wide text-sand/70 mt-1">{s.label}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ===================== ADVENTURE CATEGORIES ===================== */}
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
            <Link href="/gears" className="group inline-flex items-center gap-1.5 mt-5 text-sm font-display font-semibold uppercase tracking-wide text-ember">
              Jelajahi Semua
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            {ADVENTURES.map((a, i) => (
              <Reveal key={a.slug} delay={i * 80}>
                <Link
                  href={`/gears?category=${a.slug}`}
                  className={`group relative block h-56 rounded-3xl overflow-hidden border border-ink/10 bg-gradient-to-b ${a.from} ${a.to}`}
                >
                  <img
                    src={a.img}
                    alt=""
                    aria-hidden="true"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/40 to-ink/10" />
                  <div className="absolute inset-0 gn-topo opacity-40" />
                  <a.icon className="absolute top-5 left-5 w-8 h-8 text-white/90" strokeWidth={1.75} />
                  <div className="absolute bottom-0 inset-x-0 p-5 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Gear</p>
                      <h3 className="font-display font-bold uppercase text-xl text-white leading-tight">{a.label}</h3>
                    </div>
                    <span className="grid place-items-center w-9 h-9 rounded-full bg-white/15 group-hover:bg-ember text-white transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= FEATURED GEAR ======================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <Reveal className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display font-bold uppercase text-3xl sm:text-4xl text-ink leading-none">Featured Gear</h2>
            <div className="w-16 h-1 bg-ember rounded-full mt-3" />
            <p className="text-sm text-ink/60 mt-3">Peralatan paling populer & sering disewa</p>
          </div>
          <Link href="/gears" className="group hidden sm:inline-flex items-center gap-1.5 text-sm font-display font-semibold uppercase tracking-wide text-ember">
            Lihat Semua
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-bone-2 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGears.map((gear, i) => (
              <Reveal key={gear.id} delay={(i % 4) * 70}>
                <div className="group h-full bg-white border border-ink/10 hover:border-ember/40 rounded-3xl overflow-hidden flex flex-col transition-all hover:shadow-xl hover:shadow-ink/5">
                  <div className="relative h-44 bg-bone-2 overflow-hidden">
                    <img
                      src={gear.image_url || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&auto=format&fit=crop&q=80'}
                      alt={gear.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-ink/85 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-ember">
                      {gear.brand || 'Outdoor'}
                    </span>
                    <span className="absolute top-3 right-3 bg-moss/90 text-white backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-semibold">
                      Stok: {gear.stock_available}
                    </span>
                  </div>

                  <div className="p-5 flex-grow flex flex-col justify-between gap-4">
                    <div>
                      <h3 className="font-display font-semibold text-ink text-base uppercase tracking-wide line-clamp-1 group-hover:text-ember transition-colors">
                        {gear.name}
                      </h3>
                      <p className="text-xs text-ink/55 line-clamp-2 mt-1">
                        {gear.description || 'Peralatan outdoor berkualitas tinggi.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-ink/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-ink/50 block">Sewa / Hari</span>
                        <span className="font-display font-bold text-ink text-lg">{formatRupiah(gear.price_per_day)}</span>
                      </div>
                      <button
                        onClick={() => handleAddToCart(gear)}
                        className="p-3 bg-ember hover:bg-ember-2 text-white rounded-xl transition-all shadow-md shadow-ember/20 active:scale-95"
                        title="Tambah ke Keranjang"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* ======================= HOW IT WORKS ======================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <Reveal className="text-center max-w-xl mx-auto mb-12">
          <h2 className="font-display font-bold uppercase text-3xl sm:text-4xl text-ink">How It Works</h2>
          <div className="w-16 h-1 bg-ember rounded-full mx-auto mt-3" />
          <p className="text-sm text-ink/60 mt-3">4 langkah mudah memulai petualangan outdoor-mu</p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 90}>
              <div className="h-full bg-white border border-ink/10 rounded-3xl p-6 hover:-translate-y-1 transition-transform">
                <span className="grid place-items-center w-12 h-12 rounded-2xl bg-ink text-ember font-display font-bold text-xl">
                  {s.n}
                </span>
                <h4 className="font-display font-semibold uppercase tracking-wide text-ink text-base mt-4">{s.title}</h4>
                <p className="text-xs text-ink/60 mt-1.5 leading-relaxed">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ========================= CTA BAND ========================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-ink text-white px-8 py-14 sm:px-16 sm:py-20 text-center">
          <div className="absolute inset-0 gn-topo opacity-70" />
          <div className="absolute -bottom-24 -left-16 w-80 h-80 rounded-full bg-ember/20 blur-3xl" />
          <div className="relative">
            <h2 className="font-display font-bold uppercase leading-[0.95] tracking-tight" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              Ready For Your<br /><span className="text-ember">Adventure?</span>
            </h2>
            <p className="mt-4 text-sand/80 max-w-md mx-auto text-sm sm:text-base">
              Gear terawat, harga jujur, proses cepat. Basecamp-mu menunggu.
            </p>
            <Link
              href="/gears"
              className="group inline-flex items-center gap-2 mt-8 px-8 py-4 bg-ember hover:bg-ember-2 text-white font-display font-semibold uppercase tracking-wide rounded-xl shadow-lg shadow-ember/30 transition-all"
            >
              Sewa Sekarang
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

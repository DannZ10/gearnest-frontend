'use client';

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { useReveal, rupiah } from '@/lib/useReveal';
import GearCard from '@/components/organisms/GearCard';
import GearDetailModal from '@/components/organisms/GearDetailModal';
import {
  ArrowRight, Search, Tent, Mountain, CookingPot, Flashlight,
  Truck, Store, Package, RotateCcw, ChevronLeft, ChevronRight, Plus, Minus,
  MapPin, Star, ChevronDown, CalendarDays,
} from 'lucide-react';

/* ---------------- Static content (curated, per design) ---------------- */
const MACRO_CATS = [
  { icon: Mountain, title: 'Muncak & Trek', desc: 'Carrier, sepatu gunung, jaket, dan trekking pole untuk pendakian.', from: 'Mulai Rp 15.000/hari' },
  { icon: Tent, title: 'Camp & Stay', desc: 'Tenda dome, sleeping bag, dan matras untuk istirahat nyaman.', from: 'Mulai Rp 12.000/hari' },
  { icon: CookingPot, title: 'Camp Kitchen', desc: 'Kompor gas, nesting set, dan peralatan masak untuk makan hangat.', from: 'Mulai Rp 18.000/hari' },
  { icon: Flashlight, title: 'Light & Safety', desc: 'Headlamp, lentera, dan perlengkapan keselamatan untuk malam hari.', from: 'Mulai Rp 10.000/hari' },
];

const STEPS = [
  { n: '01', img: '/img/carrier.webp', title: 'Pilih Gear & Tanggal', desc: 'Telusuri katalog, cek ketersediaan real-time, dan tentukan tanggal sewa.' },
  { n: '02', img: '/img/kompor.webp', title: 'Booking & Bayar', desc: 'Pilih pickup gratis atau delivery. Bayar online atau di tempat via WhatsApp.' },
  { n: '03', img: '/img/tenda-dome.webp', title: 'Ambil atau Diantar', desc: 'Serahkan 2 kartu identitas saat pengambilan, atau tunggu gear diantar.' },
  { n: '04', img: '/img/hero.webp', title: 'Kembalikan & Selesai', desc: 'Kembalikan sesuai tanggal, gear dicek bersama, dan selesai.' },
];

const MARQUEE = ['Gunung Semeru', 'Gunung Rinjani', 'Gunung Merbabu', 'Gunung Ijen', 'Gunung Papandayan', 'Ranu Kumbolo', 'Pantai Pacitan', 'Dieng Plateau'];

const REVIEWS = [
  { name: 'Rizky Pratama', role: 'Pendakian Gunung Semeru', text: 'Gear-nya bersih dan terawat. Proses sewa gampang banget, tinggal pilih tanggal langsung dapat kode booking. Recommended!' },
  { name: 'Sinta Maharani', role: 'Camping Ranu Kumbolo', text: 'Baru pertama kali camping, tim Kembara sabar banget ngarahin pilih perlengkapan. Antar ke lokasi juga tepat waktu.' },
  { name: 'Andi Wijaya', role: 'Trekking Ijen', text: 'Harga transparan, tidak ada biaya tersembunyi. Kalkulator ongkirnya sangat membantu perencanaan biaya perjalanan.' },
  { name: 'Dewi Lestari', role: 'Camping Pantai Pacitan', text: 'Tenda dan sleeping bag kualitasnya melebihi ekspektasi. Jaminan identitas jelas, jadi merasa aman selama sewa.' },
  { name: 'Bima Saputra', role: 'Pendakian Gunung Merbabu', text: 'Sudah langganan tiga kali. Admin responsif di WhatsApp, dan stok di website selalu akurat real-time.' },
];

const FAQS = [
  { q: 'Apa saja jaminan yang dibutuhkan saat menyewa?', a: 'Saat pengambilan gear, kamu wajib menyerahkan minimal 2 kartu identitas asli (KTP, SIM, atau Kartu Mahasiswa) sebagai jaminan fisik. Kartu dikembalikan saat gear sudah dikembalikan dan dicek bersama.' },
  { q: 'Bagaimana cara melakukan pembayaran?', a: 'Kamu bisa membayar online melalui transfer bank, QRIS, atau e-wallet. Untuk pengambilan langsung (pickup), tersedia juga opsi bayar di tempat dan konfirmasi via WhatsApp.' },
  { q: 'Apakah gear bisa diantar ke lokasi?', a: 'Bisa. Pilih metode Delivery saat booking. Ongkir dihitung dari jarak: Rp 10.000 + Rp 3.000 per km, maksimal 30 km. Pickup di toko tidak dikenakan biaya.' },
  { q: 'Bagaimana jika gear rusak atau hilang?', a: 'Gear dicek bersama saat serah terima dan pengembalian. Jika terjadi kerusakan atau kehilangan, dikenakan biaya ganti rugi sesuai nilai gear yang tercantum di ketentuan sewa.' },
  { q: 'Bisakah saya membatalkan booking?', a: 'Ya, pembatalan gratis selama booking belum dibayar. Jika sudah dibayar, batas pembatalan adalah H-2 sebelum tanggal mulai untuk refund penuh.' },
  { q: 'Apakah stok di website real-time?', a: 'Ya. Stok otomatis berkurang saat booking terkonfirmasi dan bertambah saat gear dikembalikan, sehingga tidak ada risiko double booking.' },
];

/* ---------------- Small helpers ---------------- */
function useCountUp(target, run) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf; const dur = 1400; let start;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, run]);
  return val.toLocaleString('id-ID');
}

/* ---------------- Page ---------------- */
export default function HomePage() {
  const [gears, setGears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [modalGear, setModalGear] = useState(null);
  const [statsRun, setStatsRun] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    api.get('/gears?limit=12')
      .then((r) => setGears(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setStatsRun(true), 300);
    return () => clearTimeout(t);
  }, []);

  useReveal([loading, gears.length]);

  const categories = useMemo(() => {
    const set = new Set(gears.map((g) => g.category?.name).filter(Boolean));
    return Array.from(set);
  }, [gears]);

  const filtered = useMemo(() => gears.filter((g) => {
    const okCat = filter === 'all' || g.category?.name === filter;
    const okSearch = !search || g.name.toLowerCase().includes(search.toLowerCase());
    return okCat && okSearch;
  }), [gears, filter, search]);

  return (
    <>
      <Hero ref={heroRef} statsRun={statsRun} />
      <TrustStrip />
      <Categories />
      <PopularCatalog
        gears={filtered} loading={loading} categories={categories}
        filter={filter} setFilter={setFilter} search={search} setSearch={setSearch}
        onOpen={setModalGear}
      />
      <HowToRent />
      <Calculator gears={gears} />
      <Testimonials />
      <Faq />
      <FinalCta />
      <GearDetailModal gear={modalGear} open={!!modalGear} onClose={() => setModalGear(null)} />
    </>
  );
}

/* ---------------- Hero ---------------- */
const Hero = React.forwardRef(function Hero({ statsRun }, ref) {
  const c1 = useCountUp(1200, statsRun);
  const c2 = useCountUp(4800, statsRun);
  const c3 = useCountUp(98, statsRun);
  return (
    <section className="hero gn-topo" id="hero" ref={ref}>
      <svg className="hero-contour" viewBox="0 0 600 600" fill="none" aria-hidden="true">
        <g stroke="#E8B058" strokeWidth="1.5" strokeLinecap="round">
          <path d="M300 28 C 428 20 578 138 584 300 C 590 462 430 580 296 576 C 162 572 20 466 16 300 C 12 138 172 36 300 28 Z" />
          <path d="M300 70 C 404 66 536 160 540 302 C 544 442 410 536 300 532 C 192 528 70 444 64 302 C 58 164 196 74 300 70 Z" />
          <path d="M302 112 C 384 112 496 186 498 304 C 500 420 392 494 304 490 C 216 486 116 418 110 306 C 104 194 222 112 302 112 Z" />
          <path d="M306 154 C 366 156 456 214 456 306 C 456 396 374 452 306 448 C 238 444 156 392 154 308 C 152 226 246 152 306 154 Z" />
          <path d="M308 196 C 350 200 418 244 416 308 C 414 370 356 410 308 406 C 260 402 198 366 200 310 C 202 258 266 192 308 196 Z" />
        </g>
      </svg>
      <div className="container hero-grid">
        <div className="hero-copy">
          <div data-reveal style={{ '--d': '.05s' }}>
            <span className="hero-badge"><span className="dot" /> Stok tersedia · gear terjaga &amp; terawat</span>
          </div>
          <h1 data-reveal style={{ '--d': '.1s' }}><span className="hw-semibold">Eksplorasi Alam</span>{' '}<span className="hw-medium">dengan</span>{' '}<span className="hl hw-bold">Perlengkapan Terbaik</span></h1>
          <p className="hero-lead" data-reveal style={{ '--d': '.15s' }}>Sewa gear hiking, camping, dan pendakian berkualitas tanpa repot. Stok real-time, harga transparan, dan siap antar langsung ke lokasimu.</p>
          <div className="hero-actions" data-reveal style={{ '--d': '.2s' }}>
            <Link href="/gears" className="btn btn-primary">Jelajahi Katalog <ArrowRight className="arrow" size={17} /></Link>
            <a href="#cara-sewa" className="btn btn-onDark">Lihat Cara Sewa</a>
          </div>
          <div className="hero-stats" data-reveal style={{ '--d': '.25s' }}>
            <div className="stat"><div className="num"><span>{c1}</span>+</div><div className="lbl">Gear terjaga</div></div>
            <div className="stat"><div className="num"><span>{c2}</span>+</div><div className="lbl">Booking sukses</div></div>
            <div className="stat"><div className="num"><span>{c3}</span>%</div><div className="lbl">Kepuasan pelanggan</div></div>
          </div>
        </div>
        <div className="hero-visual" data-reveal style={{ '--d': '.2s' }}>
          <div className="hero-img-wrap">
            <img src="/img/hero.webp" alt="Pendaki di puncak gunung saat matahari terbit" />
            <div className="float-card">
              <div className="fc-left">
                <div className="fc-thumb"><img src="/img/tenda-dome.webp" alt="Tenda Dome" /></div>
                <div>
                  <div className="fc-name">Tenda Dome 3P</div>
                  <div className="fc-meta">Ringkas · tahan angin &amp; hujan</div>
                </div>
              </div>
              <div className="fc-price">Rp 45.000<small>/hari</small></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

/* ---------------- Trust strip ---------------- */
function TrustStrip() {
  const row = [...MARQUEE, ...MARQUEE];
  return (
    <div className="trust-strip" aria-hidden="true">
      <div className="marquee">
        {row.map((m, i) => (<span key={i}>{m} <i /></span>))}
      </div>
    </div>
  );
}

/* ---------------- Categories ---------------- */
function Categories() {
  return (
    <section className="section" id="kategori">
      <div className="container">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Kategori Gear</span>
          <h2 className="h2">Pilih Perlengkapan Sesuai <span className="accent">Petualanganmu</span></h2>
          <p className="lead">Empat kategori lengkap untuk mendaki, berkemah, hingga memasak di alam terbuka.</p>
        </div>
        <div className="cats-grid">
          {MACRO_CATS.map((c, i) => {
            const Icon = c.icon;
            return (
              <Link className="cat-card" href="/gears" key={c.title} data-reveal style={{ '--d': `${i * 0.08}s` }}>
                <div className="icon"><Icon size={24} /></div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <span className="count">{c.from}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Popular catalog (live) ---------------- */
function PopularCatalog({ gears, loading, categories, filter, setFilter, search, setSearch, onOpen }) {
  return (
    <section className="section" id="katalog" style={{ background: 'var(--surface-card)', borderBlock: '1px solid var(--neutral-200)' }}>
      <div className="container">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Katalog Populer</span>
          <h2 className="h2">Gear Favorit <span className="accent">Para Pendaki</span></h2>
          <p className="lead">Semua gear terawat dan dicek sebelum disewakan. Klik kartu untuk melihat detail lengkap.</p>
        </div>
        <div className="catalog-bar" data-reveal>
          <div className="filters" role="tablist">
            <button className={`filter-pill${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>Semua</button>
            {categories.map((c) => (
              <button key={c} className={`filter-pill${filter === c ? ' active' : ''}`} onClick={() => setFilter(c)}>{c}</button>
            ))}
          </div>
          <div className="search-box">
            <Search size={16} />
            <input type="text" placeholder="Cari nama gear…" aria-label="Cari gear" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="gear-grid">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <div key={i} className="gear-card" style={{ height: 320, background: 'var(--bone-2)' }} />)
          ) : gears.length === 0 ? (
            <div className="empty-state"><strong>Tidak ada gear ditemukan</strong>Coba ubah kategori atau kata kunci pencarianmu.</div>
          ) : (
            gears.map((g, i) => <GearCard key={g.id} gear={g} index={i} onOpen={onOpen} />)
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }} data-reveal>
          <Link href="/gears" className="btn btn-ghost">Lihat Semua Katalog <ArrowRight className="arrow" size={17} /></Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- How to rent ---------------- */
function HowToRent() {
  return (
    <section className="section method" id="cara-sewa">
      <div className="container">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Alur Sewa</span>
          <h2 className="h2">Sewa Gear Semudah <span className="accent">Empat Langkah</span></h2>
          <p className="lead">Dari pilih gear sampai kembali, semua prosesnya jelas dan transparan.</p>
        </div>
        <div className="method-grid">
          {STEPS.map((s, i) => (
            <div className="step" key={s.n} data-reveal style={{ '--d': `${i * 0.08}s` }}>
              <span className="num">{s.n}</span>
              <div className="thumb"><img src={s.img} alt={s.title} /></div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Calc Gear Dropdown (custom select) ---------------- */
function CalcGearDropdown({ gears, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);
  const inputRef = useRef(null);
  const close = useCallback(() => { setOpen(false); setSearch(''); }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) close(); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open, close]);

  useEffect(() => { if (open && inputRef.current) inputRef.current.focus(); }, [open]);

  const current = gears.find((g) => String(g.id) === String(value));
  const filtered = gears.filter((g) => !search || g.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="calc-gear-dd" ref={ref}>
      <button className={`calc-gear-trigger${open ? ' open' : ''}`} onClick={() => setOpen(!open)} type="button">
        <span className="calc-gear-text">
          {current ? (
            <><span className="calc-gear-name">{current.name}</span><span className="calc-gear-price">{rupiah(current.price_per_day)}/hari</span></>
          ) : 'Pilih gear…'}
        </span>
        <ChevronDown size={16} className={`calc-gear-chevron${open ? ' rotated' : ''}`} />
      </button>
      {open && (
        <div className="calc-gear-menu">
          <div className="calc-gear-search">
            <Search size={14} />
            <input ref={inputRef} type="text" placeholder="Cari gear…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="calc-gear-list">
            {filtered.length === 0 ? (
              <div className="calc-gear-empty">Tidak ditemukan</div>
            ) : (
              filtered.map((g) => (
                <button
                  key={g.id}
                  className={`calc-gear-item${String(g.id) === String(value) ? ' active' : ''}`}
                  onClick={() => { onChange(String(g.id)); close(); }}
                  type="button"
                >
                  <span className="calc-gear-item-name">{g.name}</span>
                  <span className="calc-gear-item-price">{rupiah(g.price_per_day)}/hari</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Date Input with icon ---------------- */
function DateField({ label, value, onChange, min }) {
  const inputRef = useRef(null);
  return (
    <div className="field">
      <label>{label}</label>
      <div className="date-input-wrap" onClick={() => inputRef.current?.showPicker?.()}>
        <CalendarDays size={16} className="date-input-icon" />
        <input ref={inputRef} type="date" value={value} onChange={onChange} min={min} />
      </div>
    </div>
  );
}

/* ---------------- Booking calculator (estimate) ---------------- */
function Calculator({ gears }) {
  const [gearId, setGearId] = useState('');
  const [qty, setQty] = useState(1);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [delivery, setDelivery] = useState('pickup');
  const [distance, setDistance] = useState(5);

  useEffect(() => { if (!gearId && gears.length) setGearId(String(gears[0].id)); }, [gears, gearId]);

  const gear = gears.find((g) => String(g.id) === String(gearId));
  const days = useMemo(() => {
    if (!start || !end) return 0;
    const d = Math.ceil((new Date(end) - new Date(start)) / 86400000);
    return d > 0 ? d : 0;
  }, [start, end]);
  const price = Number(gear?.price_per_day) || 0;
  const subtotal = price * qty * days;
  const deliveryFee = delivery === 'delivery' ? 10000 + 3000 * distance : 0;
  const total = subtotal + (subtotal ? deliveryFee : 0);

  const today = new Date().toISOString().split('T')[0];

  return (
    <section className="section" id="hitung">
      <div className="container calc-wrap">
        <div data-reveal>
          <div className="section-head" style={{ marginBottom: 32 }}>
            <span className="eyebrow">Hitung Biaya</span>
            <h2 className="h2">Estimasi Harga <span className="accent">Sewa</span></h2>
            <p className="lead">Isi detail di bawah untuk melihat perkiraan total biaya sewa kamu.</p>
          </div>
          <div className="calc-form">
            <div className="field-row">
              <div className="field">
                <label>Pilih Gear <span className="req">*</span></label>
                <CalcGearDropdown gears={gears} value={gearId} onChange={setGearId} />
              </div>
              <div className="field">
                <label>Jumlah Unit</label>
                <div className="qty-stepper">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Kurangi"><Minus size={16} strokeWidth={2.5} /></button>
                  <span className="qty-val">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} aria-label="Tambah"><Plus size={16} strokeWidth={2.5} /></button>
                </div>
              </div>
            </div>
            <div className="field-row">
              <DateField label="Tanggal Mulai" value={start} onChange={(e) => setStart(e.target.value)} min={today} />
              <DateField label="Tanggal Kembali" value={end} onChange={(e) => setEnd(e.target.value)} min={start || today} />
            </div>
            <div className="field">
              <label>Metode Pengambilan</label>
              <div className="radio-group">
                <div className="radio-card">
                  <input type="radio" name="delivery" id="delPickup" checked={delivery === 'pickup'} onChange={() => setDelivery('pickup')} />
                  <label className="rc-body" htmlFor="delPickup">
                    <span className="rc-icon"><Store size={20} /></span>
                    <span><span className="rc-title">Pickup</span><br /><span className="rc-sub">Ambil di toko · Gratis</span></span>
                    <span className="rc-check" />
                  </label>
                </div>
                <div className="radio-card">
                  <input type="radio" name="delivery" id="delDelivery" checked={delivery === 'delivery'} onChange={() => setDelivery('delivery')} />
                  <label className="rc-body" htmlFor="delDelivery">
                    <span className="rc-icon"><Truck size={20} /></span>
                    <span><span className="rc-title">Delivery</span><br /><span className="rc-sub">Antar ke lokasi · Berbayar</span></span>
                    <span className="rc-check" />
                  </label>
                </div>
              </div>
            </div>
            {delivery === 'delivery' && (
              <div className="field range-field">
                <label>Jarak Pengiriman: <span style={{ color: 'var(--accent-terra)' }}>{distance} km</span></label>
                <input type="range" min="1" max="30" step="1" value={distance} onChange={(e) => setDistance(Number(e.target.value))} />
                <div className="range-labels"><span>1 km</span><span>Maks 30 km</span></div>
              </div>
            )}
          </div>
        </div>
        <div className="summary gn-topo" data-reveal style={{ '--d': '.1s' }}>
          <h4>Ringkasan Sewa</h4>
          <p className="s-sub">Perkiraan biaya berdasarkan pilihanmu</p>
          <div className="sum-line"><span className="k">Gear dipilih</span><span className="v">{gear ? gear.name.slice(0, 22) : '-'}</span></div>
          <div className="sum-line"><span className="k">Durasi sewa</span><span className="v">{days ? `${days} hari` : '-'}</span></div>
          <div className="sum-line"><span className="k">Subtotal gear</span><span className="v">{subtotal ? rupiah(subtotal) : '-'}</span></div>
          <div className="sum-line"><span className="k">Ongkir</span><span className="v">{subtotal ? (deliveryFee ? rupiah(deliveryFee) : 'Gratis') : '-'}</span></div>
          <div className="sum-line total"><span className="k">Total Estimasi</span><span className="v">{total ? rupiah(total) : '-'}</span></div>
          <Link href="/gears" className="btn btn-light">Lanjut ke Booking</Link>
          <p className="sum-note">Estimasi awal. Biaya final dikonfirmasi saat checkout.</p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Testimonials ---------------- */
function Testimonials() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % REVIEWS.length), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="section testi gn-topo" id="testimoni">
      <div className="container">
        <div className="section-head center" data-reveal>
          <span className="eyebrow onDark">Testimoni</span>
          <h2 className="h2">Kata Para <span className="accent" style={{ color: 'var(--accent-500)' }}>Kembara</span></h2>
          <p className="lead">Ribuan pendaki dan camper telah mempercayakan perjalanannya pada Kembara.id.</p>
        </div>
        <div className="carousel" data-reveal>
          <div className="carousel-viewport">
            <div className="carousel-track" style={{ transform: `translateX(-${idx * 100}%)` }}>
              {REVIEWS.map((r) => (
                <div className="t-slide" key={r.name}>
                  <div className="t-card">
                    <div className="t-stars">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill="#E8B058" stroke="none" />)}</div>
                    <p className="t-quote">{r.text}</p>
                    <div className="t-person">
                      <div className="t-avatar">{r.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</div>
                      <div style={{ textAlign: 'left' }}>
                        <div className="t-name">{r.name}</div>
                        <div className="t-role">{r.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="carousel-controls">
            <button className="c-arrow" onClick={() => setIdx((i) => (i - 1 + REVIEWS.length) % REVIEWS.length)} aria-label="Sebelumnya"><ChevronLeft size={20} /></button>
            <div className="c-dots">
              {REVIEWS.map((_, i) => <button key={i} className={`c-dot${i === idx ? ' active' : ''}`} onClick={() => setIdx(i)} aria-label={`Testimoni ${i + 1}`} />)}
            </div>
            <button className="c-arrow" onClick={() => setIdx((i) => (i + 1) % REVIEWS.length)} aria-label="Berikutnya"><ChevronRight size={20} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section" id="faq">
      <div className="container">
        <div className="section-head center" data-reveal>
          <span className="eyebrow">FAQ</span>
          <h2 className="h2">Pertanyaan yang <span className="accent">Sering Ditanya</span></h2>
          <p className="lead">Hal-hal yang perlu kamu tahu sebelum menyewa gear.</p>
        </div>
        <div className="faq" data-reveal>
          {FAQS.map((f, i) => (
            <div className={`faq-item${open === i ? ' open' : ''}`} key={i}>
              <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                {f.q}
                <span className="faq-icon"><Plus size={16} strokeWidth={2.4} /></span>
              </button>
              <div className="faq-a"><div className="faq-a-inner"><p>{f.a}</p></div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Final CTA ---------------- */
function FinalCta() {
  return (
    <section className="section cta-band gn-topo">
      <div className="container cta-inner" data-reveal>
        <div>
          <h2>Siap Menatap Puncak?</h2>
          <p>Sewa gear impianmu sekarang dan jelajahi alam dengan tenang. Langkah ringan, jelajah nyaman.</p>
        </div>
        <Link href="/gears" className="btn">Sewa Sekarang <ArrowRight className="arrow" size={17} /></Link>
      </div>
    </section>
  );
}

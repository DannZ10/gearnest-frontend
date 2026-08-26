'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import api from '@/lib/axios';
import { useReveal } from '@/lib/useReveal';
import GearCard from '@/components/organisms/GearCard';
import GearDetailModal from '@/components/organisms/GearDetailModal';
import { Search, ChevronLeft, ChevronRight, ChevronDown, SlidersHorizontal, Layers } from 'lucide-react';

/* ---------- Custom Dropdown ---------- */
function CustomDropdown({ icon: Icon, label, value, options, onChange, className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) close(); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open, close]);

  const current = options.find((o) => o.value === value);

  return (
    <div className={`kb-dropdown ${className}`} ref={ref}>
      <button className={`kb-dropdown-trigger${open ? ' open' : ''}`} onClick={() => setOpen(!open)} type="button">
        {Icon && <Icon size={16} className="kb-dropdown-icon" />}
        <span className="kb-dropdown-label">{label}</span>
        <span className="kb-dropdown-value">{current?.label || '—'}</span>
        <ChevronDown size={15} className={`kb-dropdown-chevron${open ? ' rotated' : ''}`} />
      </button>
      {open && (
        <div className="kb-dropdown-menu">
          {options.map((opt) => (
            <button
              key={opt.value}
              className={`kb-dropdown-item${opt.value === value ? ' active' : ''}`}
              onClick={() => { onChange(opt.value); close(); }}
              type="button"
            >
              {opt.dot && <span className="kb-dropdown-dot" style={{ background: opt.dot }} />}
              {opt.label}
              {opt.value === value && <span className="kb-dropdown-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Page ---------- */
export default function GearCatalogPage() {
  const [gears, setGears] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('created_at-desc');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [modalGear, setModalGear] = useState(null);

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const [sort_by, sort_order] = sort.split('-');
    api.get('/gears', { params: { page, limit: 12, search: search || undefined, category: category || undefined, sort_by, sort_order } })
      .then((r) => { setGears(r.data.data || []); setMeta(r.data.meta || { current_page: 1, last_page: 1, total: 0 }); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, category, sort, page]);

  useReveal([loading, gears.length]);

  const categoryOptions = [
    { value: '', label: 'Semua Kategori' },
    ...categories.map((c) => ({ value: c.slug, label: c.name })),
  ];

  const sortOptions = [
    { value: 'created_at-desc', label: 'Terbaru' },
    { value: 'price_per_day-asc', label: 'Harga termurah' },
    { value: 'price_per_day-desc', label: 'Harga termahal' },
    { value: 'stock_available-desc', label: 'Stok terbanyak' },
  ];

  return (
    <div className="container" style={{ padding: '48px 0 88px' }}>
      <div className="section-head" data-reveal>
        <span className="eyebrow">Katalog Gear</span>
        <h2 className="h2">Semua <span className="accent">Perlengkapan</span></h2>
        <p className="lead">Cari, filter, dan sewa peralatan pendakian &amp; camping terbaik untuk perjalananmu.</p>
      </div>

      <div className="catalog-bar catalog-bar--gear" data-reveal>
        <div className="catalog-controls">
          <CustomDropdown
            icon={Layers}
            label="Kategori"
            value={category}
            options={categoryOptions}
            onChange={(v) => { setCategory(v); setPage(1); }}
          />
          <CustomDropdown
            icon={SlidersHorizontal}
            label="Urutkan"
            value={sort}
            options={sortOptions}
            onChange={(v) => { setSort(v); setPage(1); }}
          />
        </div>
        <div className="search-box">
          <Search size={16} />
          <input type="text" placeholder="Cari nama gear…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} aria-label="Cari gear" />
        </div>
      </div>

      <div className="gear-grid">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <div key={i} className="gear-card" style={{ height: 320, background: 'var(--bone-2)' }} />)
        ) : gears.length === 0 ? (
          <div className="empty-state"><strong>Tidak ada gear ditemukan</strong>Coba ubah kategori atau kata kunci pencarianmu.</div>
        ) : (
          gears.map((g, i) => <GearCard key={g.id} gear={g} index={i} onOpen={setModalGear} />)
        )}
      </div>

      {meta.last_page > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 44 }}>
          <button className="c-arrow" style={{ borderColor: 'var(--neutral-200)', color: 'var(--primary-900)' }} disabled={page <= 1} onClick={() => setPage(page - 1)} aria-label="Sebelumnya"><ChevronLeft size={20} /></button>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--neutral-400)' }}>
            Halaman <b style={{ color: 'var(--primary-900)' }}>{meta.current_page}</b> / {meta.last_page} · {meta.total} gear
          </span>
          <button className="c-arrow" style={{ borderColor: 'var(--neutral-200)', color: 'var(--primary-900)' }} disabled={page >= meta.last_page} onClick={() => setPage(page + 1)} aria-label="Berikutnya"><ChevronRight size={20} /></button>
        </div>
      )}

      <GearDetailModal gear={modalGear} open={!!modalGear} onClose={() => setModalGear(null)} />
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { formatRupiah } from '@/lib/format';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';
import { Search, Filter, ShoppingBag, ArrowLeft, ArrowRight, X } from 'lucide-react';

export default function GearCatalogPage() {
  const [gears, setGears] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data || []);
      } catch (err) {
        console.error('Failed fetching categories:', err);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchGears() {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 8,
          search: search || undefined,
          category: selectedCategory || undefined,
          sort_by: sortBy,
          sort_order: sortOrder,
        };
        const res = await api.get('/gears', { params });
        setGears(res.data.data || []);
        setMeta(res.data.meta || { current_page: 1, last_page: 1, total: 0 });
      } catch (err) {
        console.error('Failed fetching gears:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchGears();
  }, [search, selectedCategory, sortBy, sortOrder, page]);

  const handleAddToCart = (gear) => {
    addItem(gear, 1);
    toast.success(`${gear.name} ditambahkan ke keranjang!`);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSortBy('created_at');
    setSortOrder('desc');
    setPage(1);
  };

  const inputCls =
    'w-full bg-bone border border-ink/15 rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-ember transition-colors';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="font-display font-bold uppercase text-3xl sm:text-4xl text-ink">Katalog Gear</h1>
        <div className="w-16 h-1 bg-ember rounded-full mt-3" />
        <p className="text-sm text-ink/60 mt-3">Cari dan sewa peralatan pendakian terbaik untuk perjalananmu</p>
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-ink/10 rounded-2xl p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-ink/40" />
            <input
              type="text"
              placeholder="Cari tenda, carrier, merk..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-bone border border-ink/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink focus:outline-none focus:border-ember transition-colors"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
            className={inputCls}
          >
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [sb, so] = e.target.value.split('-');
              setSortBy(sb);
              setSortOrder(so);
              setPage(1);
            }}
            className={inputCls}
          >
            <option value="created_at-desc">Terbaru</option>
            <option value="price_per_day-asc">Harga: Termurah ➔ Termahal</option>
            <option value="price_per_day-desc">Harga: Termahal ➔ Termurah</option>
            <option value="stock_available-desc">Stok Terbanyak</option>
          </select>

          <button
            onClick={clearFilters}
            className="flex items-center justify-center gap-2 bg-bone-2 hover:bg-sand/40 text-ink border border-ink/10 text-sm font-semibold rounded-xl py-2.5 px-4 transition-all"
          >
            <X className="w-4 h-4" /> Reset Filter
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 bg-bone-2 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : gears.length === 0 ? (
        <div className="text-center py-20 bg-white border border-ink/10 rounded-3xl space-y-4">
          <Filter className="w-12 h-12 text-ink/25 mx-auto" />
          <h3 className="font-display font-bold uppercase text-lg text-ink">Tidak Ada Gear Ditemukan</h3>
          <p className="text-xs text-ink/55 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau bersihkan filter kategori.
          </p>
          <button onClick={clearFilters} className="px-4 py-2 bg-ember text-white text-xs font-bold rounded-xl">
            Tampilkan Semua Gear
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gears.map((gear) => (
            <div
              key={gear.id}
              className="group bg-white border border-ink/10 hover:border-ember/40 rounded-3xl overflow-hidden flex flex-col transition-all hover:shadow-xl hover:shadow-ink/5"
            >
              <div className="relative h-48 bg-bone-2 overflow-hidden">
                <img
                  src={gear.image_url || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&auto=format&fit=crop&q=80'}
                  alt={gear.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-ink/85 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-ember">
                  {gear.category?.name || gear.brand || 'Outdoor'}
                </span>
                <span className="absolute top-3 right-3 bg-moss/90 text-white backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-semibold">
                  Stok: {gear.stock_available}
                </span>
              </div>

              <div className="p-5 flex-grow flex flex-col justify-between gap-4">
                <div>
                  <h3 className="font-display font-semibold uppercase tracking-wide text-ink text-base line-clamp-1 group-hover:text-ember transition-colors">
                    {gear.name}
                  </h3>
                  <p className="text-xs text-ink/55 line-clamp-2 mt-1">
                    {gear.description || 'Perlengkapan gunung siap sewa.'}
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
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-4 pt-6 border-t border-ink/10">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="p-2 bg-white border border-ink/15 text-ink/70 hover:text-ink rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-ink/60 font-medium">
            Halaman <strong className="text-ink">{meta.current_page}</strong> dari {meta.last_page} ({meta.total} gear)
          </span>
          <button
            disabled={page >= meta.last_page}
            onClick={() => setPage(page + 1)}
            className="p-2 bg-white border border-ink/15 text-ink/70 hover:text-ink rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

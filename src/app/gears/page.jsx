'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { formatRupiah } from '@/lib/format';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';
import { Search, Filter, ShoppingBag, ArrowLeft, ArrowRight, X } from 'lucide-react';

export default function GearCatalogPage() {
  const [gears, setGears] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Katalog Alat Outdoor</h1>
        <p className="text-sm text-slate-400 mt-1">Cari dan sewa peralatan pendakian terbaik untuk perjalanan Anda</p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari tenda, carrier, merk..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="">Semua Kategori (14)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-');
                setSortBy(sb);
                setSortOrder(so);
                setPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="created_at-desc">Terbaru</option>
              <option value="price_per_day-asc">Harga: Termurah ➔ Termahal</option>
              <option value="price_per_day-desc">Harga: Termahal ➔ Termurah</option>
              <option value="stock_available-desc">Stok Terbanyak</option>
            </select>
          </div>

          {/* Reset Filters */}
          <button
            onClick={clearFilters}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl py-2.5 px-4 transition-all"
          >
            <X className="w-4 h-4" /> Reset Filter
          </button>
        </div>
      </div>

      {/* Gears Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 bg-slate-900 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : gears.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-3xl space-y-4">
          <Filter className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">Tidak ada gear yang ditemukan</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau bersihkan filter kategori Anda.
          </p>
          <button onClick={clearFilters} className="px-4 py-2 bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl">
            Tampilkan Semua Gear
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gears.map((gear) => (
            <div
              key={gear.id}
              className="group bg-slate-900/80 border border-slate-800 hover:border-emerald-500/30 rounded-3xl overflow-hidden flex flex-col transition-all hover:shadow-xl hover:shadow-emerald-500/5"
            >
              {/* Image */}
              <div className="relative h-48 bg-slate-800 overflow-hidden">
                <img
                  src={gear.image_url || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&auto=format&fit=crop&q=80'}
                  alt={gear.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700 text-[10px] font-bold text-emerald-400">
                  {gear.category?.name || gear.brand || 'Outdoor'}
                </div>
                <div className="absolute top-3 right-3 bg-emerald-500/20 text-emerald-300 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-semibold border border-emerald-500/30">
                  Stok: {gear.stock_available}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-white text-base line-clamp-1 group-hover:text-emerald-400 transition-colors">
                    {gear.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {gear.description || 'Perlengkapan gunung siap sewa.'}
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

      {/* Pagination Controls */}
      {meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-4 pt-6 border-t border-slate-900">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="p-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-400 font-medium">
            Halaman <strong className="text-white">{meta.current_page}</strong> dari {meta.last_page} ({meta.total} gear)
          </span>
          <button
            disabled={page >= meta.last_page}
            onClick={() => setPage(page + 1)}
            className="p-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';
import SectionHeading from '@/components/atoms/SectionHeading';
import GearCard from '@/components/molecules/GearCard';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Search, Filter, ArrowLeft, ArrowRight, X } from 'lucide-react';

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SectionHeading
        title="Katalog Gear"
        subtitle="Cari dan sewa peralatan pendakian terbaik untuk perjalananmu"
      />

      {/* Filter bar */}
      <Card className="p-4 sm:p-6 rounded-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-ink/40" />
            <Input
              type="text"
              placeholder="Cari tenda, carrier, merk..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-10"
            />
          </div>

          <Select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
          >
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </Select>

          <Select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [sb, so] = e.target.value.split('-');
              setSortBy(sb);
              setSortOrder(so);
              setPage(1);
            }}
          >
            <option value="created_at-desc">Terbaru</option>
            <option value="price_per_day-asc">Harga: Termurah ➔ Termahal</option>
            <option value="price_per_day-desc">Harga: Termahal ➔ Termurah</option>
            <option value="stock_available-desc">Stok Terbanyak</option>
          </Select>

          <Button
            variant="secondary"
            onClick={clearFilters}
            className="w-full flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" /> Reset Filter
          </Button>
        </div>
      </Card>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-3xl" />
          ))}
        </div>
      ) : gears.length === 0 ? (
        <Card className="text-center py-20 space-y-4">
          <Filter className="w-12 h-12 text-ink/25 mx-auto" />
          <h3 className="font-display font-bold uppercase text-lg text-ink">Tidak Ada Gear Ditemukan</h3>
          <p className="text-xs text-ink/55 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau bersihkan filter kategori.
          </p>
          <Button onClick={clearFilters} size="sm">
            Tampilkan Semua Gear
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gears.map((gear) => (
            <GearCard key={gear.id} gear={gear} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-4 pt-6 border-t border-ink/10">
          <Button
            variant="secondary"
            size="icon"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs text-ink/60 font-medium">
            Halaman <strong className="text-ink">{meta.current_page}</strong> dari {meta.last_page} ({meta.total} gear)
          </span>
          <Button
            variant="secondary"
            size="icon"
            disabled={page >= meta.last_page}
            onClick={() => setPage(page + 1)}
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

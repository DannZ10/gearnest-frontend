'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { Compass, ArrowRight } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data || []);
      } catch (err) {
        console.error('Failed fetching categories:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Kategori Peralatan Outdoor</h1>
        <p className="text-sm text-slate-400 mt-1">14 Kategori perlengkapan gunung terlengkap untuk persiapan pendakian Anda</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-44 bg-slate-900 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/gears?category=${cat.slug}`}
              className="group p-6 bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 rounded-3xl transition-all flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-500/5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 group-hover:scale-110 rounded-2xl transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  {cat.gears_count || 0} unit
                </span>
              </div>

              <div>
                <h3 className="font-bold text-white text-lg group-hover:text-emerald-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                  {cat.description || 'Peralatan outdoor berkualitas tinggi.'}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center text-xs font-semibold text-slate-400 group-hover:text-emerald-400 transition-colors">
                Eksplor Katalog <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

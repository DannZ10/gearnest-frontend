'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { ArrowUpRight } from 'lucide-react';

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
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-trail mb-3">// Kategori</p>
        <h1 className="font-display font-bold uppercase text-4xl sm:text-5xl leading-[0.9] tracking-tight text-ink">Kategori Peralatan</h1>
        <p className="text-sm text-ink/60 mt-3">Perlengkapan gunung terlengkap untuk persiapan petualanganmu.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-44 bg-bone-2 rounded-md animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/gears?category=${cat.slug}`}
              className="group relative bg-white border-2 border-ink/10 hover:border-ember rounded-md transition-colors flex flex-col overflow-hidden"
            >
              {/* Image band (falls back to a big outline numeral when no image_url) */}
              <div className="relative h-32 overflow-hidden bg-bone-2">
                {cat.image_url ? (
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center">
                    <span className="font-display font-bold text-6xl leading-none text-ink/10 gn-stroke">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-char/55 via-char/5 to-transparent pointer-events-none" />
                <span className="absolute top-2.5 right-2.5 font-mono text-[10px] font-bold text-white bg-char/75 backdrop-blur-sm px-2 py-1 rounded-sm border border-white/15 uppercase tracking-wide">
                  {cat.gears_count || 0} unit
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold uppercase tracking-tight text-ink text-xl leading-none group-hover:text-ember transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-ink/55 line-clamp-2 mt-2">
                    {cat.description || 'Peralatan outdoor berkualitas tinggi.'}
                  </p>
                </div>

                <div className="pt-3 border-t-2 border-ink/10 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-ink/50 group-hover:text-ember transition-colors">
                  Eksplor Katalog
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

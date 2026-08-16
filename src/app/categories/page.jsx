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
        <h1 className="font-display font-bold uppercase text-3xl sm:text-4xl text-ink">Kategori Peralatan</h1>
        <div className="w-16 h-1 bg-ember rounded-full mt-3" />
        <p className="text-sm text-ink/60 mt-3">Perlengkapan gunung terlengkap untuk persiapan petualanganmu</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-44 bg-bone-2 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/gears?category=${cat.slug}`}
              className="group p-6 bg-white border border-ink/10 hover:border-ember/40 rounded-3xl transition-all flex flex-col justify-between hover:shadow-xl hover:shadow-ink/5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-ink text-ember group-hover:-translate-y-0.5 rounded-2xl transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-moss bg-moss/10 px-2.5 py-1 rounded-full border border-moss/20">
                  {cat.gears_count || 0} unit
                </span>
              </div>

              <div>
                <h3 className="font-display font-semibold uppercase tracking-wide text-ink text-lg group-hover:text-ember transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-ink/55 line-clamp-2 mt-1">
                  {cat.description || 'Peralatan outdoor berkualitas tinggi.'}
                </p>
              </div>

              <div className="pt-3 border-t border-ink/10 flex items-center text-xs font-display font-semibold uppercase tracking-wide text-ink/60 group-hover:text-ember transition-colors">
                Eksplor Katalog <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

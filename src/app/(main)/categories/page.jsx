'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { useReveal } from '@/lib/useReveal';
import { Mountain, Tent, CookingPot, Flashlight, Backpack, Compass, Package, LifeBuoy } from 'lucide-react';

const ICONS = [Mountain, Tent, CookingPot, Flashlight, Backpack, Compass, LifeBuoy, Package];

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useReveal([loading, categories.length]);

  return (
    <div className="container" style={{ padding: '48px 0 88px' }}>
      <div className="section-head" data-reveal>
        <span className="eyebrow">Kategori Gear</span>
        <h2 className="h2">Kategori <span className="accent">Peralatan</span></h2>
        <p className="lead">Perlengkapan gunung terlengkap untuk mendaki, berkemah, memasak, hingga keselamatan.</p>
      </div>

      <div className="cats-grid">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <div key={i} className="cat-card" style={{ height: 180, background: 'var(--bone-2)' }} />)
        ) : (
          categories.map((cat, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <Link className="cat-card" href={`/gears?category=${cat.slug}`} key={cat.id} data-reveal style={{ '--d': `${(i % 4) * 0.08}s` }}>
                {typeof cat.gears_count === 'number' && <span className="badge">{cat.gears_count} unit</span>}
                <div className="icon"><Icon size={24} /></div>
                <h3>{cat.name}</h3>
                <p>{cat.description || 'Peralatan outdoor berkualitas tinggi dan terawat.'}</p>
                <span className="count">Eksplor katalog →</span>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

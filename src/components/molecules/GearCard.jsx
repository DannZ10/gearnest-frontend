'use client';

import React, { useState } from 'react';
import { formatRupiah } from '@/lib/format';
import { Plus, Layers, Eye } from 'lucide-react';
import GearDetailModal from '@/components/molecules/GearDetailModal';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&auto=format&fit=crop&q=80';

/**
 * Bold gear card — used on the catalog and featured landing grid.
 * The whole card opens a detail modal (stock + variants). The add button quick-adds
 * for plain gears, or opens the modal to pick a variant when the gear has variations.
 */
export default function GearCard({ gear, onAddToCart }) {
  const [open, setOpen] = useState(false);
  const low = Number(gear.stock_available) <= 3;
  const hasVariants = Number(gear.variants_count) > 0;

  const onAddClick = (e) => {
    e.stopPropagation();
    if (hasVariants) { setOpen(true); return; }
    onAddToCart?.(gear);
  };

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="group h-full flex flex-col rounded-md overflow-hidden border-2 border-ink/10 bg-white hover:border-ember transition-colors cursor-pointer"
      >
        <div className="relative h-44 overflow-hidden bg-bone-2">
          <img
            src={gear.image_url || FALLBACK_IMG}
            alt={gear.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.14em] bg-char/85 text-white px-2 py-1 rounded-sm backdrop-blur-sm">
            {gear.brand || gear.category?.name || 'Outdoor'}
          </span>
          <span className={`absolute top-3 right-3 font-mono text-[10px] uppercase tracking-wide px-2 py-1 rounded-sm text-white ${low ? 'bg-ember-2' : 'bg-trail'}`}>
            Stok {gear.stock_available}
          </span>
          {hasVariants && (
            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wide bg-ember text-white px-2 py-1 rounded-sm">
              <Layers className="w-3 h-3" /> Varian
            </span>
          )}
          {/* Hover cue that the card opens a detail view */}
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wide bg-white/90 text-ink px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <Eye className="w-3 h-3" /> Detail
          </span>
        </div>

        <div className="p-4 flex-grow flex flex-col justify-between gap-3">
          <div>
            <h3 className="font-display font-bold text-ink text-lg uppercase tracking-tight leading-tight line-clamp-1 group-hover:text-ember transition-colors">
              {gear.name}
            </h3>
            <p className="text-xs text-ink/55 line-clamp-2 mt-1">
              {gear.description || 'Peralatan outdoor berkualitas tinggi.'}
            </p>
          </div>

          <div className="pt-3 border-t-2 border-ink/10 flex items-end justify-between">
            <div>
              <span className="block font-mono text-[10px] uppercase tracking-wide text-ink/45">Sewa / Hari</span>
              <span className="font-display font-bold text-xl text-ink leading-none">{formatRupiah(gear.price_per_day)}</span>
            </div>
            <button
              onClick={onAddClick}
              title={hasVariants ? 'Pilih Varian' : 'Tambah ke Keranjang'}
              className="grid place-items-center w-11 h-11 rounded-md bg-ember hover:bg-ember-2 text-white shadow-lg shadow-ember/25 active:scale-95 transition-all"
            >
              {hasVariants ? <Layers className="w-5 h-5" strokeWidth={2.5} /> : <Plus className="w-5 h-5" strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      </div>

      <GearDetailModal gear={gear} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

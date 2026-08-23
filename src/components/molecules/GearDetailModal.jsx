'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import api from '@/lib/axios';
import { formatRupiah } from '@/lib/format';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';
import { X, Plus, Minus, ShoppingBag, Package, Weight, Layers, Tag, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1000&auto=format&fit=crop&q=80';

/**
 * Interactive gear detail: image carousel, full spec, and variant/quantity
 * picker. Centered overlay portaled to <body>.
 */
export default function GearDetailModal({ gear, open, onClose }) {
  const addItem = useCartStore((s) => s.addItem);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [variant, setVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    if (!open || !gear?.id) return;
    setLoading(true);
    setVariant(null);
    setQty(1);
    setImgIdx(0);
    let alive = true;
    api
      .get(`/gears/${gear.id}`)
      .then((res) => { if (alive) setDetail(res.data.data); })
      .catch(() => { if (alive) setDetail(gear); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [open, gear?.id]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);

  const gallery = useMemo(() => {
    const arr = [detail?.image_url, ...(detail?.images || [])].filter(Boolean);
    return arr.length ? [...new Set(arr)] : [FALLBACK_IMG];
  }, [detail]);

  if (!open || typeof document === 'undefined') return null;

  const variants = detail?.variants || [];
  const hasVariants = variants.length > 0;
  const maxStock = hasVariants ? Number(variant?.stock ?? 0) : Number(detail?.stock_available ?? 0);
  const outOfStock = hasVariants ? variants.every((v) => v.stock <= 0) : maxStock <= 0;
  const needVariant = hasVariants && !variant;

  const add = () => {
    if (needVariant) { toast.error('Pilih varian dulu (ukuran/warna).'); return; }
    if (maxStock <= 0) { toast.error('Stok habis.'); return; }
    addItem(detail, Math.min(qty, maxStock), variant);
    toast.success(`${detail.name}${variant ? ` (${variant.label})` : ''} ditambahkan ke keranjang!`);
    onClose();
  };

  const pickVariant = (v) => {
    if (v.stock <= 0) return;
    setVariant(v);
    setQty(1);
  };

  const prevImg = () => setImgIdx((i) => (i - 1 + gallery.length) % gallery.length);
  const nextImg = () => setImgIdx((i) => (i + 1) % gallery.length);

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-char/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white border-2 border-ink/10 rounded-md shadow-2xl overflow-hidden flex flex-col md:grid md:grid-cols-2">
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="absolute top-3 right-3 z-20 grid place-items-center w-9 h-9 rounded-md bg-char/70 text-white hover:bg-char transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {loading || !detail ? (
          <div className="col-span-2 h-80 grid place-items-center text-ink/40">
            <Loader2 className="w-7 h-7 animate-spin" />
          </div>
        ) : (
          <>
            {/* Image carousel */}
            <div className="relative h-60 md:h-auto md:min-h-[24rem] bg-bone-2 shrink-0">
              <img
                src={gallery[imgIdx]}
                alt={detail.name}
                onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.14em] bg-char/85 text-white px-2 py-1 rounded-sm">
                {detail.brand || detail.category?.name || 'Outdoor'}
              </span>

              {gallery.length > 1 && (
                <>
                  <button
                    onClick={prevImg}
                    aria-label="Gambar sebelumnya"
                    className="absolute left-2 top-1/2 -translate-y-1/2 grid place-items-center w-9 h-9 rounded-full bg-white/85 text-ink hover:bg-white shadow-md transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImg}
                    aria-label="Gambar berikutnya"
                    className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center w-9 h-9 rounded-full bg-white/85 text-ink hover:bg-white shadow-md transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 right-3 flex gap-1.5">
                    {gallery.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIdx(i)}
                        aria-label={`Gambar ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all ${i === imgIdx ? 'w-5 bg-ember' : 'w-1.5 bg-white/70 hover:bg-white'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Body (scrolls independently) */}
            <div className="p-6 flex flex-col gap-4 overflow-y-auto">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-trail">{detail.category?.name || 'Gear'}</p>
                <h2 className="font-display font-bold uppercase tracking-tight text-ink text-2xl leading-none mt-1">{detail.name}</h2>
              </div>

              <p className="text-sm text-ink/65 leading-relaxed whitespace-pre-line">
                {detail.description || 'Peralatan outdoor berkualitas tinggi, terawat, dan siap tempur.'}
              </p>

              {/* Full spec chips */}
              <div className="flex flex-wrap gap-2 text-[11px]">
                {detail.brand && (
                  <span className="inline-flex items-center gap-1.5 font-mono uppercase tracking-wide bg-bone border border-ink/10 text-ink/70 px-2.5 py-1 rounded-sm">
                    <Tag className="w-3.5 h-3.5 text-trail" /> {detail.brand}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 font-mono uppercase tracking-wide bg-bone border border-ink/10 text-ink/70 px-2.5 py-1 rounded-sm">
                  <Package className="w-3.5 h-3.5 text-trail" />
                  {hasVariants ? `Total stok ${detail.stock_available}` : `Sisa stok ${detail.stock_available}`}
                </span>
                {detail.weight_kg != null && (
                  <span className="inline-flex items-center gap-1.5 font-mono uppercase tracking-wide bg-bone border border-ink/10 text-ink/70 px-2.5 py-1 rounded-sm">
                    <Weight className="w-3.5 h-3.5 text-trail" /> {detail.weight_kg} kg
                  </span>
                )}
              </div>

              {/* Variant picker */}
              {hasVariants && (
                <div className="space-y-2">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/60 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-ember" /> Pilih Varian
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((v) => {
                      const disabled = v.stock <= 0;
                      const active = variant?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          disabled={disabled}
                          onClick={() => pickVariant(v)}
                          className={`px-3 py-1.5 rounded-md border-2 text-xs font-semibold transition-colors ${
                            active
                              ? 'border-ember bg-ember/10 text-ember'
                              : disabled
                                ? 'border-ink/10 bg-bone-2 text-ink/30 line-through cursor-not-allowed'
                                : 'border-ink/15 bg-white text-ink/80 hover:border-ember/50'
                          }`}
                        >
                          {v.label}
                          <span className="ml-1.5 font-mono text-[10px] text-ink/40">{disabled ? 'habis' : `·${v.stock}`}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Price + qty + add */}
              <div className="mt-auto pt-4 border-t-2 border-ink/10 space-y-3">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="block font-mono text-[10px] uppercase tracking-wide text-ink/45">Sewa / Hari</span>
                    <span className="font-display font-bold text-2xl text-ink leading-none">{formatRupiah(detail.price_per_day)}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-bone border-2 border-ink/10 rounded-md p-1">
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-1 text-ink/50 hover:text-ink disabled:opacity-30" disabled={qty <= 1}>
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-bold text-ink px-2 min-w-[2ch] text-center">{qty}</span>
                    <button
                      onClick={() => setQty((q) => Math.min(maxStock || 1, q + 1))}
                      className="p-1 text-ink/50 hover:text-ink disabled:opacity-30"
                      disabled={qty >= maxStock || needVariant}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={add}
                  disabled={outOfStock || needVariant}
                  className="w-full py-3 bg-ember hover:bg-ember-2 text-white font-display font-semibold uppercase tracking-wide rounded-md shadow-lg shadow-ember/25 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {outOfStock ? 'Stok Habis' : needVariant ? 'Pilih Varian Dulu' : 'Tambah ke Keranjang'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}

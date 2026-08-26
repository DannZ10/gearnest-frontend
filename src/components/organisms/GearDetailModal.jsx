'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore } from '@/store/useCartStore';
import { rupiah } from '@/lib/useReveal';

export default function GearDetailModal({ gear, open, onClose }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);

  useEffect(() => { if (open) setQty(1); }, [open, gear]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [open, onClose]);

  if (!gear) return null;

  const stock = Number(gear.stock_available ?? 0);
  const category = gear.category?.name || gear.category_name || 'Gear';
  const img = gear.image_url || '/img/tenda-dome.webp';
  const price = Number(gear.price_per_day) || 0;

  const specs = [
    gear.brand && ['Brand', gear.brand],
    gear.weight_kg && ['Berat', `${Number(gear.weight_kg)} kg`],
    ['Kategori', category],
    ['Stok', `${stock} unit`],
  ].filter(Boolean);

  const handleRent = () => {
    addItem(gear, qty);
    toast.success(`${gear.name} (${qty}×) ditambahkan ke keranjang`);
    onClose();
    router.push('/cart');
  };

  return (
    <div className={`modal-overlay${open ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label={gear.name} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Tutup"><X size={18} strokeWidth={2.2} /></button>
        <div className="modal-grid">
          <div className="modal-media">
            <img src={img} alt={gear.name} onError={(e) => { e.currentTarget.src = '/img/tenda-dome.webp'; }} />
            <span className="m-cat">{category}</span>
          </div>
          <div className="modal-content">
            {gear.brand && <div className="m-rating"><span className="val" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--neutral-400)' }}>{gear.brand}</span></div>}
            <h3>{gear.name}</h3>
            <div className="m-price">{rupiah(price)}<small>/hari</small></div>
            <div className="m-stock"><span className="dot" />{stock > 0 ? `Tersedia ${stock} unit` : 'Stok habis'}</div>
            {gear.description && <p className="m-desc">{gear.description}</p>}
            <div className="specs">
              {specs.map(([k, v]) => (
                <div className="spec" key={k}><div className="k">{k}</div><div className="v">{v}</div></div>
              ))}
            </div>
            <div className="m-actions">
              <div className="qty-stepper qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Kurangi"><Minus size={16} strokeWidth={2.5} /></button>
                <span className="qty-val">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(stock || 99, q + 1))} aria-label="Tambah"><Plus size={16} strokeWidth={2.5} /></button>
              </div>
              <button className="btn btn-primary" onClick={handleRent} disabled={stock <= 0}>Sewa Sekarang</button>
            </div>
            <div className="m-subtotal">Subtotal: <b>{rupiah(price * qty)}</b> / hari</div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { formatRupiah } from '@/lib/format';

/**
 * Formatted rupiah price display with per-day label.
 */
export default function PriceTag({ amount, label = 'Sewa / Hari' }) {
  return (
    <div>
      <span className="text-[10px] text-ink/50 block">{label}</span>
      <span className="font-display font-bold text-ink text-lg">{formatRupiah(amount)}</span>
    </div>
  );
}

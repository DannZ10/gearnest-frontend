'use client';

import React, { useEffect } from 'react';
import { formatRupiah, formatDate } from '@/lib/format';
import { Printer, X, Mountain } from 'lucide-react';

/**
 * Printable booking invoice for admins to hand to a customer.
 * Uses the shared `.print-receipt` / `.print-hide` styles so window.print()
 * isolates just this card.
 */
export default function BookingInvoice({ booking, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!booking) return null;

  const u = booking.user || {};
  const idents = [booking.identity_type_1, booking.identity_type_2].filter(Boolean).join(' + ') || '—';

  return (
    <div className="fixed inset-0 z-[80] bg-char/75 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
      <div className="print-receipt bg-white border-2 border-ink/10 rounded-md w-full max-w-lg my-8 p-6 sm:p-8 space-y-6 shadow-2xl relative text-ink">
        <button onClick={onClose} className="print-hide absolute top-4 right-4 p-2 text-ink/40 hover:text-ink">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start justify-between border-b-2 border-ink/10 pb-4">
          <div className="inline-flex items-center gap-2 font-display font-extrabold text-xl uppercase tracking-tight">
            <Mountain className="w-6 h-6 text-ember" />
            <span className="text-ink">Kembara<span className="text-ember">.id</span></span>
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink/50">Invoice</p>
            <p className="font-mono text-sm text-ember-2 font-bold">{booking.booking_code}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs bg-bone p-4 rounded-sm border-2 border-ink/10">
          <div><span className="text-ink/50 block font-mono text-[10px] uppercase">Penyewa</span><span className="font-bold text-ink">{u.name || '-'}</span></div>
          <div><span className="text-ink/50 block font-mono text-[10px] uppercase">Email</span><span className="font-bold text-ink break-all">{u.email || '-'}</span></div>
          <div><span className="text-ink/50 block font-mono text-[10px] uppercase">HP / WA</span><span className="font-bold text-ink">{u.phone || '-'}</span></div>
          <div><span className="text-ink/50 block font-mono text-[10px] uppercase">Status</span><span className="font-bold text-ink capitalize">{booking.status}</span></div>
          <div><span className="text-ink/50 block font-mono text-[10px] uppercase">Mulai</span><span className="font-bold text-ink">{formatDate(booking.start_date)}</span></div>
          <div><span className="text-ink/50 block font-mono text-[10px] uppercase">Selesai</span><span className="font-bold text-ink">{formatDate(booking.end_date)}</span></div>
        </div>

        <div className="space-y-2">
          <h4 className="font-mono text-[11px] font-bold text-ink uppercase tracking-[0.14em]">Rincian Peralatan</h4>
          <div className="divide-y divide-ink/10 text-xs">
            {booking.items?.map((it) => (
              <div key={it.id} className="py-2 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-ink">{it.gear?.name || 'Gear'}</span>
                  {it.variant_label && <span className="text-ink/50 text-[10px]"> ({it.variant_label})</span>}
                  <span className="text-ink/50 block text-[10px] font-mono">
                    {formatRupiah(it.price_per_day)} × {it.quantity} × {booking.duration_days} hari
                  </span>
                </div>
                <span className="font-bold text-ember-2">{formatRupiah(it.line_total)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t-2 border-ink/10 space-y-1.5 text-xs">
          <div className="flex justify-between text-ink/60"><span>Subtotal</span><span className="font-semibold text-ink">{formatRupiah(booking.subtotal)}</span></div>
          <div className="flex justify-between text-ink/60"><span>Ongkir ({booking.delivery_type})</span><span className="font-semibold text-ink">{formatRupiah(booking.delivery_fee)}</span></div>
          <div className="flex justify-between text-base font-display font-bold text-ink pt-2 border-t-2 border-ink/10 uppercase">
            <span>Total</span><span className="text-ember-2">{formatRupiah(booking.total_price)}</span>
          </div>
        </div>

        <div className="text-[11px] bg-bone p-3 rounded-sm border-2 border-ink/10 text-ink/70">
          <span className="font-semibold text-ink">Jaminan Identitas:</span> {idents} — {booking.identity_verified ? 'terverifikasi' : 'belum diverifikasi'}{booking.identity_returned ? ', sudah dikembalikan' : ''}.
        </div>

        <div className="print-hide">
          <button
            onClick={() => window.print()}
            className="w-full py-3 bg-ember hover:bg-ember-2 text-white font-display font-semibold uppercase tracking-wide text-sm rounded-md flex items-center justify-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" /> Cetak / Simpan PDF
          </button>
        </div>
      </div>
    </div>
  );
}

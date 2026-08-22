'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { formatRupiah, formatDate } from '@/lib/format';
import { toast } from 'sonner';
import RequireAuth from '@/components/templates/RequireAuth';
import CountUp from '@/components/atoms/CountUp';
import { ShoppingBag, CreditCard, Printer, X, Mountain, Package, Compass, Clock, Wallet } from 'lucide-react';

function StatusBadge({ status }) {
  const map = {
    confirmed: ['bg-moss/15 text-moss border-moss/40', 'Dikonfirmasi'],
    active: ['bg-trail/15 text-trail border-trail/40', 'Sedang Disewa'],
    returned: ['bg-ink/10 text-ink/60 border-ink/20', 'Selesai'],
    cancelled: ['bg-red-500/10 text-red-600 border-red-500/30', 'Dibatalkan'],
    pending: ['bg-ember/15 text-ember-2 border-ember/40', 'Menunggu Bayar'],
  };
  const [cls, label] = map[status] || map.pending;
  return (
    <span className={`font-mono text-[10px] font-bold px-2.5 py-1 rounded-sm border uppercase tracking-[0.12em] ${cls}`}>
      {label}
    </span>
  );
}

function StatCard({ icon: Icon, value, label, tint, decimals, suffix, currency }) {
  return (
    <div className="relative rounded-md border-2 border-ink/10 bg-white p-5 overflow-hidden">
      <span className={`absolute left-0 top-0 bottom-0 w-1 ${tint}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display font-bold text-4xl leading-none text-ink">
            {currency ? formatRupiah(value) : <CountUp value={value} decimals={decimals || 0} suffix={suffix || ''} />}
          </p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/50">{label}</p>
        </div>
        <span className="grid place-items-center w-9 h-9 rounded-md bg-ink/5 text-ink/60 shrink-0">
          <Icon className="w-4.5 h-4.5" strokeWidth={2} />
        </span>
      </div>
    </div>
  );
}

function AccountInner() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    async function fetchMyBookings() {
      try {
        const res = await api.get('/bookings');
        setBookings(res.data.data || []);
      } catch (err) {
        console.error('Failed fetching user bookings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMyBookings();
  }, []);

  const summary = useMemo(() => ({
    total: bookings.length,
    active: bookings.filter((b) => b.status === 'active').length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    value: bookings
      .filter((b) => b.status !== 'cancelled')
      .reduce((acc, b) => acc + Number(b.total_price || 0), 0),
  }), [bookings]);

  const handlePayNow = async (bookingId) => {
    try {
      const res = await api.post(`/bookings/${bookingId}/payment`);
      const payment = res.data.data;
      if (payment?.payment_url) {
        window.location.href = payment.payment_url;
      } else {
        toast.error('Gagal mengambil link pembayaran Midtrans.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal memproses pembayaran.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Command header */}
      <div className="relative overflow-hidden bg-char text-white rounded-xl border border-white/10 p-6 sm:p-9">
        <div className="absolute inset-0 gn-gridlines opacity-50" />
        <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-ember/25 blur-[90px]" />
        <div className="absolute -bottom-28 -left-16 w-72 h-72 rounded-full bg-trail/20 blur-[90px]" />
        <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-trail-2 mb-3">// Basecamp Penyewa</p>
            <h1 className="font-display font-bold uppercase text-3xl sm:text-5xl leading-[0.9] tracking-tight text-white">
              Halo,<br />{user?.name || 'Petualang'}.
            </h1>
            <p className="text-sm text-white/60 mt-3 max-w-md">Pantau status sewa, kelola pembayaran, dan cetak nota transaksimu.</p>
          </div>
          <Link
            href="/gears"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-ember hover:bg-ember-2 text-white font-display font-semibold uppercase tracking-wide text-sm rounded-md shadow-lg shadow-ember/25 transition-all"
          >
            <ShoppingBag className="w-4 h-4" /> Sewa Gear Baru
          </Link>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={Package} value={summary.total} label="Total Booking" tint="bg-ember" />
        <StatCard icon={Compass} value={summary.active} label="Sedang Disewa" tint="bg-trail" />
        <StatCard icon={Clock} value={summary.pending} label="Menunggu Bayar" tint="bg-ember-2" />
        <StatCard icon={Wallet} value={summary.value} label="Total Nilai Sewa" tint="bg-moss" currency />
      </div>

      {/* Bookings */}
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <h2 className="font-display font-bold uppercase text-2xl text-ink tracking-tight">Riwayat Booking</h2>
          <span className="flex-1 h-0.5 bg-ink/10" />
          <span className="font-mono text-xs text-ink/40">{bookings.length} entri</span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-44 bg-bone-2 rounded-md animate-pulse" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 bg-white border-2 border-dashed border-ink/15 rounded-md space-y-4">
            <ShoppingBag className="w-12 h-12 text-ink/20 mx-auto" />
            <h3 className="font-display font-bold uppercase text-lg text-ink">Belum Ada Riwayat</h3>
            <p className="text-sm text-ink/55">Kamu belum pernah menyewa gear di GearNest.</p>
            <Link href="/gears" className="inline-block px-5 py-2.5 bg-ember text-white text-sm font-display font-semibold uppercase tracking-wide rounded-md">
              Mulai Sewa Sekarang
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white border-2 border-ink/10 rounded-md p-5 sm:p-6 space-y-4 hover:border-ember/50 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink/10 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-ink text-sm tracking-wide">{booking.booking_code}</span>
                    <StatusBadge status={booking.status} />
                  </div>
                  <span className="font-mono text-[11px] text-ink/45">{formatDate(booking.created_at)}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="md:col-span-2 space-y-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/45 block">Peralatan</span>
                    <div className="flex flex-wrap gap-2">
                      {booking.items?.map((item) => (
                        <div key={item.id} className="bg-bone border border-ink/10 px-3 py-1.5 rounded-sm flex items-center gap-2">
                          <span className="font-semibold text-ink">{item.gear?.name || 'Gear'}</span>
                          <span className="bg-ink text-ember font-mono font-bold px-1.5 py-0.5 rounded-sm text-[10px]">{item.quantity}x</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 bg-bone p-3.5 rounded-sm border-2 border-ink/10">
                    <div className="flex justify-between">
                      <span className="text-ink/50">Periode</span>
                      <span className="font-semibold text-ink text-right">{formatDate(booking.start_date)} – {formatDate(booking.end_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink/50">Metode</span>
                      <span className="font-semibold text-ink capitalize">{booking.delivery_type}</span>
                    </div>
                    <div className="flex justify-between pt-1.5 border-t border-ink/10">
                      <span className="font-bold text-ink">Total</span>
                      <span className="font-display font-bold text-ember-2 text-base leading-none">{formatRupiah(booking.total_price)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedReceipt(booking)}
                    className="px-4 py-2.5 bg-bone hover:bg-bone-2 text-ink font-display font-semibold uppercase tracking-wide text-xs rounded-md flex items-center gap-2 transition-colors border-2 border-ink/10"
                  >
                    <Printer className="w-4 h-4 text-ember" /> Lihat Nota
                  </button>

                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handlePayNow(booking.id)}
                      className="px-5 py-2.5 bg-ember hover:bg-ember-2 text-white font-display font-semibold uppercase tracking-wide text-xs rounded-md flex items-center gap-2 transition-all shadow-md shadow-ember/25"
                    >
                      <CreditCard className="w-4 h-4" /> Bayar Sekarang
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Printable receipt */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-char/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="print-receipt bg-white border-2 border-ink/10 rounded-md w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl relative text-ink">
            <button onClick={() => setSelectedReceipt(null)} className="print-hide absolute top-4 right-4 p-2 text-ink/40 hover:text-ink">
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2 border-b-2 border-ink/10 pb-4">
              <div className="inline-flex items-center gap-2 font-display font-bold text-xl uppercase tracking-tight">
                <Mountain className="w-6 h-6 text-ember" />
                <span className="text-ink">GEAR<span className="text-ember">NEST</span></span>
              </div>
              <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink/50">Nota Transaksi Persewaan</h3>
              <p className="font-mono text-sm text-ember-2 font-bold">{selectedReceipt.booking_code}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-bone p-4 rounded-sm border-2 border-ink/10">
              <div><span className="text-ink/50 block font-mono text-[10px] uppercase">Penyewa</span><span className="font-bold text-ink">{user?.name}</span></div>
              <div><span className="text-ink/50 block font-mono text-[10px] uppercase">Tgl Pesan</span><span className="font-bold text-ink">{formatDate(selectedReceipt.created_at)}</span></div>
              <div><span className="text-ink/50 block font-mono text-[10px] uppercase">Mulai</span><span className="font-bold text-ink">{formatDate(selectedReceipt.start_date)}</span></div>
              <div><span className="text-ink/50 block font-mono text-[10px] uppercase">Selesai</span><span className="font-bold text-ink">{formatDate(selectedReceipt.end_date)}</span></div>
            </div>

            <div className="space-y-2">
              <h4 className="font-mono text-[11px] font-bold text-ink uppercase tracking-[0.14em]">Rincian Peralatan</h4>
              <div className="divide-y divide-ink/10 text-xs">
                {selectedReceipt.items?.map((item) => (
                  <div key={item.id} className="py-2 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-ink">{item.gear?.name}</span>
                      <span className="text-ink/50 block text-[10px] font-mono">
                        {formatRupiah(item.price_per_day)} × {item.quantity} × {selectedReceipt.duration_days} hari
                      </span>
                    </div>
                    <span className="font-bold text-ember-2">{formatRupiah(item.line_total)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t-2 border-ink/10 space-y-1.5 text-xs">
              <div className="flex justify-between text-ink/60"><span>Subtotal</span><span className="font-semibold text-ink">{formatRupiah(selectedReceipt.subtotal)}</span></div>
              <div className="flex justify-between text-ink/60"><span>Delivery ({selectedReceipt.delivery_type})</span><span className="font-semibold text-ink">{formatRupiah(selectedReceipt.delivery_fee)}</span></div>
              <div className="flex justify-between text-base font-display font-bold text-ink pt-2 border-t-2 border-ink/10 uppercase">
                <span>Total</span><span className="text-ember-2">{formatRupiah(selectedReceipt.total_price)}</span>
              </div>
            </div>

            <div className="print-hide pt-2">
              <button
                onClick={() => window.print()}
                className="w-full py-3 bg-ember hover:bg-ember-2 text-white font-display font-semibold uppercase tracking-wide text-sm rounded-md flex items-center justify-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4" /> Cetak / Simpan PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AccountPage() {
  return (
    <RequireAuth>
      <AccountInner />
    </RequireAuth>
  );
}

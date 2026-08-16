'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { formatRupiah, formatDate } from '@/lib/format';
import { toast } from 'sonner';
import RequireAuth from '@/components/templates/RequireAuth';
import { ShoppingBag, CreditCard, Printer, X, Mountain } from 'lucide-react';

function StatusBadge({ status }) {
  const map = {
    confirmed: ['bg-moss/15 text-moss border-moss/30', 'Dikonfirmasi'],
    active: ['bg-blue-500/10 text-blue-600 border-blue-500/20', 'Sedang Disewa'],
    returned: ['bg-ink/10 text-ink/60 border-ink/15', 'Selesai'],
    cancelled: ['bg-red-500/10 text-red-600 border-red-500/20', 'Dibatalkan'],
    pending: ['bg-ember/15 text-ember-2 border-ember/30', 'Menunggu Pembayaran'],
  };
  const [cls, label] = map[status] || map.pending;
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide ${cls}`}>
      {label}
    </span>
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
      {/* Welcome banner */}
      <div className="relative overflow-hidden bg-ink text-white gn-topo rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-ember/20 blur-3xl" />
        <div className="relative">
          <span className="text-xs font-display font-semibold uppercase tracking-[0.15em] text-ember">Dashboard Penyewa</span>
          <h1 className="font-display font-bold uppercase text-2xl sm:text-3xl text-white mt-1">Halo, {user?.name}!</h1>
          <p className="text-xs text-sand/70 mt-1">Pantau status persewaan dan cetak nota transaksi sewa gear-mu.</p>
        </div>
        <Link
          href="/gears"
          className="relative px-5 py-2.5 bg-ember hover:bg-ember-2 text-white font-display font-semibold uppercase tracking-wide text-xs rounded-xl shadow-lg shadow-ember/25 transition-all"
        >
          Sewa Gear Baru +
        </Link>
      </div>

      {/* Bookings */}
      <div className="space-y-4">
        <h2 className="font-display font-bold uppercase text-xl text-ink">Riwayat Booking Saya</h2>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-bone-2 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 bg-white border border-ink/10 rounded-3xl space-y-4">
            <ShoppingBag className="w-12 h-12 text-ink/25 mx-auto" />
            <h3 className="font-display font-bold uppercase text-lg text-ink">Belum Ada Riwayat Booking</h3>
            <p className="text-xs text-ink/55">Kamu belum pernah melakukan pemesanan sewa di GearNest.</p>
            <Link href="/gears" className="inline-block px-4 py-2 bg-ember text-white text-xs font-bold rounded-xl">
              Mulai Sewa Sekarang
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white border border-ink/10 rounded-3xl p-6 space-y-4 hover:border-ember/30 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-display font-bold text-ink text-base">{booking.booking_code}</span>
                    <StatusBadge status={booking.status} />
                  </div>
                  <span className="text-xs text-ink/50">Dibuat: {formatDate(booking.created_at)}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="md:col-span-2 space-y-2">
                    <span className="text-ink/50 font-medium block">Peralatan Disewa:</span>
                    <div className="flex flex-wrap gap-2">
                      {booking.items?.map((item) => (
                        <div key={item.id} className="bg-bone border border-ink/10 px-3 py-1.5 rounded-xl flex items-center gap-2">
                          <span className="font-semibold text-ink">{item.gear?.name || 'Gear'}</span>
                          <span className="bg-ink text-ember font-bold px-1.5 py-0.5 rounded text-[10px]">{item.quantity}x</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1 bg-bone p-3 rounded-2xl border border-ink/10">
                    <div className="flex justify-between">
                      <span className="text-ink/50">Periode:</span>
                      <span className="font-semibold text-ink">{formatDate(booking.start_date)} - {formatDate(booking.end_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink/50">Metode:</span>
                      <span className="font-semibold text-ink capitalize">{booking.delivery_type}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-1 border-t border-ink/10">
                      <span className="text-ink">Total:</span>
                      <span className="text-ember-2">{formatRupiah(booking.total_price)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedReceipt(booking)}
                    className="px-3.5 py-2 bg-bone hover:bg-bone-2 text-ink font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all border border-ink/10"
                  >
                    <Printer className="w-3.5 h-3.5 text-ember" /> Lihat Struk / Nota Sewa
                  </button>

                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handlePayNow(booking.id)}
                      className="px-4 py-2 bg-ember hover:bg-ember-2 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-ember/20"
                    >
                      <CreditCard className="w-3.5 h-3.5" /> Bayar Sekarang
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
        <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="print-receipt bg-white border border-ink/10 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl relative text-ink">
            <button onClick={() => setSelectedReceipt(null)} className="print-hide absolute top-4 right-4 p-2 text-ink/40 hover:text-ink">
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2 border-b border-ink/10 pb-4">
              <div className="inline-flex items-center gap-2 font-display font-bold text-xl">
                <Mountain className="w-6 h-6 text-ember" />
                <span className="text-ink">GEAR<span className="text-ember">NEST</span></span>
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-ink/50">Nota Transaksi Persewaan</h3>
              <p className="font-mono text-xs text-ember-2 font-extrabold">{selectedReceipt.booking_code}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-bone p-4 rounded-2xl border border-ink/10">
              <div><span className="text-ink/50 block">Penyewa</span><span className="font-bold text-ink">{user?.name}</span></div>
              <div><span className="text-ink/50 block">Tanggal Pemesanan</span><span className="font-bold text-ink">{formatDate(selectedReceipt.created_at)}</span></div>
              <div><span className="text-ink/50 block">Mulai Sewa</span><span className="font-bold text-ink">{formatDate(selectedReceipt.start_date)}</span></div>
              <div><span className="text-ink/50 block">Selesai Sewa</span><span className="font-bold text-ink">{formatDate(selectedReceipt.end_date)}</span></div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-ink uppercase tracking-wider">Rincian Peralatan</h4>
              <div className="divide-y divide-ink/10 text-xs">
                {selectedReceipt.items?.map((item) => (
                  <div key={item.id} className="py-2 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-ink">{item.gear?.name}</span>
                      <span className="text-ink/50 block text-[10px]">
                        {formatRupiah(item.price_per_day)} x {item.quantity} unit x {selectedReceipt.duration_days} hari
                      </span>
                    </div>
                    <span className="font-bold text-ember-2">{formatRupiah(item.line_total)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-ink/10 space-y-1.5 text-xs">
              <div className="flex justify-between text-ink/60"><span>Subtotal:</span><span className="font-semibold text-ink">{formatRupiah(selectedReceipt.subtotal)}</span></div>
              <div className="flex justify-between text-ink/60"><span>Delivery Fee ({selectedReceipt.delivery_type}):</span><span className="font-semibold text-ink">{formatRupiah(selectedReceipt.delivery_fee)}</span></div>
              <div className="flex justify-between text-sm font-extrabold text-ink pt-2 border-t border-ink/10">
                <span>Total Pembayaran:</span><span className="text-ember-2">{formatRupiah(selectedReceipt.total_price)}</span>
              </div>
            </div>

            <div className="print-hide pt-4 flex gap-3">
              <button
                onClick={() => window.print()}
                className="w-full py-3 bg-ember hover:bg-ember-2 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Printer className="w-4 h-4" /> Cetak / Save PDF Nota
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

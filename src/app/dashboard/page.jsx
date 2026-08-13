'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { formatRupiah, formatDate } from '@/lib/format';
import { toast } from 'sonner';
import { ShoppingBag, CreditCard, Calendar, Truck, ShieldCheck, Printer, X, Mountain, CheckCircle2 } from 'lucide-react';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/dashboard');
      return;
    }

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
  }, [isAuthenticated, router]);

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

  const handlePrintReceipt = () => {
    window.print();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">Dikonfirmasi</span>;
      case 'active':
        return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">Sedang Disewa</span>;
      case 'returned':
        return <span className="bg-slate-700 text-slate-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">Selesai (Dikembalikan)</span>;
      case 'cancelled':
        return <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">Dibatalkan</span>;
      default:
        return <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">Menunggu Pembayaran</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* User Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-emerald-400">Dashboard Penyewa</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Halo, {user?.name}!</h1>
          <p className="text-xs text-slate-400 mt-1">Pantau status persewaan dan cetak nota transaksi sewa gear Anda</p>
        </div>

        <Link
          href="/gears"
          className="px-5 py-2.5 bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-500/10"
        >
          Sewa Gear Baru +
        </Link>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight">Riwayat Booking Saya</h2>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-slate-900 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl space-y-4">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">Belum Ada Riwayat Booking</h3>
            <p className="text-xs text-slate-400">Anda belum pernah melakukan pemesanan sewa di GearNest.</p>
            <Link
              href="/gears"
              className="inline-block px-4 py-2 bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl"
            >
              Mulai Sewa Sekarang
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-slate-700 transition-all"
              >
                {/* Header Info */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-extrabold text-white text-base">{booking.booking_code}</span>
                    {getStatusBadge(booking.status)}
                  </div>
                  <span className="text-xs text-slate-400">Dibuat: {formatDate(booking.created_at)}</span>
                </div>

                {/* Items & Rental Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="md:col-span-2 space-y-2">
                    <span className="text-slate-400 font-medium block">Peralatan Disewa:</span>
                    <div className="flex flex-wrap gap-2">
                      {booking.items?.map((item) => (
                        <div
                          key={item.id}
                          className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2"
                        >
                          <span className="font-semibold text-white">{item.gear?.name || 'Gear'}</span>
                          <span className="bg-slate-800 text-emerald-400 font-bold px-1.5 py-0.5 rounded text-[10px]">
                            {item.quantity}x
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Periode:</span>
                      <span className="font-semibold text-white">{formatDate(booking.start_date)} - {formatDate(booking.end_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Metode:</span>
                      <span className="font-semibold text-white capitalize">{booking.delivery_type}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-1 border-t border-slate-800">
                      <span className="text-white">Total Tagihan:</span>
                      <span className="text-emerald-400">{formatRupiah(booking.total_price)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedReceipt(booking)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all border border-slate-700"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-400" /> Lihat Struk / Nota Sewa
                  </button>

                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handlePayNow(booking.id)}
                      className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/10"
                    >
                      <CreditCard className="w-3.5 h-3.5" /> Bayar Sekarang (Midtrans)
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-200">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Content Header */}
            <div className="text-center space-y-2 border-b border-slate-800 pb-4">
              <div className="inline-flex items-center gap-2 font-bold text-xl text-emerald-400">
                <Mountain className="w-6 h-6 text-emerald-400" />
                <span className="text-white">GearNest</span>
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Nota Transaksi Persewaan</h3>
              <p className="font-mono text-xs text-emerald-400 font-extrabold">{selectedReceipt.booking_code}</p>
            </div>

            {/* Customer & Period Details */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <span className="text-slate-500 block">Penyewa</span>
                <span className="font-bold text-white">{user?.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Tanggal Pemesanan</span>
                <span className="font-bold text-white">{formatDate(selectedReceipt.created_at)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Mulai Sewa</span>
                <span className="font-bold text-white">{formatDate(selectedReceipt.start_date)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Selesai Sewa</span>
                <span className="font-bold text-white">{formatDate(selectedReceipt.end_date)}</span>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Rincian Peralatan</h4>
              <div className="divide-y divide-slate-800 text-xs">
                {selectedReceipt.items?.map((item) => (
                  <div key={item.id} className="py-2 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-white">{item.gear?.name}</span>
                      <span className="text-slate-500 block text-[10px]">
                        {formatRupiah(item.price_per_day)} x {item.quantity} unit x {selectedReceipt.duration_days} hari
                      </span>
                    </div>
                    <span className="font-bold text-emerald-400">{formatRupiah(item.line_total)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Total */}
            <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="font-semibold text-white">{formatRupiah(selectedReceipt.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Delivery Fee ({selectedReceipt.delivery_type}):</span>
                <span className="font-semibold text-white">{formatRupiah(selectedReceipt.delivery_fee)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-slate-800">
                <span>Total Pembayaran:</span>
                <span className="text-emerald-400">{formatRupiah(selectedReceipt.total_price)}</span>
              </div>
            </div>

            {/* Print Action */}
            <div className="pt-4 flex gap-3">
              <button
                onClick={handlePrintReceipt}
                className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
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

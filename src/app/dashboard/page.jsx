'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { formatRupiah, formatDate } from '@/lib/format';
import { toast } from 'sonner';
import { ShoppingBag, CreditCard, Calendar, Truck, ShieldCheck, ExternalLink, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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
          <p className="text-xs text-slate-400 mt-1">Pantau status persewaan dan riwayat transaksi sewa gear Anda</p>
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
                {booking.status === 'pending' && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handlePayNow(booking.id)}
                      className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/10"
                    >
                      <CreditCard className="w-3.5 h-3.5" /> Bayar Sekarang (Midtrans Snap)
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatRupiah, formatDate } from '@/lib/format';
import { toast } from 'sonner';
import { ShieldCheck, CreditCard, Calendar, MapPin, Truck, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const {
    items,
    startDate,
    endDate,
    deliveryType,
    deliveryAddress,
    deliveryDistanceKm,
    getDurationDays,
    getSubtotal,
    getDeliveryFee,
    getTotalPrice,
    clearCart,
  } = useCartStore();

  const [notes, setNotes] = useState('');
  const [identityAgreed, setIdentityAgreed] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
  }, [isAuthenticated, router]);

  if (!mounted || items.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 text-center space-y-4">
        <p className="text-slate-400">Keranjang sewa Anda kosong.</p>
        <button
          onClick={() => router.push('/gears')}
          className="px-4 py-2 bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl"
        >
          Lihat Katalog Gear
        </button>
      </div>
    );
  }

  const handleCreateBooking = async () => {
    if (!identityAgreed) {
      toast.error('Anda harus menyetujui jaminan identitas (KTP/SIM/Paspor).');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create Booking in Laravel API
      const bookingPayload = {
        start_date: startDate,
        end_date: endDate,
        delivery_type: deliveryType,
        delivery_address: deliveryType === 'delivery' ? deliveryAddress : undefined,
        delivery_distance_km: deliveryType === 'delivery' ? deliveryDistanceKm : undefined,
        notes: notes || undefined,
        items: items.map((i) => ({
          gear_id: i.gear.id,
          quantity: i.quantity,
        })),
      };

      const bookingRes = await api.post('/bookings', bookingPayload);
      const booking = bookingRes.data.data;
      toast.success(`Booking ${booking.booking_code} berhasil dibuat!`);

      // 2. Request Midtrans Snap Payment URL
      const payRes = await api.post(`/bookings/${booking.id}/payment`);
      const paymentData = payRes.data.data;

      clearCart();

      // Redirect to Midtrans Snap Payment Page or Dashboard
      if (paymentData?.payment_url) {
        window.location.href = paymentData.payment_url;
      } else {
        router.push(`/dashboard`);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      const errMsg = err.response?.data?.message || 'Gagal membuat booking. Silakan coba lagi.';
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Konfirmasi Booking</h1>
        <p className="text-sm text-slate-400 mt-1">Periksa kembali rincian persewaan Anda sebelum melakukan pembayaran</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Customer & Delivery Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Customer Profile Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-3">
            <h3 className="font-bold text-white text-base">Informasi Penyewa</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Nama Lengkap</span>
                <span className="font-semibold text-white">{user?.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Email</span>
                <span className="font-semibold text-white">{user?.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Nomor HP / WhatsApp</span>
                <span className="font-semibold text-white">{user?.phone || '08123456789'}</span>
              </div>
            </div>
          </div>

          {/* Booking & Delivery Detail */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-white text-base">Rincian Sewa & Pengiriman</h3>

            <div className="grid grid-cols-2 gap-4 text-xs p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-slate-400 block">Periode</span>
                  <span className="font-bold text-white">{formatDate(startDate)} ➔ {formatDate(endDate)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-slate-400 block">Metode</span>
                  <span className="font-bold text-white capitalize">{deliveryType === 'pickup' ? 'Ambil Mandiri (Pickup)' : 'Layanan Antar'}</span>
                </div>
              </div>
            </div>

            {deliveryType === 'delivery' && (
              <div className="text-xs p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block font-medium">Alamat Pengiriman ({deliveryDistanceKm} km):</span>
                <p className="text-slate-200">{deliveryAddress}</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Catatan Tambahan (Opsional)</label>
              <input
                type="text"
                placeholder="Contoh: Titik temu di gerbang utama / antar jam 8 pagi..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Identity Guarantee Agreement */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-3">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Syarat Jaminan Identitas
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Sebagai syarat persewaan alat outdoor, Anda wajib membawa & menyerahkan 1 dokumen identitas asli (KTP / SIM / Paspor) saat pengambilan/serah terima gear. Dokumen akan dikembalikan utuh saat gear selesai disewakan.
            </p>

            <label className="flex items-center gap-3 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={identityAgreed}
                onChange={(e) => setIdentityAgreed(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-400 bg-slate-950 border-slate-800 focus:ring-emerald-500"
              />
              <span className="text-xs text-slate-300 font-medium">
                Saya setuju membawa identitas asli saat serah terima peralatan.
              </span>
            </label>
          </div>
        </div>

        {/* Right Column: Payment Box */}
        <div>
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 sticky top-24 shadow-xl">
            <h3 className="font-bold text-white text-lg border-b border-slate-800 pb-4">Pembayaran Midtrans</h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Durasi:</span>
                <span className="font-semibold text-slate-200">{getDurationDays()} Hari</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Subtotal Gear:</span>
                <span className="font-semibold text-slate-200">{formatRupiah(getSubtotal())}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Delivery Fee:</span>
                <span className="font-semibold text-slate-200">{formatRupiah(getDeliveryFee())}</span>
              </div>
              <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-sm">
                <span className="font-bold text-white">Total Tagihan:</span>
                <span className="font-extrabold text-emerald-400 text-lg">{formatRupiah(getTotalPrice())}</span>
              </div>
            </div>

            <button
              onClick={handleCreateBooking}
              disabled={submitting}
              className="w-full py-3.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Memproses Payment...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" /> Bayar Sekarang (Midtrans)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

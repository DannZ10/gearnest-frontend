'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatRupiah, formatDate } from '@/lib/format';
import { toast } from 'sonner';
import RequireAuth from '@/components/templates/RequireAuth';
import { ShieldCheck, CreditCard, Calendar, Truck, Loader2 } from 'lucide-react';

function CheckoutInner() {
  const router = useRouter();
  const { user } = useAuthStore();
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

  // Auth (and the persist-hydration race) is handled by RequireAuth below.
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || items.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 text-center space-y-4">
        <p className="text-ink/60">Keranjang sewa Anda kosong.</p>
        <button
          onClick={() => router.push('/gears')}
          className="px-4 py-2 bg-ember text-white font-bold text-xs rounded-md"
        >
          Lihat Katalog Gear
        </button>
      </div>
    );
  }

  // Dates are chosen on the cart page. Landing here without them (direct link,
  // back button) would fail booking validation with a confusing error.
  if (!startDate || !endDate) {
    return (
      <div className="max-w-md mx-auto my-20 text-center space-y-4">
        <p className="text-ink/60">Tanggal sewa belum diatur.</p>
        <button
          onClick={() => router.push('/cart')}
          className="px-4 py-2 bg-ember text-white font-bold text-xs rounded-md"
        >
          Atur Tanggal di Keranjang
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
      const bookingPayload = {
        start_date: startDate,
        end_date: endDate,
        delivery_type: deliveryType,
        delivery_address: deliveryType === 'delivery' ? deliveryAddress : undefined,
        delivery_distance_km: deliveryType === 'delivery' ? deliveryDistanceKm : undefined,
        notes: notes || undefined,
        items: items.map((i) => ({ gear_id: i.gear.id, quantity: i.quantity })),
      };

      const bookingRes = await api.post('/bookings', bookingPayload);
      const booking = bookingRes.data.data;
      toast.success(`Booking ${booking.booking_code} berhasil dibuat!`);

      const payRes = await api.post(`/bookings/${booking.id}/payment`);
      const paymentData = payRes.data.data;

      clearCart();

      if (paymentData?.payment_url) {
        window.location.href = paymentData.payment_url;
      } else {
        router.push('/account');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error(err.response?.data?.message || 'Gagal membuat booking. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-trail mb-3">// Konfirmasi</p>
        <h1 className="font-display font-bold uppercase text-4xl sm:text-5xl leading-[0.9] tracking-tight text-ink">Konfirmasi Booking</h1>
        <p className="text-sm text-ink/60 mt-3">Periksa kembali rincian persewaan sebelum membayar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border-2 border-ink/10 rounded-md p-6 space-y-3">
            <h3 className="font-display font-semibold uppercase tracking-wide text-ink text-base">Informasi Penyewa</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <Info label="Nama Lengkap" value={user?.name} />
              <Info label="Email" value={user?.email} />
              <Info label="Nomor HP / WhatsApp" value={user?.phone || '08123456789'} />
            </div>
          </div>

          <div className="bg-white border-2 border-ink/10 rounded-md p-6 space-y-4">
            <h3 className="font-display font-semibold uppercase tracking-wide text-ink text-base">Rincian Sewa & Pengiriman</h3>

            <div className="grid grid-cols-2 gap-4 text-xs p-4 bg-bone rounded-md border-2 border-ink/10">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-ember" />
                <div>
                  <span className="text-ink/50 block">Periode</span>
                  <span className="font-bold text-ink">{formatDate(startDate)} ➔ {formatDate(endDate)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-ember" />
                <div>
                  <span className="text-ink/50 block">Metode</span>
                  <span className="font-bold text-ink capitalize">{deliveryType === 'pickup' ? 'Ambil Mandiri (Pickup)' : 'Layanan Antar'}</span>
                </div>
              </div>
            </div>

            {deliveryType === 'delivery' && (
              <div className="text-xs p-4 bg-bone rounded-md border-2 border-ink/10 space-y-1">
                <span className="text-ink/50 block font-medium">Alamat Pengiriman ({deliveryDistanceKm} km):</span>
                <p className="text-ink">{deliveryAddress}</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-ink/60 mb-1">Catatan Tambahan (Opsional)</label>
              <input
                type="text"
                placeholder="Contoh: Titik temu di gerbang utama / antar jam 8 pagi..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-bone border border-ink/15 rounded-md px-4 py-2 text-sm text-ink focus:outline-none focus:border-ember"
              />
            </div>
          </div>

          <div className="bg-white border-2 border-ink/10 rounded-md p-6 space-y-3">
            <h3 className="font-display font-semibold uppercase tracking-wide text-ink text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-ember" /> Syarat Jaminan Identitas
            </h3>
            <p className="text-xs text-ink/60 leading-relaxed">
              Sebagai syarat persewaan alat outdoor, Anda wajib membawa & menyerahkan 1 dokumen identitas asli (KTP / SIM / Paspor) saat serah terima gear. Dokumen dikembalikan utuh saat gear selesai disewa.
            </p>
            <label className="flex items-center gap-3 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={identityAgreed}
                onChange={(e) => setIdentityAgreed(e.target.checked)}
                className="w-4 h-4 rounded accent-ember"
              />
              <span className="text-xs text-ink/70 font-medium">Saya setuju membawa identitas asli saat serah terima peralatan.</span>
            </label>
          </div>
        </div>

        {/* Right */}
        <div>
          <div className="bg-white border-2 border-ink/10 rounded-md p-6 space-y-6 sticky top-24 shadow-xl shadow-ink/5">
            <h3 className="font-display font-bold uppercase text-ink text-lg border-b border-ink/10 pb-4">Pembayaran Midtrans</h3>
            <div className="space-y-3 text-xs">
              <Row label="Durasi:" value={`${getDurationDays()} Hari`} />
              <Row label="Subtotal Gear:" value={formatRupiah(getSubtotal())} />
              <Row label="Delivery Fee:" value={formatRupiah(getDeliveryFee())} />
              <div className="pt-3 border-t border-ink/10 flex justify-between items-center text-sm">
                <span className="font-bold text-ink">Total Tagihan:</span>
                <span className="font-display font-bold text-ember-2 text-lg">{formatRupiah(getTotalPrice())}</span>
              </div>
            </div>
            <button
              onClick={handleCreateBooking}
              disabled={submitting}
              className="w-full py-3.5 bg-ember hover:bg-ember-2 text-white font-display font-semibold uppercase tracking-wide rounded-md shadow-lg shadow-ember/25 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</>
              ) : (
                <><CreditCard className="w-4 h-4" /> Bayar Sekarang</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <RequireAuth>
      <CheckoutInner />
    </RequireAuth>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <span className="text-ink/50 block">{label}</span>
      <span className="font-semibold text-ink">{value}</span>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-ink/60">
      <span>{label}</span>
      <span className="font-semibold text-ink">{value}</span>
    </div>
  );
}

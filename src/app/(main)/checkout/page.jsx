'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatRupiah, formatDate } from '@/lib/format';
import { toast } from 'sonner';
import RequireAuth from '@/components/templates/RequireAuth';
import { buildWhatsAppUrl } from '@/lib/config';
import { ShieldCheck, CreditCard, Calendar, Truck, Loader2, MapPin, MessageCircle } from 'lucide-react';

const IDENTITY_OPTIONS = ['KTP', 'SIM', 'KTM', 'Paspor'];

function CheckoutInner() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    items,
    startDate,
    endDate,
    deliveryType,
    deliveryAddress,
    deliveryMapsUrl,
    deliveryDistanceKm,
    paymentMethod,
    getDurationDays,
    getSubtotal,
    getDeliveryFee,
    getTotalPrice,
    clearCart,
  } = useCartStore();

  const isOnsite = paymentMethod === 'onsite';

  const [notes, setNotes] = useState('');
  // Default UNCHECKED so the customer actually reads the guarantee terms first.
  const [identityAgreed, setIdentityAgreed] = useState(false);
  const [identity1, setIdentity1] = useState('');
  const [identity2, setIdentity2] = useState('');
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

  const identityReady = identityAgreed && identity1 && identity2;

  const handleCreateBooking = async () => {
    if (!identity1 || !identity2) {
      toast.error('Pilih 2 dokumen identitas untuk jaminan.');
      return;
    }
    if (!identityAgreed) {
      toast.error('Centang persetujuan syarat jaminan identitas terlebih dahulu.');
      return;
    }

    setSubmitting(true);
    try {
      const onsiteNote = isOnsite ? '[Pembayaran di tempat]' : '';
      const bookingPayload = {
        start_date: startDate,
        end_date: endDate,
        delivery_type: deliveryType,
        delivery_address: deliveryType === 'delivery' ? deliveryAddress : undefined,
        delivery_maps_url: deliveryType === 'delivery' ? deliveryMapsUrl : undefined,
        identity_type_1: identity1,
        identity_type_2: identity2,
        identity_agreed: identityAgreed,
        notes: [notes, onsiteNote].filter(Boolean).join(' ') || undefined,
        items: items.map((i) => ({
          gear_id: i.gear.id,
          gear_variant_id: i.variant?.id ?? undefined,
          quantity: i.quantity,
        })),
      };

      const bookingRes = await api.post('/bookings', bookingPayload);
      const booking = bookingRes.data.data;
      toast.success(`Booking ${booking.booking_code} berhasil dibuat!`);

      // On-site: no Midtrans — send the customer to WhatsApp to confirm with admin.
      if (isOnsite) {
        const waUrl = buildWhatsAppUrl(booking, {
          items,
          deliveryType,
          deliveryAddress,
          deliveryMapsUrl,
          durationDays: getDurationDays(),
          total: getTotalPrice(),
        });
        clearCart();
        window.open(waUrl, '_blank', 'noopener');
        router.push('/account');
        return;
      }

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
              <div className="text-xs p-4 bg-bone rounded-md border-2 border-ink/10 space-y-1.5">
                <span className="text-ink/50 block font-medium">Alamat Pengiriman ({deliveryDistanceKm} km dari basecamp):</span>
                <p className="text-ink">{deliveryAddress}</p>
                {deliveryMapsUrl && (
                  <a
                    href={deliveryMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-trail hover:text-ember font-medium mt-1"
                  >
                    <MapPin className="w-3.5 h-3.5" /> Lihat titik lokasi di Google Maps
                  </a>
                )}
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

          <div className="bg-white border-2 border-ink/10 rounded-md p-6 space-y-4">
            <h3 className="font-display font-semibold uppercase tracking-wide text-ink text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-ember" /> Syarat Jaminan Identitas
            </h3>
            <p className="text-xs text-ink/60 leading-relaxed">
              Sebagai syarat persewaan alat outdoor, Anda <strong className="text-ink font-bold">wajib menyerahkan 2 (dua) dokumen identitas asli</strong> saat{' '}
              {deliveryType === 'pickup' ? 'pengambilan (pickup) di basecamp' : 'gear diantar ke lokasi Anda'}. Pilihan dokumen:{' '}
              <strong className="text-ink font-bold">KTP / SIM / KTM / Paspor</strong>. Kedua dokumen{' '}
              <strong className="text-ink font-bold">dikembalikan utuh</strong> saat gear selesai disewa dan dikembalikan lengkap.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-ink/60 mb-1">Dokumen Identitas #1</label>
                <select
                  value={identity1}
                  onChange={(e) => setIdentity1(e.target.value)}
                  className="w-full bg-bone border-2 border-ink/15 rounded-md px-3 py-2 text-sm text-ink focus:outline-none focus:border-ember appearance-none"
                >
                  <option value="">— Pilih —</option>
                  {IDENTITY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-ink/60 mb-1">Dokumen Identitas #2</label>
                <select
                  value={identity2}
                  onChange={(e) => setIdentity2(e.target.value)}
                  className="w-full bg-bone border-2 border-ink/15 rounded-md px-3 py-2 text-sm text-ink focus:outline-none focus:border-ember appearance-none"
                >
                  <option value="">— Pilih —</option>
                  {IDENTITY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={identityAgreed}
                onChange={(e) => setIdentityAgreed(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded accent-ember shrink-0"
              />
              <span className="text-xs text-ink/70 font-medium">
                Saya telah membaca &amp; <strong className="text-ink font-bold">setuju menyerahkan 2 identitas asli</strong> di atas saat serah terima peralatan.
              </span>
            </label>
          </div>
        </div>

        {/* Right */}
        <div>
          <div className="bg-white border-2 border-ink/10 rounded-md p-6 space-y-6 sticky top-24 shadow-xl shadow-ink/5">
            <h3 className="font-display font-bold uppercase text-ink text-lg border-b border-ink/10 pb-4">
              {isOnsite ? 'Bayar di Tempat' : 'Pembayaran Midtrans'}
            </h3>
            <div className="space-y-3 text-xs">
              <Row label="Durasi:" value={`${getDurationDays()} Hari`} />
              <Row label="Subtotal Gear:" value={formatRupiah(getSubtotal())} />
              <Row label="Delivery Fee:" value={formatRupiah(getDeliveryFee())} />
              <div className="pt-3 border-t border-ink/10 flex justify-between items-center text-sm">
                <span className="font-bold text-ink">Total {isOnsite ? 'Bayar di Tempat' : 'Tagihan'}:</span>
                <span className="font-display font-bold text-ember-2 text-lg">{formatRupiah(getTotalPrice())}</span>
              </div>
            </div>

            {isOnsite && (
              <p className="text-[11px] text-ink/55 bg-bone border border-ink/10 rounded-md p-3 leading-relaxed">
                Booking dibuat lalu Anda diarahkan ke <span className="font-semibold text-ink">WhatsApp admin</span> untuk konfirmasi. Pembayaran dilakukan <span className="font-semibold text-ink">tunai saat serah terima gear</span>.
              </p>
            )}

            <button
              onClick={handleCreateBooking}
              disabled={submitting || !identityReady}
              className={`w-full py-3.5 text-white font-display font-semibold uppercase tracking-wide rounded-md shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed ${
                isOnsite
                  ? 'bg-[#25D366] hover:bg-[#1ebe5b] shadow-[#25D366]/25 disabled:hover:bg-[#25D366]'
                  : 'bg-ember hover:bg-ember-2 shadow-ember/25 disabled:hover:bg-ember'
              }`}
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</>
              ) : isOnsite ? (
                <><MessageCircle className="w-4 h-4" /> Konfirmasi via WhatsApp</>
              ) : (
                <><CreditCard className="w-4 h-4" /> Bayar Sekarang</>
              )}
            </button>
            {!identityReady && (
              <p className="text-[11px] text-ink/45 text-center -mt-3">
                Pilih 2 identitas &amp; centang persetujuan untuk mengaktifkan {isOnsite ? 'konfirmasi' : 'pembayaran'}.
              </p>
            )}
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

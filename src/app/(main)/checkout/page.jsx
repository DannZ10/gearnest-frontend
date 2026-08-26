'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatDate } from '@/lib/format';
import { rupiah } from '@/lib/useReveal';
import { toast } from 'sonner';
import RequireAuth from '@/components/templates/RequireAuth';
import { buildWhatsAppUrl } from '@/lib/config';
import { ShieldCheck, CreditCard, Calendar, Truck, Loader2, MapPin, MessageCircle } from 'lucide-react';

const IDENTITY_OPTIONS = ['KTP', 'SIM', 'KTM', 'Paspor'];

function CheckoutInner() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    items, startDate, endDate, deliveryType, deliveryAddress, deliveryMapsUrl, deliveryDistanceKm,
    paymentMethod, getDurationDays, getSubtotal, getDeliveryFee, getTotalPrice, clearCart,
  } = useCartStore();

  const isOnsite = paymentMethod === 'onsite';
  const [notes, setNotes] = useState('');
  const [identityAgreed, setIdentityAgreed] = useState(false);
  const [identity1, setIdentity1] = useState('');
  const [identity2, setIdentity2] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted || items.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <p className="lead" style={{ marginBottom: 16 }}>Keranjang sewa kamu kosong.</p>
        <button onClick={() => router.push('/gears')} className="btn btn-primary">Lihat Katalog Gear</button>
      </div>
    );
  }
  if (!startDate || !endDate) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <p className="lead" style={{ marginBottom: 16 }}>Tanggal sewa belum diatur.</p>
        <button onClick={() => router.push('/cart')} className="btn btn-primary">Atur Tanggal di Keranjang</button>
      </div>
    );
  }

  const identityReady = identityAgreed && identity1 && identity2;

  const handleCreateBooking = async () => {
    if (!identity1 || !identity2) { toast.error('Pilih 2 dokumen identitas untuk jaminan.'); return; }
    if (!identityAgreed) { toast.error('Centang persetujuan syarat jaminan identitas.'); return; }
    setSubmitting(true);
    try {
      const onsiteNote = isOnsite ? '[Pembayaran di tempat]' : '';
      const bookingPayload = {
        start_date: startDate, end_date: endDate, delivery_type: deliveryType,
        delivery_address: deliveryType === 'delivery' ? deliveryAddress : undefined,
        delivery_maps_url: deliveryType === 'delivery' ? deliveryMapsUrl : undefined,
        identity_type_1: identity1, identity_type_2: identity2, identity_agreed: identityAgreed,
        notes: [notes, onsiteNote].filter(Boolean).join(' ') || undefined,
        items: items.map((i) => ({ gear_id: i.gear.id, gear_variant_id: i.variant?.id ?? undefined, quantity: i.quantity })),
      };
      const bookingRes = await api.post('/bookings', bookingPayload);
      const booking = bookingRes.data.data;
      toast.success(`Booking ${booking.booking_code} berhasil dibuat!`);
      if (isOnsite) {
        const waUrl = buildWhatsAppUrl(booking, { items, deliveryType, deliveryAddress, deliveryMapsUrl, durationDays: getDurationDays(), total: getTotalPrice() });
        clearCart(); window.open(waUrl, '_blank', 'noopener'); router.push('/account'); return;
      }
      const payRes = await api.post(`/bookings/${booking.id}/payment`);
      const paymentData = payRes.data.data;
      clearCart();
      if (paymentData?.payment_url) window.location.href = paymentData.payment_url;
      else router.push('/account');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal membuat booking. Silakan coba lagi.');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="container" style={{ padding: '48px 0 88px', maxWidth: 1000 }}>
      <div className="section-head">
        <span className="eyebrow">Konfirmasi</span>
        <h2 className="h2">Konfirmasi <span className="accent">Booking</span></h2>
        <p className="lead">Periksa kembali rincian persewaan sebelum membayar.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.7fr) minmax(0,.9fr)', gap: 32, alignItems: 'start' }} className="cart-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="panel">
            <h3 className="panel-h">Informasi Penyewa</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Info label="Nama Lengkap" value={user?.name} />
              <Info label="Email" value={user?.email} />
              <Info label="Nomor HP / WhatsApp" value={user?.phone || '—'} />
            </div>
          </div>

          <div className="panel">
            <h3 className="panel-h">Rincian Sewa &amp; Pengiriman</h3>
            <div className="dur-note" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, background: 'var(--surface-sand)' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Calendar size={16} style={{ color: 'var(--accent-cta)' }} /><div><span style={{ display: 'block', color: 'var(--neutral-400)', fontSize: 11 }}>Periode</span><b style={{ color: 'var(--primary-900)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>{formatDate(startDate)} → {formatDate(endDate)}</b></div></div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Truck size={16} style={{ color: 'var(--accent-cta)' }} /><div><span style={{ display: 'block', color: 'var(--neutral-400)', fontSize: 11 }}>Metode</span><b style={{ color: 'var(--primary-900)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>{deliveryType === 'pickup' ? 'Pickup' : 'Delivery'}</b></div></div>
            </div>
            {deliveryType === 'delivery' && (
              <div style={{ marginTop: 12, fontSize: 12.5, color: 'var(--neutral-800)' }}>
                <span style={{ color: 'var(--neutral-400)' }}>Alamat ({deliveryDistanceKm} km dari basecamp):</span>
                <p style={{ marginTop: 4 }}>{deliveryAddress}</p>
                {deliveryMapsUrl && <a href={deliveryMapsUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-700)', display: 'inline-flex', gap: 6, alignItems: 'center', marginTop: 4, fontWeight: 600 }}><MapPin size={14} /> Lihat titik lokasi</a>}
              </div>
            )}
            <div className="field" style={{ marginTop: 14 }}>
              <label>Catatan Tambahan (opsional)</label>
              <input type="text" placeholder="Titik temu di gerbang utama / antar jam 8 pagi…" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>

          <div className="panel">
            <h3 className="panel-h"><ShieldCheck size={18} /> Syarat Jaminan Identitas</h3>
            <p style={{ fontSize: 12.5, color: 'var(--neutral-800)', lineHeight: 1.65 }}>
              Sebagai syarat sewa, kamu <b>wajib menyerahkan 2 dokumen identitas asli</b> saat {deliveryType === 'pickup' ? 'pengambilan di basecamp' : 'gear diantar'}. Pilihan: <b>KTP / SIM / KTM / Paspor</b>. Keduanya <b>dikembalikan utuh</b> saat gear selesai disewa.
            </p>
            <div className="field-row" style={{ marginTop: 14 }}>
              <div className="field"><label>Dokumen #1 <span className="req">*</span></label>
                <select value={identity1} onChange={(e) => setIdentity1(e.target.value)}><option value="">— Pilih —</option>{IDENTITY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}</select>
              </div>
              <div className="field"><label>Dokumen #2 <span className="req">*</span></label>
                <select value={identity2} onChange={(e) => setIdentity2(e.target.value)}><option value="">— Pilih —</option>{IDENTITY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}</select>
              </div>
            </div>
            <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', marginTop: 14 }}>
              <input type="checkbox" checked={identityAgreed} onChange={(e) => setIdentityAgreed(e.target.checked)} style={{ width: 16, height: 16, marginTop: 2, accentColor: 'var(--accent-cta)', flexShrink: 0 }} />
              <span style={{ fontSize: 12.5, color: 'var(--neutral-800)' }}>Saya telah membaca &amp; <b>setuju menyerahkan 2 identitas asli</b> saat serah terima peralatan.</span>
            </label>
          </div>
        </div>

        <div className="summary gn-topo" style={{ position: 'sticky', top: 96 }}>
          <h4>{isOnsite ? 'Bayar di Tempat' : 'Pembayaran Midtrans'}</h4>
          <p className="s-sub">{isOnsite ? 'Bayar tunai saat serah terima' : 'Transfer / QRIS / e-wallet via Midtrans'}</p>
          <div className="sum-line"><span className="k">Durasi</span><span className="v">{getDurationDays()} hari</span></div>
          <div className="sum-line"><span className="k">Subtotal gear</span><span className="v">{rupiah(getSubtotal())}</span></div>
          <div className="sum-line"><span className="k">Ongkir</span><span className="v">{getDeliveryFee() ? rupiah(getDeliveryFee()) : 'Gratis'}</span></div>
          <div className="sum-line total"><span className="k">Total</span><span className="v">{rupiah(getTotalPrice())}</span></div>
          <button onClick={handleCreateBooking} disabled={submitting || !identityReady} className="btn" style={{ width: '100%', marginTop: 18, background: isOnsite ? '#25D366' : 'var(--accent-cta)', color: '#fff', opacity: (submitting || !identityReady) ? 0.45 : 1, cursor: (submitting || !identityReady) ? 'not-allowed' : 'pointer' }}>
            {submitting ? <><Loader2 size={16} className="spin" /> Memproses…</> : isOnsite ? <><MessageCircle size={16} /> Konfirmasi via WhatsApp</> : <><CreditCard size={16} /> Bayar Sekarang</>}
          </button>
          {!identityReady && <p className="sum-note">Pilih 2 identitas &amp; centang persetujuan untuk melanjutkan.</p>}
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (<RequireAuth><CheckoutInner /></RequireAuth>);
}

function Info({ label, value }) {
  return (<div><span style={{ display: 'block', color: 'var(--neutral-400)', fontSize: 11 }}>{label}</span><span style={{ fontWeight: 600, color: 'var(--primary-900)', fontSize: 13.5 }}>{value}</span></div>);
}

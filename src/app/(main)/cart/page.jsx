'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useCartStore, cartLineKey } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatRupiah } from '@/lib/format';
import { toast } from 'sonner';
import { ShoppingBag, Trash2, Plus, Minus, Calendar, Truck, Store, ArrowRight, MapPin, Loader2, Navigation, MessageCircle, CreditCard } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const {
    items,
    startDate,
    endDate,
    deliveryType,
    deliveryAddress,
    deliveryMapsUrl,
    deliveryDistanceKm,
    removeItem,
    updateQuantity,
    setBookingDates,
    setDeliveryInfo,
    setDeliveryQuote,
    setPaymentMethod,
    getDurationDays,
    getTotalWeightKg,
    getSubtotal,
    getDeliveryFee,
    getTotalPrice,
  } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [localStartDate, setLocalStartDate] = useState(startDate || '');
  const [localEndDate, setLocalEndDate] = useState(endDate || '');
  const [localAddress, setLocalAddress] = useState(deliveryAddress || '');
  const [localMapsUrl, setLocalMapsUrl] = useState(deliveryMapsUrl || '');
  const [quoting, setQuoting] = useState(false);
  const [quoteErr, setQuoteErr] = useState('');

  useEffect(() => {
    setMounted(true);
    if (!startDate || !endDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const threeDays = new Date();
      threeDays.setDate(threeDays.getDate() + 3);
      const sStr = tomorrow.toISOString().split('T')[0];
      const eStr = threeDays.toISOString().split('T')[0];
      setLocalStartDate(sStr);
      setLocalEndDate(eStr);
      setBookingDates(sStr, eStr);
    }
  }, []);

  const itemsSig = items.map((i) => `${i.gear.id}:${i.variant?.id || ''}:${i.quantity}`).join(',');

  // Live delivery-fee quote (server-side distance from the Google Maps link + weight).
  useEffect(() => {
    if (!mounted) return;
    if (deliveryType !== 'delivery' || !deliveryMapsUrl.trim() || items.length === 0) {
      setQuoteErr('');
      setDeliveryQuote({ distanceKm: 0, deliveryFee: 0 });
      return;
    }
    const t = setTimeout(async () => {
      setQuoting(true);
      setQuoteErr('');
      try {
        const res = await api.post('/delivery/quote', {
          delivery_type: 'delivery',
          delivery_maps_url: deliveryMapsUrl,
          items: items.map((i) => ({ gear_id: i.gear.id, quantity: i.quantity })),
        });
        const d = res.data.data;
        setDeliveryQuote({ distanceKm: d.distance_km, deliveryFee: d.delivery_fee });
      } catch (err) {
        setQuoteErr(err.response?.data?.message || 'Gagal menghitung ongkir dari link tersebut.');
        setDeliveryQuote({ distanceKm: 0, deliveryFee: 0 });
      } finally {
        setQuoting(false);
      }
    }, 600);
    return () => clearTimeout(t);
  }, [mounted, deliveryType, deliveryMapsUrl, itemsSig]);

  const handleDateChange = (start, end) => {
    setLocalStartDate(start);
    setLocalEndDate(end);
    setBookingDates(start, end);
  };

  const handleDeliveryTypeChange = (type) => setDeliveryInfo(type, localAddress, localMapsUrl);

  const handleAddressChange = (addr) => {
    setLocalAddress(addr);
    setDeliveryInfo(deliveryType, addr, localMapsUrl);
  };

  const handleMapsUrlChange = (url) => {
    setLocalMapsUrl(url);
    setDeliveryInfo(deliveryType, localAddress, url);
  };

  // Both payment choices go through checkout (identity is mandatory to create a
  // booking). The chosen method decides the final action there: Midtrans vs WhatsApp.
  const proceed = (method) => {
    if (!isAuthenticated) {
      toast.error('Silakan login terlebih dahulu untuk melakukan booking.');
      router.push('/login?redirect=/cart');
      return;
    }
    if (items.length === 0) {
      toast.error('Keranjang sewa Anda masih kosong!');
      return;
    }
    if (!localStartDate || !localEndDate) {
      toast.error('Pilih tanggal mulai dan selesai sewa!');
      return;
    }
    if (deliveryType === 'delivery') {
      if (!localAddress.trim()) { toast.error('Isi alamat pengiriman lengkap!'); return; }
      if (!localMapsUrl.trim()) { toast.error('Tempel link Google Maps lokasi pengiriman!'); return; }
      if (quoting) { toast.error('Tunggu perhitungan ongkir selesai…'); return; }
      if (deliveryDistanceKm <= 0) { toast.error('Ongkir belum terhitung. Pastikan link Google Maps valid.'); return; }
    }
    setPaymentMethod(method);
    router.push('/checkout');
  };

  if (!mounted) return null;

  const dateCls =
    'w-full bg-bone border border-ink/15 rounded-md px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-ember';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-trail mb-3">// Keranjang</p>
        <h1 className="font-display font-bold uppercase text-4xl sm:text-5xl leading-[0.9] tracking-tight text-ink">Keranjang Sewa</h1>
        <p className="text-sm text-ink/60 mt-3">Atur tanggal sewa, jumlah unit, dan metode pengiriman.</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white border-2 border-ink/10 rounded-md space-y-4">
          <ShoppingBag className="w-16 h-16 text-ink/25 mx-auto" />
          <h3 className="font-display font-bold uppercase text-xl text-ink">Keranjang Sewa Kosong</h3>
          <p className="text-sm text-ink/55 max-w-sm mx-auto">Kamu belum menambahkan peralatan outdoor ke keranjang.</p>
          <Link
            href="/gears"
            className="inline-flex items-center gap-2 px-6 py-3 bg-ember text-white font-display font-semibold uppercase tracking-wide text-sm rounded-md hover:bg-ember-2 transition-all"
          >
            Pilih Alat Outdoor
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dates */}
            <div className="bg-white border-2 border-ink/10 rounded-md p-6 space-y-4">
              <h3 className="font-display font-semibold uppercase tracking-wide text-ink text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-ember" /> Atur Tanggal Sewa
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ink/60 mb-1">Tanggal Mulai Sewa</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={localStartDate}
                    onChange={(e) => handleDateChange(e.target.value, localEndDate)}
                    className={dateCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink/60 mb-1">Tanggal Selesai Sewa</label>
                  <input
                    type="date"
                    min={localStartDate || new Date().toISOString().split('T')[0]}
                    value={localEndDate}
                    onChange={(e) => handleDateChange(localStartDate, e.target.value)}
                    className={dateCls}
                  />
                </div>
              </div>
              <div className="p-3 bg-bone rounded-md border-2 border-ink/10 flex items-center justify-between text-xs">
                <span className="text-ink/60">Total Durasi Sewa:</span>
                <span className="font-display font-bold text-ember-2">{getDurationDays()} Hari</span>
              </div>
            </div>

            {/* Delivery */}
            <div className="bg-white border-2 border-ink/10 rounded-md p-6 space-y-4">
              <h3 className="font-display font-semibold uppercase tracking-wide text-ink text-base flex items-center gap-2">
                <Truck className="w-5 h-5 text-ember" /> Metode Pengiriman
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleDeliveryTypeChange('pickup')}
                  className={`p-4 rounded-md border text-left flex items-start gap-3 transition-all ${
                    deliveryType === 'pickup'
                      ? 'bg-ember/10 border-ember text-ink'
                      : 'bg-bone border-ink/10 text-ink/60 hover:border-ink/25'
                  }`}
                >
                  <Store className="w-6 h-6 text-ember mt-1" />
                  <div>
                    <h4 className="font-bold text-sm text-ink">Ambil Mandiri (Pickup)</h4>
                    <p className="text-xs text-ink/55 mt-0.5">Ambil di Basecamp Kembara.id (Gratis)</p>
                    <span className="inline-block mt-2 font-bold text-xs text-moss">Rp 0</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeliveryTypeChange('delivery')}
                  className={`p-4 rounded-md border text-left flex items-start gap-3 transition-all ${
                    deliveryType === 'delivery'
                      ? 'bg-ember/10 border-ember text-ink'
                      : 'bg-bone border-ink/10 text-ink/60 hover:border-ink/25'
                  }`}
                >
                  <Truck className="w-6 h-6 text-ember mt-1" />
                  <div>
                    <h4 className="font-bold text-sm text-ink">Layanan Antar</h4>
                    <p className="text-xs text-ink/55 mt-0.5">Dikirim langsung ke lokasimu</p>
                    <span className="inline-block mt-2 font-bold text-xs text-ember-2">Rp 10.000 (≤5km & ≤5kg) · +Rp 1.000 / km atau kg</span>
                  </div>
                </button>
              </div>

              {deliveryType === 'delivery' && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-ink/60 mb-1">Alamat Lengkap Pengiriman</label>
                    <textarea
                      rows={2}
                      placeholder="Nama jalan, nomor rumah, RT/RW, dan patokan..."
                      value={localAddress}
                      onChange={(e) => handleAddressChange(e.target.value)}
                      className="w-full bg-bone border border-ink/15 rounded-md px-4 py-2 text-sm text-ink focus:outline-none focus:border-ember"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink/60 mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-ember" /> Link Google Maps Lokasi Pengiriman
                    </label>
                    <input
                      type="url"
                      inputMode="url"
                      placeholder="https://maps.app.goo.gl/… (share titik lokasi dari Google Maps)"
                      value={localMapsUrl}
                      onChange={(e) => handleMapsUrlChange(e.target.value)}
                      className="w-full bg-bone border border-ink/15 rounded-md px-4 py-2 text-sm text-ink focus:outline-none focus:border-ember"
                    />
                    <p className="text-[11px] text-ink/45 mt-1">
                      Buka Google Maps → cari lokasimu → <span className="font-semibold">Bagikan</span> → salin link, tempel di sini. Jarak & ongkir dihitung otomatis dari basecamp.
                    </p>

                    {/* Quote feedback */}
                    <div className="mt-2">
                      {quoting ? (
                        <span className="inline-flex items-center gap-2 text-xs text-ink/60">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Menghitung jarak & ongkir…
                        </span>
                      ) : quoteErr ? (
                        <span className="text-xs text-red-600 font-medium">{quoteErr}</span>
                      ) : deliveryDistanceKm > 0 ? (
                        <div className="flex flex-wrap gap-2 text-[11px]">
                          <span className="inline-flex items-center gap-1.5 font-mono uppercase tracking-wide bg-trail/10 border border-trail/20 text-trail px-2.5 py-1 rounded-sm">
                            <Navigation className="w-3.5 h-3.5" /> {deliveryDistanceKm} km
                          </span>
                          <span className="inline-flex items-center gap-1.5 font-mono uppercase tracking-wide bg-bone border border-ink/10 text-ink/70 px-2.5 py-1 rounded-sm">
                            {getTotalWeightKg().toFixed(1)} kg
                          </span>
                          <span className="inline-flex items-center gap-1.5 font-mono uppercase tracking-wide bg-ember/10 border border-ember/20 text-ember-2 px-2.5 py-1 rounded-sm font-bold">
                            Ongkir {formatRupiah(getDeliveryFee())}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="bg-white border-2 border-ink/10 rounded-md p-6 space-y-4">
              <h3 className="font-display font-semibold uppercase tracking-wide text-ink text-base">Daftar Gear</h3>
              <div className="divide-y divide-ink/10">
                {items.map((item) => {
                  const key = cartLineKey(item.gear.id, item.variant?.id);
                  const maxStock = item.variant ? Number(item.variant.stock ?? 0) : Number(item.gear.stock_available ?? 0);
                  return (
                    <div key={key} className="py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <img
                          src={item.gear.image_url || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200&auto=format&fit=crop&q=80'}
                          alt={item.gear.name}
                          className="w-16 h-16 object-cover rounded-md border-2 border-ink/10 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-semibold text-ink text-sm line-clamp-1">{item.gear.name}</h4>
                          {item.variant && (
                            <span className="inline-block mt-0.5 font-mono text-[10px] uppercase tracking-wide bg-ember/10 text-ember-2 px-2 py-0.5 rounded-sm border border-ember/20">
                              {item.variant.label}
                            </span>
                          )}
                          <p className="text-xs text-ember-2 font-semibold mt-0.5">{formatRupiah(item.gear.price_per_day)} / hari</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-bone border-2 border-ink/10 rounded-md p-1">
                          <button onClick={() => updateQuantity(key, item.quantity - 1)} className="p-1 text-ink/50 hover:text-ink">
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold text-ink px-2">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(key, item.quantity + 1)}
                            disabled={item.quantity >= maxStock}
                            className="p-1 text-ink/50 hover:text-ink disabled:opacity-30"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(key)}
                          className="p-2 text-ink/40 hover:text-red-600 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="h-fit sticky top-24">
            <div className="bg-white border-2 border-ink/10 rounded-md p-6 space-y-6 shadow-xl shadow-ink/5">
              <h3 className="font-display font-bold uppercase text-ink text-lg border-b border-ink/10 pb-4">Ringkasan Biaya</h3>
              <div className="space-y-3 text-xs">
                <Row label="Total Unit Gear:" value={`${items.reduce((acc, i) => acc + i.quantity, 0)} Unit`} />
                <Row label="Berat Total:" value={`${getTotalWeightKg().toFixed(1)} kg`} />
                <Row label="Durasi Sewa:" value={`${getDurationDays()} Hari`} />
                <Row label="Subtotal Sewa:" value={formatRupiah(getSubtotal())} />
                <Row
                  label="Biaya Pengiriman:"
                  value={
                    deliveryType === 'pickup'
                      ? 'Gratis (Pickup)'
                      : quoting
                        ? 'Menghitung…'
                        : deliveryDistanceKm > 0
                          ? formatRupiah(getDeliveryFee())
                          : 'Isi link Maps'
                  }
                />
                <div className="pt-3 border-t border-ink/10 flex justify-between items-center text-sm">
                  <span className="font-bold text-ink">Total Pembayaran:</span>
                  <span className="font-display font-bold text-ember-2 text-lg">{formatRupiah(getTotalPrice())}</span>
                </div>
              </div>
              <div className="space-y-2.5">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/45 text-center">Pilih Metode Pembayaran</p>
                <button
                  onClick={() => proceed('online')}
                  className="w-full py-3.5 bg-ember hover:bg-ember-2 text-white font-display font-semibold uppercase tracking-wide rounded-md shadow-lg shadow-ember/25 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <CreditCard className="w-4 h-4" /> Bayar Online <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => proceed('onsite')}
                  className="w-full py-3.5 bg-[#25D366] hover:bg-[#1ebe5b] text-white font-display font-semibold uppercase tracking-wide rounded-md shadow-lg shadow-[#25D366]/25 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <MessageCircle className="w-4 h-4" /> Bayar di Tempat
                </button>
                <p className="text-[11px] text-ink/45 text-center leading-relaxed">
                  <span className="font-semibold text-ink/60">Bayar di Tempat</span>: konfirmasi ke admin via WhatsApp, bayar saat serah terima gear.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
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

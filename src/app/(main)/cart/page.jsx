'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatRupiah } from '@/lib/format';
import { toast } from 'sonner';
import { ShoppingBag, Trash2, Plus, Minus, Calendar, Truck, Store, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const {
    items,
    startDate,
    endDate,
    deliveryType,
    deliveryAddress,
    deliveryDistanceKm,
    removeItem,
    updateQuantity,
    setBookingDates,
    setDeliveryInfo,
    getDurationDays,
    getSubtotal,
    getDeliveryFee,
    getTotalPrice,
  } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [localStartDate, setLocalStartDate] = useState(startDate || '');
  const [localEndDate, setLocalEndDate] = useState(endDate || '');
  const [localAddress, setLocalAddress] = useState(deliveryAddress || '');
  const [localDistance, setLocalDistance] = useState(deliveryDistanceKm || 5);

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

  const handleDateChange = (start, end) => {
    setLocalStartDate(start);
    setLocalEndDate(end);
    setBookingDates(start, end);
  };

  const handleDeliveryTypeChange = (type) => setDeliveryInfo(type, localAddress, localDistance);

  const handleAddressChange = (addr) => {
    setLocalAddress(addr);
    setDeliveryInfo(deliveryType, addr, localDistance);
  };

  const handleDistanceChange = (dist) => {
    const num = Math.max(1, Number(dist) || 1);
    setLocalDistance(num);
    setDeliveryInfo(deliveryType, localAddress, num);
  };

  const handleProceedCheckout = () => {
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
    if (deliveryType === 'delivery' && !localAddress.trim()) {
      toast.error('Isi alamat pengiriman lengkap!');
      return;
    }
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
                    <p className="text-xs text-ink/55 mt-0.5">Ambil di Basecamp GearNest (Gratis)</p>
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
                    <span className="inline-block mt-2 font-bold text-xs text-ember-2">Rp 10.000 + Rp 3.000/km</span>
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
                    <label className="block text-xs font-medium text-ink/60 mb-1">Estimasi Jarak Pengiriman (km)</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={localDistance}
                      onChange={(e) => handleDistanceChange(e.target.value)}
                      className="w-full bg-bone border border-ink/15 rounded-md px-4 py-2 text-sm text-ink focus:outline-none focus:border-ember"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="bg-white border-2 border-ink/10 rounded-md p-6 space-y-4">
              <h3 className="font-display font-semibold uppercase tracking-wide text-ink text-base">Daftar Gear</h3>
              <div className="divide-y divide-ink/10">
                {items.map((item) => (
                  <div key={item.gear.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.gear.image_url || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200&auto=format&fit=crop&q=80'}
                        alt={item.gear.name}
                        className="w-16 h-16 object-cover rounded-md border-2 border-ink/10"
                      />
                      <div>
                        <h4 className="font-semibold text-ink text-sm line-clamp-1">{item.gear.name}</h4>
                        <p className="text-xs text-ember-2 font-semibold mt-0.5">{formatRupiah(item.gear.price_per_day)} / hari</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 bg-bone border-2 border-ink/10 rounded-md p-1">
                        <button onClick={() => updateQuantity(item.gear.id, item.quantity - 1)} className="p-1 text-ink/50 hover:text-ink">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-ink px-2">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.gear.id, item.quantity + 1)} className="p-1 text-ink/50 hover:text-ink">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.gear.id)}
                        className="p-2 text-ink/40 hover:text-red-600 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="h-fit sticky top-24">
            <div className="bg-white border-2 border-ink/10 rounded-md p-6 space-y-6 shadow-xl shadow-ink/5">
              <h3 className="font-display font-bold uppercase text-ink text-lg border-b border-ink/10 pb-4">Ringkasan Biaya</h3>
              <div className="space-y-3 text-xs">
                <Row label="Total Unit Gear:" value={`${items.reduce((acc, i) => acc + i.quantity, 0)} Unit`} />
                <Row label="Durasi Sewa:" value={`${getDurationDays()} Hari`} />
                <Row label="Subtotal Sewa:" value={formatRupiah(getSubtotal())} />
                <Row label="Biaya Pengiriman:" value={deliveryType === 'pickup' ? 'Gratis (Pickup)' : formatRupiah(getDeliveryFee())} />
                <div className="pt-3 border-t border-ink/10 flex justify-between items-center text-sm">
                  <span className="font-bold text-ink">Total Pembayaran:</span>
                  <span className="font-display font-bold text-ember-2 text-lg">{formatRupiah(getTotalPrice())}</span>
                </div>
              </div>
              <button
                onClick={handleProceedCheckout}
                className="w-full py-3.5 bg-ember hover:bg-ember-2 text-white font-display font-semibold uppercase tracking-wide rounded-md shadow-lg shadow-ember/25 transition-all flex items-center justify-center gap-2 text-sm"
              >
                Lanjut ke Checkout <ArrowRight className="w-4 h-4" />
              </button>
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

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatRupiah } from '@/lib/format';
import { toast } from 'sonner';
import { ShoppingBag, Trash2, Plus, Minus, Calendar, MapPin, Truck, Store, ArrowRight } from 'lucide-react';

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

    // Default dates if empty: start tomorrow, end 3 days later
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

  const handleDeliveryTypeChange = (type) => {
    setDeliveryInfo(type, localAddress, localDistance);
  };

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Keranjang Sewa</h1>
        <p className="text-sm text-slate-400 mt-1">Atur tanggal sewa, jumlah unit, dan metode pengiriman</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-3xl space-y-4">
          <ShoppingBag className="w-16 h-16 text-slate-600 mx-auto" />
          <h3 className="text-xl font-bold text-white">Keranjang Sewa Kosong</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            Anda belum menambahkan peralatan outdoor ke keranjang.
          </p>
          <Link
            href="/gears"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl hover:bg-emerald-300 transition-all"
          >
            Pilih Alat Outdoor Sekarang
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Dates, Delivery & Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date Picker Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" /> Atur Tanggal Sewa
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Tanggal Mulai Sewa</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={localStartDate}
                    onChange={(e) => handleDateChange(e.target.value, localEndDate)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Tanggal Selesai Sewa</label>
                  <input
                    type="date"
                    min={localStartDate || new Date().toISOString().split('T')[0]}
                    value={localEndDate}
                    onChange={(e) => handleDateChange(localStartDate, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Durasi Sewa:</span>
                <span className="font-extrabold text-emerald-400">{getDurationDays()} Hari</span>
              </div>
            </div>

            {/* Delivery Option Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-400" /> Metode Pengiriman
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleDeliveryTypeChange('pickup')}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    deliveryType === 'pickup'
                      ? 'bg-emerald-500/10 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Store className="w-6 h-6 text-emerald-400 mt-1" />
                  <div>
                    <h4 className="font-bold text-sm text-white">Ambil Mandiri (Pickup)</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Ambil di Basecamp GearNest (Gratis)</p>
                    <span className="inline-block mt-2 font-bold text-xs text-emerald-400">Rp 0</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeliveryTypeChange('delivery')}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    deliveryType === 'delivery'
                      ? 'bg-emerald-500/10 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Truck className="w-6 h-6 text-emerald-400 mt-1" />
                  <div>
                    <h4 className="font-bold text-sm text-white">Layanan Antar</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Dikirim langsung ke rumah Anda</p>
                    <span className="inline-block mt-2 font-bold text-xs text-emerald-400">
                      Rp 10.000 + Rp 3.000/km
                    </span>
                  </div>
                </button>
              </div>

              {deliveryType === 'delivery' && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Alamat Lengkap Pengiriman</label>
                    <textarea
                      rows={2}
                      placeholder="Masukkan nama jalan, nomor rumah, RT/RW, dan patokan..."
                      value={localAddress}
                      onChange={(e) => handleAddressChange(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Estimasi Jarak Pengiriman (km)</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={localDistance}
                      onChange={(e) => handleDistanceChange(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Items List */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-white text-base">Daftar Gear di Keranjang</h3>

              <div className="divide-y divide-slate-800/80">
                {items.map((item) => (
                  <div key={item.gear.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.gear.image_url || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200&auto=format&fit=crop&q=80'}
                        alt={item.gear.name}
                        className="w-16 h-16 object-cover rounded-xl border border-slate-800"
                      />
                      <div>
                        <h4 className="font-bold text-white text-sm line-clamp-1">{item.gear.name}</h4>
                        <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                          {formatRupiah(item.gear.price_per_day)} / hari
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Quantity Controller */}
                      <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(item.gear.id, item.quantity - 1)}
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-white px-2">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.gear.id, item.quantity + 1)}
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.gear.id)}
                        className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
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

          {/* Right Column: Order Summary */}
          <div className="h-fit sticky top-24">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
              <h3 className="font-bold text-white text-lg border-b border-slate-800 pb-4">Ringkasan Biaya</h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Total Unit Gear:</span>
                  <span className="font-semibold text-slate-200">{items.reduce((acc, i) => acc + i.quantity, 0)} Unit</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Durasi Sewa:</span>
                  <span className="font-semibold text-slate-200">{getDurationDays()} Hari</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Subtotal Sewa:</span>
                  <span className="font-semibold text-slate-200">{formatRupiah(getSubtotal())}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Biaya Pengiriman:</span>
                  <span className="font-semibold text-slate-200">
                    {deliveryType === 'pickup' ? 'Gratis (Pickup)' : formatRupiah(getDeliveryFee())}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-sm">
                  <span className="font-bold text-white">Total Pembayaran:</span>
                  <span className="font-extrabold text-emerald-400 text-lg">{formatRupiah(getTotalPrice())}</span>
                </div>
              </div>

              <button
                onClick={handleProceedCheckout}
                className="w-full py-3.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 text-sm"
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

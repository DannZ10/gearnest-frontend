'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useCartStore, cartLineKey } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { rupiah } from '@/lib/useReveal';
import { toast } from 'sonner';
import { ShoppingBag, Trash2, Plus, Minus, Calendar, Truck, Store, ArrowRight, MapPin, Loader2, Navigation, MessageCircle, CreditCard } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const {
    items, startDate, endDate, deliveryType, deliveryAddress, deliveryMapsUrl, deliveryDistanceKm,
    removeItem, updateQuantity, setBookingDates, setDeliveryInfo, setDeliveryQuote, setPaymentMethod,
    getDurationDays, getTotalWeightKg, getSubtotal, getDeliveryFee, getTotalPrice,
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
      const t = new Date(); t.setDate(t.getDate() + 1);
      const e = new Date(); e.setDate(e.getDate() + 3);
      const sStr = t.toISOString().split('T')[0];
      const eStr = e.toISOString().split('T')[0];
      setLocalStartDate(sStr); setLocalEndDate(eStr); setBookingDates(sStr, eStr);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const itemsSig = items.map((i) => `${i.gear.id}:${i.variant?.id || ''}:${i.quantity}`).join(',');

  useEffect(() => {
    if (!mounted) return;
    if (deliveryType !== 'delivery' || !deliveryMapsUrl.trim() || items.length === 0) {
      setQuoteErr(''); setDeliveryQuote({ distanceKm: 0, deliveryFee: 0 }); return;
    }
    const t = setTimeout(async () => {
      setQuoting(true); setQuoteErr('');
      try {
        const res = await api.post('/delivery/quote', {
          delivery_type: 'delivery', delivery_maps_url: deliveryMapsUrl,
          items: items.map((i) => ({ gear_id: i.gear.id, quantity: i.quantity })),
        });
        const d = res.data.data;
        setDeliveryQuote({ distanceKm: d.distance_km, deliveryFee: d.delivery_fee });
      } catch (err) {
        setQuoteErr(err.response?.data?.message || 'Gagal menghitung ongkir dari link tersebut.');
        setDeliveryQuote({ distanceKm: 0, deliveryFee: 0 });
      } finally { setQuoting(false); }
    }, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, deliveryType, deliveryMapsUrl, itemsSig]);

  const handleDateChange = (start, end) => { setLocalStartDate(start); setLocalEndDate(end); setBookingDates(start, end); };
  const handleDeliveryTypeChange = (type) => setDeliveryInfo(type, localAddress, localMapsUrl);
  const handleAddressChange = (addr) => { setLocalAddress(addr); setDeliveryInfo(deliveryType, addr, localMapsUrl); };
  const handleMapsUrlChange = (url) => { setLocalMapsUrl(url); setDeliveryInfo(deliveryType, localAddress, url); };

  const proceed = (method) => {
    if (!isAuthenticated) { toast.error('Silakan login dulu untuk booking.'); router.push('/login?redirect=/cart'); return; }
    if (items.length === 0) { toast.error('Keranjang masih kosong!'); return; }
    if (!localStartDate || !localEndDate) { toast.error('Pilih tanggal mulai & selesai sewa!'); return; }
    if (deliveryType === 'delivery') {
      if (!localAddress.trim()) { toast.error('Isi alamat pengiriman!'); return; }
      if (!localMapsUrl.trim()) { toast.error('Tempel link Google Maps lokasi!'); return; }
      if (quoting) { toast.error('Tunggu perhitungan ongkir selesai…'); return; }
      if (deliveryDistanceKm <= 0) { toast.error('Ongkir belum terhitung. Pastikan link valid.'); return; }
    }
    setPaymentMethod(method); router.push('/checkout');
  };

  if (!mounted) return null;

  return (
    <div className="container" style={{ padding: '48px 0 88px' }}>
      <div className="section-head">
        <span className="eyebrow">Keranjang</span>
        <h2 className="h2">Keranjang <span className="accent">Sewa</span></h2>
        <p className="lead">Atur tanggal sewa, jumlah unit, dan metode pengiriman.</p>
      </div>

      {items.length === 0 ? (
        <div className="empty-state" style={{ background: 'var(--surface-card)', border: '1px solid var(--neutral-200)', borderRadius: 'var(--r-xl)' }}>
          <ShoppingBag size={48} style={{ margin: '0 auto 14px', color: 'var(--neutral-400)' }} />
          <strong>Keranjang sewa kosong</strong>
          Kamu belum menambahkan perlengkapan ke keranjang.
          <div style={{ marginTop: 18 }}><Link href="/gears" className="btn btn-primary">Pilih Perlengkapan</Link></div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.7fr) minmax(0,.9fr)', gap: 32, alignItems: 'start' }} className="cart-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Dates */}
            <div className="panel">
              <h3 className="panel-h"><Calendar size={18} /> Atur Tanggal Sewa</h3>
              <div className="field-row">
                <div className="field"><label>Tanggal Mulai</label><input type="date" min={new Date().toISOString().split('T')[0]} value={localStartDate} onChange={(e) => handleDateChange(e.target.value, localEndDate)} /></div>
                <div className="field"><label>Tanggal Selesai</label><input type="date" min={localStartDate || new Date().toISOString().split('T')[0]} value={localEndDate} onChange={(e) => handleDateChange(localStartDate, e.target.value)} /></div>
              </div>
              <div className="dur-note"><span>Total durasi sewa</span><b>{getDurationDays()} hari</b></div>
            </div>

            {/* Delivery */}
            <div className="panel">
              <h3 className="panel-h"><Truck size={18} /> Metode Pengiriman</h3>
              <div className="radio-group">
                <div className="radio-card">
                  <input type="radio" name="delivery" id="cPickup" checked={deliveryType === 'pickup'} onChange={() => handleDeliveryTypeChange('pickup')} />
                  <label className="rc-body" htmlFor="cPickup">
                    <span className="rc-icon"><Store size={20} /></span>
                    <span><span className="rc-title">Pickup</span><br /><span className="rc-sub">Ambil di basecamp · Gratis</span></span>
                    <span className="rc-check" />
                  </label>
                </div>
                <div className="radio-card">
                  <input type="radio" name="delivery" id="cDelivery" checked={deliveryType === 'delivery'} onChange={() => handleDeliveryTypeChange('delivery')} />
                  <label className="rc-body" htmlFor="cDelivery">
                    <span className="rc-icon"><Truck size={20} /></span>
                    <span><span className="rc-title">Delivery</span><br /><span className="rc-sub">Antar ke lokasi · Berbayar</span></span>
                    <span className="rc-check" />
                  </label>
                </div>
              </div>

              {deliveryType === 'delivery' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
                  <div className="field"><label>Alamat Lengkap Pengiriman</label><textarea rows={2} placeholder="Nama jalan, nomor, RT/RW, patokan…" value={localAddress} onChange={(e) => handleAddressChange(e.target.value)} /></div>
                  <div className="field">
                    <label><MapPin size={14} style={{ display: 'inline', verticalAlign: '-2px', color: 'var(--accent-cta)' }} /> Link Google Maps Lokasi</label>
                    <input type="url" inputMode="url" placeholder="https://maps.app.goo.gl/…" value={localMapsUrl} onChange={(e) => handleMapsUrlChange(e.target.value)} />
                    <p style={{ fontSize: 11, color: 'var(--neutral-400)', marginTop: 2 }}>Google Maps → cari lokasi → <b>Bagikan</b> → salin link. Jarak &amp; ongkir dihitung otomatis dari basecamp.</p>
                    <div style={{ marginTop: 6 }}>
                      {quoting ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--neutral-400)' }}><Loader2 size={14} className="spin" /> Menghitung jarak &amp; ongkir…</span>
                      ) : quoteErr ? (
                        <span className="form-error" style={{ display: 'inline-block' }}>{quoteErr}</span>
                      ) : deliveryDistanceKm > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          <span className="chip"><Navigation size={13} /> {deliveryDistanceKm} km</span>
                          <span className="chip">{getTotalWeightKg().toFixed(1)} kg</span>
                          <span className="chip chip-amber">Ongkir {rupiah(getDeliveryFee())}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="panel">
              <h3 className="panel-h">Daftar Gear</h3>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {items.map((item) => {
                  const key = cartLineKey(item.gear.id, item.variant?.id);
                  const maxStock = item.variant ? Number(item.variant.stock ?? 0) : Number(item.gear.stock_available ?? 0);
                  return (
                    <div key={key} className="cart-line">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                        <img src={item.gear.image_url || '/img/tenda-dome.webp'} alt={item.gear.name} className="cart-thumb" onError={(e) => { e.currentTarget.src = '/img/tenda-dome.webp'; }} />
                        <div style={{ minWidth: 0 }}>
                          <h4 className="cart-name">{item.gear.name}</h4>
                          {item.variant && <span className="variant-badge">{item.variant.label}</span>}
                          <p className="cart-price">{rupiah(item.gear.price_per_day)} / hari</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="qty-stepper">
                          <button onClick={() => updateQuantity(key, item.quantity - 1)} aria-label="Kurangi"><Minus size={14} strokeWidth={2.5} /></button>
                          <span className="qty-val">{item.quantity}</span>
                          <button onClick={() => updateQuantity(key, item.quantity + 1)} disabled={item.quantity >= maxStock} aria-label="Tambah"><Plus size={14} strokeWidth={2.5} /></button>
                        </div>
                        <button onClick={() => removeItem(key)} className="icon-danger" title="Hapus"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Summary (dark) */}
          <div className="summary gn-topo" style={{ position: 'sticky', top: 96 }}>
            <h4>Ringkasan Biaya</h4>
            <p className="s-sub">Perkiraan total sewa kamu</p>
            <div className="sum-line"><span className="k">Total unit</span><span className="v">{items.reduce((a, i) => a + i.quantity, 0)} unit</span></div>
            <div className="sum-line"><span className="k">Berat total</span><span className="v">{getTotalWeightKg().toFixed(1)} kg</span></div>
            <div className="sum-line"><span className="k">Durasi sewa</span><span className="v">{getDurationDays()} hari</span></div>
            <div className="sum-line"><span className="k">Subtotal</span><span className="v">{rupiah(getSubtotal())}</span></div>
            <div className="sum-line"><span className="k">Ongkir</span><span className="v">{deliveryType === 'pickup' ? 'Gratis' : quoting ? '…' : deliveryDistanceKm > 0 ? rupiah(getDeliveryFee()) : 'Isi link'}</span></div>
            <div className="sum-line total"><span className="k">Total</span><span className="v">{rupiah(getTotalPrice())}</span></div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: 16 }} onClick={() => proceed('online')}><CreditCard size={16} /> Bayar Online <ArrowRight size={16} className="arrow" /></button>
            <button className="btn" style={{ width: '100%', marginTop: 10, background: '#25D366', color: '#fff' }} onClick={() => proceed('onsite')}><MessageCircle size={16} /> Bayar di Tempat</button>
            <p className="sum-note"><b>Bayar di Tempat</b>: konfirmasi admin via WhatsApp, bayar saat serah terima gear.</p>
          </div>
        </div>
      )}
    </div>
  );
}

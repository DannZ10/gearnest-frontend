'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { formatRupiah, formatDate } from '@/lib/format';
import { toast } from 'sonner';
import { Shield, Package, ShoppingBag, DollarSign, AlertTriangle, TrendingUp, CheckCircle, XCircle, Search } from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, role, isAuthenticated } = useAuthStore();

  const [summary, setSummary] = useState(null);
  const [popularGears, setPopularGears] = useState([]);
  const [lowStockGears, setLowStockGears] = useState([]);
  const [adminBookings, setAdminBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || role !== 'admin') {
      toast.error('Akses ditolak. Perlu hak akses Admin.');
      router.push('/dashboard');
      return;
    }

    async function fetchAdminData() {
      try {
        const [sumRes, popRes, lowRes, bookRes] = await Promise.all([
          api.get('/admin/reports/dashboard'),
          api.get('/admin/reports/popular-gear'),
          api.get('/admin/reports/low-stock'),
          api.get('/admin/bookings'),
        ]);

        setSummary(sumRes.data.data || null);
        setPopularGears(popRes.data.data || []);
        setLowStockGears(lowRes.data.data || []);
        setAdminBookings(bookRes.data.data || []);
      } catch (err) {
        console.error('Failed fetching admin data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAdminData();
  }, [isAuthenticated, role, router]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await api.patch(`/admin/bookings/${bookingId}/status`, { status: newStatus });
      toast.success(`Status booking #${bookingId} diubah menjadi ${newStatus}!`);

      // Refresh bookings
      const bookRes = await api.get('/admin/bookings');
      setAdminBookings(bookRes.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengubah status booking.');
    }
  };

  const handleToggleVerifyIdentity = async (bookingId, currentVerified) => {
    try {
      await api.patch(`/admin/bookings/${bookingId}/verify`, { verified: !currentVerified });
      toast.success(`Jaminan identitas booking #${bookingId} diperbarui!`);

      // Refresh bookings
      const bookRes = await api.get('/admin/bookings');
      setAdminBookings(bookRes.data.data || []);
    } catch (err) {
      toast.error('Gagal memperbarui verifikasi identitas.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-2">
            <Shield className="w-3.5 h-3.5" /> Admin Control Center
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Manajemen & Laporan GearNest</h1>
        </div>
      </div>

      {/* Summary Analytics Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Total Pendapatan</span>
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-emerald-400">{formatRupiah(summary.total_revenue)}</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Total Transaksi Booking</span>
              <ShoppingBag className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-2xl font-black text-white">{summary.total_bookings} Booking</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Sewa Aktif Berjalan</span>
              <TrendingUp className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-amber-400">{summary.active_rentals} Unit</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Total Katalog Gear</span>
              <Package className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-2xl font-black text-white">{summary.total_gears} Item</p>
          </div>
        </div>
      )}

      {/* Two Column Layout: Low Stock Warning & Popular Gears */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock Warning */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" /> Peringatan Stok Menipis (≤ 3 Unit)
          </h3>

          {lowStockGears.length === 0 ? (
            <p className="text-xs text-slate-400">Semua stok gear dalam kondisi aman.</p>
          ) : (
            <div className="divide-y divide-slate-800/80 text-xs">
              {lowStockGears.map((gear) => (
                <div key={gear.id} className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white">{gear.name}</h4>
                    <span className="text-[10px] text-slate-400">{gear.category?.name}</span>
                  </div>
                  <span className="bg-rose-500/20 text-rose-400 font-bold px-2.5 py-1 rounded-full border border-rose-500/30">
                    Sisa Stok: {gear.stock_available}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popular Gears */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" /> Top Gear Paling Sering Disewa
          </h3>

          <div className="divide-y divide-slate-800/80 text-xs">
            {popularGears.map((item) => (
              <div key={item.gear_id} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">{item.gear?.name || `Gear #${item.gear_id}`}</h4>
                  <span className="text-[10px] text-slate-400">Total Disewa: {item.total_rented} kali</span>
                </div>
                <span className="font-extrabold text-emerald-400">
                  {formatRupiah(item.total_revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Booking Management Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6">
        <h3 className="font-bold text-white text-lg">Kelola Transaksi Booking Penyewa</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase border-b border-slate-800">
              <tr>
                <th className="p-3">Kode Booking</th>
                <th className="p-3">Penyewa</th>
                <th className="p-3">Periode</th>
                <th className="p-3">Total Harga</th>
                <th className="p-3">Jaminan ID</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Aksi Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {adminBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-white">{b.booking_code}</td>
                  <td className="p-3">
                    <p className="font-semibold text-white">{b.user?.name}</p>
                    <p className="text-[10px] text-slate-400">{b.user?.email}</p>
                  </td>
                  <td className="p-3">{formatDate(b.start_date)} - {formatDate(b.end_date)}</td>
                  <td className="p-3 font-bold text-emerald-400">{formatRupiah(b.total_price)}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleToggleVerifyIdentity(b.id, b.identity_verified)}
                      className={`px-2 py-1 rounded text-[10px] font-bold ${
                        b.identity_verified
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {b.identity_verified ? 'Terverifikasi ✓' : 'Belum Verifikasi ⚠'}
                    </button>
                  </td>
                  <td className="p-3 font-extrabold uppercase text-[10px]">{b.status}</td>
                  <td className="p-3 text-right space-x-1">
                    <select
                      value={b.status}
                      onChange={(e) => handleUpdateStatus(b.id, e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="active">Active (Sewa)</option>
                      <option value="returned">Returned (Selesai)</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

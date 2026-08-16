'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { formatRupiah, formatDate } from '@/lib/format';
import { toast } from 'sonner';
import AdminShell from '@/components/AdminShell';
import AnalyticsCharts from '@/components/admin/AnalyticsCharts';
import { Package, ShoppingBag, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';

const CARD = 'bg-white dark:bg-[#1b2228] border border-ink/10 dark:border-white/10 rounded-3xl';
const SKEL = 'bg-bone-2 dark:bg-white/5 animate-pulse';

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className={`${CARD} p-6 space-y-2`}>
      <div className="flex items-center justify-between text-ink/50 dark:text-sand/60">
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
        <Icon className={`w-5 h-5 ${accent}`} />
      </div>
      <p className="font-display font-bold text-3xl text-ink dark:text-white">{value}</p>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className={`${CARD} p-6 space-y-4`}>
      <div className={`${SKEL} h-5 w-40 rounded`} />
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => <div key={i} className={`${SKEL} h-10 rounded-xl`} />)}
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [popularGears, setPopularGears] = useState([]);
  const [lowStockGears, setLowStockGears] = useState([]);
  const [adminBookings, setAdminBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshBookings = async () => {
    const bookRes = await api.get('/admin/bookings');
    setAdminBookings(bookRes.data.data || []);
  };

  useEffect(() => {
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
        toast.error('Gagal memuat data admin.');
      } finally {
        setLoading(false);
      }
    }
    fetchAdminData();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await api.patch(`/admin/bookings/${bookingId}/status`, { status: newStatus });
      toast.success(`Status booking diubah menjadi ${newStatus}.`);
      await refreshBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengubah status booking.');
    }
  };

  const handleToggleVerifyIdentity = async (bookingId, currentVerified) => {
    try {
      await api.patch(`/admin/bookings/${bookingId}/verify`, { verified: !currentVerified });
      toast.success('Jaminan identitas diperbarui.');
      await refreshBookings();
    } catch (err) {
      toast.error('Gagal memperbarui verifikasi identitas.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Ringkasan */}
      <section id="ringkasan" className="scroll-mt-20 space-y-4">
        <h2 className="font-display font-bold uppercase text-ink dark:text-white text-lg">Ringkasan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading || !summary ? (
            [...Array(4)].map((_, i) => <div key={i} className={`${SKEL} h-28 rounded-3xl`} />)
          ) : (
            <>
              <StatCard icon={DollarSign} accent="text-ember" label="Total Pendapatan" value={formatRupiah(summary.total_revenue)} />
              <StatCard icon={ShoppingBag} accent="text-moss" label="Total Booking" value={summary.total_bookings} />
              <StatCard icon={TrendingUp} accent="text-ember" label="Sewa Aktif" value={summary.active_rentals} />
              <StatCard icon={Package} accent="text-bark" label="Total Gear" value={summary.total_gears} />
            </>
          )}
        </div>
      </section>

      {/* Analitik */}
      <section id="analitik" className="scroll-mt-20 space-y-4">
        <h2 className="font-display font-bold uppercase text-ink dark:text-white text-lg">Analitik Bisnis</h2>
        <AnalyticsCharts />
      </section>

      {/* Stok + Populer */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"><ListSkeleton /><ListSkeleton /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section id="stok" className={`scroll-mt-20 ${CARD} p-6 space-y-4`}>
            <h3 className="font-display font-bold uppercase text-ink dark:text-white text-base flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-ember" /> Stok Menipis (≤ 3 Unit)
            </h3>
            {lowStockGears.length === 0 ? (
              <p className="text-xs text-ink/55 dark:text-sand/60">Semua stok gear dalam kondisi aman.</p>
            ) : (
              <div className="divide-y divide-ink/10 dark:divide-white/10 text-xs">
                {lowStockGears.map((gear) => (
                  <div key={gear.id} className="py-3 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-ink dark:text-white">{gear.name}</h4>
                      <span className="text-[10px] text-ink/50 dark:text-sand/50">{gear.category?.name}</span>
                    </div>
                    <span className="bg-red-500/10 text-red-600 dark:text-red-400 font-bold px-2.5 py-1 rounded-full border border-red-500/20">
                      Sisa: {gear.stock_available}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section id="populer" className={`scroll-mt-20 ${CARD} p-6 space-y-4`}>
            <h3 className="font-display font-bold uppercase text-ink dark:text-white text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-moss" /> Gear Paling Populer
            </h3>
            {popularGears.length === 0 ? (
              <p className="text-xs text-ink/55 dark:text-sand/60">Belum ada data penyewaan.</p>
            ) : (
              <div className="divide-y divide-ink/10 dark:divide-white/10 text-xs">
                {popularGears.map((item) => (
                  <div key={item.gear_id} className="py-3 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-ink dark:text-white">{item.gear?.name || `Gear #${item.gear_id}`}</h4>
                      <span className="text-[10px] text-ink/50 dark:text-sand/50">Disewa {item.total_rented} kali</span>
                    </div>
                    <span className="font-display font-bold text-ember-2 dark:text-ember">{formatRupiah(item.total_revenue)}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Booking */}
      <section id="booking" className={`scroll-mt-20 ${CARD} p-6 space-y-6`}>
        <h3 className="font-display font-bold uppercase text-ink dark:text-white text-lg">Kelola Transaksi Booking</h3>
        {loading ? (
          <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className={`${SKEL} h-12 rounded-xl`} />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-ink/80 dark:text-sand/80">
              <thead className="bg-bone dark:bg-white/5 text-ink/50 dark:text-sand/60 font-semibold uppercase border-b border-ink/10 dark:border-white/10">
                <tr>
                  <th className="p-3">Kode</th>
                  <th className="p-3">Penyewa</th>
                  <th className="p-3">Periode</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Jaminan ID</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10 dark:divide-white/10">
                {adminBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-bone/60 dark:hover:bg-white/5">
                    <td className="p-3 font-display font-bold text-ink dark:text-white">{b.booking_code}</td>
                    <td className="p-3">
                      <p className="font-semibold text-ink dark:text-white">{b.user?.name}</p>
                      <p className="text-[10px] text-ink/50 dark:text-sand/50">{b.user?.email}</p>
                    </td>
                    <td className="p-3">{formatDate(b.start_date)} - {formatDate(b.end_date)}</td>
                    <td className="p-3 font-bold text-ember-2 dark:text-ember">{formatRupiah(b.total_price)}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleToggleVerifyIdentity(b.id, b.identity_verified)}
                        className={`px-2 py-1 rounded text-[10px] font-bold border ${
                          b.identity_verified
                            ? 'bg-moss/15 text-moss dark:text-moss-2 border-moss/30'
                            : 'bg-ember/15 text-ember-2 dark:text-ember border-ember/30'
                        }`}
                      >
                        {b.identity_verified ? 'Terverifikasi ✓' : 'Belum ⚠'}
                      </button>
                    </td>
                    <td className="p-3 font-bold uppercase text-[10px] text-ink/70 dark:text-sand/70">{b.status}</td>
                    <td className="p-3 text-right">
                      <select
                        value={b.status}
                        onChange={(e) => handleUpdateStatus(b.id, e.target.value)}
                        className="bg-bone dark:bg-[#12171b] border border-ink/15 dark:border-white/15 rounded px-2 py-1 text-xs text-ink dark:text-white focus:outline-none focus:border-ember"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="active">Active</option>
                        <option value="returned">Returned</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminShell title="Dashboard">
      <AdminDashboard />
    </AdminShell>
  );
}

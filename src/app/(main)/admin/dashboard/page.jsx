'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { formatRupiah } from '@/lib/format';
import { toast } from 'sonner';
import AdminShell from '@/components/organisms/AdminShell';
import StatCard from '@/components/molecules/StatCard';
import { CARD, SKEL, SectionHead } from '@/components/admin/ui';
import {
  Package, ShoppingBag, DollarSign, AlertTriangle, TrendingUp,
  CalendarCheck, BarChart3, Tags, ArrowUpRight,
} from 'lucide-react';

const QUICK = [
  { href: '/admin/bookings', label: 'Kelola Booking', desc: 'Ubah status & verifikasi identitas', icon: CalendarCheck },
  { href: '/admin/gears', label: 'Kelola Gear', desc: 'Tambah, edit, hapus peralatan', icon: Package },
  { href: '/admin/categories', label: 'Kategori', desc: 'Atur kategori peralatan', icon: Tags },
  { href: '/admin/analytics', label: 'Analitik', desc: 'Grafik pendapatan & performa', icon: BarChart3 },
];

function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [popularGears, setPopularGears] = useState([]);
  const [lowStockGears, setLowStockGears] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [sumRes, popRes, lowRes] = await Promise.all([
          api.get('/admin/reports/dashboard'),
          api.get('/admin/reports/popular-gear'),
          api.get('/admin/reports/low-stock'),
        ]);
        setSummary(sumRes.data.data || null);
        setPopularGears(popRes.data.data || []);
        setLowStockGears(lowRes.data.data || []);
      } catch (err) {
        console.error('Failed fetching admin data:', err);
        toast.error('Gagal memuat data admin.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <section className="space-y-5">
        <SectionHead eyebrow="// 01 — Ringkasan" title="Ikhtisar Basecamp" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading || !summary ? (
            [...Array(4)].map((_, i) => <div key={i} className={`${SKEL} h-24`} />)
          ) : (
            <>
              <StatCard icon={DollarSign} accent="text-ember" stripe="bg-ember" label="Total Pendapatan" value={formatRupiah(summary.total_revenue)} />
              <StatCard icon={ShoppingBag} accent="text-trail" stripe="bg-trail" label="Total Booking" value={summary.total_bookings} />
              <StatCard icon={TrendingUp} accent="text-moss" stripe="bg-moss" label="Sewa Aktif" value={summary.active_rentals} />
              <StatCard icon={Package} accent="text-bark" stripe="bg-bark" label="Total Gear" value={summary.total_gears} />
            </>
          )}
        </div>
      </section>

      {/* Quick access */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK.map((q) => (
          <Link key={q.href} href={q.href} className={`group ${CARD} p-5 hover:border-ember transition-colors flex flex-col gap-4`}>
            <div className="flex items-center justify-between">
              <span className="grid place-items-center w-10 h-10 rounded-md bg-ink text-ember dark:bg-white/5">
                <q.icon className="w-5 h-5" />
              </span>
              <ArrowUpRight className="w-5 h-5 text-ink/30 dark:text-white/30 group-hover:text-ember transition-colors" />
            </div>
            <div>
              <h3 className="font-display font-bold uppercase tracking-tight text-ink dark:text-white text-base leading-none">{q.label}</h3>
              <p className="text-xs text-ink/55 dark:text-sand/55 mt-1.5">{q.desc}</p>
            </div>
          </Link>
        ))}
      </section>

      {/* Stok + Populer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className={`${CARD} p-6 space-y-4`}>
          <h3 className="font-display font-bold uppercase tracking-tight text-ink dark:text-white text-base flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-ember" /> Stok Menipis (≤ 3 Unit)
          </h3>
          {loading ? (
            <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className={`${SKEL} h-10`} />)}</div>
          ) : lowStockGears.length === 0 ? (
            <p className="text-xs text-ink/55 dark:text-sand/60">Semua stok gear dalam kondisi aman.</p>
          ) : (
            <div className="divide-y divide-ink/10 dark:divide-white/10 text-xs">
              {lowStockGears.map((gear) => (
                <div key={gear.id} className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-ink dark:text-white">{gear.name}</h4>
                    <span className="font-mono text-[10px] text-ink/50 dark:text-sand/50">{gear.category?.name}</span>
                  </div>
                  <span className="bg-red-500/10 text-red-600 dark:text-red-400 font-mono text-[10px] font-bold px-2.5 py-1 rounded-sm border border-red-500/20 uppercase tracking-wide">
                    Sisa {gear.stock_available}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={`${CARD} p-6 space-y-4`}>
          <h3 className="font-display font-bold uppercase tracking-tight text-ink dark:text-white text-base flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-moss" /> Gear Paling Populer
          </h3>
          {loading ? (
            <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className={`${SKEL} h-10`} />)}</div>
          ) : popularGears.length === 0 ? (
            <p className="text-xs text-ink/55 dark:text-sand/60">Belum ada data penyewaan.</p>
          ) : (
            <div className="divide-y divide-ink/10 dark:divide-white/10 text-xs">
              {popularGears.map((item) => (
                <div key={item.gear_id} className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-ink dark:text-white">{item.gear?.name || `Gear #${item.gear_id}`}</h4>
                    <span className="font-mono text-[10px] text-ink/50 dark:text-sand/50">Disewa {item.total_rented} kali</span>
                  </div>
                  <span className="font-display font-bold text-ember-2 dark:text-ember">{formatRupiah(item.total_revenue)}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminShell title="Ringkasan">
      <AdminDashboard />
    </AdminShell>
  );
}

'use client';

import React, { useCallback, useEffect, useState } from 'react';
import api from '@/lib/axios';
import { formatRupiah, formatDate } from '@/lib/format';
import { toast } from 'sonner';
import AdminShell from '@/components/organisms/AdminShell';
import { CARD, SKEL, INPUT, SectionHead } from '@/components/admin/ui';
import { Search, ShieldCheck, ShieldAlert, Pencil } from 'lucide-react';

const STATUSES = ['pending', 'confirmed', 'active', 'returned', 'cancelled'];

const STATUS_STYLE = {
  confirmed: 'bg-moss/15 text-moss border-moss/40',
  active: 'bg-trail/15 text-trail border-trail/40',
  returned: 'bg-ink/10 text-ink/60 dark:text-sand/60 border-ink/20 dark:border-white/20',
  cancelled: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
  pending: 'bg-ember/15 text-ember-2 dark:text-ember border-ember/40',
};

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (search) params.search = search;
      if (status) params.status = status;
      const res = await api.get('/admin/bookings', { params });
      setBookings(res.data.data || []);
    } catch (err) {
      toast.error('Gagal memuat data booking.');
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const t = setTimeout(load, 300); // debounce search/filter
    return () => clearTimeout(t);
  }, [load]);

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/admin/bookings/${id}/status`, { status: newStatus });
      toast.success(`Status diubah menjadi ${newStatus}.`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengubah status.');
    }
  };

  const toggleVerify = async (id, current) => {
    try {
      await api.patch(`/admin/bookings/${id}/verify`, { verified: !current });
      toast.success('Jaminan identitas diperbarui.');
      load();
    } catch (err) {
      toast.error('Gagal memperbarui verifikasi.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <SectionHead eyebrow="// 03 — Transaksi" title="Kelola Booking" />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-ink/40 dark:text-sand/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kode booking, nama, atau email penyewa…"
            className={`${INPUT} pl-9`}
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${INPUT} sm:w-52`}>
          <option value="">Semua Status</option>
          {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      <section className={`${CARD} p-6`}>
        {loading ? (
          <div className="space-y-2">{[...Array(6)].map((_, i) => <div key={i} className={`${SKEL} h-12`} />)}</div>
        ) : bookings.length === 0 ? (
          <p className="text-sm text-ink/55 dark:text-sand/60 py-8 text-center">Tidak ada booking yang cocok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-ink/80 dark:text-sand/80">
              <thead className="bg-bone dark:bg-white/5 text-ink/50 dark:text-sand/60 font-mono text-[10px] tracking-[0.1em] uppercase border-b-2 border-ink/10 dark:border-white/10">
                <tr>
                  <th className="p-3">Kode</th>
                  <th className="p-3">Penyewa</th>
                  <th className="p-3">Periode</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Jaminan ID <span className="normal-case font-sans font-normal text-ink/35 dark:text-sand/35">(klik utk ubah)</span></th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Ubah Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10 dark:divide-white/10">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-bone/60 dark:hover:bg-white/5">
                    <td className="p-3 font-mono font-bold text-ink dark:text-white">{b.booking_code}</td>
                    <td className="p-3">
                      <p className="font-semibold text-ink dark:text-white">{b.user?.name}</p>
                      <p className="font-mono text-[10px] text-ink/50 dark:text-sand/50">{b.user?.email}</p>
                    </td>
                    <td className="p-3">{formatDate(b.start_date)} – {formatDate(b.end_date)}</td>
                    <td className="p-3 font-bold text-ember-2 dark:text-ember">{formatRupiah(b.total_price)}</td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleVerify(b.id, b.identity_verified)}
                        title={b.identity_verified ? 'Klik untuk batalkan verifikasi jaminan ID' : 'Klik untuk verifikasi jaminan ID'}
                        aria-label="Ubah status jaminan identitas"
                        className={`group/id inline-flex items-center gap-1.5 font-mono px-2.5 py-1.5 rounded-sm text-[10px] font-bold border uppercase tracking-wide cursor-pointer transition-all hover:shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-transparent ${
                          b.identity_verified
                            ? 'bg-moss/15 text-moss dark:text-moss-2 border-moss/30 hover:bg-moss/25 focus:ring-moss/40'
                            : 'bg-ember/15 text-ember-2 dark:text-ember border-ember/40 hover:bg-ember/25 focus:ring-ember/40'
                        }`}
                      >
                        {b.identity_verified
                          ? <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                          : <ShieldAlert className="w-3.5 h-3.5 shrink-0" />}
                        {b.identity_verified ? 'Terverifikasi' : 'Belum'}
                        <Pencil className="w-2.5 h-2.5 ml-0.5 opacity-40 group-hover/id:opacity-100 transition-opacity" />
                      </button>
                    </td>
                    <td className="p-3">
                      <span className={`font-mono px-2 py-1 rounded-sm text-[10px] font-bold border uppercase tracking-wide ${STATUS_STYLE[b.status] || STATUS_STYLE.pending}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <select
                        value={b.status}
                        onChange={(e) => updateStatus(b.id, e.target.value)}
                        className="bg-bone dark:bg-[#16261d] border-2 border-ink/15 dark:border-white/15 rounded-md px-2 py-1 text-xs text-ink dark:text-white focus:outline-none focus:border-ember capitalize"
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
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

export default function AdminBookingsPage() {
  return (
    <AdminShell title="Booking">
      <AdminBookings />
    </AdminShell>
  );
}

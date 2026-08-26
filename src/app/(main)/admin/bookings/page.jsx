'use client';

import React, { useCallback, useEffect, useState } from 'react';
import api from '@/lib/axios';
import { formatRupiah, formatDate } from '@/lib/format';
import { toast } from 'sonner';
import AdminShell from '@/components/organisms/AdminShell';
import { CARD, SKEL, INPUT, SectionHead } from '@/components/admin/ui';
import BookingInvoice from '@/components/organisms/BookingInvoice';
import BookingActivityModal from '@/components/organisms/BookingActivityModal';
import { Search, ShieldCheck, ShieldAlert, Pencil, FileText, Activity } from 'lucide-react';

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
  const [invoice, setInvoice] = useState(null);
  const [activityBooking, setActivityBooking] = useState(null);

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

  const toggleIdentityReturned = async (id, current) => {
    try {
      await api.patch(`/admin/bookings/${id}/identity-returned`, { returned: !current });
      toast.success('Status pengembalian jaminan diperbarui.');
      load();
    } catch (err) {
      toast.error('Gagal memperbarui status jaminan.');
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
                  <th className="p-3">Serah Terima</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Aksi</th>
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
                      <div className="space-y-1.5">
                        <div className="font-mono text-[10px] text-ink/55 dark:text-sand/55 leading-tight">
                          <div>{b.picked_up_at ? `Diambil ${formatDate(b.picked_up_at)}` : 'Belum diambil'}</div>
                          <div>{b.returned_at ? `Kembali ${formatDate(b.returned_at)}` : `Tempo ${formatDate(b.end_date)}`}</div>
                        </div>
                        <button
                          onClick={() => toggleIdentityReturned(b.id, b.identity_returned)}
                          title="Klik untuk ubah status pengembalian kartu jaminan"
                          className={`inline-flex items-center gap-1 font-mono px-2 py-1 rounded-sm text-[10px] font-bold border uppercase tracking-wide cursor-pointer transition-colors ${
                            b.identity_returned
                              ? 'bg-moss/15 text-moss dark:text-moss-2 border-moss/30 hover:bg-moss/25'
                              : 'bg-ink/5 text-ink/50 dark:text-sand/50 border-ink/15 dark:border-white/15 hover:bg-ink/10'
                          }`}
                        >
                          {b.identity_returned ? 'Jaminan kembali ✓' : 'Jaminan di kami'}
                        </button>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`font-mono px-2 py-1 rounded-sm text-[10px] font-bold border uppercase tracking-wide ${STATUS_STYLE[b.status] || STATUS_STYLE.pending}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setActivityBooking(b)}
                          title="Lihat aktivitas"
                          className="grid place-items-center w-8 h-8 rounded-md border-2 border-ink/10 dark:border-white/15 text-ink/70 dark:text-sand hover:border-ember/40 hover:text-ember transition-colors"
                        >
                          <Activity className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setInvoice(b)}
                          title="Cetak invoice"
                          className="grid place-items-center w-8 h-8 rounded-md border-2 border-ink/10 dark:border-white/15 text-ink/70 dark:text-sand hover:border-ember/40 hover:text-ember transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <select
                          value={b.status}
                          onChange={(e) => updateStatus(b.id, e.target.value)}
                          className="bg-bone dark:bg-[#16261d] border-2 border-ink/15 dark:border-white/15 rounded-md px-2 py-1 text-xs text-ink dark:text-white focus:outline-none focus:border-ember capitalize"
                        >
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {invoice && <BookingInvoice booking={invoice} onClose={() => setInvoice(null)} />}
      {activityBooking && <BookingActivityModal booking={activityBooking} onClose={() => setActivityBooking(null)} />}
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

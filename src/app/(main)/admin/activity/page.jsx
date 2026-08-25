'use client';

import React, { useCallback, useEffect, useState } from 'react';
import api from '@/lib/axios';
import { formatDateTime } from '@/lib/format';
import { toast } from 'sonner';
import AdminShell from '@/components/organisms/AdminShell';
import { CARD, SKEL, INPUT, SectionHead } from '@/components/admin/ui';
import { Search, ShoppingBag, RefreshCw, CreditCard, XCircle, ShieldCheck, KeyRound, Activity } from 'lucide-react';

const ACTION_META = {
  'booking.created': { icon: ShoppingBag, tone: 'text-trail bg-trail/10 border-trail/20', label: 'Booking' },
  'status.changed': { icon: RefreshCw, tone: 'text-ember-2 bg-ember/10 border-ember/20', label: 'Status' },
  'payment.paid': { icon: CreditCard, tone: 'text-moss bg-moss/10 border-moss/20', label: 'Bayar' },
  'payment.failed': { icon: XCircle, tone: 'text-red-600 bg-red-500/10 border-red-500/20', label: 'Gagal' },
  'identity.verified': { icon: ShieldCheck, tone: 'text-moss bg-moss/10 border-moss/20', label: 'Verifikasi' },
  'identity.returned': { icon: KeyRound, tone: 'text-trail bg-trail/10 border-trail/20', label: 'Jaminan' },
};
const FALLBACK_META = { icon: Activity, tone: 'text-ink/60 bg-ink/5 border-ink/15', label: 'Aktivitas' };

const ROLE_LABEL = { admin: 'Admin', customer: 'Penyewa', system: 'Sistem' };

function AdminActivity() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (search) params.search = search;
      const res = await api.get('/admin/activity-logs', { params });
      setLogs(res.data.data || []);
    } catch {
      toast.error('Gagal memuat riwayat aktivitas.');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <SectionHead eyebrow="// 07 — Audit Trail" title="Riwayat Aktivitas" />

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-3 text-ink/40 dark:text-sand/40" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari kode booking…" className={`${INPUT} pl-9`} />
      </div>

      <section className={`${CARD} p-6`}>
        {loading ? (
          <div className="space-y-2">{[...Array(8)].map((_, i) => <div key={i} className={`${SKEL} h-14`} />)}</div>
        ) : logs.length === 0 ? (
          <p className="text-sm text-ink/55 dark:text-sand/60 py-8 text-center">Belum ada aktivitas.</p>
        ) : (
          <ol className="relative border-l-2 border-ink/10 dark:border-white/10 ml-3 space-y-5">
            {logs.map((log) => {
              const meta = ACTION_META[log.action] || FALLBACK_META;
              const Icon = meta.icon;
              return (
                <li key={log.id} className="relative pl-6">
                  <span className={`absolute -left-[13px] top-0.5 grid place-items-center w-6 h-6 rounded-full border-2 ${meta.tone}`}>
                    <Icon className="w-3 h-3" />
                  </span>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className={`font-mono text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-sm border ${meta.tone}`}>{meta.label}</span>
                    {log.booking?.booking_code && (
                      <span className="font-mono text-[11px] font-bold text-ink dark:text-white">{log.booking.booking_code}</span>
                    )}
                    <span className="font-mono text-[10px] text-ink/40 dark:text-sand/40">{formatDateTime(log.created_at)}</span>
                  </div>
                  <p className="text-xs text-ink/75 dark:text-sand/75 mt-1">{log.description}</p>
                  <p className="font-mono text-[10px] text-ink/40 dark:text-sand/40 mt-0.5">
                    oleh {log.actor?.name || ROLE_LABEL[log.actor_role] || 'Sistem'}
                    {log.actor_role ? ` · ${ROLE_LABEL[log.actor_role] || log.actor_role}` : ''}
                  </p>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </div>
  );
}

export default function AdminActivityPage() {
  return (
    <AdminShell title="Aktivitas">
      <AdminActivity />
    </AdminShell>
  );
}

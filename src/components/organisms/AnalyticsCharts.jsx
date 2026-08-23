'use client';

import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, LabelList,
} from 'recharts';
import api from '@/lib/axios';
import { formatRupiah } from '@/lib/format';
import { useAdminTheme } from '@/components/organisms/AdminShell';
import { BarChart3 } from 'lucide-react';

const INK = '#1e2a32';
const EMBER = '#e58a26';
const MOSS = '#55624a';
const BARK = '#6b4e34';
const SAND = '#cdaa7d';
const LINE = '#e2ddd2';

const STATUS_COLOR = {
  pending: EMBER, confirmed: MOSS, active: '#4a6fa5', returned: SAND, cancelled: '#c0392b',
};
const STATUS_LABEL = {
  pending: 'Pending', confirmed: 'Dikonfirmasi', active: 'Aktif', returned: 'Selesai', cancelled: 'Dibatalkan',
};

const num = (v) => Number(v) || 0;
const shortDate = (s) => (s ? new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '');

function ChartCard({ title, children, empty }) {
  return (
    <div className="bg-white dark:bg-[#213026] border-2 border-ink/10 dark:border-white/10 rounded-md p-6 space-y-4">
      <h3 className="font-display font-bold uppercase text-ink dark:text-white text-base flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-ember" /> {title}
      </h3>
      {empty ? (
        <div className="h-[220px] grid place-items-center text-xs text-ink/45 dark:text-sand/50">Belum ada data transaksi.</div>
      ) : (
        <div className="h-[220px]">{children}</div>
      )}
    </div>
  );
}

function MoneyTooltip({ active, payload, label, labelText }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-ink text-white rounded-xl px-3 py-2 text-xs shadow-lg border border-white/10">
      {label != null && <p className="font-semibold mb-0.5">{label}</p>}
      {payload.map((p) => (
        <p key={p.dataKey} className="text-sand/90">{labelText?.(p) ?? `${p.name}: ${p.value}`}</p>
      ))}
    </div>
  );
}

export default function AnalyticsCharts() {
  const { isDark } = useAdminTheme();
  const [data, setData] = useState(null);

  const axis = isDark ? '#c9d1cf' : INK;
  const grid = isDark ? 'rgba(255,255,255,0.09)' : LINE;

  useEffect(() => {
    async function load() {
      try {
        const [rev, status, cat, busy] = await Promise.all([
          api.get('/admin/reports/revenue?groupBy=daily'),
          api.get('/admin/reports/status-breakdown'),
          api.get('/admin/reports/category-performance'),
          api.get('/admin/reports/busiest-periods'),
        ]);
        setData({
          revenue: (rev.data.data || []).map((r) => ({ period: shortDate(r.period), revenue: num(r.total_revenue), bookings: num(r.total_bookings) })),
          status: (status.data.data || []).map((s) => ({ name: STATUS_LABEL[s.status] || s.status, value: num(s.total), color: STATUS_COLOR[s.status] || SAND })),
          category: (cat.data.data || []).map((c) => ({ name: c.category_name, revenue: num(c.total_revenue), rented: num(c.total_rented) })),
          busiest: (busy.data.data || []).map((b) => ({ date: shortDate(b.start_date), bookings: num(b.total_bookings) })),
        });
      } catch (err) {
        console.error('Failed fetching analytics:', err);
        setData({ revenue: [], status: [], category: [], busiest: [] });
      }
    }
    load();
  }, []);

  if (!data) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[...Array(4)].map((_, i) => <div key={i} className="h-[300px] bg-bone-2 dark:bg-white/5 rounded-md animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Revenue over time */}
      <ChartCard title="Pendapatan Harian" empty={data.revenue.length === 0}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.revenue} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={EMBER} stopOpacity={0.35} />
                <stop offset="100%" stopColor={EMBER} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
            <XAxis dataKey="period" tick={{ fontSize: 11, fill: axis }} tickLine={false} axisLine={{ stroke: grid }} />
            <YAxis tick={{ fontSize: 10, fill: axis }} tickLine={false} axisLine={false} width={44}
              tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)} />
            <Tooltip content={<MoneyTooltip labelText={(p) => `${p.name === 'revenue' ? 'Pendapatan' : p.name}: ${formatRupiah(p.value)}`} />} />
            <Area type="monotone" dataKey="revenue" name="revenue" stroke={EMBER} strokeWidth={2.5} fill="url(#revFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Status breakdown */}
      <ChartCard title="Sebaran Status Booking" empty={data.status.length === 0}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data.status} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
              {data.status.map((s) => <Cell key={s.name} fill={s.color} stroke={isDark ? '#213026' : '#fff'} strokeWidth={2} />)}
              <LabelList dataKey="value" position="outside" style={{ fontSize: 11, fill: axis, fontWeight: 700 }} />
            </Pie>
            <Tooltip content={<MoneyTooltip labelText={(p) => `${p.payload.name}: ${p.value} booking`} />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
          {data.status.map((s) => (
            <span key={s.name} className="inline-flex items-center gap-1.5 text-[11px] text-ink/70 dark:text-sand/70">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} /> {s.name}
            </span>
          ))}
        </div>
      </ChartCard>

      {/* Category performance */}
      <ChartCard title="Pendapatan per Kategori" empty={data.category.length === 0}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.category} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10, fill: axis }} tickLine={false} axisLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: axis }} tickLine={false} axisLine={{ stroke: grid }} width={90} />
            <Tooltip cursor={{ fill: isDark ? '#ffffff0d' : '#00000008' }} content={<MoneyTooltip labelText={(p) => formatRupiah(p.value)} />} />
            <Bar dataKey="revenue" name="Pendapatan" fill={MOSS} radius={[0, 6, 6, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Busiest periods */}
      <ChartCard title="Tanggal Sewa Paling Ramai" empty={data.busiest.length === 0}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.busiest} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: axis }} tickLine={false} axisLine={{ stroke: grid }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: axis }} tickLine={false} axisLine={false} width={28} />
            <Tooltip cursor={{ fill: isDark ? '#ffffff0d' : '#00000008' }} content={<MoneyTooltip labelText={(p) => `${p.value} booking`} />} />
            <Bar dataKey="bookings" name="Booking" fill={BARK} radius={[6, 6, 0, 0]} barSize={26}>
              <LabelList dataKey="bookings" position="top" style={{ fontSize: 11, fill: axis, fontWeight: 700 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

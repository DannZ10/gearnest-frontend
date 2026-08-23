'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import AdminShell from '@/components/organisms/AdminShell';
import { CARD, SKEL, INPUT, SectionHead, Btn, Field } from '@/components/admin/ui';
import { Truck, MapPin, Save } from 'lucide-react';

const FIELDS = [
  { key: 'delivery_base_fee', label: 'Biaya Dasar (Rp)', step: '500', hint: 'Ongkir dalam radius & berat gratis.' },
  { key: 'delivery_free_radius_km', label: 'Radius Gratis (km)', step: '0.5', hint: 'Di bawah ini tidak ada tambahan jarak.' },
  { key: 'delivery_free_weight_kg', label: 'Berat Gratis (kg)', step: '0.5', hint: 'Di bawah ini tidak ada tambahan berat.' },
  { key: 'delivery_per_km_fee', label: 'Tambahan / km (Rp)', step: '500', hint: 'Per 1 km di atas radius gratis.' },
  { key: 'delivery_per_kg_fee', label: 'Tambahan / kg (Rp)', step: '500', hint: 'Per 1 kg di atas berat gratis.' },
];

function AdminSettings() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get('/admin/settings/delivery')
      .then((res) => setForm(res.data.data))
      .catch(() => toast.error('Gagal memuat pengaturan.'))
      .finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, Number(v)]));
      await api.put('/admin/settings/delivery', payload);
      toast.success('Pengaturan biaya antar disimpan.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan pengaturan.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <SectionHead eyebrow="// 06 — Konfigurasi" title="Biaya Antar" />

      {loading || !form ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className={`${SKEL} h-16`} />)}</div>
      ) : (
        <form onSubmit={save} className="space-y-6">
          <div className={`${CARD} p-6 space-y-4`}>
            <h3 className="font-display font-semibold uppercase tracking-wide text-ink dark:text-white text-base flex items-center gap-2">
              <Truck className="w-5 h-5 text-ember" /> Formula Ongkir
            </h3>
            <p className="text-xs text-ink/55 dark:text-sand/60 leading-relaxed">
              Radius &lt; <strong className="text-ink dark:text-white">{form.delivery_free_radius_km} km</strong> DAN berat &lt;{' '}
              <strong className="text-ink dark:text-white">{form.delivery_free_weight_kg} kg</strong> = biaya dasar{' '}
              <strong className="text-ink dark:text-white">Rp {Number(form.delivery_base_fee).toLocaleString('id-ID')}</strong>. Lebih dari itu,
              tiap 1 km atau 1 kg menambah biaya sesuai tarif di bawah.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FIELDS.map((f) => (
                <Field key={f.key} label={f.label}>
                  <input type="number" min="0" step={f.step} required value={form[f.key]} onChange={(e) => set(f.key, e.target.value)} className={INPUT} />
                  <p className="text-[10px] text-ink/40 dark:text-sand/40 mt-1">{f.hint}</p>
                </Field>
              ))}
            </div>
          </div>

          <div className={`${CARD} p-6 space-y-4`}>
            <h3 className="font-display font-semibold uppercase tracking-wide text-ink dark:text-white text-base flex items-center gap-2">
              <MapPin className="w-5 h-5 text-ember" /> Titik Basecamp
            </h3>
            <p className="text-xs text-ink/55 dark:text-sand/60">Titik asal perhitungan jarak (radius garis lurus ke lokasi pelanggan).</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Latitude">
                <input type="number" step="any" required value={form.basecamp_lat} onChange={(e) => set('basecamp_lat', e.target.value)} className={INPUT} />
              </Field>
              <Field label="Longitude">
                <input type="number" step="any" required value={form.basecamp_lng} onChange={(e) => set('basecamp_lng', e.target.value)} className={INPUT} />
              </Field>
            </div>
            <a
              href={`https://www.google.com/maps/place/@${form.basecamp_lat},${form.basecamp_lng},16z`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-trail dark:text-trail-2 hover:text-ember font-medium"
            >
              <MapPin className="w-3.5 h-3.5" /> Lihat titik basecamp di Google Maps
            </a>
          </div>

          <Btn type="submit" disabled={saving} className="w-full sm:w-auto">
            <Save className="w-4 h-4" /> {saving ? 'Menyimpan…' : 'Simpan Pengaturan'}
          </Btn>
        </form>
      )}
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <AdminShell title="Biaya Antar">
      <AdminSettings />
    </AdminShell>
  );
}

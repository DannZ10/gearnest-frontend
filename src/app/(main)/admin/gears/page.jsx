'use client';

import React, { useEffect, useMemo, useState } from 'react';
import api from '@/lib/axios';
import { formatRupiah } from '@/lib/format';
import { toast } from 'sonner';
import AdminShell from '@/components/organisms/AdminShell';
import { CARD, SKEL, INPUT, SectionHead, Btn, Modal, Field } from '@/components/admin/ui';
import { Plus, Pencil, PowerOff, Search } from 'lucide-react';

const EMPTY = {
  category_id: '', name: '', description: '', brand: '',
  price_per_day: '', stock_total: '', image_url: '', weight_kg: '', is_available: true,
};

function GearForm({ open, onClose, categories, editing, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(editing
      ? {
          category_id: editing.category_id || '',
          name: editing.name || '',
          description: editing.description || '',
          brand: editing.brand || '',
          price_per_day: editing.price_per_day || '',
          stock_total: editing.stock_total || '',
          image_url: editing.image_url || '',
          weight_kg: editing.weight_kg || '',
          is_available: !!editing.is_available,
        }
      : EMPTY);
  }, [open, editing]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        category_id: Number(form.category_id),
        price_per_day: Number(form.price_per_day),
        stock_total: Number(form.stock_total),
        weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
        image_url: form.image_url || null,
        brand: form.brand || null,
        description: form.description || null,
      };
      if (editing) {
        await api.put(`/admin/gears/${editing.id}`, payload);
        toast.success('Gear berhasil diperbarui.');
      } else {
        await api.post('/admin/gears', payload);
        toast.success('Gear baru ditambahkan.');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan gear.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Gear' : 'Tambah Gear'}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Kategori">
          <select required value={form.category_id} onChange={(e) => set('category_id', e.target.value)} className={INPUT}>
            <option value="">Pilih kategori…</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Nama Gear">
          <input required value={form.name} onChange={(e) => set('name', e.target.value)} className={INPUT} placeholder="Naturehike Cloud Up 2" />
        </Field>
        <Field label="Deskripsi">
          <textarea rows={2} value={form.description} onChange={(e) => set('description', e.target.value)} className={INPUT} placeholder="Tenda 2 orang ultralight…" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Brand">
            <input value={form.brand} onChange={(e) => set('brand', e.target.value)} className={INPUT} placeholder="Naturehike" />
          </Field>
          <Field label="Berat (kg)">
            <input type="number" step="0.01" min="0" value={form.weight_kg} onChange={(e) => set('weight_kg', e.target.value)} className={INPUT} placeholder="1.7" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Harga / Hari (Rp)">
            <input type="number" required min="0" value={form.price_per_day} onChange={(e) => set('price_per_day', e.target.value)} className={INPUT} placeholder="60000" />
          </Field>
          <Field label="Stok Total">
            <input type="number" required min="1" value={form.stock_total} onChange={(e) => set('stock_total', e.target.value)} className={INPUT} placeholder="8" />
          </Field>
        </div>
        <Field label="URL Gambar">
          <input type="url" value={form.image_url} onChange={(e) => set('image_url', e.target.value)} className={INPUT} placeholder="https://…" />
        </Field>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" checked={form.is_available} onChange={(e) => set('is_available', e.target.checked)} className="w-4 h-4 rounded-sm accent-ember" />
          <span className="text-xs text-ink/70 dark:text-sand/70 font-medium">Tersedia untuk disewa</span>
        </label>

        <div className="flex gap-3 pt-2">
          <Btn type="button" variant="ghost" onClick={onClose} className="flex-1">Batal</Btn>
          <Btn type="submit" disabled={saving} className="flex-1">{saving ? 'Menyimpan…' : editing ? 'Simpan Perubahan' : 'Tambah Gear'}</Btn>
        </div>
      </form>
    </Modal>
  );
}

function AdminGears() {
  const [gears, setGears] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [gearsRes, catRes] = await Promise.all([
        api.get('/gears', { params: { is_available: 'all', limit: 100 } }),
        api.get('/categories'),
      ]);
      setGears(gearsRes.data.data || []);
      setCategories(catRes.data.data || []);
    } catch (err) {
      toast.error('Gagal memuat data gear.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return gears;
    return gears.filter((g) => `${g.name} ${g.brand} ${g.category?.name}`.toLowerCase().includes(s));
  }, [gears, q]);

  const deactivate = async (gear) => {
    if (!window.confirm(`Nonaktifkan "${gear.name}"? Gear tidak akan tampil di katalog publik.`)) return;
    try {
      await api.delete(`/admin/gears/${gear.id}`);
      toast.success('Gear dinonaktifkan.');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menonaktifkan gear.');
    }
  };

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (gear) => { setEditing(gear); setModalOpen(true); };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <SectionHead
        eyebrow="// 04 — Inventaris"
        title="Kelola Gear"
        action={<Btn onClick={openAdd}><Plus className="w-4 h-4" /> Tambah</Btn>}
      />

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-3 text-ink/40 dark:text-sand/40" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama, brand, atau kategori…" className={`${INPUT} pl-9`} />
      </div>

      <section className={`${CARD} p-6`}>
        {loading ? (
          <div className="space-y-2">{[...Array(6)].map((_, i) => <div key={i} className={`${SKEL} h-14`} />)}</div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-ink/55 dark:text-sand/60 py-8 text-center">Tidak ada gear.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-ink/80 dark:text-sand/80">
              <thead className="bg-bone dark:bg-white/5 text-ink/50 dark:text-sand/60 font-mono text-[10px] tracking-[0.1em] uppercase border-b-2 border-ink/10 dark:border-white/10">
                <tr>
                  <th className="p-3">Gear</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Harga/Hari</th>
                  <th className="p-3">Stok</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10 dark:divide-white/10">
                {filtered.map((g) => (
                  <tr key={g.id} className="hover:bg-bone/60 dark:hover:bg-white/5">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img src={g.image_url || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=100&q=70&auto=format&fit=crop'} alt="" className="w-10 h-10 object-cover rounded-sm border border-ink/10 dark:border-white/10" />
                        <div>
                          <p className="font-semibold text-ink dark:text-white">{g.name}</p>
                          <p className="font-mono text-[10px] text-ink/50 dark:text-sand/50">{g.brand || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{g.category?.name || '—'}</td>
                    <td className="p-3 font-bold text-ember-2 dark:text-ember">{formatRupiah(g.price_per_day)}</td>
                    <td className="p-3 font-mono">{g.stock_available}/{g.stock_total}</td>
                    <td className="p-3">
                      <span className={`font-mono px-2 py-1 rounded-sm text-[10px] font-bold border uppercase tracking-wide ${g.is_available ? 'bg-moss/15 text-moss border-moss/30' : 'bg-ink/10 text-ink/50 dark:text-sand/50 border-ink/20 dark:border-white/20'}`}>
                        {g.is_available ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(g)} title="Edit" className="grid place-items-center w-8 h-8 rounded-md bg-bone dark:bg-white/5 border-2 border-ink/10 dark:border-white/10 text-ink/70 dark:text-sand hover:border-ember/40">
                          <Pencil className="w-4 h-4" />
                        </button>
                        {g.is_available && (
                          <button onClick={() => deactivate(g)} title="Nonaktifkan" className="grid place-items-center w-8 h-8 rounded-md bg-red-500/10 border-2 border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/20">
                            <PowerOff className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <GearForm open={modalOpen} onClose={() => setModalOpen(false)} categories={categories} editing={editing} onSaved={load} />
    </div>
  );
}

export default function AdminGearsPage() {
  return (
    <AdminShell title="Kelola Gear">
      <AdminGears />
    </AdminShell>
  );
}

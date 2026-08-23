'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import api from '@/lib/axios';
import { formatRupiah } from '@/lib/format';
import { toast } from 'sonner';
import AdminShell from '@/components/organisms/AdminShell';
import { CARD, SKEL, INPUT, SectionHead, Btn, Modal, Field } from '@/components/admin/ui';
import { Plus, Pencil, Power, PowerOff, Trash2, MoreVertical, Search, Layers, X } from 'lucide-react';

// Meatball (⋮) row menu. Renders fixed-positioned so it escapes the table's
// horizontal-scroll container instead of being clipped.
function RowActions({ gear, onEdit, onToggle, onDelete, onVariants }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);

  // Close on scroll/resize (position would go stale). Outside-click is handled
  // by the backdrop below — no document mousedown listener, which used to race
  // the button's click and swallow it.
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  const toggleMenu = () => {
    if (open) { setOpen(false); return; }
    const r = btnRef.current.getBoundingClientRect();
    setPos({ top: r.bottom + 6, left: r.right - 180 });
    setOpen(true);
  };

  const run = (fn) => { setOpen(false); fn(); };
  const item = 'w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors';

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggleMenu}
        aria-label="Aksi gear"
        className="grid place-items-center w-8 h-8 rounded-md border-2 border-ink/10 dark:border-white/10 text-ink/70 dark:text-sand hover:border-ember/40"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && createPortal(
        <>
          <div className="fixed inset-0 z-[65]" onClick={() => setOpen(false)} />
          <div
            style={{ position: 'fixed', top: pos.top, left: pos.left }}
            className="w-45 z-[70] rounded-md border-2 border-ink/10 dark:border-white/10 bg-white dark:bg-[#213026] shadow-xl shadow-ink/20 py-1"
          >
            <button onClick={() => run(onEdit)} className={`${item} text-ink/80 dark:text-sand hover:bg-bone dark:hover:bg-white/5`}>
              <Pencil className="w-4 h-4 text-ink/50 dark:text-sand/60" /> Edit
            </button>
            <button onClick={() => run(onVariants)} className={`${item} text-ink/80 dark:text-sand hover:bg-bone dark:hover:bg-white/5`}>
              <Layers className="w-4 h-4 text-trail" /> Kelola Varian
            </button>
            <button onClick={() => run(onToggle)} className={`${item} text-ink/80 dark:text-sand hover:bg-bone dark:hover:bg-white/5`}>
              {gear.is_available
                ? <><PowerOff className="w-4 h-4 text-ember-2 dark:text-ember" /> Nonaktifkan</>
                : <><Power className="w-4 h-4 text-moss" /> Aktifkan kembali</>}
            </button>
            <button onClick={() => run(onDelete)} className={`${item} text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10`}>
              <Trash2 className="w-4 h-4" /> Hapus
            </button>
          </div>
        </>,
        document.body
      )}
    </>
  );
}

const EMPTY = {
  category_id: '', name: '', description: '', brand: '',
  price_per_day: '', stock_total: '', image_url: '', images: '', weight_kg: '', is_available: true,
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
          images: (editing.images || []).join('\n'),
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
        images: form.images ? form.images.split('\n').map((s) => s.trim()).filter(Boolean) : [],
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
        <Field label="URL Gambar Utama (cover)">
          <input type="url" value={form.image_url} onChange={(e) => set('image_url', e.target.value)} className={INPUT} placeholder="https://…" />
        </Field>
        <Field label="URL Gambar Tambahan (satu per baris, untuk galeri)">
          <textarea rows={3} value={form.images} onChange={(e) => set('images', e.target.value)} className={INPUT} placeholder={'https://…\nhttps://…'} />
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

// Add / edit / delete a gear's variants (size, color, per-variant stock).
function VariantModal({ open, onClose, gear, onSaved }) {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState({ size: '', color: '', stock: '' });
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/gears/${gear.id}`);
      setVariants(res.data.data?.variants || []);
    } catch {
      toast.error('Gagal memuat varian.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && gear) { setDraft({ size: '', color: '', stock: '' }); load(); }
  }, [open, gear?.id]);

  const addVariant = async () => {
    if (!draft.size && !draft.color) { toast.error('Isi minimal ukuran atau warna.'); return; }
    setBusy(true);
    try {
      await api.post(`/admin/gears/${gear.id}/variants`, {
        size: draft.size || null,
        color: draft.color || null,
        stock: Number(draft.stock) || 0,
      });
      setDraft({ size: '', color: '', stock: '' });
      await load();
      onSaved?.();
      toast.success('Varian ditambahkan.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menambah varian.');
    } finally {
      setBusy(false);
    }
  };

  const saveVariant = async (v) => {
    setBusy(true);
    try {
      await api.put(`/admin/gears/${gear.id}/variants/${v.id}`, {
        size: v.size || null,
        color: v.color || null,
        stock: Number(v.stock) || 0,
      });
      await load();
      onSaved?.();
      toast.success('Varian diperbarui.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan varian.');
    } finally {
      setBusy(false);
    }
  };

  const deleteVariant = async (v) => {
    if (!window.confirm(`Hapus varian "${v.label}"?`)) return;
    setBusy(true);
    try {
      await api.delete(`/admin/gears/${gear.id}/variants/${v.id}`);
      await load();
      onSaved?.();
      toast.success('Varian dihapus.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus varian.');
    } finally {
      setBusy(false);
    }
  };

  const setRow = (id, key, val) =>
    setVariants((vs) => vs.map((v) => (v.id === id ? { ...v, [key]: val } : v)));

  return (
    <Modal open={open} onClose={onClose} title={`Varian — ${gear?.name || ''}`}>
      <div className="space-y-4">
        <p className="text-xs text-ink/55 dark:text-sand/60">
          Varian untuk gear dengan ukuran/warna (mis. jaket, sepatu). Stok dilacak per varian. Kosongkan bila gear tanpa varian.
        </p>

        {loading ? (
          <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className={`${SKEL} h-10`} />)}</div>
        ) : (
          <div className="space-y-2">
            {variants.length === 0 && (
              <p className="text-xs text-ink/45 dark:text-sand/45 py-2 text-center">Belum ada varian.</p>
            )}
            {variants.map((v) => (
              <div key={v.id} className="grid grid-cols-[1fr_1fr_4.5rem_auto] gap-2 items-center">
                <input value={v.size || ''} onChange={(e) => setRow(v.id, 'size', e.target.value)} placeholder="Ukuran" className={INPUT} />
                <input value={v.color || ''} onChange={(e) => setRow(v.id, 'color', e.target.value)} placeholder="Warna" className={INPUT} />
                <input type="number" min="0" value={v.stock} onChange={(e) => setRow(v.id, 'stock', e.target.value)} placeholder="Stok" className={INPUT} />
                <div className="flex gap-1">
                  <button onClick={() => saveVariant(v)} disabled={busy} title="Simpan" className="grid place-items-center w-9 h-9 rounded-md bg-ember/10 text-ember border-2 border-ember/20 hover:bg-ember/20 disabled:opacity-40">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteVariant(v)} disabled={busy} title="Hapus" className="grid place-items-center w-9 h-9 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 border-2 border-red-500/20 hover:bg-red-500/20 disabled:opacity-40">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add row */}
        <div className="pt-3 border-t-2 border-ink/10 dark:border-white/10">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60 dark:text-sand/60 mb-2">Tambah Varian</p>
          <div className="grid grid-cols-[1fr_1fr_4.5rem_auto] gap-2 items-center">
            <input value={draft.size} onChange={(e) => setDraft((d) => ({ ...d, size: e.target.value }))} placeholder="Ukuran" className={INPUT} />
            <input value={draft.color} onChange={(e) => setDraft((d) => ({ ...d, color: e.target.value }))} placeholder="Warna" className={INPUT} />
            <input type="number" min="0" value={draft.stock} onChange={(e) => setDraft((d) => ({ ...d, stock: e.target.value }))} placeholder="Stok" className={INPUT} />
            <button onClick={addVariant} disabled={busy} className="grid place-items-center w-9 h-9 rounded-md bg-ember text-white shadow-md shadow-ember/20 hover:bg-ember-2 disabled:opacity-40">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <Btn type="button" variant="ghost" onClick={onClose} className="w-full">Selesai</Btn>
      </div>
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
  const [variantGear, setVariantGear] = useState(null);

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

  const setAvailability = async (gear, available) => {
    if (available === false && !window.confirm(`Nonaktifkan "${gear.name}"? Gear tidak akan tampil di katalog publik.`)) return;
    try {
      await api.patch(`/admin/gears/${gear.id}/availability`, { available });
      toast.success(available ? 'Gear diaktifkan kembali.' : 'Gear dinonaktifkan.');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal memperbarui status gear.');
    }
  };

  const remove = async (gear) => {
    if (!window.confirm(`Hapus "${gear.name}"? Gear akan hilang dari katalog & dashboard (riwayat booking tetap aman).`)) return;
    try {
      await api.delete(`/admin/gears/${gear.id}`);
      toast.success('Gear dihapus.');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus gear.');
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
                    <td className="p-3 font-mono">
                      {g.stock_available}/{g.stock_total}
                      {g.variants_count > 0 && (
                        <span className="ml-1.5 inline-flex items-center gap-1 text-[10px] text-trail" title={`${g.variants_count} varian`}>
                          <Layers className="w-3 h-3" />{g.variants_count}
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`font-mono px-2 py-1 rounded-sm text-[10px] font-bold border uppercase tracking-wide ${g.is_available ? 'bg-moss/15 text-moss border-moss/30' : 'bg-ink/10 text-ink/50 dark:text-sand/50 border-ink/20 dark:border-white/20'}`}>
                        {g.is_available ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-2">
                        {!g.is_available && (
                          <button
                            onClick={() => setAvailability(g, true)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-moss/15 border-2 border-moss/30 text-moss font-mono text-[10px] font-bold uppercase tracking-wide hover:bg-moss/25"
                          >
                            <Power className="w-3.5 h-3.5" /> Aktifkan
                          </button>
                        )}
                        <RowActions
                          gear={g}
                          onEdit={() => openEdit(g)}
                          onVariants={() => setVariantGear(g)}
                          onToggle={() => setAvailability(g, !g.is_available)}
                          onDelete={() => remove(g)}
                        />
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
      <VariantModal open={!!variantGear} gear={variantGear} onClose={() => setVariantGear(null)} onSaved={load} />
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

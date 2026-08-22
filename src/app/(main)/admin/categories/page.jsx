'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import AdminShell from '@/components/organisms/AdminShell';
import { CARD, SKEL, INPUT, SectionHead, Btn, Modal, Field } from '@/components/admin/ui';
import { Plus, Pencil, Trash2, Tags } from 'lucide-react';

const EMPTY = { name: '', description: '', image_url: '' };

function CategoryForm({ open, onClose, editing, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(editing
      ? { name: editing.name || '', description: editing.description || '', image_url: editing.image_url || '' }
      : EMPTY);
  }, [open, editing]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: form.name, description: form.description || null, image_url: form.image_url || null };
      if (editing) {
        await api.put(`/admin/categories/${editing.id}`, payload);
        toast.success('Kategori diperbarui.');
      } else {
        await api.post('/admin/categories', payload);
        toast.success('Kategori baru ditambahkan.');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan kategori.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Kategori' : 'Tambah Kategori'}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Nama Kategori">
          <input required value={form.name} onChange={(e) => set('name', e.target.value)} className={INPUT} placeholder="Tenda" />
        </Field>
        <Field label="Deskripsi">
          <textarea rows={2} value={form.description} onChange={(e) => set('description', e.target.value)} className={INPUT} placeholder="Tenda dome, tunnel, & ultralight…" />
        </Field>
        <Field label="URL Gambar">
          <input type="url" value={form.image_url} onChange={(e) => set('image_url', e.target.value)} className={INPUT} placeholder="https://…" />
        </Field>
        <div className="flex gap-3 pt-2">
          <Btn type="button" variant="ghost" onClick={onClose} className="flex-1">Batal</Btn>
          <Btn type="submit" disabled={saving} className="flex-1">{saving ? 'Menyimpan…' : editing ? 'Simpan' : 'Tambah'}</Btn>
        </div>
      </form>
    </Modal>
  );
}

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data || []);
    } catch (err) {
      toast.error('Gagal memuat kategori.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (cat) => {
    if (!window.confirm(`Hapus kategori "${cat.name}"?`)) return;
    try {
      await api.delete(`/admin/categories/${cat.id}`);
      toast.success('Kategori dihapus.');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus kategori.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <SectionHead
        eyebrow="// 05 — Klasifikasi"
        title="Kategori Gear"
        action={<Btn onClick={() => { setEditing(null); setModalOpen(true); }}><Plus className="w-4 h-4" /> Tambah</Btn>}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className={`${SKEL} h-28`} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div key={c.id} className={`${CARD} p-5 flex flex-col gap-4`}>
              <div className="flex items-start justify-between">
                <span className="grid place-items-center w-10 h-10 rounded-md bg-ink text-ember dark:bg-white/5">
                  <Tags className="w-5 h-5" />
                </span>
                <span className="font-mono text-[10px] font-bold text-trail bg-trail/10 px-2 py-1 rounded-sm border border-trail/20 uppercase tracking-wide">
                  {c.gears_count ?? 0} unit
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="font-display font-bold uppercase tracking-tight text-ink dark:text-white text-lg leading-none truncate">{c.name}</h3>
                <p className="text-xs text-ink/55 dark:text-sand/55 mt-1.5 line-clamp-2">{c.description || 'Tanpa deskripsi.'}</p>
              </div>
              <div className="flex gap-2 pt-1">
                <Btn variant="ghost" onClick={() => { setEditing(c); setModalOpen(true); }} className="flex-1"><Pencil className="w-3.5 h-3.5" /> Edit</Btn>
                <Btn variant="danger" onClick={() => remove(c)}><Trash2 className="w-3.5 h-3.5" /></Btn>
              </div>
            </div>
          ))}
        </div>
      )}

      <CategoryForm open={modalOpen} onClose={() => setModalOpen(false)} editing={editing} onSaved={load} />
    </div>
  );
}

export default function AdminCategoriesPage() {
  return (
    <AdminShell title="Kategori">
      <AdminCategories />
    </AdminShell>
  );
}

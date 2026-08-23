'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const CARD = 'bg-white dark:bg-[#213026] border-2 border-ink/10 dark:border-white/10 rounded-md';
export const SKEL = 'bg-bone-2 dark:bg-white/5 animate-pulse rounded-md';
export const INPUT =
  'w-full bg-bone dark:bg-[#16261d] border-2 border-ink/15 dark:border-white/15 rounded-md px-3 py-2 text-sm text-ink dark:text-white focus:outline-none focus:border-ember transition-colors';

export function SectionHead({ eyebrow, title, action }) {
  return (
    <div className="flex items-end gap-3">
      <div className="min-w-0">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-trail dark:text-trail-2">{eyebrow}</p>
        <h2 className="font-display font-bold uppercase text-2xl tracking-tight text-ink dark:text-white leading-none mt-1">{title}</h2>
      </div>
      <span className="flex-1 h-0.5 bg-ink/10 dark:bg-white/10 mb-1" />
      {action}
    </div>
  );
}

export function Btn({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-display font-semibold uppercase tracking-wide text-xs rounded-md px-4 py-2.5 transition-colors disabled:opacity-50';
  const styles = {
    primary: 'bg-ember hover:bg-ember-2 text-white shadow-md shadow-ember/20',
    ghost: 'bg-bone dark:bg-white/5 text-ink dark:text-sand border-2 border-ink/10 dark:border-white/10 hover:border-ember/40',
    danger: 'bg-red-500/10 text-red-600 dark:text-red-400 border-2 border-red-500/20 hover:bg-red-500/20',
  };
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-char/75 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg my-8 bg-white dark:bg-[#213026] border-2 border-ink/10 dark:border-white/10 rounded-md shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-ink/10 dark:border-white/10">
          <h3 className="font-display font-bold uppercase tracking-tight text-ink dark:text-white text-lg">{title}</h3>
          <button onClick={onClose} className="p-1.5 text-ink/40 dark:text-sand/50 hover:text-ink dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60 dark:text-sand/60 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown, Check } from 'lucide-react';

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

export function AdminSelect({ value, onChange, options, placeholder = 'Pilih…', className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const formattedOptions = options.map((opt) =>
    typeof opt === 'object' ? opt : { value: opt, label: opt }
  );

  const selected = formattedOptions.find((o) => String(o.value) === String(value));

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-2 bg-bone dark:bg-[#16261d] border-2 ${
          open ? 'border-ember ring-2 ring-ember/20' : 'border-ink/15 dark:border-white/15 hover:border-ink/30 dark:hover:border-white/30'
        } rounded-md px-3 py-2 text-sm text-left transition-all ${
          selected && selected.value !== '' ? 'text-ink dark:text-white font-medium' : 'text-ink/50 dark:text-sand/50'
        }`}
      >
        <span className="truncate capitalize">{selected ? selected.label : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-ink/50 dark:text-sand/50 transition-transform duration-200 ${open ? 'rotate-180 text-ember' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-[80] bg-white dark:bg-[#213026] border-2 border-ink/15 dark:border-white/15 rounded-md shadow-xl max-h-56 overflow-y-auto py-1 animate-in fade-in zoom-in-95 duration-100">
          {formattedOptions.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-left capitalize transition-colors ${
                  isSelected
                    ? 'bg-ember/15 text-ember-2 dark:text-ember font-semibold'
                    : 'text-ink/80 dark:text-sand hover:bg-bone dark:hover:bg-white/5'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check className="w-4 h-4 text-ember shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function AdminStatusSelect({ value, onChange, options, statusStyleMap = {} }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);

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

  const toggle = () => {
    if (open) { setOpen(false); return; }
    const r = btnRef.current.getBoundingClientRect();
    setPos({ top: r.bottom + 4, left: Math.max(10, r.right - 140) });
    setOpen(true);
  };

  const formattedOptions = options.map((opt) =>
    typeof opt === 'object' ? opt : { value: opt, label: opt }
  );

  const selected = formattedOptions.find((o) => String(o.value) === String(value));
  const badgeStyle = statusStyleMap[value] || 'bg-bone dark:bg-[#16261d] text-ink dark:text-white border-ink/20';

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        className={`inline-flex items-center gap-1.5 font-mono px-2.5 py-1.5 rounded-md text-xs font-bold border capitalize tracking-wide transition-all hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-ember/40 ${badgeStyle}`}
      >
        <span>{selected ? selected.label : value}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && createPortal(
        <>
          <div className="fixed inset-0 z-[65]" onClick={() => setOpen(false)} />
          <div
            style={{ position: 'fixed', top: pos.top, left: pos.left }}
            className="w-36 z-[70] rounded-md border-2 border-ink/15 dark:border-white/15 bg-white dark:bg-[#213026] shadow-xl py-1 text-xs font-mono font-medium animate-in fade-in zoom-in-95 duration-100"
          >
            {formattedOptions.map((opt) => {
              const isSelected = String(opt.value) === String(value);
              const optStyle = statusStyleMap[opt.value] || '';
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left capitalize transition-colors ${
                    isSelected
                      ? 'bg-ember/15 text-ember-2 dark:text-ember font-bold'
                      : 'text-ink/80 dark:text-sand hover:bg-bone dark:hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${optStyle.split(' ')[0] || 'bg-ink/30'}`} />
                    {opt.label}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-ember shrink-0" />}
                </button>
              );
            })}
          </div>
        </>,
        document.body
      )}
    </>
  );
}


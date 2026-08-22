'use client';

import * as React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Custom dropdown that replaces the native <select> so the option list can be
 * themed (rounded, ember highlight) — native option popups can't be styled.
 * Keeps the same API: pass <option value>label</option> children, read the
 * choice via onChange(e) with e.target.value. Keyboard + click-outside aware.
 */
function Select({ value, onChange, children, className, disabled, placeholder }) {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(-1);
  const rootRef = React.useRef(null);
  const listRef = React.useRef(null);

  const options = [];
  React.Children.forEach(children, (child) => {
    if (child && child.props) options.push({ value: child.props.value ?? '', label: child.props.children });
  });

  const selectedIndex = options.findIndex((o) => String(o.value) === String(value));
  const selected = options[selectedIndex];

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  // Keep the keyboard-highlighted option scrolled into view.
  React.useEffect(() => {
    if (open && active >= 0 && listRef.current) {
      listRef.current.children[active]?.scrollIntoView({ block: 'nearest' });
    }
  }, [open, active]);

  const choose = (v) => {
    onChange?.({ target: { value: v } });
    setOpen(false);
  };

  const openMenu = () => {
    setActive(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  };

  const onKey = (e) => {
    if (disabled) return;
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); openMenu(); }
      return;
    }
    if (e.key === 'Escape' || e.key === 'Tab') { setOpen(false); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(options.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (active >= 0) choose(options[active].value); }
  };

  return (
    <div ref={rootRef} className={cn('relative w-full', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKey}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-md border-2 border-ink/15 bg-bone px-4 py-2.5 text-sm font-medium text-ink cursor-pointer transition-colors hover:border-ink/30 focus-visible:outline-none focus-visible:border-ember disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="truncate text-left">{selected ? selected.label : (placeholder || 'Pilih…')}</span>
        <ChevronDown className={cn('w-4 h-4 text-ink/50 transition-transform shrink-0', open && 'rotate-180')} />
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-50 mt-2 w-full max-h-72 overflow-y-auto rounded-md border-2 border-ink/10 bg-white shadow-xl shadow-ink/15 py-1.5"
        >
          {options.map((o, i) => {
            const isSel = String(o.value) === String(value);
            const isActive = i === active;
            return (
              <li
                key={`${o.value}-${i}`}
                role="option"
                aria-selected={isSel}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(o.value)}
                className={cn(
                  'flex items-center justify-between gap-2 px-4 py-2 text-sm cursor-pointer transition-colors',
                  isSel ? 'bg-ember/15 text-ember-2 font-semibold' : 'text-ink/80',
                  isActive && !isSel && 'bg-bone'
                )}
              >
                <span className="truncate">{o.label}</span>
                {isSel && <Check className="w-3.5 h-3.5 shrink-0" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export { Select };

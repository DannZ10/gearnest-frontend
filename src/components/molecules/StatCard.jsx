import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Admin dashboard stat card — bold expedition style with a left accent stripe.
 */
export default function StatCard({ icon: Icon, label, value, accent = 'text-ember', stripe = 'bg-ember' }) {
  return (
    <div className="relative overflow-hidden rounded-md border-2 border-ink/10 dark:border-white/10 bg-white dark:bg-[#1b2228] p-5">
      <span className={cn('absolute left-0 top-0 bottom-0 w-1', stripe)} />
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display font-bold text-4xl leading-none text-ink dark:text-white">{value}</p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/50 dark:text-sand/60">{label}</p>
        </div>
        <span className="grid place-items-center w-9 h-9 rounded-md bg-ink/5 dark:bg-white/5 shrink-0">
          <Icon className={cn('w-4.5 h-4.5', accent)} />
        </span>
      </div>
    </div>
  );
}

import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * Admin dashboard stat card with icon and large value.
 */
export default function StatCard({ icon: Icon, label, value, accent = 'text-ember' }) {
  return (
    <Card className="p-6 space-y-2 dark:bg-[#1b2228] dark:border-white/10">
      <div className="flex items-center justify-between text-ink/50 dark:text-sand/60">
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
        <Icon className={cn('w-5 h-5', accent)} />
      </div>
      <p className="font-display font-bold text-3xl text-ink dark:text-white">{value}</p>
    </Card>
  );
}

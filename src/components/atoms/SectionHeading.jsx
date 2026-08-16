import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Reusable section heading with divider line and optional subtitle.
 * Used across all landing page sections.
 */
export default function SectionHeading({ title, subtitle, center = false, className }) {
  return (
    <div className={cn(center && 'text-center', className)}>
      <h2 className="font-display font-bold uppercase text-3xl sm:text-4xl text-ink leading-none">
        {title}
      </h2>
      <div className={cn('w-16 h-1 bg-ember rounded-full mt-3', center && 'mx-auto')} />
      {subtitle && (
        <p className="text-sm text-ink/60 mt-3">{subtitle}</p>
      )}
    </div>
  );
}

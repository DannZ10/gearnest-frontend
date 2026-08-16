import React from 'react';
import Link from 'next/link';
import { Mountain } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * The GearNest brand logo + wordmark.
 * Used in Navbar, Footer, Login portal, and Admin sidebar.
 */
export default function BrandMark({ className, dark = false, showTagline = false }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2.5 group', className)}>
      <span
        className={cn(
          'grid place-items-center w-10 h-10 rounded-xl shadow-sm transition-transform group-hover:-translate-y-0.5',
          dark ? 'bg-ember text-ink' : 'bg-ink text-ember'
        )}
      >
        <Mountain className="w-5 h-5" strokeWidth={2.5} />
      </span>
      <span className="leading-none">
        <span
          className={cn(
            'font-display font-bold text-xl tracking-wide block',
            dark ? 'text-white' : 'text-ink'
          )}
        >
          GEAR<span className="text-ember">NEST</span>
        </span>
        {showTagline && (
          <span className={cn('text-[9px] font-semibold tracking-[0.18em] uppercase', dark ? 'text-ember' : 'text-moss')}>
            Rent. Gear Up. Get Out.
          </span>
        )}
      </span>
    </Link>
  );
}

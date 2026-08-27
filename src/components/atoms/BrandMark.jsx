import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * The Kembara.id brand logo — the real brand asset used across the site.
 * Light surfaces get the full colour lockup (same asset as the landing navbar);
 * dark surfaces get the wordmark whitened (same treatment as the footer).
 * Used in the auth screens and the admin sidebar.
 */
export default function BrandMark({ className, dark = false }) {
  return (
    <Link href="/" aria-label="Kembara.id" className={cn('inline-flex items-center group', className)}>
      {dark ? (
        <Image
          src="/img/logo-text.webp"
          alt="Kembara.id"
          width={150}
          height={30}
          priority
          className="transition-transform group-hover:-translate-y-0.5"
          style={{ height: 30, width: 'auto', filter: 'brightness(0) invert(1)' }}
        />
      ) : (
        <Image
          src="/img/logo-full.webp"
          alt="Kembara.id"
          width={130}
          height={32}
          priority
          className="transition-transform group-hover:-translate-y-0.5"
          style={{ height: 34, width: 'auto' }}
        />
      )}
    </Link>
  );
}

'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * The public navbar/footer are hidden on /admin/* — the admin area runs its
 * own shell (AdminShell) instead.
 */
export function SiteHeader() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return <Navbar />;
}

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return <Footer />;
}

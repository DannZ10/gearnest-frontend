import React from 'react';
import { SiteHeader, SiteFooter } from '@/components/templates/SiteChrome';

export default function MainLayout({ children }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-grow flex flex-col">{children}</main>
      <SiteFooter />
    </>
  );
}

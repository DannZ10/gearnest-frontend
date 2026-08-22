import React from 'react';
import { Inter, Oswald } from 'next/font/google';
import { Toaster } from 'sonner';
import IdleTimeout from '@/components/templates/IdleTimeout';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const oswald = Oswald({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-oswald',
});

export const metadata = {
  title: 'GearNest — Sewa Alat Outdoor & Perlengkapan Gunung',
  description:
    'Basecamp-mu untuk gear terawat dan petualangan tak terlupakan. Sewa tenda, carrier, sleeping bag, dan perlengkapan gunung dengan pembayaran otomatis.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${inter.variable} ${oswald.variable}`} suppressHydrationWarning>
      <body
        className="bg-bone text-ink min-h-screen flex flex-col antialiased"
        suppressHydrationWarning
      >
        {children}
        <IdleTimeout />
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}

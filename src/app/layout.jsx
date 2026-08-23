import React from 'react';
import { Inter, Outfit, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import IdleTimeout from '@/components/templates/IdleTimeout';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-outfit',
});
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains',
});

export const metadata = {
  title: 'Kembara.id — Sewa Perlengkapan Outdoor & Alat Gunung',
  description:
    'Eksplorasi Alam dengan Perlengkapan Terbaik. Sewa tenda, carrier, sleeping bag, dan gear teknis terawat dengan pembayaran otomatis.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${inter.variable} ${outfit.variable} ${jetbrains.variable}`} suppressHydrationWarning>
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

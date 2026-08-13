import React from 'react';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'GearNest — Sistem Rental Alat Outdoor & Peralatan Gunung',
  description: 'Sewa tenda, carrier, sleeping bag, kompor, dan perlengkapan gunung terlengkap dengan pengiriman cepat & pembayaran otomatis.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Toaster position="bottom-right" theme="dark" richColors />
      </body>
    </html>
  );
}

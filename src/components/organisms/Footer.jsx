'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer gn-topo">
      <svg className="footer-contour" viewBox="0 0 600 600" fill="none" aria-hidden="true">
        <g stroke="#6C8C70" strokeWidth="1.5" strokeLinecap="round">
          <path d="M300 28 C 428 20 578 138 584 300 C 590 462 430 580 296 576 C 162 572 20 466 16 300 C 12 138 172 36 300 28 Z" />
          <path d="M300 70 C 404 66 536 160 540 302 C 544 442 410 536 300 532 C 192 528 70 444 64 302 C 58 164 196 74 300 70 Z" />
          <path d="M302 112 C 384 112 496 186 498 304 C 500 420 392 494 304 490 C 216 486 116 418 110 306 C 104 194 222 112 302 112 Z" />
          <path d="M306 154 C 366 156 456 214 456 306 C 456 396 374 452 306 448 C 238 444 156 392 154 308 C 152 226 246 152 306 154 Z" />
          <path d="M308 196 C 350 200 418 244 416 308 C 414 370 356 410 308 406 C 260 402 198 366 200 310 C 202 258 266 192 308 196 Z" />
        </g>
      </svg>
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Image src="/img/logo-text.webp" alt="Kembara.id" width={150} height={30} style={{ height: 30, width: 'auto', filter: 'brightness(0) invert(1)' }} />
            <p>Platform sewa perlengkapan outdoor untuk pendakian, camping, dan tracking. Kawan setia di setiap langkah alam.</p>
            <div className="socials">
              <a href="#" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" /></svg>
              </a>
              <a href="#" aria-label="TikTok">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 3c.4 2.1 1.8 3.7 3.9 4v3c-1.5 0-2.9-.5-3.9-1.3v6.4a6 6 0 1 1-6-6c.3 0 .7 0 1 .1v3.1a3 3 0 1 0 2 2.8V3h3z" /></svg>
              </a>
              <a href="#" aria-label="WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l5-1.4A10 10 0 1 0 12 2zm0 2a8 8 0 1 1-4.1 14.9l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 0 1 12 4zm-3.1 4.3c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.8 2.2.9 2.6.7 3.1.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.5-.3-1.5-.7c-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.4 6.4 0 0 1-3-2.6c-.1-.2 0-.3.1-.5l.5-.6c.1-.2.1-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4z" /></svg>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h5>Navigasi</h5>
            <ul>
              <li><Link href="/">Beranda</Link></li>
              <li><Link href="/gears">Katalog Gear</Link></li>
              <li><Link href="/#cara-sewa">Cara Sewa</Link></li>
              <li><Link href="/#hitung">Hitung Biaya</Link></li>
              <li><Link href="/#faq">FAQ</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Kategori</h5>
            <ul>
              <li><Link href="/categories">Muncak &amp; Trek</Link></li>
              <li><Link href="/categories">Camp &amp; Stay</Link></li>
              <li><Link href="/categories">Camp Kitchen</Link></li>
              <li><Link href="/categories">Light &amp; Safety</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Bantuan</h5>
            <ul>
              <li><Link href="/#faq">Jaminan Identitas</Link></li>
              <li><Link href="/#faq">Kebijakan Pembatalan</Link></li>
              <li><Link href="/#faq">Ketentuan Sewa</Link></li>
              <li><Link href="/#faq">Pusat Bantuan</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Kontak</h5>
            <div className="footer-contact"><MapPin size={16} /><span>Jl. Raya Bromo No. 45, Malang, Jawa Timur</span></div>
            <div className="footer-contact"><Phone size={16} /><span>+62 812-1740-9277</span></div>
            <div className="footer-contact"><Mail size={16} /><span>halo@kembara.id</span></div>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="legal">© {new Date().getFullYear()} Kembara.id. Seluruh hak cipta dilindungi.</span>
          <span className="legal" style={{ fontFamily: 'var(--font-mono)' }}>Sewa Gear Lengkap · Siap Menatap Puncak</span>
        </div>
        <div className="footer-kicker">Kembara</div>
      </div>
    </footer>
  );
}

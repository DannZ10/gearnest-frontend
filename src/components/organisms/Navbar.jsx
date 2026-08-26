'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingBag, User as UserIcon, LogOut, Shield, Menu, X, ChevronDown, ArrowRight } from 'lucide-react';

const NAV_LINKS = [
  { href: '/gears', label: 'Katalog' },
  { href: '/categories', label: 'Kategori' },
  { href: '/#cara-sewa', label: 'Cara Sewa' },
  { href: '/#hitung', label: 'Hitung Biaya' },
  { href: '/#faq', label: 'FAQ' },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, role, logout } = useAuthStore();
  const items = useCartStore((s) => s.items);

  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  // The header floats transparently over the dark hero only on the landing page.
  const overHero = pathname === '/';
  const solid = scrolled || !overHero || mobileOpen;

  useEffect(() => {
    setMounted(true);
    let lastY = window.scrollY || 0;
    const onScroll = () => {
      const y = window.scrollY || 0;
      setScrolled(y > 40);
      setHidden(y > lastY && y > 320 && !mobileOpen);
      lastY = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mobileOpen]);

  useEffect(() => { setMobileOpen(false); setUserMenu(false); }, [pathname]);

  const cartCount = mounted ? items.reduce((a, i) => a + i.quantity, 0) : 0;

  const handleLogout = () => {
    logout();
    setUserMenu(false);
    setMobileOpen(false);
    router.push('/login');
  };

  return (
    <>
      <header className={`site-header${solid ? ' scrolled' : ''}${hidden ? ' hidden' : ''}`}>
        <div className="container nav">
          <Link href="/" className="brand" aria-label="Kembara.id — Beranda">
            <Image src="/img/logo-full.webp" alt="Kembara.id" width={130} height={32} priority style={{ height: 32, width: 'auto' }} />
          </Link>

          <ul className="nav-links">
            {NAV_LINKS.map((l) => (
              <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
            ))}
          </ul>

          <div className="nav-cta">
            <Link href="/cart" className="nav-icon" aria-label="Keranjang">
              <ShoppingBag size={20} strokeWidth={2} />
              {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
            </Link>

            {mounted && token ? (
              <div className="nav-user">
                <button className="nav-user-btn" onClick={() => setUserMenu((v) => !v)} aria-expanded={userMenu}>
                  <span className="nav-user-name">{user?.name?.split(' ')[0] || 'Akun'}</span>
                  <ChevronDown size={15} strokeWidth={2.2} />
                </button>
                {userMenu && (
                  <div className="nav-dropdown">
                    <div className="nd-head">
                      <p className="nd-name">{user?.name}</p>
                      <p className="nd-email">{user?.email}</p>
                    </div>
                    {role === 'admin' ? (
                      <Link href="/admin/dashboard" className="nd-item nd-admin"><Shield size={16} /> Admin Control Panel</Link>
                    ) : (
                      <Link href="/account" className="nd-item"><ShoppingBag size={16} /> Riwayat Booking</Link>
                    )}
                    <button className="nd-item nd-danger" onClick={handleLogout}><LogOut size={16} /> Keluar</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="login">Masuk</Link>
                <Link href="/gears" className="btn btn-primary btn-sm">Sewa Sekarang</Link>
              </>
            )}

            <button className="nav-toggle" aria-label="Buka menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen((v) => !v)}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <div className={`mobile-menu${mobileOpen ? ' open' : ''}`}>
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>{l.label}</Link>
          ))}
          {mounted && token ? (
            <>
              {role === 'admin' ? (
                <Link href="/admin/dashboard" onClick={() => setMobileOpen(false)}>Admin Control Panel</Link>
              ) : (
                <Link href="/account" onClick={() => setMobileOpen(false)}>Riwayat Booking</Link>
              )}
              <button className="btn btn-ghost" onClick={handleLogout} style={{ marginTop: 12 }}>Keluar</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMobileOpen(false)}>Masuk</Link>
              <Link href="/gears" className="btn btn-primary" onClick={() => setMobileOpen(false)}>Sewa Sekarang <ArrowRight size={16} /></Link>
            </>
          )}
        </div>
      </header>

      {/* Spacer keeps content clear of the fixed header on non-hero pages */}
      {!overHero && <div style={{ height: 'var(--nav-height)' }} aria-hidden="true" />}
    </>
  );
}

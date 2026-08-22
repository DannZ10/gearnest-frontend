'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import BrandMark from '@/components/atoms/BrandMark';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, User as UserIcon, LogOut, Shield, Menu, X, ArrowRight } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/gears', label: 'Katalog Gear' },
  { href: '/categories', label: 'Kategori' },
  { href: '/about', label: 'Cara Sewa' },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, role, logout } = useAuthStore();
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the drawer on navigation.
  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  // Lock body scroll + close on Escape while the drawer is open.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && setMobileMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [mobileMenuOpen]);

  const totalCartCount = mounted ? items.reduce((acc, i) => acc + i.quantity, 0) : 0;

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push('/login');
  };

  const closeDrawer = () => setMobileMenuOpen(false);

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-bone/85 backdrop-blur-md border-b transition-shadow ${
          scrolled ? 'border-ink/10 shadow-sm shadow-ink/5' : 'border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">
            <BrandMark showTagline />

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-7 font-display uppercase tracking-wide text-[13px] text-ink/70">
              {NAV_LINKS.map((l) => {
                const active = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`relative transition-colors hover:text-ember ${active ? 'text-ember' : ''}`}
                  >
                    {l.label}
                    {active && <span className="absolute -bottom-1.5 left-0 right-0 h-[3px] bg-ember" />}
                  </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/cart"
                className="relative p-2.5 text-ink/70 hover:text-ink hover:bg-bone-2 rounded-md transition-all"
                title="Keranjang Sewa"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-ember text-white font-bold text-[10px] w-5 h-5 rounded-full grid place-items-center">
                    {totalCartCount}
                  </span>
                )}
              </Link>

              {mounted && token ? (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 py-1.5 pl-3 pr-2 text-sm bg-bone-2 hover:bg-sand/40 border border-ink/10 rounded-md transition-all"
                  >
                    <span className="font-semibold max-w-[120px] truncate text-ink">{user?.name || 'Akun'}</span>
                    {role === 'admin' && <Badge variant="warning">ADMIN</Badge>}
                    <UserIcon className="w-4 h-4 text-moss" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-ink/10 rounded-md shadow-xl shadow-ink/10 py-2 z-50 text-sm">
                      <div className="px-4 py-2 border-b border-ink/10">
                        <p className="font-semibold text-ink">{user?.name}</p>
                        <p className="text-xs text-ink/50 truncate">{user?.email}</p>
                      </div>

                      {role !== 'admin' && (
                        <Link
                          href="/account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 hover:bg-bone text-ink/80 hover:text-ember transition-colors"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Riwayat Booking Saya
                        </Link>
                      )}

                      {role === 'admin' && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 hover:bg-bone text-ember-2 font-semibold transition-colors border-t border-b border-ink/10 my-1"
                        >
                          <Shield className="w-4 h-4" />
                          Admin Control Panel
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-red-50 text-red-600 transition-colors text-left font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Keluar
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Button variant="ghost" asChild>
                    <Link href="/login">Masuk</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/gears" className="group">
                      Sewa Sekarang
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                </div>
              )}

              <button
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Buka menu"
                className="md:hidden p-2 text-ink/70 hover:text-ink"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer — fixed overlay, slides in from the right, above all layers */}
      <div className={`md:hidden fixed inset-0 z-[60] ${mobileMenuOpen ? '' : 'pointer-events-none'}`} aria-hidden={!mobileMenuOpen}>
        <div
          onClick={closeDrawer}
          className={`absolute inset-0 bg-char/60 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
        />
        <aside
          style={{
            transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
            translate: 'none',
            transition: 'transform 0.3s cubic-bezier(0.76,0,0.24,1)',
          }}
          className="absolute top-0 right-0 h-full w-[82%] max-w-xs bg-bone border-l-2 border-ink/10 shadow-2xl flex flex-col"
        >
          <div className="flex items-center justify-between px-5 h-18 border-b-2 border-ink/10">
            <BrandMark />
            <button onClick={closeDrawer} aria-label="Tutup menu" className="p-2 text-ink/60 hover:text-ink">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {NAV_LINKS.map((l) => {
              const active = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={closeDrawer}
                  className={`flex items-center px-3 py-3 rounded-md font-display uppercase tracking-wide text-sm transition-colors ${
                    active ? 'bg-ember/15 text-ember' : 'text-ink/80 hover:bg-bone-2'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="px-3 py-4 border-t-2 border-ink/10 space-y-2">
            {mounted && token ? (
              <>
                <div className="px-3 pb-2">
                  <p className="font-semibold text-ink text-sm truncate">{user?.name}</p>
                  <p className="font-mono text-[11px] text-ink/50 truncate">{user?.email}</p>
                </div>
                {role === 'admin' ? (
                  <Link href="/admin/dashboard" onClick={closeDrawer} className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-semibold text-ember-2 hover:bg-bone-2">
                    <Shield className="w-4 h-4" /> Admin Control Panel
                  </Link>
                ) : (
                  <Link href="/account" onClick={closeDrawer} className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-ink/80 hover:bg-bone-2">
                    <ShoppingBag className="w-4 h-4" /> Riwayat Booking Saya
                  </Link>
                )}
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 text-left">
                  <LogOut className="w-4 h-4" /> Keluar
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={closeDrawer} className="w-full text-center px-4 py-2.5 text-sm font-semibold text-ink bg-bone-2 rounded-md">
                  Masuk
                </Link>
                <Link href="/gears" onClick={closeDrawer} className="w-full text-center px-4 py-2.5 text-sm font-display font-semibold uppercase tracking-wide text-white bg-ember rounded-md">
                  Sewa Sekarang
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}

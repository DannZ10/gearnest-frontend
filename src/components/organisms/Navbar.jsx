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

  const totalCartCount = mounted ? items.reduce((acc, i) => acc + i.quantity, 0) : 0;

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    router.push('/login');
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-bone/85 backdrop-blur-md border-b transition-shadow ${
        scrolled ? 'border-ink/10 shadow-sm shadow-ink/5' : 'border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          <BrandMark showTagline />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-ink/70">
            {NAV_LINKS.map((l) => {
              const active = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative transition-colors hover:text-ember ${active ? 'text-ember' : ''}`}
                >
                  {l.label}
                  {active && <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-ember rounded-full" />}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="relative p-2.5 text-ink/70 hover:text-ink hover:bg-bone-2 rounded-xl transition-all"
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
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 py-1.5 pl-3 pr-2 text-sm bg-bone-2 hover:bg-sand/40 border border-ink/10 rounded-xl transition-all"
                >
                  <span className="font-semibold max-w-[120px] truncate text-ink">{user?.name || 'Akun'}</span>
                  {role === 'admin' && (
                    <Badge variant="warning">
                      ADMIN
                    </Badge>
                  )}
                  <UserIcon className="w-4 h-4 text-moss" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-ink/10 rounded-2xl shadow-xl shadow-ink/10 py-2 z-50 text-sm">
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
              <div className="hidden sm:flex items-center gap-2">
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
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-ink/70 hover:text-ink"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-bone border-t border-ink/10 px-4 pt-3 pb-4 space-y-1">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-semibold text-ink/80 hover:bg-bone-2"
            >
              {l.label}
            </Link>
          ))}
          {!token && (
            <div className="pt-2 border-t border-ink/10 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 text-sm font-semibold text-ink bg-bone-2 rounded-xl"
              >
                Masuk
              </Link>
              <Link
                href="/gears"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 text-sm font-display font-semibold uppercase tracking-wide text-white bg-ember rounded-xl"
              >
                Sewa Sekarang
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

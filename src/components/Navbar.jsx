'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingBag, User as UserIcon, LogOut, Shield, Menu, X, Mountain } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const { user, token, role, logout } = useAuthStore();
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalCartCount = mounted ? items.reduce((acc, i) => acc + i.quantity, 0) : 0;

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-emerald-400 hover:text-emerald-300 transition-colors">
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <Mountain className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="tracking-tight">Gear<span className="text-white">Nest</span></span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-300">
            <Link href="/" className="hover:text-emerald-400 transition-colors">Beranda</Link>
            <Link href="/gears" className="hover:text-emerald-400 transition-colors">Katalog Gear</Link>
            <Link href="/categories" className="hover:text-emerald-400 transition-colors">Kategori</Link>
            <Link href="/about" className="hover:text-emerald-400 transition-colors">Cara Sewa</Link>
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
              title="Keranjang Sewa"
            >
              <ShoppingBag className="w-6 h-6 text-emerald-400" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {totalCartCount}
                </span>
              )}
            </Link>

            {/* Auth Buttons or Profile Menu */}
            {mounted && token ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-3 pr-2 text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all"
                >
                  <span className="font-medium max-w-[120px] truncate text-slate-200">{user?.name || 'Akun'}</span>
                  {role === 'admin' && (
                    <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                      ADMIN
                    </span>
                  )}
                  <UserIcon className="w-4 h-4 text-emerald-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-2xl shadow-xl py-2 z-50 text-sm">
                    <div className="px-4 py-2 border-b border-slate-700">
                      <p className="font-semibold text-white">{user?.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-700/60 text-slate-200 hover:text-emerald-400 transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Riwayat Booking Saya
                    </Link>

                    {role === 'admin' && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-700/60 text-amber-400 font-medium transition-colors border-t border-b border-slate-700/50 my-1"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Control Panel
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-rose-500/10 text-rose-400 transition-colors text-left font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar (Logout)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
                >
                  Daftar
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Beranda
          </Link>
          <Link
            href="/gears"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Katalog Gear
          </Link>
          <Link
            href="/categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Kategori
          </Link>
          {!token && (
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 rounded-xl"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2 text-sm font-bold text-slate-950 bg-emerald-400 rounded-xl"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

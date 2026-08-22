'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import RequireAuth from '@/components/templates/RequireAuth';
import BrandMark from '@/components/atoms/BrandMark';
import { useAuthStore } from '@/store/useAuthStore';
import {
  LayoutDashboard, CalendarCheck, Package, Tags,
  ExternalLink, LogOut, Shield, Menu, BarChart3, Sun, Moon,
} from 'lucide-react';

const AdminThemeContext = createContext({ isDark: false });
export const useAdminTheme = () => useContext(AdminThemeContext);

const NAV = [
  { href: '/admin/dashboard', label: 'Ringkasan', icon: LayoutDashboard },
  { href: '/admin/analytics', label: 'Analitik', icon: BarChart3 },
  { href: '/admin/bookings', label: 'Booking', icon: CalendarCheck },
  { href: '/admin/gears', label: 'Kelola Gear', icon: Package },
  { href: '/admin/categories', label: 'Kategori', icon: Tags },
];

function SidebarInner({ user, pathname, onLogout, onNavigate }) {
  return (
    <>
      <div className="flex items-center gap-2.5 px-5 h-18 border-b-2 border-white/10">
        <BrandMark dark />
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        {NAV.map((n) => {
          const active = pathname === n.href || pathname.startsWith(n.href + '/');
          return (
            <Link
              key={n.href}
              href={n.href}
              onClick={onNavigate}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-md font-display uppercase tracking-wide text-[13px] transition-colors ${
                active ? 'bg-ember/15 text-ember' : 'text-white/65 hover:text-white hover:bg-white/5'
              }`}
            >
              {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full bg-ember" />}
              <n.icon className="w-4.5 h-4.5" />
              {n.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t-2 border-white/10 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-white/65 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ExternalLink className="w-4.5 h-4.5" />
          Lihat Situs
        </Link>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-red-300 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4.5 h-4.5" />
          Keluar
        </button>
        {user && (
          <div className="px-3 pt-3 mt-2 border-t border-white/10">
            <p className="text-xs font-semibold text-white truncate">{user.name}</p>
            <p className="font-mono text-[10px] text-white/50 truncate">{user.email}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default function AdminShell({ title = 'Dashboard', children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(localStorage.getItem('gn-admin-dark') === '1');
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('gn-admin-dark', next ? '1' : '0');
      return next;
    });
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <RequireAuth admin>
      <AdminThemeContext.Provider value={{ isDark }}>
        <div className={`${isDark ? 'dark' : ''} flex min-h-screen bg-bone dark:bg-[#12171b]`}>
          {/* Desktop sidebar */}
          <aside className="hidden md:flex flex-col w-64 shrink-0 bg-char gn-gridlines sticky top-0 h-screen">
            <SidebarInner user={user} pathname={pathname} onLogout={handleLogout} />
          </aside>

          {/* Mobile drawer */}
          {mobileOpen && (
            <div className="md:hidden fixed inset-0 z-50 flex">
              <div className="w-64 bg-char gn-gridlines flex flex-col">
                <SidebarInner user={user} pathname={pathname} onLogout={handleLogout} onNavigate={() => setMobileOpen(false)} />
              </div>
              <div className="flex-1 bg-char/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col">
            <header className="sticky top-0 z-30 bg-bone/85 dark:bg-[#12171b]/85 backdrop-blur-md border-b-2 border-ink/10 dark:border-white/10 h-16 flex items-center gap-3 px-4 sm:px-8">
              <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 text-ink/70 dark:text-sand/70">
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-ember" />
                <h1 className="font-display font-bold uppercase tracking-wide text-ink dark:text-white text-lg">{title}</h1>
              </div>
              <button
                onClick={toggleTheme}
                title={isDark ? 'Mode terang' : 'Mode gelap'}
                className="ml-auto grid place-items-center w-9 h-9 rounded-md border-2 border-ink/10 dark:border-white/15 text-ink/70 dark:text-sand hover:bg-bone-2 dark:hover:bg-white/10 transition-colors"
              >
                {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </button>
            </header>

            <div className="p-4 sm:p-8 flex-1">{children}</div>
          </div>
        </div>
      </AdminThemeContext.Provider>
    </RequireAuth>
  );
}

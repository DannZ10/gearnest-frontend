'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/RequireAuth';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Mountain, LayoutDashboard, CalendarCheck, AlertTriangle, TrendingUp,
  ExternalLink, LogOut, Shield, Menu, BarChart3, Sun, Moon,
} from 'lucide-react';

const AdminThemeContext = createContext({ isDark: false });
export const useAdminTheme = () => useContext(AdminThemeContext);

const NAV = [
  { href: '#ringkasan', label: 'Ringkasan', icon: LayoutDashboard },
  { href: '#analitik', label: 'Analitik', icon: BarChart3 },
  { href: '#booking', label: 'Booking', icon: CalendarCheck },
  { href: '#stok', label: 'Stok Menipis', icon: AlertTriangle },
  { href: '#populer', label: 'Gear Populer', icon: TrendingUp },
];

function SidebarInner({ user, onLogout, onNavigate }) {
  return (
    <>
      <div className="flex items-center gap-2.5 px-5 h-18 border-b border-white/10">
        <span className="grid place-items-center w-9 h-9 rounded-xl bg-ember text-ink">
          <Mountain className="w-5 h-5" strokeWidth={2.5} />
        </span>
        <div className="leading-none">
          <span className="font-display font-bold text-lg tracking-wide text-white block">
            GEAR<span className="text-ember">NEST</span>
          </span>
          <span className="text-[9px] font-semibold tracking-[0.18em] text-ember uppercase">Admin Panel</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        {NAV.map((n) => (
          <a
            key={n.href}
            href={n.href}
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sand/80 hover:text-white hover:bg-white/5 transition-colors"
          >
            <n.icon className="w-4.5 h-4.5" />
            {n.label}
          </a>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sand/80 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ExternalLink className="w-4.5 h-4.5" />
          Lihat Situs
        </Link>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4.5 h-4.5" />
          Keluar
        </button>
        {user && (
          <div className="px-3 pt-3 mt-2 border-t border-white/10">
            <p className="text-xs font-semibold text-white truncate">{user.name}</p>
            <p className="text-[10px] text-sand/60 truncate">{user.email}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default function AdminShell({ title = 'Dashboard', children }) {
  const router = useRouter();
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
    router.push('/admin/login');
  };

  return (
    <RequireAuth admin>
      <AdminThemeContext.Provider value={{ isDark }}>
        <div className={`${isDark ? 'dark' : ''} flex min-h-screen bg-bone dark:bg-[#12171b]`}>
          {/* Desktop sidebar */}
          <aside className="hidden md:flex flex-col w-64 shrink-0 bg-ink gn-topo sticky top-0 h-screen">
            <SidebarInner user={user} onLogout={handleLogout} />
          </aside>

          {/* Mobile drawer */}
          {mobileOpen && (
            <div className="md:hidden fixed inset-0 z-50 flex">
              <div className="w-64 bg-ink gn-topo flex flex-col">
                <SidebarInner user={user} onLogout={handleLogout} onNavigate={() => setMobileOpen(false)} />
              </div>
              <div className="flex-1 bg-ink/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col">
            <header className="sticky top-0 z-30 bg-bone/85 dark:bg-[#12171b]/85 backdrop-blur-md border-b border-ink/10 dark:border-white/10 h-16 flex items-center gap-3 px-4 sm:px-8">
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
                className="ml-auto grid place-items-center w-9 h-9 rounded-xl border border-ink/10 dark:border-white/15 text-ink/70 dark:text-sand hover:bg-bone-2 dark:hover:bg-white/10 transition-colors"
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

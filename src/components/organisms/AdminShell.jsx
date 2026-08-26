'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import RequireAuth from '@/components/templates/RequireAuth';
import BrandMark from '@/components/atoms/BrandMark';
import { useAuthStore } from '@/store/useAuthStore';
import {
  LayoutDashboard, CalendarCheck, Package, Tags,
  ExternalLink, LogOut, Shield, Menu, BarChart3, Sun, Moon, Truck, Mountain,
} from 'lucide-react';

const AdminThemeContext = createContext({ isDark: false });
export const useAdminTheme = () => useContext(AdminThemeContext);

const FULL_W = 256; // expanded sidebar width (px)
const RAIL_W = 76;  // collapsed icon-rail width (px)

const NAV = [
  { href: '/admin/dashboard', label: 'Ringkasan', icon: LayoutDashboard },
  { href: '/admin/analytics', label: 'Analitik', icon: BarChart3 },
  { href: '/admin/bookings', label: 'Booking', icon: CalendarCheck },
  { href: '/admin/gears', label: 'Kelola Gear', icon: Package },
  { href: '/admin/categories', label: 'Kategori', icon: Tags },
  { href: '/admin/settings', label: 'Biaya Antar', icon: Truck },
];

function SidebarInner({ user, pathname, rail, onLogout, onNavigate }) {
  return (
    <>
      {/* Brand */}
      <div className={`flex items-center h-16 shrink-0 border-b-2 border-white/10 ${rail ? 'justify-center px-0' : 'px-5'}`}>
        {rail ? (
          <Link href="/" title="Kembara.id" className="grid place-items-center w-10 h-10 rounded-xl bg-ember text-ink shadow-sm">
            <Mountain className="w-5 h-5" strokeWidth={2.5} />
          </Link>
        ) : (
          <BrandMark dark />
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-5 space-y-1">
        {NAV.map((n) => {
          const active = pathname === n.href || pathname.startsWith(n.href + '/');
          return (
            <Link
              key={n.href}
              href={n.href}
              onClick={onNavigate}
              title={rail ? n.label : undefined}
              className={`relative flex items-center rounded-md font-display uppercase tracking-wide text-[13px] transition-colors ${
                rail ? 'justify-center px-0 py-3' : 'gap-3 px-3 py-2.5'
              } ${active ? 'bg-ember/15 text-ember' : 'text-white/65 hover:text-white hover:bg-white/5'}`}
            >
              {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full bg-ember" />}
              <n.icon className="w-5 h-5 shrink-0" />
              {!rail && <span className="truncate">{n.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t-2 border-white/10 space-y-1 shrink-0">
        <Link
          href="/"
          title={rail ? 'Lihat Situs' : undefined}
          className={`flex items-center rounded-md text-sm font-medium text-white/65 hover:text-white hover:bg-white/5 transition-colors ${
            rail ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5'
          }`}
        >
          <ExternalLink className="w-5 h-5 shrink-0" />
          {!rail && 'Lihat Situs'}
        </Link>
        <button
          onClick={onLogout}
          title={rail ? 'Keluar' : undefined}
          className={`w-full flex items-center rounded-md text-sm font-medium text-red-300 hover:bg-red-500/10 transition-colors ${
            rail ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5'
          }`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!rail && 'Keluar'}
        </button>
        {user && !rail && (
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
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false); // desktop icon-rail
  const [mobileOpen, setMobileOpen] = useState(false); // mobile drawer
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(localStorage.getItem('gn-admin-dark') === '1');
    setCollapsed(localStorage.getItem('gn-admin-collapsed') === '1');
    const mq = window.matchMedia('(max-width: 767px)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Lock body scroll only while the mobile drawer is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [mobileOpen]);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('gn-admin-dark', next ? '1' : '0');
      return next;
    });
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen((o) => !o);
    } else {
      setCollapsed((c) => {
        const next = !c;
        localStorage.setItem('gn-admin-collapsed', next ? '1' : '0');
        return next;
      });
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Rail mode = collapsed icons, desktop only. Mobile drawer always shows labels.
  const rail = !isMobile && collapsed;
  const sidebarWidth = rail ? RAIL_W : FULL_W;
  const contentMargin = isMobile ? 0 : sidebarWidth;
  const asideTransform = isMobile ? (mobileOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)';

  return (
    <RequireAuth admin>
      <AdminThemeContext.Provider value={{ isDark }}>
        <div className={`${isDark ? 'dark' : ''} min-h-screen bg-bone dark:bg-[#16261d]`}>
          {/* Mobile backdrop */}
          <div
            onClick={() => setMobileOpen(false)}
            className={`md:hidden fixed inset-0 z-[55] bg-char/60 backdrop-blur-sm transition-opacity duration-300 ${
              mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />

          {/* Sidebar — position is set inline so no global class (e.g. .gn-topo)
              can override it into the normal flow. */}
          <aside
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              height: '100vh',
              width: `${sidebarWidth}px`,
              transform: asideTransform,
              transition: 'width 0.25s ease, transform 0.3s cubic-bezier(0.76,0,0.24,1)',
            }}
            className="z-[60] flex flex-col bg-char overflow-hidden"
          >
            <SidebarInner
              user={user}
              pathname={pathname}
              rail={rail}
              onLogout={handleLogout}
              onNavigate={() => { if (window.innerWidth < 768) setMobileOpen(false); }}
            />
          </aside>

          {/* Content */}
          <div
            style={{
              marginLeft: `${contentMargin}px`,
              transition: 'margin-left 0.25s ease',
            }}
            className="min-h-screen flex flex-col"
          >
            <header className="sticky top-0 z-30 bg-bone/85 dark:bg-[#16261d]/85 backdrop-blur-md border-b-2 border-ink/10 dark:border-white/10 h-16 flex items-center gap-3 px-4 sm:px-8">
              <button
                onClick={toggleSidebar}
                aria-label={isMobile ? (mobileOpen ? 'Tutup menu' : 'Buka menu') : (collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar')}
                className="grid place-items-center w-9 h-9 rounded-md border-2 border-ink/10 dark:border-white/15 text-ink/70 dark:text-sand hover:bg-bone-2 dark:hover:bg-white/10 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 min-w-0">
                <Shield className="w-4 h-4 text-ember shrink-0" />
                <h1 className="font-display font-bold uppercase tracking-wide text-ink dark:text-white text-lg truncate">{title}</h1>
              </div>
              <button
                onClick={toggleTheme}
                title={isDark ? 'Mode terang' : 'Mode gelap'}
                className="ml-auto grid place-items-center w-9 h-9 rounded-md border-2 border-ink/10 dark:border-white/15 text-ink/70 dark:text-sand hover:bg-bone-2 dark:hover:bg-white/10 transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </header>

            <div className="p-4 sm:p-8 flex-1">{children}</div>
          </div>
        </div>
      </AdminThemeContext.Provider>
    </RequireAuth>
  );
}

'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, History, Settings, X } from 'lucide-react';

function NavLinks({ setOpen }) {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Workspaces', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Document History', href: '/dashboard/history', icon: History },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
      {navLinks.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href !== '/dashboard' && pathname.startsWith(link.href));
        const Icon = link.icon;

        return (
          <Link
            key={link.name}
            href={link.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
              isActive
                ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-red-600 dark:text-red-500' : ''}`} />
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Sidebar({ open, setOpen }) {
  return (
    <>
      {/* Mobile Dark Overlay */}
      {open && (
        <div
          className="no-print fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`no-print fixed md:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } flex flex-col`}
      >
        {/* Header / Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-2 text-red-600 font-bold text-lg tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center">
              C
            </div>
            Crimson Group
          </Link>
          <button onClick={() => setOpen(false)} className="md:hidden text-slate-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation wrapped in Suspense */}
        <Suspense fallback={<div className="p-4 text-xs text-muted-foreground">Loading navigation...</div>}>
          <NavLinks setOpen={setOpen} />
        </Suspense>
      </aside>
    </>
  );
}
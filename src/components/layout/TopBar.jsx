'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ModeToggle } from './mode-toggle';
import { User } from 'lucide-react';

const titles = {
  '/dashboard': 'Dashboard',
  '/dashboard/companies': 'Companies',
  '/dashboard/tenders': 'Tenders',
  '/dashboard/cover-letters': 'Cover Letters',
  '/dashboard/tags': 'Item Tags',
  '/dashboard/settings': 'Settings',
};

export default function TopBar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const title =
    Object.keys(titles)
      .sort((a, b) => b.length - a.length)
      .map((key) => (pathname.startsWith(key) ? titles[key] : null))
      .find(Boolean) || 'Dashboard';

  return (
    <header className="sticky top-0 z-30 h-16 glass-panel border-b border-x-0 border-t-0 rounded-none flex items-center justify-between px-6">
      <div className="flex flex-col justify-center">
        <h2 className="text-lg font-bold font-[family-name:var(--font-jakarta)] leading-tight">
          {title}
        </h2>
        <p className="text-xs text-muted-foreground leading-tight">
          Welcome back, {user?.name || 'Admin'}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <ModeToggle />
        <div className="flex items-center gap-3 pl-4 border-l border-border/50">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-semibold leading-none mb-1">
              {user?.name || 'Admin'}
            </span>
            <span className="text-xs text-muted-foreground leading-none capitalize">
              {user?.role || 'Administrator'}
            </span>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary ring-2 ring-primary/20">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
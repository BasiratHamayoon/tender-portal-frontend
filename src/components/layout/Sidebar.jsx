'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  FileText,
  Tags,
  Settings,
  LogOut,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  FileStack,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Building2, label: 'Companies', href: '/dashboard/companies' },
  { icon: Briefcase, label: 'Tenders', href: '/dashboard/tenders' },
  { icon: FileText, label: 'Cover Letters', href: '/dashboard/cover-letters' },
  { icon: Tags, label: 'Item Tags', href: '/dashboard/tags' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

// Small CSS-only tooltip shown when the sidebar is collapsed
function HoverLabel({ text, danger = false }) {
  return (
    <span
      className={`pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold shadow-lg opacity-0 translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 ${
        danger
          ? 'bg-destructive text-destructive-foreground'
          : 'bg-foreground text-background'
      }`}
    >
      {text}
    </span>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex flex-col glass-panel border-r border-y-0 border-l-0 rounded-none transition-[width] duration-300 ease-in-out ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand + toggle */}
      <div className="h-16 flex items-center justify-between px-3 border-b border-border/50">
        <div
          className={`flex items-center gap-2.5 overflow-hidden transition-all duration-300 ${
            collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100 pl-1'
          }`}
        >
          <div className="h-9 w-9 shrink-0 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/30">
            <FileStack className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold font-[family-name:var(--font-jakarta)] text-gradient whitespace-nowrap">
            Tender Portal
          </span>
        </div>

        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`h-9 w-9 shrink-0 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors ${
            collapsed ? 'mx-auto' : ''
          }`}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-visible py-5 px-3 space-y-1.5">
        {menuItems.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`group relative flex items-center gap-3 h-11 rounded-xl px-3 transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                  : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
              } ${collapsed ? 'justify-center px-0' : ''}`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span
                className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-200 ${
                  collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                }`}
              >
                {item.label}
              </span>
              {collapsed && <HoverLabel text={item.label} />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border/50">
        <button
          type="button"
          onClick={logout}
          title={collapsed ? 'Logout' : undefined}
          className={`group relative flex items-center gap-3 h-11 w-full rounded-xl px-3 text-destructive hover:bg-destructive/10 transition-all duration-200 ${
            collapsed ? 'justify-center px-0' : ''
          }`}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span
            className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-200 ${
              collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
            }`}
          >
            Logout
          </span>
          {collapsed && <HoverLabel text="Logout" danger />}
        </button>
      </div>
    </aside>
  );
}
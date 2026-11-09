'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { SidebarProvider, useSidebar } from '@/context/SidebarContext';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';

function Shell({ children }) {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-background font-sans">
      <Sidebar />

      {/* Content shifts to match the fixed sidebar width */}
      <div
        className={`flex min-h-screen flex-col transition-[padding] duration-300 ease-in-out ${
          collapsed ? 'pl-20' : 'pl-64'
        }`}
      >
        <TopBar />
        <main className="flex-1 min-w-0 p-6 md:p-8">
          <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <div className="line-loader" />
        <p className="text-muted-foreground text-sm font-medium animate-pulse">
          Loading session...
        </p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <SidebarProvider>
      <Shell>{children}</Shell>
    </SidebarProvider>
  );
}
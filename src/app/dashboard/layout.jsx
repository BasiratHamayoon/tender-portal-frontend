'use client';

import { useState, Suspense } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden text-slate-900 dark:text-slate-100">
      {/* Wrapped in Suspense for usePathname */}
      <Suspense fallback={null}>
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      </Suspense>

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
          <div className="max-w-7xl mx-auto">
            {/* Wrapped in Suspense for useParams */}
            <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading workspace...</div>}>
              {children}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { Menu, LogOut, User, X, ShieldAlert, Sun, Moon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

export default function TopBar({ setSidebarOpen }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userName, setUserName] = useState('Admin User');
  const [userEmail, setUserEmail] = useState('');

  // Handle SSR Hydration for next-themes
  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw);
        setUserName(u?.name || 'Admin User');
        setUserEmail(u?.email || '');
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const handleLogoutConfirm = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setShowLogoutModal(false);
    router.push('/login');
  };

  return (
    <>
      <header className="no-print sticky top-0 z-30 h-16 shrink-0 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-8">
        {/* Left Side */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setSidebarOpen?.(true)}
            className="md:hidden p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex flex-col min-w-0">
            <span className="text-sm font-semibold text-foreground tracking-tight truncate">
              Welcome to Crimson Portal
            </span>
            <span className="text-[11px] text-muted-foreground truncate">
              Tender Document Management
            </span>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Theme Toggle Button (Light / Dark Mode) */}
          {mounted && (
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 animate-in spin-in-90 duration-300" />
              )}
            </button>
          )}

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center shadow-md shadow-red-500/20">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden md:flex flex-col leading-tight min-w-0">
              <span className="text-xs font-bold text-foreground truncate max-w-[140px]">
                {userName}
              </span>
              {userEmail ? (
                <span className="text-[10px] text-muted-foreground truncate max-w-[140px]">
                  {userEmail}
                </span>
              ) : null}
            </div>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="inline-flex items-center gap-2 h-10 px-3 sm:px-4 rounded-xl border border-red-200/80 dark:border-red-900/50 bg-red-50/80 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-950/50 hover:border-red-300 dark:hover:border-red-800 transition-all active:scale-[0.98]"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="no-print fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/50 dark:bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />

          {/* Dialog */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            className="relative w-full max-w-md rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl shadow-black/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-rose-500 to-red-600" />

            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-red-500/25">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h2
                      id="logout-title"
                      className="text-lg font-extrabold tracking-tight text-foreground"
                    >
                      Confirm Logout
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      End your current session securely
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-7">
                Are you sure you want to log out of{' '}
                <span className="font-semibold text-foreground">Crimson Portal</span>?
                You will need to sign in again to generate tender documents.
              </p>

              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  className="h-11 px-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLogoutConfirm}
                  className="h-11 px-5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-sm font-bold shadow-lg shadow-red-500/25 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
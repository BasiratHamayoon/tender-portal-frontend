"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Lock, User, Loader2, ShieldCheck, Mail, BadgeCheck } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    if (form.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    
    setLoading(true);
    try {
      await api.put("/auth/change-password", { 
        currentPassword: form.currentPassword, 
        newPassword: form.newPassword 
      });
      toast.success("Password successfully updated!");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          Account Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Manage your personal profile and security preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Profile Info Card (Left Column - 5 cols) */}
        <div className="lg:col-span-5 glass rounded-3xl p-6 md:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-xl relative overflow-hidden">
          {/* Decorative background blob */}
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
              <User className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Profile Details</h2>
              <p className="text-xs text-muted-foreground">Read-only account information</p>
            </div>
          </div>

          <div className="space-y-6 relative z-10">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <BadgeCheck className="w-3.5 h-3.5 text-red-500" /> Full Name
              </label>
              <div className="w-full px-4 py-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 text-sm font-medium text-foreground cursor-not-allowed">
                {user?.name || "Loading..."}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-red-500" /> Email Address
              </label>
              <div className="w-full px-4 py-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 text-sm font-medium text-foreground cursor-not-allowed">
                {user?.email || "Loading..."}
              </div>
            </div>

            {/* Role Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-red-500" /> Account Role
              </label>
              <div className="w-full px-4 py-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 text-sm font-medium text-foreground capitalize cursor-not-allowed">
                {user?.role || "Loading..."}
              </div>
            </div>
          </div>
        </div>

        {/* Security / Password Card (Right Column - 7 cols) */}
        <div className="lg:col-span-7 glass rounded-3xl p-6 md:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-red-500/20">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Security & Password</h2>
              <p className="text-xs text-muted-foreground">Update your account password</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Current Password
              </label>
              <input
                type="password"
                required
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all placeholder:text-slate-400"
                placeholder="Enter your current password"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={form.newPassword}
                  onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all placeholder:text-slate-400"
                  placeholder="Min. 6 characters"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all placeholder:text-slate-400"
                  placeholder="Repeat new password"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-6 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto py-3.5 px-8 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-red-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating Security...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
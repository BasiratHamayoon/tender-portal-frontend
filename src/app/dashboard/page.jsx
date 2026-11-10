"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { getCompanies } from "@/lib/api";
import LineLoader from "@/components/layout/LineLoader";
import { useGsap } from "@/hooks/useGsap";
import { toast } from "sonner";

export default function DashboardPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const cardsRef = useRef(null);
  const { animateStagger } = useGsap();

  useEffect(() => {
    fetchCompanies();
  }, []);

  async function fetchCompanies() {
    try {
      setLoading(true);
      const res = await getCompanies();
      // FIX: Handle both raw arrays and wrapped response formats
      const data = res.data?.data || res.data;
      
      if (Array.isArray(data)) {
        setCompanies(data);
      } else {
        toast.error("Unexpected data format from server");
      }
    } catch (err) {
      toast.error("Connection error. Is backend server running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!loading && companies.length > 0 && cardsRef.current) {
      animateStagger(cardsRef.current.children, 0.08);
    }
  }, [loading, companies]);

  if (loading) return <LineLoader />;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-8 md:p-10 text-white shadow-2xl shadow-red-500/20">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wider uppercase border border-white/20">
            Tender Document Management System
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Crimson Group Workspaces
          </h1>
          <p className="text-white/80 text-sm md:text-base leading-relaxed">
            Select a company below to generate standardized cover letters,
            financial/technical item tags, and envelope labels.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 top-0 w-40 h-40 bg-black/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Grid of Companies — no icons */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Sister Companies ({companies.length})
          </h2>
          <span className="text-xs text-muted-foreground">
            Click any card to start generating documents
          </span>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {companies.map((company) => (
            <Link
              key={company._id}
              href={`/dashboard/company/${company._id}`}
              className="group relative glass rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 hover:border-red-500/50 dark:hover:border-red-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Code badge only — no logo/icon box */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-red-50 dark:group-hover:bg-red-950/40 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {company.code || company.shortName}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-red-500 transition-colors line-clamp-2">
                    {company.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {company.address || "Standard Procurement Tender Workspace"}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                <span>Open Workspace</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
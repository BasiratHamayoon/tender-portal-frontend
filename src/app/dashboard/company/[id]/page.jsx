"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { ArrowLeft, FileText, Tag, Mail, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import LineLoader from "@/components/layout/LineLoader";
import { toast } from "sonner";

export default function CompanyWorkspacePage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchCompany() {
      try {
        setLoading(true);
        const res = await api.get(`/companies/${id}`);
        
        // Safely extract company object across all possible backend response shapes
        const companyData = 
          res.data?.data || 
          res.data?.company || 
          (res.data && typeof res.data === 'object' && res.data._id ? res.data : null);

        if (companyData) {
          setCompany(companyData);
        } else {
          toast.error("Company details not found");
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Fetch company error:", err);
        toast.error("Failed to load company workspace");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchCompany();
  }, [id, router]);

  if (loading) return <LineLoader />;
  if (!company) return null;

  const actions = [
    {
      title: "Cover Letter",
      description: "Generate a formal cover letter for tender proposals",
      href: `/dashboard/company/${id}/cover-letter`,
      icon: FileText,
      color: "from-red-500 to-rose-600",
      badge: "Letter",
    },
    {
      title: "Item Tags",
      description: "Print financial & technical proposal item tags",
      href: `/dashboard/company/${id}/item-tags`,
      icon: Tag,
      color: "from-blue-500 to-indigo-600",
      badge: "Labels",
    },
    {
      title: "Envelope Tags",
      description: "Large envelope labels for tender submission",
      href: `/dashboard/company/${id}/envelope-tags`,
      icon: Mail,
      color: "from-emerald-500 to-teal-600",
      badge: "Envelope",
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Back to Workspaces Link */}
      <div className="no-print">
        <Button variant="ghost" asChild className="-ml-3 text-muted-foreground hover:text-foreground">
          <Link href="/dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Workspaces
          </Link>
        </Button>
      </div>

      {/* Clean Company Header — Title & Code Badge (NO Icon Box) */}
      <div className="no-print space-y-2 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            {company.name}
          </h1>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
            {company.code || company.shortName}
          </span>
        </div>

        {company.address && (
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
            {company.address}
          </p>
        )}

        <p className="text-xs text-muted-foreground pt-1">
          Select a document type below to generate and print formatted tender documents.
        </p>
      </div>

      {/* Generator Action Cards */}
      <div className="no-print grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              href={action.href}
              className="group glass rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 hover:border-red-500/50 dark:hover:border-red-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.color} text-white flex items-center justify-center shadow-lg mb-5 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-red-500 transition-colors">
                      {action.title}
                    </h3>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {action.badge}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                <span>Open Generator</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
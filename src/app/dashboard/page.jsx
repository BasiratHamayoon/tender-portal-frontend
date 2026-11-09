"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, FileText, Tag, FolderOpen, Plus, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import gsap from "gsap";
import LineLoader from "@/components/layout/LineLoader";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => { fetchStats(); }, []);

  useEffect(() => {
    if (!loading && containerRef.current) {
      const cards = containerRef.current.querySelectorAll(".stat-card");
      gsap.fromTo(cards, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" });
    }
  }, [loading]);

  const fetchStats = async () => {
    try {
      const res = await api.get("/dashboard/stats");
      setData(res.data);
    } catch (error) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: "Companies", value: data?.stats?.totalCompanies || 0, icon: Building2, color: "bg-blue-500", link: "/dashboard/companies" },
    { label: "Cover Letters", value: data?.stats?.totalCoverLetters || 0, icon: FileText, color: "bg-red-500", link: "/dashboard/cover-letters" },
    { label: "Tags", value: data?.stats?.totalTags || 0, icon: Tag, color: "bg-amber-500", link: "/dashboard/tags" },
    { label: "Tenders", value: data?.stats?.totalTenders || 0, icon: FolderOpen, color: "bg-emerald-500", link: "/dashboard/tenders" },
  ];

  return (
    <>
      <LineLoader loading={loading} />
      <div ref={containerRef}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Dashboard</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Overview of your tender operations</p>
          </div>
          <div className="flex gap-3">
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link href="/dashboard/cover-letters/new"><Plus className="w-4 h-4 mr-2" />Cover Letter</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/tags/new"><Plus className="w-4 h-4 mr-2" />Tags</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map((stat, i) => (
            <Link key={i} href={stat.link}>
              <Card className="stat-card hover:shadow-lg transition-all duration-300 cursor-pointer border-zinc-200 dark:border-zinc-800 hover:border-red-300 dark:hover:border-red-800">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</p>
                      <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mt-1">{stat.value}</h3>
                    </div>
                    <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Cover Letters</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/cover-letters">View All <ArrowRight className="w-4 h-4 ml-1" /></Link>
              </Button>
            </CardHeader>
            <CardContent>
              {data?.recentCoverLetters?.length > 0 ? (
                <div className="space-y-3">
                  {data.recentCoverLetters.map((cl) => (
                    <div key={cl._id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                      <div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-white">{cl.itemName}</p>
                        <p className="text-xs text-zinc-500">{cl.company?.shortName} - {cl.addressedTo}</p>
                      </div>
                      <Badge variant={cl.type === "technical" ? "default" : "secondary"} className={cl.type === "technical" ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"}>
                        {cl.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-400 text-center py-8">No cover letters yet</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Tags</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/tags">View All <ArrowRight className="w-4 h-4 ml-1" /></Link>
              </Button>
            </CardHeader>
            <CardContent>
              {data?.recentTags?.length > 0 ? (
                <div className="space-y-3">
                  {data.recentTags.map((tag) => (
                    <div key={tag._id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                      <div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-white">{tag.itemName}</p>
                        <p className="text-xs text-zinc-500">{tag.company?.shortName}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{tag.tagType}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-400 text-center py-8">No tags yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

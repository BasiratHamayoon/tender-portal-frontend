"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, FolderOpen } from "lucide-react";
import { toast } from "sonner";
import LineLoader from "@/components/layout/LineLoader";

export default function TendersPage() {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTenders(); }, []);

  const fetchTenders = async () => {
    try {
      const res = await api.get("/tenders");
      setTenders(res.data);
    } catch (error) {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteTender = async (id) => {
    if (!confirm("Delete?")) return;
    try {
      await api.delete(`/tenders/${id}`);
      toast.success("Deleted");
      fetchTenders();
    } catch (error) {
      toast.error("Failed");
    }
  };

  const statusColor = (s) => {
    if (s === "draft") return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
    if (s === "generated") return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
    return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
  };

  return (
    <>
      <LineLoader loading={loading} />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Tenders</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Track your tender submissions</p>
        </div>
        <Button asChild className="bg-red-600 hover:bg-red-700">
          <Link href="/dashboard/tenders/new"><Plus className="w-4 h-4 mr-2" /> New Tender</Link>
        </Button>
      </div>

      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Tender No.</TableHead>
                <TableHead>Addressed To</TableHead>
                <TableHead>Opening Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenders.map((tender) => (
                <TableRow key={tender._id}>
                  <TableCell className="font-medium">{tender.company?.shortName}</TableCell>
                  <TableCell>{tender.tenderNumber}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm text-zinc-500">{tender.addressedTo}</TableCell>
                  <TableCell className="text-sm">{tender.openingDate}</TableCell>
                  <TableCell><Badge variant="outline">{tender.items?.length || 0}</Badge></TableCell>
                  <TableCell><Badge className={statusColor(tender.status)}>{tender.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => deleteTender(tender._id)} className="text-red-600"><Trash2 className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {tenders.length === 0 && !loading && (
                <TableRow><TableCell colSpan={7} className="text-center py-12 text-zinc-400"><FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No tenders yet</p></TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
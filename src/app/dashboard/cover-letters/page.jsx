"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Eye, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import LineLoader from "@/components/layout/LineLoader";

export default function CoverLettersPage() {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchLetters(); }, []);

  const fetchLetters = async () => {
    try {
      const res = await api.get("/cover-letters");
      setLetters(res.data);
    } catch (error) {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const deleteLetter = async (id) => {
    if (!confirm("Delete this cover letter?")) return;
    try {
      await api.delete(`/cover-letters/${id}`);
      toast.success("Deleted");
      fetchLetters();
    } catch (error) {
      toast.error("Failed");
    }
  };

  return (
    <>
      <LineLoader loading={loading} />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Cover Letters</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Technical and financial cover letters</p>
        </div>
        <Button asChild className="bg-red-600 hover:bg-red-700">
          <Link href="/dashboard/cover-letters/new"><Plus className="w-4 h-4 mr-2" /> Create Cover Letter</Link>
        </Button>
      </div>

      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Addressed To</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {letters.map((letter) => (
                <TableRow key={letter._id}>
                  <TableCell className="font-medium">{letter.company?.shortName || "N/A"}</TableCell>
                  <TableCell>
                    <Badge className={letter.type === "technical" ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"}>
                      {letter.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{letter.itemName}</TableCell>
                  <TableCell className="text-sm text-zinc-500">{letter.addressedTo}</TableCell>
                  <TableCell className="text-sm text-zinc-500">{letter.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="icon" asChild><Link href={`/dashboard/cover-letters/${letter._id}`}><Eye className="w-4 h-4" /></Link></Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteLetter(letter._id)} className="text-red-600"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {letters.length === 0 && !loading && (
                <TableRow><TableCell colSpan={6} className="text-center py-12 text-zinc-400"><FileText className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No cover letters yet</p></TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
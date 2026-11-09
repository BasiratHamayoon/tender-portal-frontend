"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Tag as TagIcon } from "lucide-react";
import { toast } from "sonner";
import LineLoader from "@/components/layout/LineLoader";

export default function TagsPage() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTags(); }, []);

  const fetchTags = async () => {
    try {
      const res = await api.get("/tags");
      setTags(res.data);
    } catch (error) {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteTag = async (id) => {
    if (!confirm("Delete?")) return;
    try {
      await api.delete(`/tags/${id}`);
      toast.success("Deleted");
      fetchTags();
    } catch (error) {
      toast.error("Failed");
    }
  };

  const tagTypeLabel = (type) => {
    const map = { "item-technical": "Item Tech", "item-financial": "Item Fin", "large-envelope-technical": "Env Tech", "large-envelope-financial": "Env Fin", "main-envelope": "Main Env" };
    return map[type] || type;
  };

  const tagTypeColor = (type) => {
    if (type.includes("technical")) return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
    if (type.includes("financial")) return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
    return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
  };

  return (
    <>
      <LineLoader loading={loading} />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Tags</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Item tags and envelope labels</p>
        </div>
        <Button asChild className="bg-red-600 hover:bg-red-700">
          <Link href="/dashboard/tags/new"><Plus className="w-4 h-4 mr-2" /> Create Tags</Link>
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
                <TableHead>Tender No.</TableHead>
                <TableHead>Opening Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.map((tag) => (
                <TableRow key={tag._id}>
                  <TableCell className="font-medium">{tag.company?.shortName}</TableCell>
                  <TableCell><Badge className={tagTypeColor(tag.tagType)}>{tagTypeLabel(tag.tagType)}</Badge></TableCell>
                  <TableCell className="max-w-[200px] truncate">{tag.itemName}</TableCell>
                  <TableCell className="text-sm text-zinc-500">{tag.tenderNumber || "-"}</TableCell>
                  <TableCell className="text-sm text-zinc-500">{tag.openingDate || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="icon" asChild><Link href={`/dashboard/tags/${tag._id}`}><TagIcon className="w-4 h-4" /></Link></Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteTag(tag._id)} className="text-red-600"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {tags.length === 0 && !loading && (
                <TableRow><TableCell colSpan={6} className="text-center py-12 text-zinc-400"><TagIcon className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No tags yet</p></TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
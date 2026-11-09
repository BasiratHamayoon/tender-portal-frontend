"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { toast } from "sonner";
import LineLoader from "@/components/layout/LineLoader";
import { useGsapFadeIn } from "@/hooks/useGsap";

export default function NewTenderPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ company: "", tenderNumber: "", addressedTo: "", openingDate: "", notes: "", status: "draft" });
  const [items, setItems] = useState([""]);
  const formRef = useGsapFadeIn();

  useEffect(() => {
    api.get("/companies").then((res) => { setCompanies(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const addItem = () => setItems([...items, ""]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, val) => { const n = [...items]; n[i] = val; setItems(n); };

  const handleSubmit = async () => {
    if (!form.company || !form.tenderNumber || !form.addressedTo || !form.openingDate) return toast.error("Fill required fields");
    setSubmitting(true);
    try {
      await api.post("/tenders", { ...form, items: items.filter(Boolean) });
      toast.success("Tender created");
      router.push("/dashboard/tenders");
    } catch (error) {
      toast.error("Failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <LineLoader loading={loading || submitting} />
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => router.back()}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">New Tender</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Record a new tender submission</p>
        </div>
      </div>

      <Card ref={formRef} className="max-w-2xl border-zinc-200 dark:border-zinc-800">
        <CardHeader><CardTitle>Tender Details</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company *</Label>
              <Select value={form.company} onValueChange={(v) => setForm({ ...form, company: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {companies.map((c) => (<SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="generated">Generated</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tender Number *</Label>
              <Input value={form.tenderNumber} onChange={(e) => setForm({ ...form, tenderNumber: e.target.value })} placeholder="1304/Adver/HQFC KP/Signs" required />
            </div>
            <div className="space-y-2">
              <Label>Opening Date *</Label>
              <Input value={form.openingDate} onChange={(e) => setForm({ ...form, openingDate: e.target.value })} placeholder="6th Nov, 2026" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Addressed To *</Label>
            <Input value={form.addressedTo} onChange={(e) => setForm({ ...form, addressedTo: e.target.value })} placeholder="HQ Frontier Corps KP North" required />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Items</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}><Plus className="w-3 h-3 mr-1" /> Add</Button>
            </div>
            {items.map((item, i) => (
              <div key={i} className="flex gap-2">
                <Input value={item} onChange={(e) => updateItem(i, e.target.value)} placeholder={`Item ${i + 1}`} />
                {items.length > 1 && <Button variant="ghost" size="icon" onClick={() => removeItem(i)} className="text-red-500"><X className="w-4 h-4" /></Button>}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Additional notes..." rows={3} />
          </div>

          <Button onClick={handleSubmit} className="bg-red-600 hover:bg-red-700" disabled={submitting}>
            <Save className="w-4 h-4 mr-2" /> {submitting ? "Saving..." : "Save Tender"}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
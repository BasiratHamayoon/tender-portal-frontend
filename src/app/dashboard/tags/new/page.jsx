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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Printer, Save, Plus, X } from "lucide-react";
import { toast } from "sonner";
import LineLoader from "@/components/layout/LineLoader";
import ItemTagPrint from "@/components/print/ItemTagPrint";
import LargeEnvelopeTagPrint from "@/components/print/LargeEnvelopeTagPrint";
import { useGsapFadeIn } from "@/hooks/useGsap";

export default function NewTagsPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ company: "", tenderNumber: "", specificationNumber: "", openingDate: "", addressedTo: "" });
  const [items, setItems] = useState([""]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [generatedTags, setGeneratedTags] = useState([]);
  const formRef = useGsapFadeIn();

  useEffect(() => {
    api.get("/companies").then((res) => { setCompanies(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (form.company) setSelectedCompany(companies.find((c) => c._id === form.company));
  }, [form.company, companies]);

  const addItem = () => setItems([...items, ""]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, val) => { const n = [...items]; n[i] = val; setItems(n); };

  const handleGenerate = () => {
    const validItems = items.filter(Boolean);
    if (!form.company || validItems.length === 0) return toast.error("Select company and add items");
    const tags = [];
    const types = ["item-technical", "item-financial", "large-envelope-technical", "large-envelope-financial", "main-envelope"];
    for (const item of validItems) {
      for (const type of types) {
        tags.push({ ...form, tagType: type, itemName: item });
      }
    }
    setGeneratedTags(tags);
    toast.success(`${tags.length} tags generated`);
  };

  const handleSave = async () => {
    const validItems = items.filter(Boolean);
    if (!form.company || validItems.length === 0) return toast.error("Fill required fields");
    setSubmitting(true);
    try {
      await api.post("/tags/bulk", { ...form, items: validItems });
      toast.success("Tags saved");
      router.push("/dashboard/tags");
    } catch (error) {
      toast.error("Failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <LineLoader loading={loading || submitting} />
      <div className="no-print flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => router.back()}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Create Tags</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Generate item tags and envelope labels</p>
        </div>
      </div>

      <Tabs defaultValue="form" className="no-print">
        <TabsList className="mb-6">
          <TabsTrigger value="form">Form</TabsTrigger>
          <TabsTrigger value="preview">Preview ({generatedTags.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <Card ref={formRef} className="max-w-2xl border-zinc-200 dark:border-zinc-800">
            <CardHeader><CardTitle>Tag Details</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company *</Label>
                  <Select value={form.company} onValueChange={(v) => setForm({ ...form, company: v })}>
                    <SelectTrigger><SelectValue placeholder="Select company" /></SelectTrigger>
                    <SelectContent>
                      {companies.map((c) => (<SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Opening Date</Label>
                  <Input value={form.openingDate} onChange={(e) => setForm({ ...form, openingDate: e.target.value })} placeholder="6th Nov, 2026" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tender Number</Label>
                  <Input value={form.tenderNumber} onChange={(e) => setForm({ ...form, tenderNumber: e.target.value })} placeholder="1304/Adver/HQFC KP/Signs" />
                </div>
                <div className="space-y-2">
                  <Label>Specification Number</Label>
                  <Input value={form.specificationNumber} onChange={(e) => setForm({ ...form, specificationNumber: e.target.value })} placeholder="PROCURMENT 2026/ 27" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Addressed To</Label>
                <Input value={form.addressedTo} onChange={(e) => setForm({ ...form, addressedTo: e.target.value })} placeholder="HQ FRONTIER CORPS, KP (NORTH) PESHAWAR (SIGNAL BRANCH)" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Items *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}><Plus className="w-3 h-3 mr-1" /> Add Item</Button>
                </div>
                {items.map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={item} onChange={(e) => updateItem(i, e.target.value)} placeholder={`Item ${i + 1}: e.g., Bullet Proof Helmet`} />
                    {items.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeItem(i)} className="text-red-500 flex-shrink-0"><X className="w-4 h-4" /></Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button onClick={handleGenerate} variant="outline">Preview Tags</Button>
                <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700" disabled={submitting}>
                  <Save className="w-4 h-4 mr-2" /> {submitting ? "Saving..." : "Save All Tags"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          {generatedTags.length > 0 && selectedCompany ? (
            <div>
              <div className="flex gap-3 mb-6">
                <Button onClick={() => window.print()} variant="outline"><Printer className="w-4 h-4 mr-2" /> Print All</Button>
                <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700" disabled={submitting}><Save className="w-4 h-4 mr-2" /> Save All</Button>
              </div>
              <div className="space-y-6">
                {generatedTags.map((tag, i) => (
                  <div key={i} className="bg-white shadow-lg rounded-lg overflow-hidden max-w-[210mm] mx-auto border">
                    <div className="p-2 bg-zinc-100 text-xs font-mono text-zinc-500 no-print">
                      {tag.tagType} - {tag.itemName}
                    </div>
                    {tag.tagType.startsWith("item-") ? (
                      <ItemTagPrint data={tag} company={selectedCompany} />
                    ) : (
                      <LargeEnvelopeTagPrint data={tag} company={selectedCompany} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Card><CardContent className="py-12 text-center text-zinc-400">Click &quot;Preview Tags&quot; in the form to see generated tags</CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <div className="hidden print:block">
        {generatedTags.map((tag, i) => (
          <div key={i} className="print-page">
            {tag.tagType.startsWith("item-") ? (
              <ItemTagPrint data={tag} company={selectedCompany} />
            ) : (
              <LargeEnvelopeTagPrint data={tag} company={selectedCompany} />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
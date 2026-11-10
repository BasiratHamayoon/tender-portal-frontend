"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Printer, Calendar, User, Package, Eye, Loader2, FileText } from "lucide-react";
import CoverLetterPrint from "@/components/print/CoverLetterPrint";
import { toast } from "sonner";
import { formatDate } from "@/lib/date-utils";

export default function CoverLetterGenPage() {
  const { id } = useParams();
  const router = useRouter();
  const [company, setCompany] = useState(null);
  const [type, setType] = useState("technical");
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    addressedTo: "Headquarter Frontier Corps, KP (North) Peshawar (Signal Branch).",
    itemName: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [generated, setGenerated] = useState(null);

  useEffect(() => {
    api.get(`/companies/${id}`).then((res) => setCompany(res.data)).catch(() => router.push("/dashboard"));
  }, [id, router]);

  const handleGenerate = async () => {
    if (!form.itemName.trim()) return toast.error("Item name is required");
    setSubmitting(true);
    try {
      const payload = {
        company: id, type,
        date: formatDate(form.date),
        addressedTo: form.addressedTo,
        itemName: form.itemName,
      };
      const res = await api.post("/cover-letters", payload);
      setGenerated(res.data);
      toast.success("Cover letter generated!");
      setTimeout(() => document.getElementById("preview")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      toast.error("Failed to generate");
    } finally {
      setSubmitting(false);
    }
  };

  if (!company) return null;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="no-print">
        <Button variant="ghost" asChild className="mb-6 -ml-3 text-muted-foreground">
          <Link href={`/dashboard/company/${id}`}><ArrowLeft className="w-4 h-4 mr-2" /> Back to {company.shortName}</Link>
        </Button>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 text-xs font-semibold mb-3">
            <FileText className="w-3.5 h-3.5" /> COVER LETTER · {company.shortName}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-jakarta)]">Generate Cover Letter</h1>
          <p className="text-muted-foreground mt-2">Fill 3 fields. Everything else is pre-written.</p>
        </div>

        <div className="inline-flex rounded-2xl glass p-1.5 mb-6">
          {["technical", "financial"].map((t) => (
            <button key={t} onClick={() => { setType(t); setGenerated(null); }}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${
                type === t ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
              }`}>
              {t} Proposal
            </button>
          ))}
        </div>

        <div className="glass rounded-3xl p-6 md:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-semibold flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> Date</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="h-12 rounded-xl bg-background/50" />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold flex items-center gap-2"><Package className="w-4 h-4 text-primary" /> Item Name</Label>
              <Input placeholder="e.g. Enterprise Drone" value={form.itemName}
                onChange={(e) => setForm({ ...form, itemName: e.target.value })}
                className="h-12 rounded-xl bg-background/50" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="font-semibold flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Addressed To</Label>
              <Textarea rows={2} value={form.addressedTo}
                onChange={(e) => setForm({ ...form, addressedTo: e.target.value })}
                className="rounded-xl bg-background/50" />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <Button onClick={handleGenerate} disabled={submitting}
              className="btn-pop bg-primary h-12 rounded-xl px-6 font-semibold">
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Eye className="w-4 h-4 mr-2" />}
              Generate & Preview
            </Button>
            {generated && (
              <Button onClick={() => window.print()} variant="outline" className="btn-pop h-12 rounded-xl px-6">
                <Printer className="w-4 h-4 mr-2" /> Print
              </Button>
            )}
          </div>
        </div>
      </div>

      {generated && (
        <div id="preview" className="no-print">
          <h2 className="text-lg font-semibold mb-4">Live Preview</h2>
          <div className="bg-white shadow-2xl rounded-lg overflow-hidden max-w-[210mm] mx-auto border">
            <CoverLetterPrint data={generated} company={company} />
          </div>
        </div>
      )}

      {generated && (
        <div className="print-only">
          <CoverLetterPrint data={generated} company={company} />
        </div>
      )}
    </div>
  );
}
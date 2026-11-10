"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import ItemTagPrint from "@/components/print/ItemTagPrint";
import LineLoader from "@/components/layout/LineLoader";
import { toast } from "sonner";

export default function ItemTagsGeneratorPage({ params }) {
  const unwrappedParams = use(params);
  const companyId = unwrappedParams.id;
  const router = useRouter();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [generated, setGenerated] = useState(null);

  const [form, setForm] = useState({
    specification: "ORDNANCE STORES & ELECTRO MEDICAL EQUIPMENT –",
    fiscalYear: "FY 2026-27",
    itemName: "BULLET PROOF JACKET",
  });

  useEffect(() => {
    async function fetchCompany() {
      try {
        setLoading(true);
        const res = await api.get(`/companies/${companyId}`);
        const data = res.data?.data || res.data?.company || res.data;
        setCompany(data);
      } catch (err) {
        toast.error("Failed to load company");
      } finally {
        setLoading(false);
      }
    }
    fetchCompany();
  }, [companyId]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!form.itemName) return toast.error("Item Name is required");

    setSubmitting(true);
    try {
      const payload = {
        company: companyId,
        type: "item-tag",
        itemName: form.itemName,
        specification: form.specification,
        fiscalYear: form.fiscalYear
      };

      await api.post("/tags", payload).catch(() => null);
      setGenerated(payload);
      toast.success("Tags Generated!");
    } catch (err) {
      toast.error("Error generating tags");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    toast.dismiss();
    setTimeout(() => window.print(), 100);
  };

  if (loading) return <LineLoader />;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      <div className="no-print flex justify-between">
        <Link href={`/dashboard/company/${companyId}`} className="text-sm font-medium hover:text-blue-600">
          ← Back to Workspace
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="no-print glass p-8 rounded-3xl border shadow-xl">
          <h1 className="text-2xl font-bold mb-6">Item Tags (Financial / Technical)</h1>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase">Specification Header</label>
              <input value={form.specification} onChange={(e) => setForm({...form, specification: e.target.value})} className="w-full p-3 rounded-xl border mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase">Fiscal Year</label>
              <input value={form.fiscalYear} onChange={(e) => setForm({...form, fiscalYear: e.target.value})} className="w-full p-3 rounded-xl border mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase">Item Name</label>
              <input value={form.itemName} onChange={(e) => setForm({...form, itemName: e.target.value})} className="w-full p-3 rounded-xl border mt-1" required />
            </div>

            <div className="pt-4 flex gap-4">
              <button type="submit" disabled={submitting} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold">
                Generate
              </button>
              {generated && (
                <button type="button" onClick={handlePrint} className="flex-1 border border-blue-600 text-blue-600 py-3 rounded-xl font-bold">
                  Print
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-1">
          {generated && (
            <>
              <div className="no-print p-6 bg-slate-100 border rounded-3xl space-y-6">
                <ItemTagPrint company={company} data={generated} proposalType="FINANCIAL" />
                <ItemTagPrint company={company} data={generated} proposalType="TECHNICAL" />
              </div>
              <div className="print-only">
                <ItemTagPrint company={company} data={generated} proposalType="FINANCIAL" />
                <ItemTagPrint company={company} data={generated} proposalType="TECHNICAL" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
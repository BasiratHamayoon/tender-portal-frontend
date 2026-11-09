"use client";

import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Building2 } from "lucide-react";
import { toast } from "sonner";
import gsap from "gsap";
import LineLoader from "@/components/layout/LineLoader";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", shortName: "", address: "", city: "", phone: "", fontFamily: "Times New Roman", fontSize: 12 });
  const [submitting, setSubmitting] = useState(false);
  const tableRef = useRef(null);

  useEffect(() => { fetchCompanies(); }, []);

  useEffect(() => {
    if (!loading && tableRef.current) {
      const rows = tableRef.current.querySelectorAll("tr");
      gsap.fromTo(rows, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" });
    }
  }, [loading, companies]);

  const fetchCompanies = async () => {
    try {
      const res = await api.get("/companies/all");
      setCompanies(res.data);
    } catch (error) {
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await api.put(`/companies/${editing}`, form);
        toast.success("Company updated");
      } else {
        await api.post("/companies", form);
        toast.success("Company created");
      }
      setDialogOpen(false);
      setEditing(null);
      setForm({ name: "", shortName: "", address: "", city: "", phone: "", fontFamily: "Times New Roman", fontSize: 12 });
      fetchCompanies();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  const editCompany = (company) => {
    setForm({ name: company.name, shortName: company.shortName, address: company.address, city: company.city, phone: company.phone, fontFamily: company.fontFamily, fontSize: company.fontSize });
    setEditing(company._id);
    setDialogOpen(true);
  };

  const deleteCompany = async (id) => {
    if (!confirm("Delete this company?")) return;
    try {
      await api.delete(`/companies/${id}`);
      toast.success("Company deleted");
      fetchCompanies();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  return (
    <>
      <LineLoader loading={loading || submitting} />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Companies</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your tender submission companies</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) { setEditing(null); setForm({ name: "", shortName: "", address: "", city: "", phone: "", fontFamily: "Times New Roman", fontSize: 12 }); } }}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700"><Plus className="w-4 h-4 mr-2" /> Add Company</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Company" : "Add Company"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="CRIMSON INTERNATIONAL" required />
                </div>
                <div className="space-y-2">
                  <Label>Short Name</Label>
                  <Input value={form.shortName} onChange={(e) => setForm({ ...form, shortName: e.target.value })} placeholder="CI" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="HOUSE NO. 1, STREET 45, F-8/1," required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="ISLAMABAD." required />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0345-8592229" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Font Family</Label>
                  <Input value={form.fontFamily} onChange={(e) => setForm({ ...form, fontFamily: e.target.value })} placeholder="Times New Roman" />
                </div>
                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <Input type="number" value={form.fontSize} onChange={(e) => setForm({ ...form, fontSize: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={submitting}>
                  {submitting ? "Saving..." : editing ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardContent className="p-0">
          <div ref={tableRef}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Font</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-900 dark:text-white">{company.name}</p>
                          <Badge variant="outline" className="text-xs mt-0.5">{company.shortName}</Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">{company.address} {company.city}</TableCell>
                    <TableCell className="text-sm">{company.phone}</TableCell>
                    <TableCell className="text-sm text-zinc-500">{company.fontFamily}, {company.fontSize}pt</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="icon" onClick={() => editCompany(company)}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteCompany(company._id)} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {companies.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-zinc-400">
                      <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No companies yet</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
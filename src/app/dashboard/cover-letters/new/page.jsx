'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, FileText, Calendar, User, Package, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function NewCoverLetterPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    date: new Date().toISOString().split('T')[0],
    addressedTo: '',
    itemName: '',
    tenderNumber: '',
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await api.get('/companies');
      setCompanies(res.data.data);
      if (res.data.data.length > 0) {
        setFormData(prev => ({ ...prev, company: res.data.data[0]._id }));
      }
    } catch (err) {
      toast.error('Failed to load companies');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/cover-letters', formData);
      toast.success('Cover Letter generated successfully!');
      router.push('/dashboard/cover-letters');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create cover letter');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header & Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors">
          <Link href="/dashboard/cover-letters">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-jakarta)] text-foreground">Generate Cover Letter</h1>
          <p className="text-sm text-muted-foreground mt-1">Create a new technical or financial cover letter.</p>
        </div>
      </div>

      {/* Stunning Form Card */}
      <Card className="glass-panel border-white/20 dark:border-white/10 overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border/50 pb-6 pt-6 px-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl">Document Details</CardTitle>
              <CardDescription>Enter the tender specifics to generate the letter.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Select Company */}
              <div className="space-y-3 md:col-span-2">
                <Label htmlFor="company" className="text-sm font-semibold text-foreground/80">Select Company</Label>
                <select
                  id="company" name="company" required
                  value={formData.company} onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl bg-background/50 focus:bg-background border border-muted-foreground/20 hover:border-muted-foreground/40 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-base outline-none appearance-none"
                >
                  <option value="" disabled>Select a company...</option>
                  {companies.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="space-y-3">
                <Label htmlFor="date" className="text-sm font-semibold text-foreground/80">Date</Label>
                <div className="relative group">
                  <Calendar className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="date" name="date" type="date" required
                    value={formData.date} onChange={handleChange}
                    className="pl-11 h-12 rounded-xl bg-background/50 focus:bg-background border-muted-foreground/20 hover:border-muted-foreground/40 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-base"
                  />
                </div>
              </div>

              {/* Tender Number */}
              <div className="space-y-3">
                <Label htmlFor="tenderNumber" className="text-sm font-semibold text-foreground/80">Tender Number (Optional)</Label>
                <div className="relative group">
                  <FileText className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="tenderNumber" name="tenderNumber"
                    placeholder="e.g. TENDER-2024-01"
                    value={formData.tenderNumber} onChange={handleChange}
                    className="pl-11 h-12 rounded-xl bg-background/50 focus:bg-background border-muted-foreground/20 hover:border-muted-foreground/40 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-base"
                  />
                </div>
              </div>

              {/* Addressed To */}
              <div className="space-y-3 md:col-span-2">
                <Label htmlFor="addressedTo" className="text-sm font-semibold text-foreground/80">Addressed To (Name / Department)</Label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Textarea
                    id="addressedTo" name="addressedTo" required
                    placeholder="e.g. The Director General,\nProcurement Department,\nIslamabad."
                    value={formData.addressedTo} onChange={handleChange}
                    className="pl-11 min-h-[100px] rounded-xl bg-background/50 focus:bg-background border-muted-foreground/20 hover:border-muted-foreground/40 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-base py-3"
                  />
                </div>
              </div>

              {/* Item Name */}
              <div className="space-y-3 md:col-span-2">
                <Label htmlFor="itemName" className="text-sm font-semibold text-foreground/80">Item Name / Bid Subject</Label>
                <div className="relative group">
                  <Package className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="itemName" name="itemName" required
                    placeholder="e.g. Procurement of IT Equipment"
                    value={formData.itemName} onChange={handleChange}
                    className="pl-11 h-12 rounded-xl bg-background/50 focus:bg-background border-muted-foreground/20 hover:border-muted-foreground/40 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-base"
                  />
                </div>
              </div>

            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-border/50 flex justify-end">
              <Button type="submit" disabled={submitting} className="btn-stunning h-12 px-8 rounded-xl text-base font-semibold w-full md:w-auto">
                {submitting ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...</>
                ) : (
                  'Generate Cover Letter'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
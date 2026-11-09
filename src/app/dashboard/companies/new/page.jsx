'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Building2, MapPin, Phone, Type, Hash, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function NewCompanyPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    font: 'Times New Roman',
    fontSize: 12,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/companies', formData);
      toast.success('Company created successfully!');
      router.push('/dashboard/companies');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create company');
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
          <Link href="/dashboard/companies">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-jakarta)] text-foreground">Add New Company</h1>
          <p className="text-sm text-muted-foreground mt-1">Register a new company for your tender documents.</p>
        </div>
      </div>

      {/* Stunning Form Card */}
      <Card className="glass-panel border-white/20 dark:border-white/10 overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border/50 pb-6 pt-6 px-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl">Company Details</CardTitle>
              <CardDescription>Fill in the official information below.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name */}
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-semibold text-foreground/80">Company Name</Label>
                <div className="relative group">
                  <Building2 className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="name" name="name" required
                    placeholder="e.g. CRIMSON INTERNATIONAL"
                    value={formData.name} onChange={handleChange}
                    className="pl-11 h-12 rounded-xl bg-background/50 focus:bg-background border-muted-foreground/20 hover:border-muted-foreground/40 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-base"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-sm font-semibold text-foreground/80">Phone Number</Label>
                <div className="relative group">
                  <Phone className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="phone" name="phone" required
                    placeholder="e.g. 0345-8592229"
                    value={formData.phone} onChange={handleChange}
                    className="pl-11 h-12 rounded-xl bg-background/50 focus:bg-background border-muted-foreground/20 hover:border-muted-foreground/40 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-base"
                  />
                </div>
              </div>

              {/* Address (Full width) */}
              <div className="space-y-3 md:col-span-2">
                <Label htmlFor="address" className="text-sm font-semibold text-foreground/80">Street Address</Label>
                <div className="relative group">
                  <MapPin className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="address" name="address" required
                    placeholder="e.g. HOUSE NO. 1, STREET 45, F-8/1,"
                    value={formData.address} onChange={handleChange}
                    className="pl-11 h-12 rounded-xl bg-background/50 focus:bg-background border-muted-foreground/20 hover:border-muted-foreground/40 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-base"
                  />
                </div>
              </div>

              {/* City */}
              <div className="space-y-3">
                <Label htmlFor="city" className="text-sm font-semibold text-foreground/80">City</Label>
                <div className="relative group">
                  <MapPin className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="city" name="city" required
                    placeholder="e.g. ISLAMABAD."
                    value={formData.city} onChange={handleChange}
                    className="pl-11 h-12 rounded-xl bg-background/50 focus:bg-background border-muted-foreground/20 hover:border-muted-foreground/40 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-base"
                  />
                </div>
              </div>

              {/* Font Settings Group */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="font" className="text-sm font-semibold text-foreground/80">Document Font</Label>
                  <div className="relative group">
                    <Type className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="font" name="font" required
                      value={formData.font} onChange={handleChange}
                      className="pl-11 h-12 rounded-xl bg-background/50 focus:bg-background border-muted-foreground/20 hover:border-muted-foreground/40 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-base"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="fontSize" className="text-sm font-semibold text-foreground/80">Font Size</Label>
                  <div className="relative group">
                    <Hash className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="fontSize" name="fontSize" type="number" required
                      value={formData.fontSize} onChange={handleChange}
                      className="pl-11 h-12 rounded-xl bg-background/50 focus:bg-background border-muted-foreground/20 hover:border-muted-foreground/40 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-base"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-border/50 flex justify-end">
              <Button type="submit" disabled={submitting} className="btn-stunning h-12 px-8 rounded-xl text-base font-semibold w-full md:w-auto">
                {submitting ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving Company...</>
                ) : (
                  'Save Company'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
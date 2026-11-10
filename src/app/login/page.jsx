"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Loader2, Eye, EyeOff, FileStack } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.4)" }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill in all fields");
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.success) toast.success("Welcome back!");
    else toast.error(result.error);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <div className="ambient" />

      <div ref={cardRef} className="w-full max-w-md glass rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 items-center justify-center shadow-xl shadow-red-500/30 mb-5">
            <FileStack className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gradient font-[family-name:var(--font-jakarta)]">
            Crimson Group
          </h1>
          <p className="text-muted-foreground text-sm mt-2">Tender Portal · Admin Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="email" placeholder="admin@tenderportal.com"
                className="pl-11 h-12 rounded-xl bg-background/50"
                value={email} onChange={(e) => setEmail(e.target.value)} required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"} placeholder="••••••••"
                className="pl-11 pr-11 h-12 rounded-xl bg-background/50"
                value={password} onChange={(e) => setPassword(e.target.value)} required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button type="submit" disabled={submitting}
            className="btn-pop w-full h-12 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90">
            {submitting ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Signing In...</>) : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
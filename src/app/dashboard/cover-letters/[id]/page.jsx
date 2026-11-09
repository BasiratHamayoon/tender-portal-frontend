"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { toast } from "sonner";
import LineLoader from "@/components/layout/LineLoader";
import CoverLetterPrint from "@/components/print/CoverLetterPrint";

export default function ViewCoverLetterPage() {
  const { id } = useParams();
  const router = useRouter();
  const [letter, setLetter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/cover-letters/${id}`).then((res) => { setLetter(res.data); setLoading(false); }).catch(() => { toast.error("Not found"); router.push("/dashboard/cover-letters"); });
  }, [id, router]);

  if (loading) return <LineLoader loading={true} />;
  if (!letter) return null;

  return (
    <>
      <div className="no-print flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{letter.type.toUpperCase()} Cover Letter</h1>
            <p className="text-zinc-500 dark:text-zinc-400">{letter.itemName}</p>
          </div>
        </div>
        <Button onClick={() => window.print()} className="bg-red-600 hover:bg-red-700"><Printer className="w-4 h-4 mr-2" /> Print</Button>
      </div>

      <div className="no-print bg-white shadow-xl rounded-lg overflow-hidden max-w-[210mm] mx-auto border">
        <CoverLetterPrint data={letter} company={letter.company} />
      </div>

      <div className="hidden print:block">
        <CoverLetterPrint data={letter} company={letter.company} />
      </div>
    </>
  );
}
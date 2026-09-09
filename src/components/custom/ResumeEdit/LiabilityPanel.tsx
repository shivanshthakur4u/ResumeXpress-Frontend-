"use client";

import { AlertTriangle, Loader2, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { axios } from "@/lib/config";

type LiabilityClaim = { path: string; text: string; exposure: number; reasons: string[]; drill: string[]; evidenceId: string | null; evidenceStale?: boolean };
type LiabilityResult = { overallExposure: number; claims: LiabilityClaim[] };
const label = (value: string) => value.replace(/([A-Z])/g, " $1").replace(/[._]/g, " ").replace(/^./, letter => letter.toUpperCase());

const LiabilityPanel = ({ resumeId }: { resumeId: string }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["resume-liability", resumeId],
    enabled: Boolean(resumeId),
    queryFn: async () => (await axios.get(`resume/${resumeId}/liability`)).data as LiabilityResult,
    staleTime: 30_000,
  });
  const exposure = data?.overallExposure ?? 0;

  return (
    <section aria-labelledby="liability-heading" className="mt-6 rounded-xl border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow flex items-center gap-2"><AlertTriangle size={14} /> INTERVIEW LIABILITY</p>
          <h2 id="liability-heading" className="mt-2 text-lg font-semibold">What you may be asked to defend</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">Claims with numbers, seniority language, or no supporting proof rise to the top.</p>
        </div>
        {data && <p className={`text-4xl font-bold ${exposure > 65 ? "text-destructive" : exposure > 35 ? "text-amber-500" : "text-emerald-500"}`} role="status" aria-live="polite">{exposure}<span className="text-base font-normal text-muted-foreground">/100</span></p>}
      </div>
      {isLoading && <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Checking your claims...</p>}
      {isError && <p className="mt-5 text-sm text-destructive" role="alert">Could not run the liability check. Try again after saving.</p>}
      {data && !data.claims.length && <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4 text-emerald-500" />Add experience or summary claims to see what needs proof.</p>}
      {data && data.claims.length > 0 && <ol className="mt-5 space-y-4">{data.claims.map((claim, index) => <li key={`${claim.path}-${index}`} className="rounded-lg border p-4">
        <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs text-muted-foreground">{label(claim.path)}</p><span className={`text-sm font-semibold ${claim.exposure > 65 ? "text-destructive" : claim.exposure > 35 ? "text-amber-500" : "text-emerald-500"}`}>{claim.exposure}/100 exposure</span></div>
        <p className="mt-2 whitespace-pre-wrap text-sm">{claim.text}</p>
        {claim.reasons.length > 0 && <ul className="mt-3 space-y-1 text-sm text-muted-foreground">{claim.reasons.map(reason => <li key={reason}>- {reason}</li>)}</ul>}
        {claim.drill.length > 0 && <details className="mt-3"><summary className="cursor-pointer text-xs font-medium text-primary">Practice questions</summary><ul className="mt-2 space-y-1 text-sm">{claim.drill.map(question => <li key={question}>- {question}</li>)}</ul></details>}
        {(!claim.evidenceId || claim.evidenceStale) && <Button size="sm" variant="outline" className="mt-4" onClick={() => document.getElementById("evidence-vault")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}>{claim.evidenceStale ? "Update evidence" : "Attach evidence"}</Button>}
      </li>)}</ol>}
    </section>
  );
};

export default LiabilityPanel;

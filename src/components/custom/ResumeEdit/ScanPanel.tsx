"use client";

import { Eye, Loader2, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { axios } from "@/lib/config";

type ScanBlock = { type: string; label: string; text: string; y: number; height: number };
type ScanResult = { verdict: string; missing: string[]; jobTitlePresent: boolean; employerVisible: boolean; containsNumber: boolean; wordCountBeforeFirstAchievement: number; contactProportion: number; zone: ScanBlock[]; pages: number };

const ScanPanel = ({ resumeId }: { resumeId: string }) => {
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ["resume-scan", resumeId],
    enabled: Boolean(resumeId),
    queryFn: async () => (await axios.get(`resume/${resumeId}/scan`)).data as ScanResult,
    staleTime: 30_000,
  });
  return (
    <section aria-labelledby="scan-heading" className="mt-6 rounded-xl border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow flex items-center gap-2"><Eye size={14} /> SIX-SECOND SCAN</p>
          <h2 id="scan-heading" className="mt-2 text-lg font-semibold">What appears above the fold</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">This uses the real first-page coordinates from your PDF, not a text-length estimate.</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => refetch()} disabled={isFetching} className="flex gap-1.5">{isFetching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}Scan page</Button>
      </div>
      {isLoading && <p className="mt-5 text-sm text-muted-foreground">Measuring the first page...</p>}
      {isError && <p className="mt-5 text-sm text-destructive" role="alert">Could not measure the first page. Save your changes and try again.</p>}
      {data && <>
        <p className={`mt-5 rounded-lg border p-4 text-sm font-medium ${data.missing.length ? "border-amber-500/30 bg-amber-500/5" : "border-emerald-500/30 bg-emerald-500/5"}`} role="status">{data.verdict}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[ ["Job title", data.jobTitlePresent], ["Employer", data.employerVisible], ["Concrete result", data.containsNumber] ].map(([name, present]) => <div key={String(name)} className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">{name}</p><p className={`mt-1 text-sm font-semibold ${present ? "text-emerald-500" : "text-destructive"}`}>{present ? "Visible" : "Missing"}</p></div>)}
          <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Words before first result</p><p className="mt-1 text-sm font-semibold">{data.wordCountBeforeFirstAchievement}</p></div>
        </div>
        <div className="mt-5 rounded-lg border p-4"><div className="flex items-center justify-between gap-3"><h3 className="font-medium">First-page scan zone</h3><span className="text-xs text-muted-foreground">{Math.round(data.contactProportion * 100)}% contact details · {data.pages} page{data.pages === 1 ? "" : "s"}</span></div><ol className="mt-3 space-y-2">{data.zone.map((block, index) => <li key={`${block.type}-${index}`} className="flex gap-3 text-sm"><span className="w-5 shrink-0 text-xs text-muted-foreground">{index + 1}</span><span><strong>{block.label}</strong><span className="text-muted-foreground"> - {block.text}</span></span></li>)}</ol></div>
      </>}
    </section>
  );
};

export default ScanPanel;

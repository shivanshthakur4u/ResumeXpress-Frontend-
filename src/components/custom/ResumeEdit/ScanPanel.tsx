"use client";

import { Eye, Loader2, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { axios } from "@/lib/config";

type ScanBlock = { type: string; label: string; text: string; y: number; height: number };
type ScanResult = { verdict: string; missing: string[]; jobTitlePresent: boolean; employerVisible: boolean; containsNumber: boolean; wordCountBeforeFirstAchievement: number; contactProportion: number; zone: ScanBlock[]; pageBlocks: ScanBlock[]; pageHeight: number; pageWidth: number; pages: number };

const blockTone = (type: string) => {
  if (type === "contact") return "bg-sky-200";
  if (type === "jobTitle") return "bg-violet-300";
  if (type === "sectionHeading") return "bg-emerald-300";
  if (type === "entryTitle") return "bg-amber-300";
  return "bg-slate-300";
};

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
        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="rounded-lg border p-4"><div className="flex items-center justify-between gap-3"><h3 className="font-medium">First-page scan zone</h3><span className="text-xs text-muted-foreground">{Math.round(data.contactProportion * 100)}% contact details · {data.pages} page{data.pages === 1 ? "" : "s"}</span></div><ol className="mt-3 space-y-2">{data.zone.map((block, index) => <li key={`${block.type}-${index}`} className="flex gap-3 text-sm"><span className="w-5 shrink-0 text-xs text-muted-foreground">{index + 1}</span><span><strong>{block.label}</strong><span className="text-muted-foreground"> - {block.text}</span></span></li>)}</ol></div>
          <div className="rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between gap-2"><h3 className="font-medium">Page one map</h3><span className="text-xs text-muted-foreground">real PDF coordinates</span></div>
            <div className="relative mx-auto w-full max-w-[240px] overflow-hidden rounded-md border bg-white shadow-inner" style={{ aspectRatio: `${data.pageWidth} / ${data.pageHeight}` }} aria-label="Resume first page scan map">
              <div className="absolute inset-x-0 top-0 z-20 h-1/3 border-b-2 border-emerald-500 bg-emerald-300/20"><span className="absolute right-1 top-1 rounded bg-emerald-600 px-1 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-white">6s zone</span></div>
              <div className="absolute inset-x-0 bottom-0 top-1/3 z-20 bg-slate-900/15" aria-hidden="true" />
              {data.pageBlocks.map((block, index) => <div key={`${block.type}-${index}`} title={block.text} className={`absolute inset-x-[8%] z-10 overflow-hidden rounded-[2px] px-1 text-[7px] leading-tight text-slate-700 ${blockTone(block.type)}`} style={{ top: `${Math.min(99, Math.max(0, block.y / data.pageHeight * 100))}%`, height: `${Math.max(0.8, Math.min(12, block.height / data.pageHeight * 100))}%` }}><span className="block truncate">{block.label}</span></div>)}
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">Highlighted area is the first third. Lower content is dimmed.</p>
          </div>
        </div>
      </>}
    </section>
  );
};

export default ScanPanel;

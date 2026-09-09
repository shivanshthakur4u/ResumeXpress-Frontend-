"use client";

import { BarChart3, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/config";

type OutcomeResult = { unlocked: boolean; applications: number; replies: number; requiredApplications?: number; requiredReplies?: number; message: string };

export default function OutcomeInsights() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["outcome-insights"],
    queryFn: async () => (await axios.get("career/applications/insights")).data as OutcomeResult,
    staleTime: 30_000,
  });
  if (isLoading) return <p className="rounded-xl border p-4 text-sm text-muted-foreground"><Loader2 className="mr-2 inline h-4 w-4 animate-spin" />Checking outcome sample...</p>;
  if (isError || !data) return <p className="rounded-xl border p-4 text-sm text-destructive" role="alert">Could not load outcome progress.</p>;
  return <section className="rounded-xl border border-primary/20 bg-primary/5 p-5"><p className="eyebrow flex items-center gap-2"><BarChart3 size={14} /> OUTCOME LOOP</p><h2 className="mt-2 font-semibold">Insights from what actually happens</h2><p className="mt-2 text-sm text-muted-foreground">{data.message}</p><div className="mt-4 flex flex-wrap gap-4 text-sm"><span><strong>{data.applications}</strong> applications logged</span><span><strong>{data.replies}</strong> replies logged</span></div>{!data.unlocked && <p className="mt-3 text-xs text-muted-foreground">The panel stays quiet until the sample is large enough to avoid presenting noise as advice.</p>}</section>;
}

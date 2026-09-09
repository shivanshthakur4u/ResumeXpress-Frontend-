"use client";

import { AlertTriangle, CheckCircle2, FileScan, Loader2, RefreshCw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResumeMachineView } from "@/lib/queryHooks/resumeHooks";
import type { MachineViewField, MachineViewFieldStatus } from "@/lib/types/machineViewTypes";

const statusStyle: Record<MachineViewFieldStatus, { label: string; className: string }> = {
  recovered: { label: "Recovered", className: "text-emerald-500" },
  altered: { label: "Altered", className: "text-amber-500" },
  lost: { label: "Lost", className: "text-destructive" },
};

const fieldLabel = (field: string) => field
  .replace(/^sections\./, "")
  .replace(/\.entries\.(\d+)\./, " entry $1 ")
  .replace(/\.(\d+)\./g, " $1 ")
  .replace(/([a-z])([A-Z])/g, "$1 $2")
  .replace(/[._]/g, " ")
  .replace(/\b\w/g, (letter) => letter.toUpperCase());

const FieldRow = ({ field, machine }: { field: MachineViewField; machine: boolean }) => {
  const style = statusStyle[field.status];
  const value = machine ? field.recovered : field.expected;
  return (
    <li className="border-b py-3 last:border-0">
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs text-muted-foreground">{fieldLabel(field.field)}</span>
        {machine && <span className={`shrink-0 text-[10px] font-semibold uppercase tracking-wide ${style.className}`}>{style.label}</span>}
      </div>
      <p className={`mt-1 break-words text-sm ${machine && field.status === "lost" ? "text-destructive line-through" : machine && field.status === "altered" ? "text-amber-500" : "text-foreground"}`}>
        {value || (machine ? "Not recovered from PDF" : "No value")}
      </p>
    </li>
  );
};

const MachineViewPanel = ({ resumeId }: { resumeId: string }) => {
  const { data, isLoading, isError, isFetching, refetch } = useResumeMachineView(resumeId);
  const percentage = data ? Math.round(data.recoveryRate * 100) : null;

  return (
    <section aria-labelledby="machine-view-heading" className="mt-6 rounded-xl border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow flex items-center gap-2"><FileScan size={14} /> WHAT THE MACHINE SEES</p>
          <h2 id="machine-view-heading" className="mt-2 text-lg font-semibold">PDF recovery check</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">We export this resume, parse that exact file, and show what survives for an ATS.</p>
        </div>
        <div className="flex items-center gap-4">
          {percentage !== null && <p className={`text-4xl font-bold ${percentage > 90 ? "text-emerald-500" : percentage > 70 ? "text-amber-500" : "text-destructive"}`} role="status" aria-live="polite">{percentage}<span className="text-base font-normal text-muted-foreground">%</span></p>}
          <Button size="sm" variant="outline" onClick={() => refetch()} disabled={isFetching} className="flex gap-1.5">
            {isFetching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            Scan PDF
          </Button>
        </div>
      </div>

      {isLoading && <p className="mt-5 text-sm text-muted-foreground">Rendering and reading your PDF...</p>}
      {isError && <p className="mt-5 text-sm text-destructive" role="alert">Could not read this PDF. Save your changes and try again.</p>}

      {data && (
        <>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border bg-background/40 p-4">
              <h3 className="font-medium">Your saved record</h3>
              <p className="mt-1 text-xs text-muted-foreground">The values you entered.</p>
              <ul className="mt-3">{data.fields.map((field) => <FieldRow key={field.field} field={field} machine={false} />)}</ul>
            </div>
            <div className="rounded-lg border bg-background/40 p-4">
              <h3 className="font-medium">Recovered machine view</h3>
              <p className="mt-1 text-xs text-muted-foreground">Lost values are crossed out. Altered values need a closer look.</p>
              <ul className="mt-3">{data.fields.map((field) => <FieldRow key={field.field} field={field} machine />)}</ul>
            </div>
          </div>

          {data.faults.length > 0 && <div className="mt-5 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <h3 className="flex items-center gap-2 font-medium"><AlertTriangle className="h-4 w-4 text-amber-500" />Reading-order risks</h3>
            <ul className="mt-3 space-y-2">{data.faults.map((fault, index) => <li key={`${fault.code}-${index}`} className="flex gap-2 text-sm"><span className={fault.severity === "high" ? "text-destructive" : "text-amber-500"}>{fault.severity === "high" ? <XCircle className="mt-0.5 h-4 w-4" /> : <AlertTriangle className="mt-0.5 h-4 w-4" />}</span><span><strong>{fault.code.replaceAll("_", " ")}</strong><span className="text-muted-foreground"> - {fault.detail}</span></span></li>)}</ul>
          </div>}

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />Reading order: {data.readingOrder.join(" > ") || "No headings recovered"}</span>
            <span>{data.pages} page{data.pages === 1 ? "" : "s"}</span>
          </div>
          <details className="mt-4 rounded-lg border px-4 py-3">
            <summary className="cursor-pointer text-sm font-medium">Show extracted text</summary>
            <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap text-xs leading-5 text-muted-foreground">{data.machineText}</pre>
          </details>
        </>
      )}
    </section>
  );
};

export default MachineViewPanel;

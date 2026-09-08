"use client";

import { Loader2, RefreshCw, ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResumeAuthenticity } from "@/lib/queryHooks/resumeHooks";
import type {
  AuthenticityBand,
  AuthenticityFinding,
} from "@/lib/types/authenticityTypes";

const CATEGORY_LABEL: Record<AuthenticityFinding["category"], string> = {
  "ai-tell": "Reads as AI-written",
  cliche: "Stock phrase",
  "duty-not-impact": "Duty, not impact",
  "vague-scale": "Vague scale",
  "no-specifics": "Nothing specific to you",
};

const BAND_COPY: Record<AuthenticityBand, { title: string; blurb: string }> = {
  specific: {
    title: "Reads like you",
    blurb:
      "Concrete enough that a recruiter can tell a real person did this work.",
  },
  mixed: {
    title: "Partly generic",
    blurb:
      "Some lines could appear on anyone's resume. The ones below are worth rewriting.",
  },
  generic: {
    title: "Reads as generic",
    blurb:
      "Most of this could belong to any candidate. Recruiters in 2026 are actively filtering this out.",
  },
};

const scoreColour = (band: AuthenticityBand) =>
  band === "specific"
    ? "text-emerald-600"
    : band === "mixed"
      ? "text-amber-600"
      : "text-destructive";

const AuthenticityPanel = ({ resumeId }: { resumeId: string }) => {
  const { data, isLoading, isError, isFetching, refetch } =
    useResumeAuthenticity(resumeId);

  return (
    <section
      aria-labelledby="authenticity-heading"
      className="rounded-xl border bg-card p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow flex items-center gap-2">
            <ScanSearch size={14} />
            HOW IT READS
          </p>
          <h2 id="authenticity-heading" className="mt-2 text-lg font-semibold">
            Originality check
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {data?.band && (
            <p
              className={`text-3xl font-bold ${scoreColour(data.band)}`}
              role="status"
              aria-live="polite"
            >
              {data.score}
              <span className="text-sm font-normal text-muted-foreground">
                /100
              </span>
            </p>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex gap-1.5"
          >
            {isFetching ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            Re-check
          </Button>
        </div>
      </div>

      {isLoading && (
        <p className="mt-4 text-sm text-muted-foreground">Reading your resume…</p>
      )}

      {isError && (
        <p className="mt-4 text-sm text-destructive" role="alert">
          Couldn&apos;t run the check. Try again in a moment.
        </p>
      )}

      {data?.message && (
        <p className="mt-4 text-sm text-muted-foreground">{data.message}</p>
      )}

      {data?.band && (
        <>
          <p className="mt-4 text-sm font-medium">{BAND_COPY[data.band].title}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {BAND_COPY[data.band].blurb}
          </p>

          {data.topFixes.length > 0 && (
            <ol className="mt-5 space-y-4">
              {data.topFixes.map((fix, index) => (
                <li key={`${fix.field}-${index}`} className="rounded-lg border p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-xs text-muted-foreground">{fix.field}</p>
                    <span className="text-xs font-medium text-muted-foreground">
                      {fix.score}/100
                    </span>
                  </div>

                  <p className="mt-2 border-l-2 border-muted pl-3 text-sm italic">
                    “{fix.text}”
                  </p>

                  <ul className="mt-3 space-y-2.5">
                    {fix.findings.map((finding, i) => (
                      <li key={i} className="text-sm">
                        <span className="font-medium">
                          {CATEGORY_LABEL[finding.category]}
                        </span>
                        {finding.phrase && (
                          <span className="text-muted-foreground">
                            {" "}
                            — “{finding.phrase}”
                            {finding.occurrences > 1 &&
                              ` (×${finding.occurrences})`}
                          </span>
                        )}
                        <p className="mt-0.5 text-muted-foreground">
                          {finding.why}
                        </p>
                        <p className="mt-1 text-foreground">{finding.ask}</p>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          )}

          <p className="mt-5 text-xs text-muted-foreground">
            These are questions, not rewrites. Only you know the real numbers and
            names — and a resume you can&apos;t defend in the interview is worse
            than a plain one.
          </p>
        </>
      )}
    </section>
  );
};

export default AuthenticityPanel;

export type AuthenticityBand = "specific" | "mixed" | "generic";

export interface AuthenticityFinding {
  category:
    | "cliche"
    | "ai-tell"
    | "duty-not-impact"
    | "vague-scale"
    | "no-specifics";
  phrase: string | null;
  occurrences: number;
  why: string;
  // A question for the candidate. There is deliberately no suggested rewrite:
  // only they know the specifics, and inventing them is the one thing this
  // product must never do.
  ask: string;
}

export interface AuthenticityStatement {
  text: string;
  score: number;
  anchored: boolean;
  findings: AuthenticityFinding[];
}

export interface AuthenticityField {
  label: string;
  score: number;
  band: AuthenticityBand;
  statements: AuthenticityStatement[];
}

export interface AuthenticityResult {
  score: number | null;
  band: AuthenticityBand | null;
  fields: AuthenticityField[];
  topFixes: (AuthenticityStatement & { field: string })[];
  message?: string;
}

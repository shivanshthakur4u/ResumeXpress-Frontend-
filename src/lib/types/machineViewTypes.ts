export type MachineViewFieldStatus = "recovered" | "altered" | "lost";
export type MachineViewFaultSeverity = "high" | "medium" | "low";

export interface MachineViewField {
  field: string;
  expected: string;
  recovered: string | null;
  status: MachineViewFieldStatus;
}

export interface MachineViewFault {
  code: string;
  detail: string;
  severity: MachineViewFaultSeverity;
}

export interface MachineViewResult {
  parsedAt: string;
  fields: MachineViewField[];
  readingOrder: string[];
  faults: MachineViewFault[];
  machineText: string;
  recoveryRate: number;
  pages: number;
  warnings: string[];
}

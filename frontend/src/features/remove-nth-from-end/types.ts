import type { LinkedListNodeState } from "../shared/linked-list-types";

export type RemoveNthOperationType =
  | "init"
  | "advance_fast_n"
  | "advance_together"
  | "remove_node"
  | "complete";

export type RemoveNthPhase = "Setup" | "Advance Fast" | "Movement" | "Remove" | "Complete";
export type RemoveNthSeverity = "neutral" | "info" | "warning" | "critical" | "success";

export interface PointerSnapshot {
  fast: number | null;
  slow: number | null;
  target: number | null;
  n: number;
}

export interface RemoveNthStepMetadata {
  phase: RemoveNthPhase;
  severity: RemoveNthSeverity;
  title: string;
  description: string;
  badge: string;
  tip?: string;
}

export interface ExecutionStep {
  type: RemoveNthOperationType;
  operation: string;
  metadata: RemoveNthStepMetadata;
  nodeStates: Record<number, LinkedListNodeState>;
  pointers: PointerSnapshot;
  links: Record<number, number | null>;
}

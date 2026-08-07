import type { LinkedListNodeState } from "../shared/linked-list-types";

export type ReverseOperationType =
  | "init"
  | "loop_check"
  | "save_next"
  | "reverse_link"
  | "move_prev"
  | "move_curr"
  | "loop_exit"
  | "complete";

export type ReversePhase = "Setup" | "Loop" | "Exit" | "Return";
export type ReverseSeverity = "neutral" | "info" | "warning" | "critical" | "success";

export interface PointerSnapshot {
  prev: number | null;
  curr: number | null;
  nextSaved: number | null;
}

export interface ReverseStepMetadata {
  phase: ReversePhase;
  severity: ReverseSeverity;
  title: string;
  description: string;
  badge: string;
  tip?: string;
}

export interface ExecutionStep {
  type: ReverseOperationType;
  operation: string;
  metadata: ReverseStepMetadata;
  nodeStates: Record<number, LinkedListNodeState>;
  pointers: PointerSnapshot;
  // Snapshot of next-pointers at this moment (nodeVal → targetVal | null)
  links: Record<number, number | null>;
}

export interface ReverseLinkedListState {
  currentStep: number;
  executionSteps: ExecutionStep[];
  nodeStates: Record<number, LinkedListNodeState>;
}

import type { LinkedListNodeState, ListNode } from "@/features/shared/linked-list-types";

export type RotateOperationType =
  | "init"
  | "count_length"
  | "find_tail"
  | "compute_k"
  | "find_new_tail"
  | "break_and_relink"
  | "done";

export type RotatePhase = "Setup" | "Count" | "Find K" | "Break & Relink" | "Result";
export type RotateSeverity = "neutral" | "info" | "warning" | "critical" | "success";

export interface PointerSnapshot {
  head: number | null;
  tail: number | null;
  curr: number | null;
  newTail: number | null;
  newHead: number | null;
  length: number;
  k: number;
}

export interface RotateStepMetadata {
  phase: RotatePhase;
  severity: RotateSeverity;
  title: string;
  description: string;
  badge: string;
  tip?: string;
}

export interface ExecutionStep {
  type: RotateOperationType;
  operation: string;
  metadata: RotateStepMetadata;
  nodeStates: Record<number, LinkedListNodeState>;
  pointers: PointerSnapshot;
  links: Record<number, number | null>;
}

export type { ListNode };

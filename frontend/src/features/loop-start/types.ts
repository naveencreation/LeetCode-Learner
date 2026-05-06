import type { LinkedListNodeState, ListNode } from "@/features/shared/linked-list-types";

export type LoopStartOperationType =
  | "init"
  | "detect_cycle"
  | "move_to_head"
  | "find_start"
  | "found_start"
  | "no_cycle";

export type LoopStartPhase = "Setup" | "Detect" | "Find Start" | "Result";
export type LoopStartSeverity = "neutral" | "info" | "warning" | "critical" | "success";

export interface PointerSnapshot {
  slow: number | null;
  fast: number | null;
  ptr1: number | null;
  ptr2: number | null;
  cycleStart: number | null;
}

export interface LoopStartStepMetadata {
  phase: LoopStartPhase;
  severity: LoopStartSeverity;
  title: string;
  description: string;
  badge: string;
  tip?: string;
}

export interface ExecutionStep {
  type: LoopStartOperationType;
  operation: string;
  metadata: LoopStartStepMetadata;
  nodeStates: Record<number, LinkedListNodeState>;
  pointers: PointerSnapshot;
  links: Record<number, number | null>;
}

export type { ListNode };

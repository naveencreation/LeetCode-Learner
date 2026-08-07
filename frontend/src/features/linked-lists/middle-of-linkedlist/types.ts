import type { LinkedListNodeState, ListNode } from "@/features/linked-lists/shared/linked-list-types";

export type MiddleOperationType =
  | "init"           // slow = head, fast = head
  | "advance_slow"   // slow = slow.next
  | "advance_fast"   // fast = fast.next.next
  | "check_loop"     // while fast and fast.next
  | "found_middle";  // return slow

export type MiddlePhase = "Setup" | "Loop" | "Movement" | "Complete";
export type MiddleSeverity = "neutral" | "info" | "warning" | "critical" | "success";

export interface PointerSnapshot {
  slow: number | null;
  fast: number | null;
}

export interface MiddleStepMetadata {
  phase: MiddlePhase;
  severity: MiddleSeverity;
  title: string;
  description: string;
  badge: string;
  tip?: string;
}

export interface ExecutionStep {
  type: MiddleOperationType;
  operation: string;
  metadata: MiddleStepMetadata;
  nodeStates: Record<number, LinkedListNodeState>;
  pointers: PointerSnapshot;
  links: Record<number, number | null>;
}

export type { ListNode };

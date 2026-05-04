import type { LinkedListNodeState, ListNode } from "@/features/shared/linked-list-types";

export type DetectCycleOperationType =
  | "init"           // slow = head, fast = head
  | "check_loop"     // while fast and fast.next
  | "advance_slow"   // slow = slow.next
  | "advance_fast"   // fast = fast.next.next
  | "cycle_detected" // fast == slow (cycle found)
  | "no_cycle";      // fast or fast.next is null (no cycle)

export type DetectCyclePhase = "Setup" | "Check" | "Movement" | "Result";
export type DetectCycleSeverity = "neutral" | "info" | "warning" | "critical" | "success";

export interface PointerSnapshot {
  slow: number | null;
  fast: number | null;
  hasCycle: boolean | null;
}

export interface DetectCycleStepMetadata {
  phase: DetectCyclePhase;
  severity: DetectCycleSeverity;
  title: string;
  description: string;
  badge: string;
  tip?: string;
}

export interface ExecutionStep {
  type: DetectCycleOperationType;
  operation: string;
  metadata: DetectCycleStepMetadata;
  nodeStates: Record<number, LinkedListNodeState>;
  pointers: PointerSnapshot;
  links: Record<number, number | null>;
}

export type { ListNode };

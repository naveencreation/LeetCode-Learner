import type { LinkedListNodeState, ListNode } from "@/features/shared/linked-list-types";

export type MiddleOperationType =
  | "init"           // slow = head, fast = head
  | "advance_slow"   // slow = slow.next
  | "advance_fast"   // fast = fast.next.next
  | "check_loop"     // while fast and fast.next
  | "found_middle";  // return slow

export interface PointerSnapshot {
  slow: number | null;
  fast: number | null;
}

export interface ExecutionStep {
  type: MiddleOperationType;
  operation: string;
  nodeStates: Record<number, LinkedListNodeState>;
  pointers: PointerSnapshot;
  links: Record<number, number | null>;
}

export type { ListNode };

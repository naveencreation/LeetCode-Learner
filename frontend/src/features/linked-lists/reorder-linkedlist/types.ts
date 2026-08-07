import type { LinkedListNodeState } from "../shared/linked-list-types";

export type ReorderOperationType =
  // Phase 1: Find Middle
  | "init"
  | "find_middle_check"    // check while fast.next && fast.next.next
  | "find_middle_move"     // slow = slow.next, fast = fast.next.next
  | "find_middle_done"     // slow is at middle node
  // Phase 2: Reverse Second Half
  | "split_halves"         // second_half = slow.next, slow.next = null
  | "reverse_init"         // prev = None, curr = second_half
  | "reverse_loop_check"   // check while curr
  | "reverse_save_next"    // tmp = curr.next
  | "reverse_link"         // curr.next = prev
  | "reverse_advance"      // prev = curr, curr = tmp
  | "reverse_done"         // reversed second half complete
  // Phase 3: Merge/Interleave
  | "merge_init"           // p1 = head, p2 = prev
  | "merge_loop_check"     // check while p2
  | "merge_save"           // p1_next = p1.next, p2_next = p2.next
  | "merge_link_p1"        // p1.next = p2
  | "merge_link_p2"        // p2.next = p1_next
  | "merge_advance"        // p1 = p1_next, p2 = p2_next
  | "complete";            // done

export type ReorderPhase = "Find Middle" | "Reverse" | "Merge" | "Done";

export type ReorderSeverity = "neutral" | "info" | "warning" | "critical" | "success";

export interface PointerSnapshot {
  // Phase 1 pointers
  slow: number | null;
  fast: number | null;
  // Phase 2 pointers (prev/curr reused; nextSaved = tmp)
  prev: number | null;
  curr: number | null;
  nextSaved: number | null;
}

export interface ReorderStepMetadata {
  phase: ReorderPhase;
  severity: ReorderSeverity;
  title: string;
  description: string;
  badge: string;
  tip?: string;
}

export interface ExecutionStep {
  type: ReorderOperationType;
  operation: string;
  metadata: ReorderStepMetadata;
  nodeStates: Record<number, LinkedListNodeState>;
  pointers: PointerSnapshot;
  links: Record<number, number | null>;
}

export interface ReorderLinkedListState {
  currentStep: number;
  executionSteps: ExecutionStep[];
  nodeStates: Record<number, LinkedListNodeState>;
}

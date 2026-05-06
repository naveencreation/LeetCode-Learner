import type { LinkedListNodeState, ListNode } from "@/features/shared/linked-list-types";

export type FindIntersectionOperationType =
  | "init_lists"       // Initialize both lists
  | "calculate_lengths" // Calculate lengths of both lists
  | "align_pointers"   // Align pointers to same length
  | "advance_both"     // Advance both pointers together
  | "check_intersection" // Check if pointers are equal
  | "found_intersection"; // Intersection found

export type FindIntersectionPhase = "Setup" | "Calculate" | "Align" | "Search" | "Complete";
export type FindIntersectionSeverity = "neutral" | "info" | "warning" | "critical" | "success";

export interface PointerSnapshot {
  pointerA: number | null;
  pointerB: number | null;
  lengthA: number;
  lengthB: number;
}

export interface ListData {
  values: number[];
  nodeStates: Record<number, LinkedListNodeState>;
  links: Record<number, number | null>;
}

export interface FindIntersectionStepMetadata {
  phase: FindIntersectionPhase;
  severity: FindIntersectionSeverity;
  title: string;
  description: string;
  badge: string;
  tip?: string;
}

export interface ExecutionStep {
  type: FindIntersectionOperationType;
  operation: string;
  metadata: FindIntersectionStepMetadata;
  listA: ListData;
  listB: ListData;
  pointers: PointerSnapshot;
}

export type { ListNode };

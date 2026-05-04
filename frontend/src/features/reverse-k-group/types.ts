import type { LinkedListNodeState, ListNode } from "@/features/shared/linked-list-types";

export type ReverseKGroupOperationType =
  | "init"           // Initialize with k value
  | "check_group"    // Check if remaining nodes >= k
  | "reverse_group"  // Reverse a group of k nodes
  | "connect_groups" // Connect reversed group to previous
  | "incomplete"     // Remaining nodes < k, keep as is
  | "complete";      // All groups processed

export type ReverseKGroupPhase = "Setup" | "Check" | "Reverse" | "Connect" | "Complete";
export type ReverseKGroupSeverity = "neutral" | "info" | "warning" | "critical" | "success";

export interface PointerSnapshot {
  current: number | null;
  groupStart: number | null;
  groupEnd: number | null;
  prevGroupEnd: number | null | undefined;
  k: number;
}

export interface ReverseKGroupStepMetadata {
  phase: ReverseKGroupPhase;
  severity: ReverseKGroupSeverity;
  title: string;
  description: string;
  badge: string;
  tip?: string;
}

export interface ExecutionStep {
  type: ReverseKGroupOperationType;
  operation: string;
  metadata: ReverseKGroupStepMetadata;
  nodeStates: Record<number, LinkedListNodeState>;
  pointers: PointerSnapshot;
  links: Record<number, number | null>;
}

export type { ListNode };

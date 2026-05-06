import type { LinkedListNodeState, ListNode } from "@/features/shared/linked-list-types";

export type DeleteNodeOperationType =
  | "init"           // Initialize node to delete
  | "check_next"     // Check if next node exists
  | "copy_value"     // Copy next node's value to current node
  | "skip_next"      // Skip over next node
  | "complete";      // Deletion complete

export type DeleteNodePhase = "Setup" | "Check" | "Copy" | "Skip" | "Complete";
export type DeleteNodeSeverity = "neutral" | "info" | "warning" | "critical" | "success";

export interface PointerSnapshot {
  current: number | null;
  next: number | null;
  nextNext: number | null;
}

export interface DeleteNodeStepMetadata {
  phase: DeleteNodePhase;
  severity: DeleteNodeSeverity;
  title: string;
  description: string;
  badge: string;
  tip?: string;
}

export interface ExecutionStep {
  type: DeleteNodeOperationType;
  operation: string;
  metadata: DeleteNodeStepMetadata;
  nodeStates: Record<number, LinkedListNodeState>;
  pointers: PointerSnapshot;
  links: Record<number, number | null>;
}

export type { ListNode };

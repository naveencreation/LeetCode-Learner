import type { LinkedListNodeState } from "../shared/linked-list-types";

export type MergeOperationType =
  | "init"
  | "compare"
  | "attach_list1"
  | "attach_list2"
  | "advance_current"
  | "append_remaining_list1"
  | "append_remaining_list2"
  | "complete";

export type MergeSeverity = "neutral" | "info" | "warning" | "critical" | "success";

export interface MergeStepMetadata {
  phase: string;
  severity: MergeSeverity;
  title: string;
  description: string;
  badge: string;
  insight: string;
}

export interface PointerSnapshot {
  list1: number | null;
  list2: number | null;
  current: number | null;
}

export interface ExecutionStep {
  type: MergeOperationType;
  operation: string;
  nodeStates: Record<number, LinkedListNodeState>;
  pointers: PointerSnapshot;
  links: Record<number, number | null>;
  mergedList: number[];
  metadata?: MergeStepMetadata;
} // Track merged result so far

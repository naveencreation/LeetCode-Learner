import type { LinkedListNodeState } from "../shared/linked-list-types";

export type ReverseOperationType =
  | "init"
  | "save_next"
  | "reverse_link"
  | "move_prev"
  | "move_curr"
  | "complete";

export interface PointerSnapshot {
  prev: number | null;
  curr: number | null;
  nextSaved: number | null;
}

export interface ExecutionStep {
  type: ReverseOperationType;
  operation: string;
  nodeStates: Record<number, LinkedListNodeState>;
  pointers: PointerSnapshot;
  // Snapshot of next-pointers at this moment (nodeVal → targetVal | null)
  links: Record<number, number | null>;
}

export interface ReverseLinkedListState {
  currentStep: number;
  executionSteps: ExecutionStep[];
  nodeStates: Record<number, LinkedListNodeState>;
}

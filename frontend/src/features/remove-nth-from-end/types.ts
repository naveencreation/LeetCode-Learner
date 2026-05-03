import type { LinkedListNodeState } from "../shared/linked-list-types";

export type RemoveNthOperationType =
  | "init"
  | "advance_fast_n"
  | "advance_together"
  | "remove_node"
  | "complete";

export interface PointerSnapshot {
  fast: number | null;
  slow: number | null;
  target: number | null;
  n: number;
}

export interface ExecutionStep {
  type: RemoveNthOperationType;
  operation: string;
  nodeStates: Record<number, LinkedListNodeState>;
  pointers: PointerSnapshot;
  links: Record<number, number | null>;
}

import type { LinkedListNodeState } from "@/features/shared/linked-list-types";

export interface RandomListNode {
  val: number;
  next: RandomListNode | null;
  random: RandomListNode | null;
}

export type CloneOperationType =
  | "init"
  | "create_copy_nodes"
  | "set_copy_randoms"
  | "separate_lists"
  | "done";

export type ClonePhase = "Setup" | "Copy Nodes" | "Set Randoms" | "Separate" | "Result";
export type CloneSeverity = "neutral" | "info" | "warning" | "critical" | "success";

export interface PointerSnapshot {
  curr: number | null;
  copy: number | null;
  originalHead: number | null;
  copyHead: number | null;
}

export interface CloneStepMetadata {
  phase: ClonePhase;
  severity: CloneSeverity;
  title: string;
  description: string;
  badge: string;
  tip?: string;
}

export interface RandomLink {
  from: number;
  to: number;
  type: "next" | "random";
}

export interface ExecutionStep {
  type: CloneOperationType;
  operation: string;
  metadata: CloneStepMetadata;
  nodeStates: Record<number, LinkedListNodeState>;
  pointers: PointerSnapshot;
  links: Record<number, { next: number | null; random: number | null }>;
}

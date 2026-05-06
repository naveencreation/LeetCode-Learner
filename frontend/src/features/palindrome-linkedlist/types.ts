import type { LinkedListNodeState, ListNode } from "@/features/shared/linked-list-types";

export type PalindromeOperationType =
  | "init"
  | "find_middle"
  | "reverse_second_half"
  | "compare_halves"
  | "mismatch_found"
  | "palindrome_confirmed";

export type PalindromePhase = "Setup" | "Find Middle" | "Reverse" | "Compare" | "Result";
export type PalindromeSeverity = "neutral" | "info" | "warning" | "critical" | "success";

export interface PointerSnapshot {
  slow: number | null;
  fast: number | null;
  prev: number | null;
  curr: number | null;
  nextSaved: number | null;
  left: number | null;
  right: number | null;
}

export interface PalindromeStepMetadata {
  phase: PalindromePhase;
  severity: PalindromeSeverity;
  title: string;
  description: string;
  badge: string;
  tip?: string;
}

export interface ExecutionStep {
  type: PalindromeOperationType;
  operation: string;
  metadata: PalindromeStepMetadata;
  nodeStates: Record<number, LinkedListNodeState>;
  pointers: PointerSnapshot;
  links: Record<number, number | null>;
}

export type { ListNode };

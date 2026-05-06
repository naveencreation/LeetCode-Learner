import type { LinkedListNodeState, ListNode } from "@/features/shared/linked-list-types";

export type AddTwoNumbersOperationType =
  | "init_l1"           // Initialize l1 pointer
  | "init_l2"           // Initialize l2 pointer
  | "init_result"       // Initialize result dummy head
  | "check_both"        // Check if l1 and l2 exist
  | "extract_digits"    // Extract digits from l1 and l2
  | "calculate_sum"     // Calculate sum with carry
  | "create_node"       // Create new node with digit
  | "advance_pointers"  // Advance l1, l2, and current
  | "update_carry"      // Update carry
  | "check_carry"       // Check if carry remains
  | "add_carry_node";   // Add final carry node

export type AddTwoNumbersPhase = "Setup" | "Extraction" | "Calculation" | "Node Creation" | "Carry Check" | "Complete";
export type AddTwoNumbersSeverity = "neutral" | "info" | "warning" | "critical" | "success";

export interface ListData {
  values: number[];
  nodeStates: Record<number, LinkedListNodeState>;
  links: Record<number, number | null>;
}

export interface PointerSnapshot {
  l1: number | null;
  l2: number | null;
  current: number | null;
  carry: number;
}

export interface AddTwoNumbersStepMetadata {
  phase: AddTwoNumbersPhase;
  severity: AddTwoNumbersSeverity;
  title: string;
  description: string;
  badge: string;
  tip?: string;
}

export interface ExecutionStep {
  type: AddTwoNumbersOperationType;
  operation: string;
  metadata: AddTwoNumbersStepMetadata;
  list1: ListData;
  list2: ListData;
  result: ListData;
  pointers: PointerSnapshot;
}

export type { ListNode };

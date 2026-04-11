import type { NodeVisualState } from "../shared/types";

export type SymmetricTreeOperationType =
  | "enter_function"
  | "check_mirror"
  | "check_null"
  | "compare_values"
  | "recurse_outer"
  | "recurse_inner"
  | "exit_function"
  | "mismatch_found"
  | "match_found";

export type { NodeVisualState };

export interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export interface NodePosition {
  x: number;
  y: number;
}

export type TreePresetKey =
  | "symmetric_complete"
  | "symmetric_single"
  | "asymmetric_structure"
  | "asymmetric_values"
  | "empty_tree"
  | "two_nodes"
  | "custom";

export interface CallStackFrame {
  leftVal: number | null;
  rightVal: number | null;
  depth: number;
  id: number;
  state: "pending" | "executing" | "returned";
}

export interface ExecutionStep {
  type: SymmetricTreeOperationType;
  leftNode: TreeNode | null;
  rightNode: TreeNode | null;
  valueLeft: number | undefined;
  valueRight: number | undefined;
  operation: string;
  callStack: CallStackFrame[];
  nodeStates: Record<number, NodeVisualState>;
  isMatch: boolean | null;
}

export interface SymmetricTreeTraversalState {
  currentStep: number;
  result: boolean | null;
  visitedNodes: Set<number>;
  currentLeftNode: number | null;
  currentRightNode: number | null;
  executionSteps: ExecutionStep[];
  nodeStates: Record<number, NodeVisualState>;
}

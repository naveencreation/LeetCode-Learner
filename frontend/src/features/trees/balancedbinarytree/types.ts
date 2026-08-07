import type { NodeVisualState } from "../shared/types";

export type BalancedBinaryTreeOperationType =
  | "enter_function"
  | "check_left"
  | "check_right"
  | "check_balance"
  | "return_height"
  | "return_unbalanced"
  | "exit_function";

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
  | "complete"
  | "left_skewed"
  | "right_skewed"
  | "sparse_random"
  | "custom_empty";

export interface CallStackFrame {
  nodeVal: number;
  depth: number;
  id: number;
  state: "pending" | "executing" | "returned";
  leftHeight: number | null;
  rightHeight: number | null;
}

export interface ExecutionStep {
  type: BalancedBinaryTreeOperationType;
  node: TreeNode | null;
  value: number | undefined;
  operation: string;
  callStack: CallStackFrame[];
  nodeStates: Record<number, NodeVisualState>;
  isBalanced: boolean | null;
  currentHeight: number | null;
}

export interface BalancedBinaryTreeState {
  currentStep: number;
  result: boolean;
  visitedNodes: Set<number>;
  currentNode: number | null;
}

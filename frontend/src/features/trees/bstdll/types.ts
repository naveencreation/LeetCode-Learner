import type { NodeVisualState } from "../shared/types";

export type BstdllOperationType =
  | "enter_function"
  | "traverse_left"
  | "set_head"
  | "link_prev_curr"
  | "visit"
  | "traverse_right"
  | "close_cycle"
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
}

export interface ExecutionStep {
  type: BstdllOperationType;
  node: TreeNode | null;
  value: number | undefined;
  operation: string;
  callStack: CallStackFrame[];
  nodeStates: Record<number, NodeVisualState>;
}

export interface BstdllTraversalState {
  currentStep: number;
  result: number[];
  visitedNodes: Set<number>;
  currentNode: number | null;
  executionSteps: ExecutionStep[];
  nodeStates: Record<number, NodeVisualState>;
}


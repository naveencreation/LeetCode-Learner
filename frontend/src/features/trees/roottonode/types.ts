import type { NodeVisualState } from "../shared/types";

export type RootToNodeOperationType =
  | "enter_function"
  | "traverse_left"
  | "visit"
  | "traverse_right"
  | "backtrack"
  | "found_target"
  | "exit_function"
  | "finish";

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
  type: RootToNodeOperationType;
  node: TreeNode | null;
  value: number | undefined;
  target: number;
  pathSnapshot: number[];
  found: boolean;
  operation: string;
  callStack: CallStackFrame[];
  nodeStates: Record<number, NodeVisualState>;
}

export interface RootToNodeTraversalState {
  currentStep: number;
  result: number[];
  visitedNodes: Set<number>;
  found: boolean;
  target: number;
  currentNode: number | null;
  executionSteps: ExecutionStep[];
  nodeStates: Record<number, NodeVisualState>;
}


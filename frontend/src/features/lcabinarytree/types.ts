import type { NodeVisualState } from "../shared/types";
import type { CallStackFrame } from "../shared/types";

export type LcaBinaryTreeOperationType =
  | "enter_function"
  | "recurse_left"
  | "recurse_right"
  | "found_target"
  | "check_split"
  | "propagate"
  | "return_lca"
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

export interface ExecutionStep {
  type: LcaBinaryTreeOperationType;
  node: TreeNode | null;
  value: number | undefined;
  operation: string;
  callStack: CallStackFrame[];
  nodeStates: Record<number, NodeVisualState>;
  lcaValue: number | null;
  returnValue: number | null;
}

export interface LcaBinaryTreeState {
  currentStep: number;
  result: number | null;
  visitedNodes: Set<number>;
  currentNode: number | null;
}

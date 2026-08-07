import type { NodeVisualState } from "../shared/types";

export type SameTreeOperationType =
  | "enter_function"
  | "compare_nodes"
  | "check_null"
  | "compare_values"
  | "recurse_left"
  | "recurse_right"
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
  | "same_trees"
  | "different_structure"
  | "different_values"
  | "empty_trees"
  | "single_node_same"
  | "single_node_diff"
  | "custom_empty";

export interface CallStackFrame {
  nodeValP: number | null;
  nodeValQ: number | null;
  depth: number;
  id: number;
  state: "pending" | "executing" | "returned";
}

export interface ExecutionStep {
  type: SameTreeOperationType;
  nodeP: TreeNode | null;
  nodeQ: TreeNode | null;
  valueP: number | undefined;
  valueQ: number | undefined;
  operation: string;
  callStack: CallStackFrame[];
  nodeStatesP: Record<string, NodeVisualState>;
  nodeStatesQ: Record<string, NodeVisualState>;
  isMatch: boolean | null;
}

export interface SameTreeTraversalState {
  currentStep: number;
  result: boolean | null;
  visitedNodesP: Set<number>;
  visitedNodesQ: Set<number>;
  currentNodeP: number | null;
  currentNodeQ: number | null;
  executionSteps: ExecutionStep[];
  nodeStatesP: Record<string, NodeVisualState>;
  nodeStatesQ: Record<string, NodeVisualState>;
}

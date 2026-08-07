import type { NodeVisualState } from "../shared/types";

export type BoundaryTreeOperationType =
  | "enter_function"
  | "add_root"
  | "collect_left_boundary"
  | "collect_leaves"
  | "collect_right_boundary"
  | "visit_left_node"
  | "visit_leaf"
  | "visit_right_node"
  | "reverse_right"
  | "exit_function"
  | "complete";

export type BoundaryPhase = "left" | "leaves" | "right" | "complete";

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
  | "standard"
  | "complete_tree"
  | "left_skewed"
  | "right_skewed"
  | "single_node"
  | "two_nodes"
  | "custom";

export interface CallStackFrame {
  nodeVal: number | null;
  phase: BoundaryPhase;
  depth: number;
  id: number;
  state: "pending" | "executing" | "returned";
}

export interface ExecutionStep {
  type: BoundaryTreeOperationType;
  node: TreeNode | null;
  value: number | undefined;
  operation: string;
  phase: BoundaryPhase;
  callStack: CallStackFrame[];
  nodeStates: Record<number, NodeVisualState>;
  boundaryResult: number[];
  isLeaf: boolean;
}

export interface BoundaryTreeTraversalState {
  currentStep: number;
  result: number[];
  visitedNodes: Set<number>;
  currentNode: number | null;
  executionSteps: ExecutionStep[];
  nodeStates: Record<number, NodeVisualState>;
  currentPhase: BoundaryPhase;
}

export type HeightOperationType =
  | "enter_function"
  | "traverse_left"
  | "traverse_right"
  | "compute_height"
  | "exit_function"
  | "finish";

export type NodeVisualState =
  | "unvisited"
  | "exploring_left"
  | "current"
  | "exploring_right"
  | "completed";

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
  type: HeightOperationType;
  node: TreeNode | null;
  value: number | undefined;
  depth?: number;
  leftHeight?: number;
  rightHeight?: number;
  computedHeight?: number;
  maxHeight?: number;
  operation: string;
  callStack: CallStackFrame[];
  nodeStates: Record<number, NodeVisualState>;
}

export interface HeightTraversalState {
  currentStep: number;
  maxHeight: number;
  visitedNodes: Set<number>;
  currentNode: number | null;
  currentDepth: number | null;
  currentComputedHeight: number;
  computedHeights: Array<{ node: number; height: number }>;
  executionSteps: ExecutionStep[];
  nodeStates: Record<number, NodeVisualState>;
}

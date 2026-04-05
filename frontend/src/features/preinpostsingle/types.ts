export type PreInPostOperationType =
  | "pre_visit"
  | "schedule_in"
  | "traverse_left"
  | "in_visit"
  | "schedule_post"
  | "traverse_right"
  | "post_visit";

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
  traversalState: 1 | 2 | 3;
}

export interface ExecutionStep {
  type: PreInPostOperationType;
  node: TreeNode | null;
  value: number | undefined;
  operation: string;
  callStack: CallStackFrame[];
  nodeStates: Record<number, NodeVisualState>;
  preResult: number[];
  inResult: number[];
  postResult: number[];
}

export interface PreInPostTraversalState {
  currentStep: number;
  preResult: number[];
  inResult: number[];
  postResult: number[];
  visitedNodes: Set<number>;
  currentNode: number | null;
  executionSteps: ExecutionStep[];
  nodeStates: Record<number, NodeVisualState>;
}

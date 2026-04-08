export type LevelOrderOperationType =
  | "level_start"
  | "enter_function"
  | "visit"
  | "traverse_left"
  | "traverse_right"
  | "exit_function"
  | "level_end"
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
  type: LevelOrderOperationType;
  node: TreeNode | null;
  value: number | undefined;
  index?: number;
  level?: number;
  levelStartIndex?: number;
  levelEndIndex?: number;
  width?: number;
  maxWidth?: number;
  levelNodes?: number[];
  operation: string;
  callStack: CallStackFrame[];
  nodeStates: Record<number, NodeVisualState>;
}

export interface LevelOrderTraversalState {
  currentStep: number;
  levels: number[][];
  maxWidth: number;
  visitedNodes: Set<number>;
  currentNode: number | null;
  executionSteps: ExecutionStep[];
  nodeStates: Record<number, NodeVisualState>;
}

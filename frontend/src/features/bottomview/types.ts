export type BottomViewOperationType =
  | "start_level"
  | "dequeue"
  | "capture_bottom_view"
  | "enqueue_left"
  | "enqueue_right"
  | "end_level"
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
  type: BottomViewOperationType;
  node: TreeNode | null;
  value: number | undefined;
  hd?: number;
  operation: string;
  level: number;
  indexInLevel: number;
  queueBefore: number[];
  queueAfter: number[];
  dequeued?: number;
  enqueued?: number[];
  captured?: boolean;
  callStack: CallStackFrame[];
  nodeStates: Record<number, NodeVisualState>;
}

export interface BottomViewTraversalState {
  currentStep: number;
  result: number[];
  visitedNodes: Set<number>;
  currentNode: number | null;
  executionSteps: ExecutionStep[];
  nodeStates: Record<number, NodeVisualState>;
}




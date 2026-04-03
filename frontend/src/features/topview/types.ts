export type InorderOperationType =
  | "enter_function"
  | "traverse_left"
  | "visit"
  | "traverse_right"
  | "exit_function";

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

export interface CallStackFrame {
  nodeVal: number;
  depth: number;
  id: number;
  state: "pending" | "executing" | "returned";
}

export interface ExecutionStep {
  type: InorderOperationType;
  node: TreeNode | null;
  value: number | undefined;
  hd?: number;
  operation: string;
  callStack: CallStackFrame[];
  nodeStates: Record<number, NodeVisualState>;
}

export interface InorderTraversalState {
  currentStep: number;
  result: number[];
  visitedNodes: Set<number>;
  currentNode: number | null;
  executionSteps: ExecutionStep[];
  nodeStates: Record<number, NodeVisualState>;
}

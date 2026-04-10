// Shared types used across all traversal problems

export interface CallStackFrame {
  nodeVal: number;
  depth: number;
  id: number;
  state: "pending" | "executing" | "returned";
}

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

// Unified NodeVisualState that supports all problem types
export type NodeVisualState =
  | "unvisited"
  | "exploring_left"
  | "current"
  | "processing"
  | "exploring_right"
  | "completed";

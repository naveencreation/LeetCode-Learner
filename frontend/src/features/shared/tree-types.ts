import type { NodeVisualState } from "./types";

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

export interface GenericExecutionStep<TOperationType extends string = string> {
  type: TOperationType;
  node: TreeNode | null;
  value: number | undefined;
  operation: string;
  callStack: CallStackFrame[];
  nodeStates: Record<number, NodeVisualState>;
}

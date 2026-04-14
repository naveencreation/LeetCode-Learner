import type { NodeVisualState, TreeNode, TreePresetKey } from "../shared/types";

export type Lc105OperationType =
  | "base_case"
  | "pick_root"
  | "build_left"
  | "build_right"
  | "complete_node";

export interface BuildRange {
  left: number;
  right: number;
}

export interface Lc105CallStackFrame {
  nodeVal: number;
  depth: number;
  id: number;
  state: "pending" | "executing" | "returned";
}

export interface ExecutionStep {
  type: Lc105OperationType;
  node: TreeNode | null;
  value: number | undefined;
  operation: string;
  callStack: Lc105CallStackFrame[];
  nodeStates: Record<number, NodeVisualState>;
  preorderIndex: number;
  currentRange: BuildRange;
  inorderPivot: number | null;
  createdOrder: number[];
}

export interface Lc105ProjectionState {
  result: number[];
  visitedNodes: Set<number>;
  currentNode: number | null;
  nodeStates: Record<number, NodeVisualState>;
  createdOrder: number[];
  preorderPointer: number;
  currentRange: BuildRange;
  inorderPivot: number | null;
}

export type Lc105PresetKey = TreePresetKey;

export type { NodePosition, TreePresetKey } from "@/features/shared/types";

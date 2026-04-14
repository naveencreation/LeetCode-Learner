import type { NodeVisualState, TreeNode, TreePresetKey } from "../shared/types";

export type Lc106OperationType =
  | "base_case"
  | "pick_root"
  | "build_right"
  | "build_left"
  | "complete_node";

export interface BuildRange {
  left: number;
  right: number;
}

export interface Lc106CallStackFrame {
  nodeVal: number;
  depth: number;
  id: number;
  state: "pending" | "executing" | "returned";
}

export interface ExecutionStep {
  type: Lc106OperationType;
  node: TreeNode | null;
  value: number | undefined;
  operation: string;
  callStack: Lc106CallStackFrame[];
  nodeStates: Record<number, NodeVisualState>;
  postorderIndex: number;
  currentRange: BuildRange;
  inorderPivot: number | null;
  createdOrder: number[];
}

export interface Lc106ProjectionState {
  result: number[];
  visitedNodes: Set<number>;
  currentNode: number | null;
  nodeStates: Record<number, NodeVisualState>;
  createdOrder: number[];
  postorderPointer: number;
  currentRange: BuildRange;
  inorderPivot: number | null;
}

export type Lc106PresetKey = TreePresetKey;

export type { NodePosition, TreePresetKey } from "@/features/shared/types";

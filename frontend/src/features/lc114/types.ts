import type { NodeVisualState, TreeNode, TreePresetKey } from "../shared/types";

export type Lc114OperationType =
  | "base_case"
  | "pick_root"
  | "build_left"
  | "build_right"
  | "complete_node";

export interface Lc114CallStackFrame {
  nodeVal: number;
  depth: number;
  id: number;
  state: "pending" | "executing" | "returned";
}

export interface ExecutionStep {
  type: Lc114OperationType;
  node: TreeNode | null;
  value: number | undefined;
  operation: string;
  callStack: Lc114CallStackFrame[];
  nodeStates: Record<number, NodeVisualState>;
  preorderIndex: number;
  chain: number[];
}

export interface Lc114ProjectionState {
  result: number[];
  visitedNodes: Set<number>;
  currentNode: number | null;
  nodeStates: Record<number, NodeVisualState>;
  chain: number[];
  preorderPointer: number;
}

export type Lc114PresetKey = TreePresetKey;

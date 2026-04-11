import type { CallStackFrame, NodeVisualState, NodePosition } from "../shared/types";

export type ZigzagOperationType =
  | "enqueue"
  | "dequeue"
  | "process_level"
  | "flip_direction"
  | "complete";

export type { NodeVisualState };

export interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export type { NodePosition };

export type TreePresetKey =
  | "complete"
  | "left_skewed"
  | "right_skewed"
  | "sparse_random"
  | "custom_empty";

export interface ExecutionStep {
  type: ZigzagOperationType;
  node: TreeNode | null;
  value: number | undefined;
  operation: string;
  callStack: CallStackFrame[];
  nodeStates: Record<number, NodeVisualState>;
  levelData?: {
    currentLevel: number[];
    direction: "left-to-right" | "right-to-left";
    depth: number;
  };
}

export interface ZigzagTraversalState {
  currentStep: number;
  result: number[][];
  visitedNodes: Set<number>;
  currentNode: number | null;
  executionSteps: ExecutionStep[];
  nodeStates: Record<number, NodeVisualState>;
}

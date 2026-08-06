import type {
  CallStackFrame,
  GenericExecutionStep,
  NodePosition,
  NodeVisualState,
  TreeNode,
  TreePresetKey,
} from "../shared/tree-types";

export type LevelOrderOperationType =
  | "level_start"
  | "enter_function"
  | "visit"
  | "traverse_left"
  | "traverse_right"
  | "exit_function"
  | "level_end"
  | "finish";

export type { TreeNode, NodePosition, TreePresetKey, CallStackFrame, NodeVisualState };

export interface ExecutionStep extends GenericExecutionStep<LevelOrderOperationType> {
  index?: number;
  level?: number;
  levelStartIndex?: number;
  levelEndIndex?: number;
  width?: number;
  maxWidth?: number;
  levelNodes?: number[];
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

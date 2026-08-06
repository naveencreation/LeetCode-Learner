import type {
  CallStackFrame,
  GenericExecutionStep,
  NodePosition,
  NodeVisualState,
  TreeNode,
  TreePresetKey,
} from "../shared/tree-types";

export type InorderOperationType =
  | "enter_function"
  | "traverse_left"
  | "visit"
  | "traverse_right"
  | "exit_function";

export type { TreeNode, NodePosition, TreePresetKey, CallStackFrame, NodeVisualState };

export type ExecutionStep = GenericExecutionStep<InorderOperationType>;

export interface InorderTraversalState {
  currentStep: number;
  result: number[];
  visitedNodes: Set<number>;
  currentNode: number | null;
  executionSteps: ExecutionStep[];
  nodeStates: Record<number, NodeVisualState>;
}


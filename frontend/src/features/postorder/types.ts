import type {
  CallStackFrame,
  GenericExecutionStep,
  NodePosition,
  NodeVisualState,
  TreeNode,
  TreePresetKey,
} from "../shared/tree-types";

export type PostorderOperationType =
  | "enter_function"
  | "traverse_left"
  | "visit"
  | "traverse_right"
  | "exit_function";

export type { TreeNode, NodePosition, TreePresetKey, CallStackFrame, NodeVisualState };

export type ExecutionStep = GenericExecutionStep<PostorderOperationType>;

export interface PostorderTraversalState {
  currentStep: number;
  result: number[];
  visitedNodes: Set<number>;
  currentNode: number | null;
  executionSteps: ExecutionStep[];
  nodeStates: Record<number, NodeVisualState>;
}




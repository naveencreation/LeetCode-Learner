export type BalancedTreeOperationType =
  | "enter_function"
  | "check_null"
  | "recurse_left"
  | "check_left_sentinel"
  | "recurse_right"
  | "check_right_sentinel"
  | "compare_heights"
  | "unbalanced"
  | "calculate_height"
  | "exit_function"
  | "complete";

export interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export interface BalancedTreeCallStackFrame {
  functionName: "check" | "isBalanced";
  nodeValue: number | null;
  phase: "start" | "recursing_left" | "recursing_right" | "checking_balance" | "done";
  leftHeight?: number;
  rightHeight?: number;
  currentHeight?: number;
}

// Re-export from shared types
export type { NodeVisualState, NodePosition } from "@/features/shared/types";

import type { NodeVisualState as SharedNodeVisualState } from "@/features/shared/types";

export interface BalancedTreeExecutionStep {
  type: BalancedTreeOperationType;
  lineNumber: number;
  callStack: BalancedTreeCallStackFrame[];
  nodeStates: Record<number, SharedNodeVisualState>;
  currentNode: TreeNode | null;
  leftHeight?: number;
  rightHeight?: number;
  currentHeight?: number;
  isBalanced: boolean;
  explanation: string;
}

export interface BalancedTreeTraversalState {
  currentStepIndex: number;
  steps: BalancedTreeExecutionStep[];
  isPlaying: boolean;
  speed: number;
  root: TreeNode | null;
  customNodePositions: Record<number, { x: number; y: number }>;
  selectedPreset: BalancedTreePresetKey;
}

export type BalancedTreePresetKey =
  | "balanced"
  | "unbalanced"
  | "single_node"
  | "two_nodes"
  | "custom_empty";

export type TreePresetKey = BalancedTreePresetKey;

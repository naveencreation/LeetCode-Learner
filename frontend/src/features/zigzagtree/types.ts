export type ZigzagTreeOperationType =
  | "enter_function"
  | "check_null"
  | "init_queue"
  | "start_level"
  | "get_level_size"
  | "process_node"
  | "add_left_child"
  | "add_right_child"
  | "reverse_level"
  | "add_level_result"
  | "toggle_direction"
  | "exit_function"
  | "complete";

export interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export interface ZigzagTreeCallStackFrame {
  functionName: "zigzagLevelOrder";
  nodeValue: number | null;
  phase: "start" | "processing" | "done";
  level?: number;
}

export interface ZigzagTreeExecutionStep {
  type: ZigzagTreeOperationType;
  lineNumber: number;
  callStack: ZigzagTreeCallStackFrame[];
  nodeStates: Record<number, import("@/features/shared/types").NodeVisualState>;
  currentNode: TreeNode | null;
  queueState: number[];
  currentLevel: number;
  leftToRight: boolean;
  levelResult: number[];
  finalResult: number[][];
  explanation: string;
}

export interface ZigzagTreeTraversalState {
  currentStepIndex: number;
  steps: ZigzagTreeExecutionStep[];
  isPlaying: boolean;
  speed: number;
  root: TreeNode | null;
  customNodePositions: Record<number, { x: number; y: number }>;
  selectedPreset: ZigzagTreePresetKey;
}

export type ZigzagTreePresetKey =
  | "standard"
  | "simple"
  | "single_node"
  | "two_nodes"
  | "custom_empty";

export type { NodePosition } from "@/features/shared/types";

export type TreePresetKey = ZigzagTreePresetKey;

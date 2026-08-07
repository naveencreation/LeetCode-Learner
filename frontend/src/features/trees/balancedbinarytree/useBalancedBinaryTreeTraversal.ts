"use client";

import { useMemo } from "react";
import {
  BALANCED_BINARY_TREE_PRESETS,
  cloneTree,
  createSampleTree,
} from "./constants";
import { generateBalancedBinaryTreeExecutionSteps } from "./engine";
import {
  getCodeLineForStep,
  getOperationBadge,
  getPhaseLabel,
} from "./selectors";
import { useGenericTraversal } from "../shared/useGenericTraversal";
import type {
  ExecutionStep,
  NodePosition,
  NodeVisualState,
  TreeNode,
  TreePresetKey,
} from "./types";
import type { StepProjection } from "../shared/useGenericTraversal";
import type { CallStackFrame } from "../shared/types";

// Problem-specific state projection logic
function projectStateForStep(
  currentStep: number,
  executionSteps: ExecutionStep[],
  initialNodeStates: Record<number, NodeVisualState>,
): StepProjection {
  if (currentStep <= 0) {
    return {
      result: false,
      visitedNodes: new Set<number>(),
      currentNode: null,
      nodeStates: { ...initialNodeStates },
    };
  }

  const visitedNodes = new Set<number>();

  for (let index = 0; index < currentStep; index += 1) {
    const step = executionSteps[index];
    if (step && step.nodeStates) {
      Object.entries(step.nodeStates).forEach(([nodeVal, state]) => {
        if (state !== "unvisited") {
          visitedNodes.add(Number(nodeVal));
        }
      });
    }
  }

  const previousStep = executionSteps[currentStep - 1];
  const currentNode = previousStep?.node?.val ?? null;
  const nodeStates = previousStep?.nodeStates ?? { ...initialNodeStates };
  const result = previousStep?.isBalanced ?? false;

  return {
    result,
    visitedNodes,
    currentNode,
    nodeStates,
  };
}

// Return type for balanced binary tree traversal
interface BalancedBinaryTreeTraversalReturn {
  root: TreeNode | null;
  selectedPreset: TreePresetKey;
  presets: Record<TreePresetKey, { label: string; create: () => TreeNode | null }>;
  customNodePositions: Record<number, NodePosition>;
  executionSteps: ExecutionStep[];
  totalSteps: number;
  currentStep: number;
  result: boolean;
  visitedNodes: Set<number>;
  currentNode: number | null;
  nodeStates: Record<number, NodeVisualState>;
  currentOperation: string;
  currentPhase: string;
  currentCodeLine: number;
  operationBadge: string;
  activeStep: ExecutionStep | undefined;
  executedStep: ExecutionStep | undefined;
  activeCallStack: CallStackFrame[];
  isAtStart: boolean;
  isAtEnd: boolean;
  controlMode: "manual" | "auto";
  setControlMode: (mode: "manual" | "auto") => void;
  isPlaying: boolean;
  autoPlaySpeedMs: number;
  setAutoPlaySpeedMs: (speedMs: number) => void;
  playTraversal: () => void;
  pauseTraversal: () => void;
  nextStep: () => void;
  previousStep: () => void;
  resetTraversal: () => void;
  goToFirst: () => void;
  goToLast: () => void;
  applyTreeConfiguration: (
    nextRoot: TreeNode | null,
    nextPositions: Record<number, NodePosition>,
    preset: TreePresetKey,
    runImmediately?: boolean,
  ) => void;
}

export function useBalancedBinaryTreeTraversal(): BalancedBinaryTreeTraversalReturn {
  const config = useMemo(
    () => ({
      generateSteps: generateBalancedBinaryTreeExecutionSteps,
      presets: BALANCED_BINARY_TREE_PRESETS,
      cloneTree,
      createSampleTree,
      getCodeLineForStep,
      getOperationBadge,
      getPhaseLabel,
      projectStateForStep,
    }),
    [],
  );

  return useGenericTraversal(config) as BalancedBinaryTreeTraversalReturn;
}

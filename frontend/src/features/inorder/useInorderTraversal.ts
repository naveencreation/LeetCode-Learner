"use client";

import { useMemo } from "react";
import { INORDER_TREE_PRESETS, cloneTree, createSampleTree } from "./constants";
import { generateInorderExecutionSteps } from "./engine";
import { getCodeLineForStep, getOperationBadge, getPhaseLabel } from "./selectors";
import { useGenericTraversal } from "../shared/useGenericTraversal";
import type {
  ExecutionStep,
  NodeVisualState,
  TreeNode,
  TreePresetKey,
} from "./types";
import type { StepProjection } from "../shared/useGenericTraversal";
import type { CallStackFrame } from "../shared/types";

import { projectStandardTraversalState } from "../shared/projectTreeState";

// Problem-specific state projection logic using shared helper
function projectStateForStep(
  currentStep: number,
  executionSteps: ExecutionStep[],
  initialNodeStates: Record<number, NodeVisualState>,
): StepProjection {
  return projectStandardTraversalState(currentStep, executionSteps, initialNodeStates);
}

// Thin wrapper around generic hook
// Return type for inorder traversal
interface InorderTraversalReturn {
  root: TreeNode | null;
  selectedPreset: TreePresetKey;
  presets: Record<TreePresetKey, { label: string; create: () => TreeNode }>;
  customNodePositions: Record<number, { x: number; y: number }>;
  executionSteps: ExecutionStep[];
  totalSteps: number;
  currentStep: number;
  result: number[];
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
  applyTreeConfiguration: (nextRoot: TreeNode, nextPositions: Record<number, any>, preset: TreePresetKey, runImmediately?: boolean) => void;
}

export function useInorderTraversal(): InorderTraversalReturn {
  // Memoize config to avoid unnecessary recalculations
  const config = useMemo(
    () => ({
      generateSteps: generateInorderExecutionSteps,
      presets: INORDER_TREE_PRESETS,
      cloneTree,
      createSampleTree,
      getCodeLineForStep,
      getOperationBadge,
      getPhaseLabel,
      projectStateForStep,
    }),
    [],
  );

  return useGenericTraversal(config) as InorderTraversalReturn;
}

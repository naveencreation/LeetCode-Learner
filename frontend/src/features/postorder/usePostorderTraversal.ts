"use client";

import { useMemo } from "react";
import { POSTORDER_TREE_PRESETS, cloneTree, createSampleTree } from "./constants";
import { generatePostorderExecutionSteps } from "./engine";
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

interface PostorderTraversalReturn {
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

import { projectStandardTraversalState } from "../shared/projectTreeState";

function projectStateForStep(
  currentStep: number,
  executionSteps: ExecutionStep[],
  initialNodeStates: Record<number, NodeVisualState>,
): StepProjection {
  return projectStandardTraversalState(currentStep, executionSteps, initialNodeStates);
}

export function usePostorderTraversal(): PostorderTraversalReturn {
  const config = useMemo(
    () => ({
      generateSteps: generatePostorderExecutionSteps,
      presets: POSTORDER_TREE_PRESETS,
      cloneTree,
      createSampleTree,
      getCodeLineForStep,
      getOperationBadge,
      getPhaseLabel,
      projectStateForStep,
    }),
    [],
  );

  return useGenericTraversal(config) as PostorderTraversalReturn;
}



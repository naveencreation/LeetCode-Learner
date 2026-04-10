"use client";

import { useMemo } from "react";
import { PREORDER_TREE_PRESETS, cloneTree, createSampleTree } from "./constants";
import { generatePreorderExecutionSteps } from "./engine";
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

interface PreorderTraversalReturn {
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

function projectStateForStep(
  currentStep: number,
  executionSteps: ExecutionStep[],
  initialNodeStates: Record<number, NodeVisualState>,
): StepProjection {
  if (currentStep <= 0) {
    return {
      result: [],
      visitedNodes: new Set<number>(),
      currentNode: null,
      nodeStates: { ...initialNodeStates },
    };
  }

  const result: number[] = [];
  const visitedNodes = new Set<number>();

  for (let index = 0; index < currentStep; index += 1) {
    const step = executionSteps[index];
    if (step.type === "visit" && typeof step.value === "number") {
      result.push(step.value);
      visitedNodes.add(step.value);
    }
  }

  const previousStep = executionSteps[currentStep - 1];
  const currentNode = previousStep?.node?.val ?? null;
  const nodeStates = previousStep?.nodeStates ?? { ...initialNodeStates };

  return {
    result,
    visitedNodes,
    currentNode,
    nodeStates,
  };
}

export function usePreorderTraversal() {
  const config = useMemo(
    () => ({
      generateSteps: generatePreorderExecutionSteps,
      presets: PREORDER_TREE_PRESETS,
      cloneTree,
      createSampleTree,
      getCodeLineForStep,
      getOperationBadge,
      getPhaseLabel,
      projectStateForStep,
    }),
    [],
  );

  return useGenericTraversal(config) as PreorderTraversalReturn;
}



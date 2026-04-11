"use client";

import { useMemo } from "react";
import {
  BOUNDARY_TREE_PRESETS,
  cloneTree,
  createSampleTree,
} from "./constants";
import { generateBoundaryTreeExecutionSteps } from "./engine";
import {
  getCodeLineForStep,
  getOperationBadge,
  getPhaseLabel,
} from "./selectors";
import { useGenericTraversal } from "../shared/useGenericTraversal";
import type {
  ExecutionStep,
  NodeVisualState,
  TreeNode,
  TreePresetKey,
} from "./types";
import type { StepProjection } from "../shared/useGenericTraversal";

// Problem-specific state projection
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

  const visitedNodes = new Set<number>();

  for (let index = 0; index < currentStep; index += 1) {
    const step = executionSteps[index];
    if (step.value !== undefined && step.value !== null) {
      visitedNodes.add(step.value);
    }
  }

  const previousStep = executionSteps[currentStep - 1];
  const currentNode = previousStep?.value ?? null;
  const nodeStates = previousStep?.nodeStates ?? { ...initialNodeStates };

  // Get result from current step
  const result: number[] = previousStep?.boundaryResult ?? [];

  return {
    result,
    visitedNodes,
    currentNode,
    nodeStates,
  };
}

// Wrapper around generic hook
export function useBoundaryTreeTraversal() {
  const config = useMemo(
    () => ({
      generateSteps: generateBoundaryTreeExecutionSteps,
      presets: BOUNDARY_TREE_PRESETS,
      cloneTree,
      createSampleTree,
      getCodeLineForStep,
      getOperationBadge,
      getPhaseLabel,
      projectStateForStep,
    }),
    [],
  );

  return useGenericTraversal<ExecutionStep, TreePresetKey>(config);
}

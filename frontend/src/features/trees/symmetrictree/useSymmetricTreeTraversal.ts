"use client";

import { useMemo } from "react";
import {
  SYMMETRIC_TREE_PRESETS,
  cloneTree,
  createSampleTree,
} from "./constants";
import { generateSymmetricTreeExecutionSteps } from "./engine";
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
      result: null,
      visitedNodes: new Set<number>(),
      currentNode: null,
      nodeStates: { ...initialNodeStates },
    };
  }

  const visitedNodes = new Set<number>();

  for (let index = 0; index < currentStep; index += 1) {
    const step = executionSteps[index];
    if (step.valueLeft !== undefined && step.valueLeft !== null) {
      visitedNodes.add(step.valueLeft);
    }
    if (step.valueRight !== undefined && step.valueRight !== null) {
      visitedNodes.add(step.valueRight);
    }
  }

  const previousStep = executionSteps[currentStep - 1];
  const currentNode = previousStep?.valueLeft ?? null;
  const nodeStates = previousStep?.nodeStates ?? { ...initialNodeStates };

  // Determine result from final step
  let result: boolean | null = null;
  if (currentStep >= executionSteps.length && executionSteps.length > 0) {
    const lastStep = executionSteps[executionSteps.length - 1];
    result = lastStep.isMatch;
  }

  return {
    result,
    visitedNodes,
    currentNode,
    nodeStates,
  };
}

// Wrapper around generic hook
export function useSymmetricTreeTraversal() {
  const config = useMemo(
    () => ({
      generateSteps: generateSymmetricTreeExecutionSteps,
      presets: SYMMETRIC_TREE_PRESETS,
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

"use client";

import { useMemo } from "react";
import { useGenericTraversal } from "@/features/shared/useGenericTraversal";
import type { StepProjection } from "@/features/shared/useGenericTraversal";
import type { NodeVisualState } from "@/features/shared/types";
import { BALANCED_PRESETS, cloneTree } from "./constants";
import { generateBalancedTreeSteps } from "./engine";
import { getCodeLine, getOperationBadge, getPhaseLabel } from "./selectors";
import type { BalancedTreeExecutionStep, BalancedTreePresetKey } from "./types";

// Problem-specific state projection
function projectStateForStep(
  currentStep: number,
  executionSteps: BalancedTreeExecutionStep[],
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
    if (step?.currentNode?.val !== undefined && step?.currentNode?.val !== null) {
      visitedNodes.add(step.currentNode.val);
    }
  }

  const previousStep = executionSteps[currentStep - 1];
  const currentNode = previousStep?.currentNode?.val ?? null;
  const nodeStates = previousStep?.nodeStates ?? { ...initialNodeStates };

  // Determine result from final step
  let result: boolean | null = null;
  if (currentStep >= executionSteps.length && executionSteps.length > 0) {
    const lastStep = executionSteps[executionSteps.length - 1];
    result = lastStep?.isBalanced ?? null;
  }

  return {
    result,
    visitedNodes,
    currentNode,
    nodeStates,
  };
}

// Wrapper around generic hook
export function useBalancedTreeTraversal() {
  const config = useMemo(
    () => ({
      generateSteps: generateBalancedTreeSteps,
      presets: BALANCED_PRESETS,
      cloneTree,
      createSampleTree: () => cloneTree(BALANCED_PRESETS.balanced.create()),
      getCodeLineForStep: getCodeLine,
      getOperationBadge,
      getPhaseLabel,
      projectStateForStep,
    }),
    [],
  );

  return useGenericTraversal<BalancedTreeExecutionStep, BalancedTreePresetKey>(config);
}

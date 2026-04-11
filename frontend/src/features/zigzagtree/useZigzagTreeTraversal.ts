"use client";

import { useMemo } from "react";
import { useGenericTraversal } from "@/features/shared/useGenericTraversal";
import type { StepProjection } from "@/features/shared/useGenericTraversal";
import type { NodeVisualState } from "@/features/shared/types";
import { ZIGZAG_PRESETS, cloneTree } from "./constants";
import { generateZigzagTreeSteps } from "./engine";
import { getCodeLine, getOperationBadge, getPhaseLabel } from "./selectors";
import type { ZigzagTreeExecutionStep, ZigzagTreePresetKey } from "./types";

function projectStateForStep(
  currentStep: number,
  executionSteps: ZigzagTreeExecutionStep[],
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

  let result: number[][] | null = null;
  if (currentStep >= executionSteps.length && executionSteps.length > 0) {
    const lastStep = executionSteps[executionSteps.length - 1];
    result = lastStep?.finalResult ?? null;
  }

  return {
    result,
    visitedNodes,
    currentNode,
    nodeStates,
  };
}

export function useZigzagTreeTraversal() {
  const config = useMemo(
    () => ({
      generateSteps: generateZigzagTreeSteps,
      presets: ZIGZAG_PRESETS,
      cloneTree,
      createSampleTree: () => cloneTree(ZIGZAG_PRESETS.standard.create()),
      getCodeLineForStep: getCodeLine,
      getOperationBadge,
      getPhaseLabel,
      projectStateForStep,
    }),
    [],
  );

  return useGenericTraversal<ZigzagTreeExecutionStep, ZigzagTreePresetKey>(config);
}

"use client";

import { useMemo } from "react";
import { cloneTree, createSampleTree, LC106_TREE_PRESETS } from "./constants";
import { generateLc106ExecutionSteps } from "./engine";
import { getCodeLineForStep, getOperationBadge, getPhaseLabel } from "./selectors";
import { useGenericTraversal } from "../shared/useGenericTraversal";
import type { StepProjection } from "../shared/useGenericTraversal";
import type { ExecutionStep, Lc106PresetKey, Lc106ProjectionState } from "./types";
import type { NodeVisualState } from "../shared/types";

interface Lc106StepProjection extends StepProjection {
  createdOrder: number[];
  postorderPointer: number;
  currentRange: { left: number; right: number };
  inorderPivot: number | null;
}

function projectStateForStep(
  currentStep: number,
  executionSteps: ExecutionStep[],
  initialNodeStates: Record<number, NodeVisualState>,
): Lc106StepProjection {
  if (currentStep <= 0) {
    return {
      result: [],
      visitedNodes: new Set<number>(),
      currentNode: null,
      nodeStates: { ...initialNodeStates },
      createdOrder: [],
      postorderPointer: -1,
      currentRange: { left: 0, right: -1 },
      inorderPivot: null,
    };
  }

  const previousStep = executionSteps[currentStep - 1];
  const createdOrder = previousStep?.createdOrder ?? [];

  return {
    result: createdOrder,
    visitedNodes: new Set(createdOrder),
    currentNode: previousStep?.node?.val ?? null,
    nodeStates: previousStep?.nodeStates ?? { ...initialNodeStates },
    createdOrder,
    postorderPointer: previousStep?.postorderIndex ?? -1,
    currentRange: previousStep?.currentRange ?? { left: 0, right: -1 },
    inorderPivot: previousStep?.inorderPivot ?? null,
  };
}

export function useLc106Traversal() {
  const config = useMemo(
    () => ({
      generateSteps: generateLc106ExecutionSteps,
      presets: LC106_TREE_PRESETS,
      cloneTree,
      createSampleTree,
      getCodeLineForStep,
      getOperationBadge,
      getPhaseLabel,
      projectStateForStep,
    }),
    [],
  );

  const state = useGenericTraversal<ExecutionStep, Lc106PresetKey>(config);
  const executedStep = state.executedStep as ExecutionStep | undefined;
  const projection = state as typeof state & Lc106ProjectionState;

  return {
    ...projection,
    createdOrder: (projection.result as number[]) ?? [],
    postorderPointer: executedStep?.postorderIndex ?? -1,
    currentRange: executedStep?.currentRange ?? { left: 0, right: -1 },
    inorderPivot: executedStep?.inorderPivot ?? null,
  };
}

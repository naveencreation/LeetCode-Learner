"use client";

import { useMemo } from "react";
import { cloneTree, createSampleTree, LC105_TREE_PRESETS } from "./constants";
import { generateLc105ExecutionSteps } from "./engine";
import { getCodeLineForStep, getOperationBadge, getPhaseLabel } from "./selectors";
import { useGenericTraversal } from "../shared/useGenericTraversal";
import type { StepProjection } from "../shared/useGenericTraversal";
import type { ExecutionStep, Lc105PresetKey, Lc105ProjectionState } from "./types";
import type { NodeVisualState } from "../shared/types";

interface Lc105StepProjection extends StepProjection {
  createdOrder: number[];
  preorderPointer: number;
  currentRange: { left: number; right: number };
  inorderPivot: number | null;
}

function projectStateForStep(
  currentStep: number,
  executionSteps: ExecutionStep[],
  initialNodeStates: Record<number, NodeVisualState>,
): Lc105StepProjection {
  if (currentStep <= 0) {
    return {
      result: [],
      visitedNodes: new Set<number>(),
      currentNode: null,
      nodeStates: { ...initialNodeStates },
      createdOrder: [],
      preorderPointer: 0,
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
    preorderPointer: previousStep?.preorderIndex ?? 0,
    currentRange: previousStep?.currentRange ?? { left: 0, right: -1 },
    inorderPivot: previousStep?.inorderPivot ?? null,
  };
}

export function useLc105Traversal() {
  const config = useMemo(
    () => ({
      generateSteps: generateLc105ExecutionSteps,
      presets: LC105_TREE_PRESETS,
      cloneTree,
      createSampleTree,
      getCodeLineForStep,
      getOperationBadge,
      getPhaseLabel,
      projectStateForStep,
    }),
    [],
  );

  const state = useGenericTraversal<ExecutionStep, Lc105PresetKey>(config);
  const executedStep = state.executedStep as ExecutionStep | undefined;
  const projection = state as typeof state & Lc105ProjectionState;

  return {
    ...projection,
    createdOrder: (projection.result as number[]) ?? [],
    preorderPointer: executedStep?.preorderIndex ?? 0,
    currentRange: executedStep?.currentRange ?? { left: 0, right: -1 },
    inorderPivot: executedStep?.inorderPivot ?? null,
  };
}

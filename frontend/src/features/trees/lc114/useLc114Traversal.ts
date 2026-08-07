"use client";

import { useMemo } from "react";
import { cloneTree, createSampleTree, LC114_TREE_PRESETS } from "./constants";
import { generateLc114ExecutionSteps } from "./engine";
import { getCodeLineForStep, getOperationBadge, getPhaseLabel } from "./selectors";
import { useGenericTraversal } from "../shared/useGenericTraversal";
import type { StepProjection } from "../shared/useGenericTraversal";
import type { ExecutionStep, Lc114PresetKey, Lc114ProjectionState } from "./types";
import type { NodeVisualState } from "../shared/types";

interface Lc114StepProjection extends StepProjection {
  chain: number[];
  preorderPointer: number;
}

function projectStateForStep(
  currentStep: number,
  executionSteps: ExecutionStep[],
  initialNodeStates: Record<number, NodeVisualState>,
): Lc114StepProjection {
  if (currentStep <= 0) {
    return {
      result: [],
      visitedNodes: new Set<number>(),
      currentNode: null,
      nodeStates: { ...initialNodeStates },
      chain: [],
      preorderPointer: 0,
    };
  }

  const previousStep = executionSteps[currentStep - 1];
  const chain = previousStep?.chain ?? [];

  return {
    result: chain,
    visitedNodes: new Set(chain),
    currentNode: previousStep?.node?.val ?? null,
    nodeStates: previousStep?.nodeStates ?? { ...initialNodeStates },
    chain,
    preorderPointer: previousStep?.preorderIndex ?? 0,
  };
}

export function useLc114Traversal() {
  const config = useMemo(
    () => ({
      generateSteps: generateLc114ExecutionSteps,
      presets: LC114_TREE_PRESETS,
      cloneTree,
      createSampleTree,
      getCodeLineForStep,
      getOperationBadge,
      getPhaseLabel,
      projectStateForStep,
    }),
    [],
  );

  const state = useGenericTraversal<ExecutionStep, Lc114PresetKey>(config);
  const executedStep = state.executedStep as ExecutionStep | undefined;
  const projection = state as typeof state & Lc114ProjectionState;

  return {
    ...projection,
    chain: (projection.result as number[]) ?? [],
    preorderPointer: executedStep?.preorderIndex ?? 0,
  };
}

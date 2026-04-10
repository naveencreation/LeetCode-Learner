"use client";

import { useMemo } from "react";
import { HEIGHT_TREE_PRESETS, cloneTree, createSampleTree } from "./constants";
import { generateHeightExecutionSteps } from "./engine";
import { getCodeLineForStep, getOperationBadge, getPhaseLabel } from "./selectors";
import { useGenericTraversal } from "../shared/useGenericTraversal";
import type {
  ExecutionStep,
  NodeVisualState,
  TreeNode,
  TreePresetKey,
} from "./types";
import type { StepProjection } from "../shared/useGenericTraversal";

interface HeightStepProjection extends StepProjection {
  maxHeight: number;
  currentDepth: number | null;
  currentComputedHeight: number;
  computedHeights: Array<{ node: number; height: number }>;
}

function projectStateForStep(
  currentStep: number,
  executionSteps: ExecutionStep[],
  initialNodeStates: Record<number, NodeVisualState>,
): HeightStepProjection {
  if (currentStep <= 0) {
    return {
      result: [],
      maxHeight: 0,
      visitedNodes: new Set<number>(),
      currentNode: null,
      currentDepth: null,
      currentComputedHeight: 0,
      computedHeights: [],
      nodeStates: { ...initialNodeStates },
    };
  }

  const heightsByNode = new Map<number, number>();
  const visitedNodes = new Set<number>();
  let maxHeight = 0;
  let currentComputedHeight = 0;

  for (let index = 0; index < currentStep; index += 1) {
    const step = executionSteps[index];
    if (step.type === "enter_function" && typeof step.value === "number") {
      visitedNodes.add(step.value);
    }

    if (step.type === "compute_height" && typeof step.value === "number") {
      const computed = step.computedHeight ?? 0;
      heightsByNode.set(step.value, computed);
      currentComputedHeight = computed;
      maxHeight = Math.max(maxHeight, step.maxHeight ?? computed);
    }

    if (step.type === "finish") {
      maxHeight = Math.max(maxHeight, step.maxHeight ?? step.computedHeight ?? 0);
      currentComputedHeight = step.computedHeight ?? currentComputedHeight;
    }
  }

  const computedHeights = Array.from(heightsByNode.entries())
    .sort(([leftNode], [rightNode]) => leftNode - rightNode)
    .map(([node, height]) => ({ node, height }));

  const previousStep = executionSteps[currentStep - 1];
  const currentNode = previousStep?.node?.val ?? null;
  const currentDepth = previousStep?.depth ?? null;
  const nodeStates = previousStep?.nodeStates ?? { ...initialNodeStates };

  return {
    result: computedHeights,
    maxHeight,
    visitedNodes,
    currentNode,
    currentDepth,
    currentComputedHeight,
    computedHeights,
    nodeStates,
  };
}

export function useHeightTraversal() {
  const config = useMemo(
    () => ({
      generateSteps: generateHeightExecutionSteps,
      presets: HEIGHT_TREE_PRESETS,
      cloneTree,
      createSampleTree,
      getCodeLineForStep,
      getOperationBadge,
      getPhaseLabel,
      projectStateForStep,
    }),
    [],
  );

  const state = useGenericTraversal(config);
  const result = state.result as Array<{ node: number; height: number }>;

  // Extend generic return with height-specific properties
  return {
    ...state,
    result,
    maxHeight: (state as any).maxHeight || 0,
    currentDepth: (state as any).currentDepth,
    currentComputedHeight: (state as any).currentComputedHeight,
  };
}

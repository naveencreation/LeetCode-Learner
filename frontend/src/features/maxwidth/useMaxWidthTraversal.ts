"use client";

import { useMemo } from "react";
import { MAX_WIDTH_TREE_PRESETS, cloneTree, createSampleTree } from "./constants";
import { generateMaxWidthExecutionSteps } from "./engine";
import { getCodeLineForStep, getOperationBadge, getPhaseLabel } from "./selectors";
import { useGenericTraversal } from "../shared/useGenericTraversal";
import type {
  ExecutionStep,
  NodeVisualState,
  TreeNode,
  TreePresetKey,
} from "./types";
import type { StepProjection } from "../shared/useGenericTraversal";

interface MaxWidthStepProjection extends StepProjection {
  maxWidth: number;
  levelWidths: number[];
  currentLevel: number | null;
  currentWidth: number;
}

interface MaxWidthTraversalReturn {
  result: number[];
  maxWidth: number;
  levelWidths: number[];
  currentLevel: number | null;
  currentWidth: number;
}

function projectStateForStep(
  currentStep: number,
  executionSteps: ExecutionStep[],
  initialNodeStates: Record<number, NodeVisualState>,
): MaxWidthStepProjection {
  if (currentStep <= 0) {
    return {
      result: [],
      levelWidths: [],
      maxWidth: 0,
      visitedNodes: new Set<number>(),
      currentNode: null,
      currentLevel: null,
      currentWidth: 0,
      nodeStates: { ...initialNodeStates },
    };
  }

  const levelWidths = new Map<number, number>();
  const visitedNodes = new Set<number>();
  let maxWidth = 0;

  for (let index = 0; index < currentStep; index += 1) {
    const step = executionSteps[index];
    if (step.type === "visit" && typeof step.value === "number") {
      visitedNodes.add(step.value);
    }

    if (step.type === "level_end" && typeof step.level === "number" && typeof step.width === "number") {
      levelWidths.set(step.level, step.width);
      maxWidth = Math.max(maxWidth, step.width);
    }

    if (step.type === "finish" && typeof step.maxWidth === "number") {
      maxWidth = Math.max(maxWidth, step.maxWidth);
    }
  }

  const result = Array.from(levelWidths.entries())
    .sort(([leftLevel], [rightLevel]) => leftLevel - rightLevel)
    .map(([, width]) => width);

  const previousStep = executionSteps[currentStep - 1];
  const currentNode = previousStep?.node?.val ?? null;
  const currentLevel = previousStep?.level ?? null;
  const currentWidth = previousStep?.width ?? 0;
  const nodeStates = previousStep?.nodeStates ?? { ...initialNodeStates };

  return {
    result,
    levelWidths: result,
    maxWidth,
    visitedNodes,
    currentNode,
    currentLevel,
    currentWidth,
    nodeStates,
  };
}

export function useMaxWidthTraversal() {
  const config = useMemo(
    () => ({
      generateSteps: generateMaxWidthExecutionSteps,
      presets: MAX_WIDTH_TREE_PRESETS,
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
  const result = state.result as number[];

  return {
    ...state,
    result,
    maxWidth: (state as any).maxWidth || 0,
    levelWidths: result,
    currentLevel: (state as any).currentLevel,
    currentWidth: (state as any).currentWidth,
  } as typeof state & MaxWidthTraversalReturn;
}

// Export for levelorder which uses maxwidth
export { useMaxWidthTraversal as useLevelOrderTraversal };

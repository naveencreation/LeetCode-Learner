"use client";

import { useMemo } from "react";
import { DIAMETER_TREE_PRESETS, cloneTree, createSampleTree } from "./constants";
import { generateDiameterExecutionSteps } from "./engine";
import { getCodeLineForStep, getOperationBadge, getPhaseLabel } from "./selectors";
import { useGenericTraversal } from "../shared/useGenericTraversal";
import type {
  ExecutionStep,
  NodeVisualState,
  TreeNode,
  TreePresetKey,
} from "./types";
import type { StepProjection } from "../shared/useGenericTraversal";

interface DiameterStepProjection extends StepProjection {
  diameterHistory: number[];
  currentDiameter: number;
}

function projectStateForStep(
  currentStep: number,
  executionSteps: ExecutionStep[],
  initialNodeStates: Record<number, NodeVisualState>,
): DiameterStepProjection {
  if (currentStep <= 0) {
    return {
      result: [],
      diameterHistory: [],
      currentDiameter: 0,
      visitedNodes: new Set<number>(),
      currentNode: null,
      nodeStates: { ...initialNodeStates },
    };
  }

  const diameterHistory: number[] = [];
  let currentDiameter = 0;
  const visitedNodes = new Set<number>();

  for (let index = 0; index < currentStep; index += 1) {
    const step = executionSteps[index];
    if (step.type === "update_diameter" && typeof step.value === "number") {
      diameterHistory.push(step.value);
      currentDiameter = step.value;
    }

    if (typeof step.node?.val === "number") {
      visitedNodes.add(step.node.val);
    }
  }

  const previousStep = executionSteps[currentStep - 1];
  const currentNode = previousStep?.node?.val ?? null;
  const nodeStates = previousStep?.nodeStates ?? { ...initialNodeStates };

  return {
    result: diameterHistory,
    diameterHistory,
    currentDiameter,
    visitedNodes,
    currentNode,
    nodeStates,
  };
}

export function useDiameterTraversal() {
  const config = useMemo(
    () => ({
      generateSteps: generateDiameterExecutionSteps,
      presets: DIAMETER_TREE_PRESETS,
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
  return {
    ...state,
    diameterHistory: (state.result as number[]) || [],
    currentDiameter: ((state.result as number[])?.[((state.result as number[])?.length - 1)] || 0),
  };
}

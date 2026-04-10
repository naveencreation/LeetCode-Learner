"use client";

import { useMemo } from "react";
import { PRE_IN_POST_TREE_PRESETS, cloneTree, createSampleTree } from "./constants";
import { generatePreInPostExecutionSteps } from "./engine";
import { getCodeLineForStep, getOperationBadge, getPhaseLabel } from "./selectors";
import { useGenericTraversal } from "../shared/useGenericTraversal";
import type {
  ExecutionStep,
  NodeVisualState,
  TreeNode,
  TreePresetKey,
} from "./types";
import type { StepProjection } from "../shared/useGenericTraversal";

interface PreInPostStepProjection extends StepProjection {
  preResult: number[];
  inResult: number[];
  postResult: number[];
}

function projectStateForStep(
  currentStep: number,
  executionSteps: ExecutionStep[],
  initialNodeStates: Record<number, NodeVisualState>,
): PreInPostStepProjection {
  if (currentStep <= 0) {
    return {
      result: [],
      preResult: [],
      inResult: [],
      postResult: [],
      visitedNodes: new Set<number>(),
      currentNode: null,
      nodeStates: { ...initialNodeStates },
    };
  }

  const previousStep = executionSteps[currentStep - 1];
  const visitedNodes = new Set<number>([
    ...(previousStep as any).preResult,
    ...(previousStep as any).inResult,
    ...(previousStep as any).postResult,
  ]);
  const currentNode = previousStep?.node?.val ?? null;
  const nodeStates = previousStep?.nodeStates ?? { ...initialNodeStates };

  return {
    result: [...(previousStep as any).preResult],
    preResult: [...(previousStep as any).preResult],
    inResult: [...(previousStep as any).inResult],
    postResult: [...(previousStep as any).postResult],
    visitedNodes,
    currentNode,
    nodeStates,
  };
}

export function usePreInPostTraversal() {
  const generateSteps = (root: TreeNode | null) => {
    if (!root) {
      return {
        executionSteps: [],
        initialNodeStates: {},
      };
    }

    return generatePreInPostExecutionSteps(root);
  };

  const config = useMemo(
    () => ({
      generateSteps,
      presets: PRE_IN_POST_TREE_PRESETS,
      cloneTree,
      createSampleTree,
      getCodeLineForStep,
      getOperationBadge,
      getPhaseLabel,
      projectStateForStep,
    }),
    [generateSteps],
  );

  const state = useGenericTraversal(config);
  const executedStep = state.executedStep as ExecutionStep | undefined;

  return {
    ...state,
    preResult: executedStep?.preResult ?? [],
    inResult: executedStep?.inResult ?? [],
    postResult: executedStep?.postResult ?? [],
  };
}

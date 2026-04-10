"use client";

import { useCallback, useMemo, useState } from "react";
import { ROOT_TO_NODE_TREE_PRESETS, cloneTree, createSampleTree } from "./constants";
import { generateRootToNodeExecutionSteps } from "./engine";
import { getCodeLineForStep, getOperationBadge, getPhaseLabel } from "./selectors";
import { useGenericTraversal } from "../shared/useGenericTraversal";
import type {
  ExecutionStep,
  NodeVisualState,
  TreeNode,
  TreePresetKey,
} from "./types";
import type { StepProjection } from "../shared/useGenericTraversal";

function collectNodeValues(node: TreeNode | null, values: number[]): void {
  if (!node) {
    return;
  }
  values.push(node.val);
  collectNodeValues(node.left, values);
  collectNodeValues(node.right, values);
}

function projectStateForStep(
  currentStep: number,
  executionSteps: ExecutionStep[],
  initialNodeStates: Record<number, NodeVisualState>,
): StepProjection & { found: boolean } {
  if (currentStep <= 0) {
    return {
      result: [],
      found: false,
      visitedNodes: new Set<number>(),
      currentNode: null,
      nodeStates: { ...initialNodeStates },
    };
  }

  let result: number[] = [];
  let found = false;
  const visitedNodes = new Set<number>();

  for (let index = 0; index < currentStep; index += 1) {
    const step = executionSteps[index];
    if ((step.type === "visit" || step.type === "backtrack") && typeof step.value === "number") {
      result = [...(step as any).pathSnapshot];
      visitedNodes.add(step.value);
    }
    if (step.type === "found_target") {
      result = [...(step as any).pathSnapshot];
      found = true;
      if (typeof step.value === "number") {
        visitedNodes.add(step.value);
      }
    }
    if (step.type === "traverse_left" || step.type === "traverse_right") {
      if (typeof step.value === "number") {
        visitedNodes.add(step.value);
      }
    }
    if (step.type === "finish") {
      found = false;
      result = [];
    }
    if (step.type === "exit_function" && (step as any).found) {
      found = true;
      result = [...(step as any).pathSnapshot];
    }
    if (step.type === "enter_function" && typeof step.value === "number") {
      visitedNodes.add(step.value);
    }
  }

  const previousStep = executionSteps[currentStep - 1];
  const currentNode = previousStep?.node?.val ?? null;
  const nodeStates = previousStep?.nodeStates ?? { ...initialNodeStates };

  return {
    result,
    found,
    visitedNodes,
    currentNode,
    nodeStates,
  };
}

export function useRootToNodeTraversal() {
  const [root, setRoot] = useState<TreeNode>(() => createSampleTree());
  const [targetValue, setTargetValue] = useState<number>(7);

  const generateSteps = useCallback(
    (node: TreeNode | null) => {
      if (!node) {
        return {
          executionSteps: [],
          initialNodeStates: {},
        };
      }

      return generateRootToNodeExecutionSteps(node, targetValue);
    },
    [targetValue],
  );

  const config = useMemo(
    () => ({
      generateSteps,
      presets: ROOT_TO_NODE_TREE_PRESETS,
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

  const nodeValues = useMemo(() => {
    const values: number[] = [];
    collectNodeValues(state.root, values);
    return Array.from(new Set(values)).sort((a, b) => a - b);
  }, [state.root]);

  const applyTreeConfigurationWithTarget = useCallback(
    (
      nextRoot: TreeNode,
      nextPositions: Record<number, any>,
      preset: TreePresetKey,
      runImmediately = false,
    ) => {
      const clonedRoot = cloneTree(nextRoot);
      if (!clonedRoot) return;
      const values: number[] = [];
      collectNodeValues(clonedRoot, values);
      const hasTarget = values.includes(targetValue);
      if (!hasTarget && values.length > 0) {
        setTargetValue(values[0]);
      }
      state.applyTreeConfiguration(clonedRoot, nextPositions, preset, runImmediately);
    },
    [targetValue, state],
  );

  return {
    ...state,
    result: state.result as number[],
    targetValue,
    setTargetValue,
    nodeValues,
    found: (state as any).found ?? false,
    applyTreeConfiguration: applyTreeConfigurationWithTarget,
  };
}

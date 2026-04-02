"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { INORDER_TREE_PRESETS, cloneTree, createSampleTree } from "./constants";
import { generateInorderExecutionSteps } from "./engine";
import { getCodeLineForStep, getOperationBadge, getPhaseLabel } from "./selectors";
import type {
  ExecutionStep,
  NodePosition,
  NodeVisualState,
  TreeNode,
  TreePresetKey,
} from "./types";

interface StepProjection {
  result: number[];
  visitedNodes: Set<number>;
  currentNode: number | null;
  nodeStates: Record<number, NodeVisualState>;
}

function projectStateForStep(
  currentStep: number,
  executionSteps: ExecutionStep[],
  initialNodeStates: Record<number, NodeVisualState>,
): StepProjection {
  if (currentStep <= 0) {
    return {
      result: [],
      visitedNodes: new Set<number>(),
      currentNode: null,
      nodeStates: { ...initialNodeStates },
    };
  }

  const result: number[] = [];
  const visitedNodes = new Set<number>();

  for (let index = 0; index < currentStep; index += 1) {
    const step = executionSteps[index];
    if (step.type === "visit" && typeof step.value === "number") {
      result.push(step.value);
      visitedNodes.add(step.value);
    }
  }

  const previousStep = executionSteps[currentStep - 1];
  const currentNode = previousStep?.node?.val ?? null;
  const nodeStates = previousStep?.nodeStates ?? { ...initialNodeStates };

  return {
    result,
    visitedNodes,
    currentNode,
    nodeStates,
  };
}

export function useInorderTraversal() {
  const [root, setRoot] = useState<TreeNode>(() => createSampleTree());
  const [selectedPreset, setSelectedPreset] = useState<TreePresetKey>("complete");
  const [customNodePositions, setCustomNodePositions] = useState<Record<number, NodePosition>>({});

  const { executionSteps, initialNodeStates } = useMemo(
    () => generateInorderExecutionSteps(root),
    [root],
  );

  const [currentStep, setCurrentStep] = useState(0);

  const projectedState = useMemo(
    () => projectStateForStep(currentStep, executionSteps, initialNodeStates),
    [currentStep, executionSteps, initialNodeStates],
  );

  const nextStep = useCallback(() => {
    setCurrentStep((previous) =>
      previous < executionSteps.length ? previous + 1 : previous,
    );
  }, [executionSteps.length]);

  const previousStep = useCallback(() => {
    setCurrentStep((previous) => (previous > 0 ? previous - 1 : previous));
  }, []);

  const resetTraversal = useCallback(() => {
    setCurrentStep(0);
  }, []);

  const goToFirst = useCallback(() => {
    setCurrentStep(0);
  }, []);

  const goToLast = useCallback(() => {
    setCurrentStep(executionSteps.length);
  }, [executionSteps.length]);

  const applyTreeConfiguration = useCallback(
    (
      nextRoot: TreeNode,
      nextPositions: Record<number, NodePosition>,
      preset: TreePresetKey,
      runImmediately = false,
    ) => {
      const clonedRoot = cloneTree(nextRoot);
      if (!clonedRoot) {
        return;
      }

      setRoot(clonedRoot);
      setCustomNodePositions({ ...nextPositions });
      setSelectedPreset(preset);
      setCurrentStep(runImmediately ? 1 : 0);
    },
    [],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        nextStep();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        previousStep();
      }

      if (event.key.toLowerCase() === "r") {
        event.preventDefault();
        resetTraversal();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [nextStep, previousStep, resetTraversal]);

  const activeStep = executionSteps[currentStep];
  const executedStep = currentStep > 0 ? executionSteps[currentStep - 1] : undefined;
  const displayStep = executedStep ?? activeStep;

  return {
    root,
    selectedPreset,
    presets: INORDER_TREE_PRESETS,
    customNodePositions,
    executionSteps,
    totalSteps: executionSteps.length,
    currentStep,
    currentNode: projectedState.currentNode,
    result: projectedState.result,
    visitedNodes: projectedState.visitedNodes,
    nodeStates: projectedState.nodeStates,
    currentOperation: displayStep?.operation ?? "Waiting...",
    currentPhase: getPhaseLabel(displayStep),
    currentCodeLine: getCodeLineForStep(displayStep),
    operationBadge: getOperationBadge(displayStep),
    activeStep,
    executedStep,
    activeCallStack: executedStep?.callStack ?? [],
    isAtStart: currentStep === 0,
    isAtEnd: currentStep === executionSteps.length,
    nextStep,
    previousStep,
    resetTraversal,
    goToFirst,
    goToLast,
    applyTreeConfiguration,
  };
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createSampleTree } from "./constants";
import { generatePostorderExecutionSteps } from "./engine";
import { getCodeLineForStep, getOperationBadge, getPhaseLabel } from "./selectors";
import type { ExecutionStep, NodeVisualState } from "./types";

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

export function usePostorderTraversal() {
  const root = useMemo(() => createSampleTree(), []);
  const { executionSteps, initialNodeStates } = useMemo(
    () => generatePostorderExecutionSteps(root),
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

  return {
    root,
    executionSteps,
    totalSteps: executionSteps.length,
    currentStep,
    currentNode: projectedState.currentNode,
    result: projectedState.result,
    visitedNodes: projectedState.visitedNodes,
    nodeStates: projectedState.nodeStates,
    currentOperation: activeStep?.operation ?? "Waiting...",
    currentPhase: getPhaseLabel(activeStep),
    currentCodeLine: getCodeLineForStep(activeStep),
    operationBadge: getOperationBadge(activeStep),
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
  };
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ROOT_TO_NODE_TREE_PRESETS, cloneTree, createSampleTree } from "./constants";
import { generateRootToNodeExecutionSteps } from "./engine";
import { getCodeLineForStep, getOperationBadge, getPhaseLabel } from "./selectors";
import { useTraversalKeyboardShortcuts } from "../shared/useTraversalKeyboardShortcuts";
import type {
  ExecutionStep,
  NodePosition,
  NodeVisualState,
  TreeNode,
  TreePresetKey,
} from "./types";

interface StepProjection {
  result: number[];
  found: boolean;
  visitedNodes: Set<number>;
  currentNode: number | null;
  nodeStates: Record<number, NodeVisualState>;
}

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
): StepProjection {
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
      result = [...step.pathSnapshot];
      visitedNodes.add(step.value);
    }

    if (step.type === "found_target") {
      result = [...step.pathSnapshot];
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

    if (step.type === "exit_function" && step.found) {
      found = true;
      result = [...step.pathSnapshot];
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
  const [selectedPreset, setSelectedPreset] = useState<TreePresetKey>("complete");
  const [customNodePositions, setCustomNodePositions] = useState<Record<number, NodePosition>>({});
  const [controlMode, setControlModeState] = useState<"manual" | "auto">("manual");
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlaySpeedMs, setAutoPlaySpeedMs] = useState(900);

  const { executionSteps, initialNodeStates } = useMemo(
    () => generateRootToNodeExecutionSteps(root, targetValue),
    [root, targetValue],
  );

  const nodeValues = useMemo(() => {
    const values: number[] = [];
    collectNodeValues(root, values);
    return Array.from(new Set(values)).sort((a, b) => a - b);
  }, [root]);

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
    setIsPlaying(false);
  }, []);

  const setControlMode = useCallback((mode: "manual" | "auto") => {
    setControlModeState(mode);
    if (mode === "manual") {
      setIsPlaying(false);
    }
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
      const values: number[] = [];
      collectNodeValues(clonedRoot, values);
      const hasTarget = values.includes(targetValue);
      if (!hasTarget && values.length > 0) {
        setTargetValue(values[0]);
      }
      setCurrentStep(runImmediately ? 1 : 0);
      setIsPlaying(false);
    },
    [targetValue],
  );

  const playTraversal = useCallback(() => {
    if (currentStep >= executionSteps.length) {
      return;
    }

    setIsPlaying(true);
  }, [currentStep, executionSteps.length]);

  const pauseTraversal = useCallback(() => {
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (controlMode !== "auto" || !isPlaying || currentStep >= executionSteps.length) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setCurrentStep((previous) =>
        previous < executionSteps.length ? previous + 1 : previous,
      );
    }, autoPlaySpeedMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [controlMode, isPlaying, currentStep, executionSteps.length, autoPlaySpeedMs]);

  useTraversalKeyboardShortcuts({ nextStep, previousStep, resetTraversal });

  const activeStep = executionSteps[currentStep];
  const executedStep = currentStep > 0 ? executionSteps[currentStep - 1] : undefined;
  const displayStep = executedStep ?? activeStep;
  const isAutoPlaying =
    controlMode === "auto" && isPlaying && currentStep < executionSteps.length;

  return {
    root,
    selectedPreset,
    presets: ROOT_TO_NODE_TREE_PRESETS,
    customNodePositions,
    executionSteps,
    totalSteps: executionSteps.length,
    currentStep,
    currentNode: projectedState.currentNode,
    result: projectedState.result,
    found: projectedState.found,
    targetValue,
    setTargetValue,
    nodeValues,
    visitedNodes: projectedState.visitedNodes,
    nodeStates: projectedState.nodeStates,
    currentOperation: displayStep?.operation ?? "Ready to search path...",
    currentPhase: getPhaseLabel(displayStep),
    currentCodeLine: getCodeLineForStep(displayStep),
    operationBadge: getOperationBadge(displayStep),
    activeStep,
    executedStep,
    activeCallStack: executedStep?.callStack ?? [],
    isAtStart: currentStep === 0,
    isAtEnd: currentStep === executionSteps.length,
    controlMode,
    setControlMode,
    isPlaying: isAutoPlaying,
    autoPlaySpeedMs,
    setAutoPlaySpeedMs,
    playTraversal,
    pauseTraversal,
    nextStep,
    previousStep,
    resetTraversal,
    goToFirst,
    goToLast,
    applyTreeConfiguration,
  };
}



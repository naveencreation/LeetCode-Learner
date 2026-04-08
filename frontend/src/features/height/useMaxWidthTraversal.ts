"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { HEIGHT_TREE_PRESETS, cloneTree, createSampleTree } from "./constants";
import { generateHeightExecutionSteps } from "./engine";
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
  maxHeight: number;
  visitedNodes: Set<number>;
  currentNode: number | null;
  currentDepth: number | null;
  currentComputedHeight: number;
  computedHeights: Array<{ node: number; height: number }>;
  nodeStates: Record<number, NodeVisualState>;
}

function projectStateForStep(
  currentStep: number,
  executionSteps: ExecutionStep[],
  initialNodeStates: Record<number, NodeVisualState>,
): StepProjection {
  if (currentStep <= 0) {
    return {
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
  const [root, setRoot] = useState<TreeNode | null>(() => createSampleTree());
  const [selectedPreset, setSelectedPreset] = useState<TreePresetKey>("complete");
  const [customNodePositions, setCustomNodePositions] = useState<Record<number, NodePosition>>({});
  const [controlMode, setControlModeState] = useState<"manual" | "auto">("manual");
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlaySpeedMs, setAutoPlaySpeedMs] = useState(900);

  const { executionSteps, initialNodeStates } = useMemo(
    () => generateHeightExecutionSteps(root),
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
    setIsPlaying(false);
  }, []);

  const setControlMode = useCallback((mode: "manual" | "auto") => {
    setControlModeState(mode);
    if (mode === "manual") {
      setIsPlaying(false);
    }
  }, []);

  const applyTreeConfiguration = useCallback(
    (
      nextRoot: TreeNode | null,
      nextPositions: Record<number, NodePosition>,
      preset: TreePresetKey,
      runImmediately = false,
    ) => {
      const clonedRoot = cloneTree(nextRoot);
      setRoot(clonedRoot);
      setCustomNodePositions({ ...nextPositions });
      setSelectedPreset(preset);
      setCurrentStep(runImmediately ? 1 : 0);
      setIsPlaying(false);
    },
    [],
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
    presets: HEIGHT_TREE_PRESETS,
    customNodePositions,
    executionSteps,
    totalSteps: executionSteps.length,
    currentStep,
    currentNode: projectedState.currentNode,
    currentDepth: projectedState.currentDepth,
    currentComputedHeight: projectedState.currentComputedHeight,
    result: projectedState.computedHeights,
    maxHeight: projectedState.maxHeight,
    visitedNodes: projectedState.visitedNodes,
    nodeStates: projectedState.nodeStates,
    currentOperation:
      displayStep?.operation ?? "Ready to begin height traversal...",
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
    applyTreeConfiguration,
  };
}

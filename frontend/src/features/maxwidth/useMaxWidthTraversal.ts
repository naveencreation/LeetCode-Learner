"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MAX_WIDTH_TREE_PRESETS, cloneTree, createSampleTree } from "./constants";
import { generateMaxWidthExecutionSteps } from "./engine";
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
  levelWidths: number[];
  maxWidth: number;
  visitedNodes: Set<number>;
  currentNode: number | null;
  currentLevel: number | null;
  currentWidth: number;
  nodeStates: Record<number, NodeVisualState>;
}

function projectStateForStep(
  currentStep: number,
  executionSteps: ExecutionStep[],
  initialNodeStates: Record<number, NodeVisualState>,
): StepProjection {
  if (currentStep <= 0) {
    return {
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
  const [root, setRoot] = useState<TreeNode | null>(() => createSampleTree());
  const [selectedPreset, setSelectedPreset] = useState<TreePresetKey>("complete");
  const [customNodePositions, setCustomNodePositions] = useState<Record<number, NodePosition>>({});
  const [controlMode, setControlModeState] = useState<"manual" | "auto">("manual");
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlaySpeedMs, setAutoPlaySpeedMs] = useState(900);

  const { executionSteps, initialNodeStates } = useMemo(
    () => generateMaxWidthExecutionSteps(root),
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
    presets: MAX_WIDTH_TREE_PRESETS,
    customNodePositions,
    executionSteps,
    totalSteps: executionSteps.length,
    currentStep,
    currentNode: projectedState.currentNode,
    currentLevel: projectedState.currentLevel,
    currentWidth: projectedState.currentWidth,
    result: projectedState.levelWidths,
    maxWidth: projectedState.maxWidth,
    visitedNodes: projectedState.visitedNodes,
    nodeStates: projectedState.nodeStates,
    currentOperation:
      displayStep?.operation ?? "Ready to begin max-width traversal...",
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

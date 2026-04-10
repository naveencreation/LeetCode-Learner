"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTraversalKeyboardShortcuts } from "./useTraversalKeyboardShortcuts";
import type { TreeNode, NodePosition, NodeVisualState } from "./types";

// Generic step projection logic (algorithm-agnostic)
export interface StepProjection {
  result: unknown;
  visitedNodes: Set<number>;
  currentNode: number | null;
  nodeStates: Record<number, NodeVisualState>;
}

export interface GenericTraversalConfig<TStep, TPresetKey extends string> {
  // Algorithm-specific functions
  generateSteps: (root: TreeNode | null) => {
    executionSteps: TStep[];
    initialNodeStates: Record<number, NodeVisualState>;
  };
  
  presets: Record<TPresetKey, { label: string; create: () => TreeNode | null }>;
  cloneTree: (tree: TreeNode | null) => TreeNode | null;
  createSampleTree: () => TreeNode | null;
  
  // Selector functions (extract data from step)
  getCodeLineForStep: (step: TStep | undefined) => number;
  getOperationBadge: (step: TStep | undefined) => string;
  getPhaseLabel: (step: TStep | undefined) => string;
  
  // State projection for current step
  projectStateForStep: (
    currentStep: number,
    executionSteps: TStep[],
    initialNodeStates: Record<number, NodeVisualState>,
  ) => StepProjection;
}

export function useGenericTraversal<TStep, TPresetKey extends string>(
  config: GenericTraversalConfig<TStep, TPresetKey>,
) {
  const [root, setRoot] = useState<TreeNode | null>(() => config.createSampleTree());
  const [selectedPreset, setSelectedPreset] = useState<TPresetKey>(
    Object.keys(config.presets)[0] as TPresetKey,
  );
  const [customNodePositions, setCustomNodePositions] = useState<Record<number, NodePosition>>({});
  const [controlMode, setControlModeState] = useState<"manual" | "auto">("manual");
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlaySpeedMs, setAutoPlaySpeedMs] = useState(900);

  // Generate execution steps based on current tree
  const { executionSteps, initialNodeStates } = useMemo(
    () => config.generateSteps(root),
    [root, config],
  );

  const [currentStep, setCurrentStep] = useState(0);

  // Project state for current step
  const projectedState = useMemo(
    () => config.projectStateForStep(currentStep, executionSteps, initialNodeStates),
    [currentStep, executionSteps, initialNodeStates, config],
  );

  // Step navigation
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

  const goToFirst = useCallback(() => {
    setCurrentStep(0);
  }, []);

  const goToLast = useCallback(() => {
    setCurrentStep(executionSteps.length);
  }, [executionSteps.length]);

  // Playback control
  const setControlMode = useCallback((mode: "manual" | "auto") => {
    setControlModeState(mode);
    if (mode === "manual") {
      setIsPlaying(false);
    }
  }, []);

  const playTraversal = useCallback(() => {
    if (currentStep >= executionSteps.length) {
      return;
    }
    setIsPlaying(true);
  }, [currentStep, executionSteps.length]);

  const pauseTraversal = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // Auto-play interval
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

  // Keyboard shortcuts
  useTraversalKeyboardShortcuts({ nextStep, previousStep, resetTraversal });

  // Calculate display values
  const activeStep = executionSteps[currentStep];
  const executedStep = currentStep > 0 ? executionSteps[currentStep - 1] : undefined;
  const displayStep = executedStep ?? activeStep;
  const isAutoPlaying =
    controlMode === "auto" && isPlaying && currentStep < executionSteps.length;

  // Tree configuration
  const applyTreeConfiguration = useCallback(
    (
      nextRoot: TreeNode | null,
      nextPositions: Record<number, NodePosition>,
      preset: TPresetKey,
      runImmediately = false,
    ) => {
      const clonedRoot = config.cloneTree(nextRoot);
      setRoot(clonedRoot);
      setCustomNodePositions({ ...nextPositions });
      setSelectedPreset(preset);
      setCurrentStep(runImmediately ? 1 : 0);
      setIsPlaying(false);
    },
    [config],
  );

  return {
    // State
    root,
    selectedPreset,
    presets: config.presets,
    customNodePositions,
    executionSteps,
    totalSteps: executionSteps.length,
    currentStep,
    currentNode: projectedState.currentNode,
    result: projectedState.result,
    visitedNodes: projectedState.visitedNodes,
    nodeStates: projectedState.nodeStates,
    
    // Selectors
    currentOperation: displayStep ? config.getOperationBadge(displayStep) : "Waiting...",
    currentPhase: config.getPhaseLabel(displayStep),
    currentCodeLine: config.getCodeLineForStep(displayStep),
    operationBadge: config.getOperationBadge(displayStep),
    
    // Step details
    activeStep,
    executedStep,
    activeCallStack: (executedStep as any)?.callStack ?? [],
    isAtStart: currentStep === 0,
    isAtEnd: currentStep === executionSteps.length,
    
    // Control state
    controlMode,
    setControlMode,
    isPlaying: isAutoPlaying,
    autoPlaySpeedMs,
    setAutoPlaySpeedMs,
    
    // Control methods
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

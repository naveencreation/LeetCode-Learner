"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  SAMETREE_TREE_PRESETS,
  cloneTree,
  createSampleTrees,
} from "./constants";
import {
  getCodeLineForStep,
  getOperationBadge,
  getPhaseLabel,
} from "./selectors";
import { generateSameTreeExecutionSteps } from "./engine";
import type {
  CallStackFrame,
  ExecutionStep,
  NodePosition,
  NodeVisualState,
  TreeNode,
  TreePresetKey,
} from "./types";
import { useTraversalKeyboardShortcuts } from "../shared/useTraversalKeyboardShortcuts";

export function useSameTreeTraversal() {
  const [roots, setRoots] = useState<{ p: TreeNode | null; q: TreeNode | null }>(() =>
    createSampleTrees(),
  );
  const [selectedPreset, setSelectedPreset] = useState<TreePresetKey>("same_trees");
  const [customNodePositionsP, setCustomNodePositionsP] = useState<Record<number, NodePosition>>({});
  const [customNodePositionsQ, setCustomNodePositionsQ] = useState<Record<number, NodePosition>>({});

  const [controlMode, setControlModeState] = useState<"manual" | "auto">("manual");
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlaySpeedMs, setAutoPlaySpeedMs] = useState(900);
  const [currentStep, setCurrentStep] = useState(0);

  const { executionSteps, initialNodeStatesP, initialNodeStatesQ } = useMemo(
    () => generateSameTreeExecutionSteps(roots.p, roots.q),
    [roots],
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

    return () => window.clearInterval(intervalId);
  }, [controlMode, isPlaying, currentStep, executionSteps.length, autoPlaySpeedMs]);

  useTraversalKeyboardShortcuts({ nextStep, previousStep, resetTraversal });

  const activeStep = executionSteps[currentStep];
  const executedStep = currentStep > 0 ? executionSteps[currentStep - 1] : undefined;
  const displayStep = executedStep ?? activeStep;
  const isAutoPlaying =
    controlMode === "auto" && isPlaying && currentStep < executionSteps.length;

  const currentNodeP = displayStep?.valueP ?? null;
  const currentNodeQ = displayStep?.valueQ ?? null;
  const currentOperation = displayStep ? displayStep.operation : "Waiting...";
  const currentPhase = getPhaseLabel(displayStep);
  const currentCodeLine = getCodeLineForStep(displayStep);
  const operationBadge = getOperationBadge(displayStep);

  const nodeStatesP: Record<string, NodeVisualState> =
    displayStep?.nodeStatesP ?? initialNodeStatesP;
  const nodeStatesQ: Record<string, NodeVisualState> =
    displayStep?.nodeStatesQ ?? initialNodeStatesQ;

  const result =
    currentStep === 0
      ? null
      : (executionSteps[currentStep - 1]?.isMatch ?? null);

  const applyTreeConfiguration = useCallback(
    (
      nextP: TreeNode | null,
      nextQ: TreeNode | null,
      nextPositionsP: Record<number, NodePosition>,
      nextPositionsQ: Record<number, NodePosition>,
      preset: TreePresetKey,
      runImmediately = false,
    ) => {
      setRoots({ p: cloneTree(nextP), q: cloneTree(nextQ) });
      setCustomNodePositionsP({ ...nextPositionsP });
      setCustomNodePositionsQ({ ...nextPositionsQ });
      setSelectedPreset(preset);
      setCurrentStep(runImmediately ? 1 : 0);
      setIsPlaying(false);
    },
    [],
  );

  return {
    rootP: roots.p,
    rootQ: roots.q,
    selectedPreset,
    presets: SAMETREE_TREE_PRESETS,
    customNodePositionsP,
    customNodePositionsQ,
    executionSteps,
    totalSteps: executionSteps.length,
    currentStep,
    result,
    currentNodeP,
    currentNodeQ,
    nodeStatesP,
    nodeStatesQ,
    currentOperation,
    currentPhase,
    currentCodeLine,
    operationBadge,
    activeStep,
    executedStep,
    activeCallStack: (executedStep?.callStack ?? []) as CallStackFrame[],
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

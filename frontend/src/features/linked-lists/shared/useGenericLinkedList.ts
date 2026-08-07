"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTraversalKeyboardShortcuts } from "./useTraversalKeyboardShortcuts";
import type {
  ListNode,
  LinkedListPresetKey,
  LinkedListPreset,
  LinkedListNodeState,
} from "./linked-list-types";
import { cloneLinkedList } from "./linked-list-types";

export interface LinkedListStepProjection<TStep> {
  nodeStates: Record<number, LinkedListNodeState>;
  displayStep: TStep | undefined;
  executedStep: TStep | undefined;
}

export interface GenericLinkedListConfig<TStep> {
  generateSteps: (head: ListNode | null) => {
    executionSteps: TStep[];
    initialNodeStates: Record<number, LinkedListNodeState>;
    originalValues: number[];
  };

  presets: Record<LinkedListPresetKey, LinkedListPreset>;
  createSampleList: () => ListNode | null;

  getCodeLineForStep: (step: TStep | undefined) => number;
  getOperationBadge: (step: TStep | undefined) => string;
  getPhaseLabel: (step: TStep | undefined) => string;

  getNodeStatesForStep: (
    currentStep: number,
    executionSteps: TStep[],
    initialNodeStates: Record<number, LinkedListNodeState>,
  ) => Record<number, LinkedListNodeState>;
}

export function useGenericLinkedList<TStep>(
  config: GenericLinkedListConfig<TStep>,
) {
  const [head, setHead] = useState<ListNode | null>(() => config.createSampleList());
  const [selectedPreset, setSelectedPreset] = useState<LinkedListPresetKey>("medium");
  const [controlMode, setControlModeState] = useState<"manual" | "auto">("manual");
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlaySpeedMs, setAutoPlaySpeedMs] = useState(900);

  const { executionSteps, initialNodeStates, originalValues } = useMemo(
    () => config.generateSteps(head),
    [head, config],
  );

  const [currentStep, setCurrentStep] = useState(0);

  const nodeStates = useMemo(
    () => config.getNodeStatesForStep(currentStep, executionSteps, initialNodeStates),
    [currentStep, executionSteps, initialNodeStates, config],
  );

  // Step navigation
  const nextStep = useCallback(() => {
    setCurrentStep((p) => (p < executionSteps.length ? p + 1 : p));
  }, [executionSteps.length]);

  const previousStep = useCallback(() => {
    setCurrentStep((p) => (p > 0 ? p - 1 : p));
  }, []);

  const resetTraversal = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  const goToFirst = useCallback(() => setCurrentStep(0), []);
  const goToLast = useCallback(() => setCurrentStep(executionSteps.length), [executionSteps.length]);

  const setControlMode = useCallback((mode: "manual" | "auto") => {
    setControlModeState(mode);
    if (mode === "manual") setIsPlaying(false);
  }, []);

  const playTraversal = useCallback(() => {
    if (currentStep >= executionSteps.length) return;
    setIsPlaying(true);
  }, [currentStep, executionSteps.length]);

  const pauseTraversal = useCallback(() => setIsPlaying(false), []);

  // Auto-play
  useEffect(() => {
    if (controlMode !== "auto" || !isPlaying || currentStep >= executionSteps.length) return;
    const id = window.setInterval(() => {
      setCurrentStep((p) => (p < executionSteps.length ? p + 1 : p));
    }, autoPlaySpeedMs);
    return () => window.clearInterval(id);
  }, [controlMode, isPlaying, currentStep, executionSteps.length, autoPlaySpeedMs]);

  useTraversalKeyboardShortcuts({ nextStep, previousStep, resetTraversal });

  const activeStep = executionSteps[currentStep] as TStep | undefined;
  const executedStep = currentStep > 0 ? executionSteps[currentStep - 1] : undefined;
  const displayStep = executedStep ?? activeStep;
  const isAutoPlaying = controlMode === "auto" && isPlaying && currentStep < executionSteps.length;

  const applyListConfiguration = useCallback(
    (nextHead: ListNode | null, preset: LinkedListPresetKey, runImmediately = false) => {
      setHead(cloneLinkedList(nextHead));
      setSelectedPreset(preset);
      setCurrentStep(runImmediately ? 1 : 0);
      setIsPlaying(false);
    },
    [],
  );

  return {
    head,
    selectedPreset,
    isCustomPreset: selectedPreset === "custom",
    presets: config.presets,
    originalValues,
    executionSteps,
    totalSteps: executionSteps.length,
    currentStep,
    nodeStates,

    currentOperation: displayStep ? config.getOperationBadge(displayStep) : "Waiting...",
    currentPhase: config.getPhaseLabel(displayStep),
    currentCodeLine: config.getCodeLineForStep(displayStep),

    activeStep,
    executedStep,
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
    applyListConfiguration,
  };
}

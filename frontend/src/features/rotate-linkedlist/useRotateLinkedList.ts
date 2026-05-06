"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTraversalKeyboardShortcuts } from "@/features/shared/useTraversalKeyboardShortcuts";
import { cloneLinkedList, linkedListPresets, createLinkedList, type ListNode, type LinkedListNodeState, type LinkedListPresetKey } from "@/features/shared/linked-list-types";
import { generateRotateSteps } from "./engine";
import { getPhaseLabel, getCodeLineForStep, getOperationBadge } from "./selectors";
import type { ExecutionStep } from "./types";

export function useRotateLinkedList() {
  const [head, setHead] = useState<ListNode | null>(() => createLinkedList([1, 2, 3, 4, 5]));
  const [selectedPreset, setSelectedPreset] = useState<LinkedListPresetKey>("medium");
  const [controlMode, setControlModeState] = useState<"manual" | "auto">("manual");
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlaySpeedMs, setAutoPlaySpeedMs] = useState(900);
  const [rotateK, setRotateK] = useState(2);

  const { executionSteps, initialNodeStates, originalValues } = useMemo(
    () => generateRotateSteps(head, rotateK),
    [head, rotateK],
  );

  const [currentStep, setCurrentStep] = useState(0);

  const nodeStates = useMemo(() => {
    if (currentStep === 0) return { ...initialNodeStates };
    const stepIndex = Math.min(currentStep, executionSteps.length) - 1;
    return { ...executionSteps[stepIndex].nodeStates };
  }, [currentStep, executionSteps, initialNodeStates]);

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

  const setControlMode = useCallback((mode: "manual" | "auto") => {
    setControlModeState(mode);
    if (mode === "manual") setIsPlaying(false);
  }, []);

  const playTraversal = useCallback(() => {
    if (currentStep >= executionSteps.length) return;
    setIsPlaying(true);
  }, [currentStep, executionSteps.length]);

  const pauseTraversal = useCallback(() => setIsPlaying(false), []);

  useEffect(() => {
    if (controlMode !== "auto" || !isPlaying || currentStep >= executionSteps.length) return;
    const id = window.setInterval(() => {
      setCurrentStep((p) => (p < executionSteps.length ? p + 1 : p));
    }, autoPlaySpeedMs);
    return () => window.clearInterval(id);
  }, [controlMode, isPlaying, currentStep, executionSteps.length, autoPlaySpeedMs]);

  useTraversalKeyboardShortcuts({ nextStep, previousStep, resetTraversal });

  const activeStep = executionSteps[currentStep] as ExecutionStep | undefined;
  const executedStep = currentStep > 0 ? executionSteps[currentStep - 1] : undefined;
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

  const displayStep = executedStep ?? activeStep;

  return {
    head,
    selectedPreset,
    originalValues,
    executionSteps,
    totalSteps: executionSteps.length,
    currentStep,
    nodeStates,

    currentOperation: displayStep ? getOperationBadge(displayStep) : "Waiting...",
    currentPhase: getPhaseLabel(displayStep),
    currentCodeLine: getCodeLineForStep(displayStep),

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

    rotateK,
    setRotateK,
    applyListConfiguration,
  };
}

"use client";

import { useMemo, useState } from "react";
import type { ListNode, LinkedListNodeState } from "../shared/linked-list-types";
import { linkedListPresets, createLinkedList } from "../shared/linked-list-types";
import { generateMergeSteps } from "./engine";
import { getCodeLineForStep, getOperationBadge, getPhaseLabel } from "./selectors";
import type { ExecutionStep } from "./types";

// Custom hook for merge problem (handles two lists)
export function useMergeSortedLists() {
  const [list1, setList1] = useState<ListNode | null>(() => createLinkedList([1, 3, 5]));
  const [list2, setList2] = useState<ListNode | null>(() => createLinkedList([2, 4, 6]));
  const [selectedPreset1, setSelectedPreset1] = useState<string>("medium");
  const [selectedPreset2, setSelectedPreset2] = useState<string>("medium");
  const [currentStep, setCurrentStep] = useState(0);
  const [controlMode, setControlModeState] = useState<"manual" | "auto">("manual");
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlaySpeedMs, setAutoPlaySpeedMs] = useState(900);

  const { executionSteps, initialNodeStates, originalValues1, originalValues2 } = useMemo(
    () => generateMergeSteps(list1, list2),
    [list1, list2],
  );

  const nodeStates = useMemo(() => {
    if (currentStep === 0 || executionSteps.length === 0) {
      return { ...initialNodeStates };
    }
    const stepIndex = Math.min(currentStep, executionSteps.length) - 1;
    return { ...executionSteps[stepIndex].nodeStates };
  }, [currentStep, executionSteps, initialNodeStates]);

  const nextStep = () => setCurrentStep((p) => (p < executionSteps.length ? p + 1 : p));
  const previousStep = () => setCurrentStep((p) => (p > 0 ? p - 1 : p));
  const resetTraversal = () => { setCurrentStep(0); setIsPlaying(false); };

  const setControlMode = (mode: "manual" | "auto") => {
    setControlModeState(mode);
    if (mode === "manual") setIsPlaying(false);
  };

  const playTraversal = () => { if (currentStep < executionSteps.length) setIsPlaying(true); };
  const pauseTraversal = () => setIsPlaying(false);

  // Auto-play
  useMemo(() => {
    if (controlMode !== "auto" || !isPlaying || currentStep >= executionSteps.length) return;
    const id = window.setInterval(() => {
      setCurrentStep((p) => (p < executionSteps.length ? p + 1 : p));
    }, autoPlaySpeedMs);
    return () => window.clearInterval(id);
  }, [controlMode, isPlaying, currentStep, executionSteps.length, autoPlaySpeedMs]);

  const activeStep = executionSteps[currentStep];
  const executedStep = currentStep > 0 ? executionSteps[currentStep - 1] : undefined;
  const displayStep = executedStep ?? activeStep;

  const applyListConfiguration = (
    newList1: ListNode | null,
    newList2: ListNode | null,
    preset1: string,
    preset2: string,
    runImmediately = false,
  ) => {
    setList1(newList1);
    setList2(newList2);
    setSelectedPreset1(preset1);
    setSelectedPreset2(preset2);
    setCurrentStep(runImmediately ? 1 : 0);
    setIsPlaying(false);
  };

  return {
    list1,
    list2,
    selectedPreset1,
    selectedPreset2,
    executionSteps,
    totalSteps: executionSteps.length,
    currentStep,
    originalValues1,
    originalValues2,
    nodeStates,
    currentOperation: displayStep ? getOperationBadge(displayStep) : "Waiting...",
    currentPhase: displayStep ? getPhaseLabel(displayStep) : "Ready",
    currentCodeLine: displayStep ? getCodeLineForStep(displayStep) : 0,
    activeStep,
    executedStep,
    isAtStart: currentStep === 0,
    isAtEnd: currentStep === executionSteps.length,
    controlMode,
    setControlMode,
    isPlaying: controlMode === "auto" && isPlaying && currentStep < executionSteps.length,
    autoPlaySpeedMs,
    setAutoPlaySpeedMs,
    playTraversal,
    pauseTraversal,
    nextStep,
    previousStep,
    resetTraversal,
    applyListConfiguration,
  };
}

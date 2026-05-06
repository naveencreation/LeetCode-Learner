"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createLinkedList, type ListNode } from "@/features/shared/linked-list-types";
import { generateAddTwoNumbersSteps } from "./engine";
import { getCodeLineForStep, getOperationBadge, getPhaseLabel } from "./selectors";
import type { ExecutionStep, ListData } from "./types";

export function useAddTwoNumbers() {
  // Default lists: [2,4,3] and [5,6,4] -> [7,0,8]
  const [list1, setList1] = useState<ListNode | null>(() => createLinkedList([2, 4, 3]));
  const [list2, setList2] = useState<ListNode | null>(() => createLinkedList([5, 6, 4]));
  const [currentStep, setCurrentStep] = useState(0);
  const [controlMode, setControlModeState] = useState<"manual" | "auto">("manual");
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlaySpeedMs, setAutoPlaySpeedMs] = useState(900);

  const { executionSteps, list1: list1Data, list2: list2Data } = useMemo(
    () => generateAddTwoNumbersSteps(list1, list2),
    [list1, list2],
  );

  const [isListSetupOpen, setIsListSetupOpen] = useState(false);

  const activeStep = executionSteps[currentStep];
  const executedStep = currentStep > 0 ? executionSteps[currentStep - 1] : undefined;
  const displayStep = executedStep ?? activeStep;
  const totalSteps = executionSteps.length;

  const stepNavigation = {
    nextStep: useCallback(() => {
      setCurrentStep((p) => (p < totalSteps ? p + 1 : p));
    }, [totalSteps]),
    previousStep: useCallback(() => {
      setCurrentStep((p) => (p > 0 ? p - 1 : p));
    }, []),
    resetTraversal: useCallback(() => {
      setCurrentStep(0);
      setIsPlaying(false);
    }, []),
    goToFirst: useCallback(() => setCurrentStep(0), []),
    goToLast: useCallback(() => setCurrentStep(totalSteps), [totalSteps]),
  };

  const setControlMode = useCallback((mode: "manual" | "auto") => {
    setControlModeState(mode);
    if (mode === "manual") setIsPlaying(false);
  }, []);

  const playTraversal = useCallback(() => {
    if (currentStep >= totalSteps) return;
    setIsPlaying(true);
  }, [currentStep, totalSteps]);

  const pauseTraversal = useCallback(() => setIsPlaying(false), []);

  // Auto-play
  useEffect(() => {
    if (controlMode !== "auto" || !isPlaying || currentStep >= totalSteps) return;
    const id = window.setInterval(() => {
      setCurrentStep((p) => (p < totalSteps ? p + 1 : p));
    }, autoPlaySpeedMs);
    return () => window.clearInterval(id);
  }, [controlMode, isPlaying, currentStep, totalSteps, autoPlaySpeedMs]);

  const applyListConfiguration = useCallback(
    (newList1: ListNode | null, newList2: ListNode | null, runImmediately = false) => {
      setList1(newList1);
      setList2(newList2);
      setCurrentStep(runImmediately ? 1 : 0);
      setIsPlaying(false);
    },
    [],
  );

  return {
    list1,
    list2,
    list1Data,
    list2Data,
    executionSteps,
    currentStep,
    totalSteps,
    currentCodeLine: displayStep ? getCodeLineForStep(displayStep) : 1,
    currentOperation: displayStep ? getOperationBadge(displayStep) : "READY",
    currentPhase: displayStep ? getPhaseLabel(displayStep) : "Ready",
    activeStep,
    executedStep,
    displayStep,
    isAtStart: currentStep === 0,
    isAtEnd: currentStep === totalSteps,
    controlMode,
    setControlMode,
    isPlaying,
    autoPlaySpeedMs,
    setAutoPlaySpeedMs,
    playTraversal,
    pauseTraversal,
    nextStep: stepNavigation.nextStep,
    previousStep: stepNavigation.previousStep,
    resetTraversal: stepNavigation.resetTraversal,
    goToFirst: stepNavigation.goToFirst,
    goToLast: stepNavigation.goToLast,
    applyListConfiguration,
    isListSetupOpen,
    setIsListSetupOpen,
  };
}

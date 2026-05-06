"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createLinkedList, type ListNode } from "@/features/shared/linked-list-types";
import { generateFindIntersectionSteps } from "./engine";
import { getCodeLineForStep, getOperationBadge, getPhaseLabel } from "./selectors";
import type { ExecutionStep } from "./types";

export function useFindIntersection() {
  // Create two lists that intersect at node 8
  // List A: 1 -> 2 -> 3 -> 4
  // List B: 5 -> 6 -> 4
  // Intersection at node 4
  const [listA, setListA] = useState<ListNode | null>(() => {
    const common = createLinkedList([4]);
    const headA = createLinkedList([1, 2, 3]);
    let curr = headA;
    while (curr?.next) curr = curr.next;
    if (curr) curr.next = common;
    return headA;
  });
  const [listB, setListB] = useState<ListNode | null>(() => {
    const common = createLinkedList([4]);
    const headB = createLinkedList([5, 6]);
    let curr = headB;
    while (curr?.next) curr = curr.next;
    if (curr) curr.next = common;
    return headB;
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [controlMode, setControlModeState] = useState<"manual" | "auto">("manual");
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlaySpeedMs, setAutoPlaySpeedMs] = useState(900);

  const { executionSteps, listA: listAData, listB: listBData } = useMemo(
    () => generateFindIntersectionSteps(listA, listB),
    [listA, listB],
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
    (newListA: ListNode | null, newListB: ListNode | null, runImmediately = false) => {
      setListA(newListA);
      setListB(newListB);
      setCurrentStep(runImmediately ? 1 : 0);
      setIsPlaying(false);
    },
    [],
  );

  return {
    listA,
    listB,
    listAData,
    listBData,
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

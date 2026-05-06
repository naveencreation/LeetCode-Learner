"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTraversalKeyboardShortcuts } from "@/features/shared/useTraversalKeyboardShortcuts";
import { createLinkedList, type ListNode, type LinkedListNodeState } from "@/features/shared/linked-list-types";
import { generateCloneSteps } from "./engine";
import { getPhaseLabel, getCodeLineForStep, getOperationBadge } from "./selectors";
import type { ExecutionStep } from "./types";

// Build a random map from a simple list node chain (random pointers ignored for simplicity)
function extractValues(head: ListNode | null): number[] {
  const values: number[] = [];
  let curr = head;
  while (curr !== null) { values.push(curr.val); curr = curr.next; }
  return values;
}

// Default random mapping: node 0 -> null, node 1 -> 0, node 2 -> null, etc.
function defaultRandomMap(n: number): Record<number, number | null> {
  const map: Record<number, number | null> = {};
  for (let i = 0; i < n; i++) map[i] = i > 0 && i % 2 === 1 ? i - 1 : null;
  return map;
}

export function useCloneLinkedList() {
  const [head, setHead] = useState<ListNode | null>(() => createLinkedList([7, 13, 11]));
  const [controlMode, setControlModeState] = useState<"manual" | "auto">("manual");
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlaySpeedMs, setAutoPlaySpeedMs] = useState(900);
  const [randomMap, setRandomMap] = useState<Record<number, number | null>>(() => defaultRandomMap(3));

  const nodeValues = useMemo(() => extractValues(head), [head]);

  const { executionSteps, initialNodeStates, originalValues } = useMemo(
    () => generateCloneSteps(nodeValues, randomMap),
    [nodeValues, randomMap],
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
    (nextHead: ListNode | null, nextRandomMap: Record<number, number | null>, runImmediately = false) => {
      setHead(nextHead);
      setRandomMap(nextRandomMap);
      setCurrentStep(runImmediately ? 1 : 0);
      setIsPlaying(false);
    },
    [],
  );

  const displayStep = executedStep ?? activeStep;

  return {
    head,
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

    randomMap,
    applyListConfiguration,
  };
}

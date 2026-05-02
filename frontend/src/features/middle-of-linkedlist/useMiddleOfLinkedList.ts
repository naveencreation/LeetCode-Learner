"use client";

import { useMemo } from "react";
import { useGenericLinkedList } from "@/features/shared/useGenericLinkedList";
import { linkedListPresets, createLinkedList, type LinkedListNodeState } from "@/features/shared/linked-list-types";
import { generateMiddleOfLinkedListSteps } from "./engine";
import { getCodeLineForStep, getOperationBadge, getPhaseLabel } from "./selectors";
import type { ExecutionStep } from "./types";

export function useMiddleOfLinkedList() {
  const config = useMemo(
    () => ({
      generateSteps: generateMiddleOfLinkedListSteps,
      presets: linkedListPresets,
      createSampleList: () => createLinkedList([1, 2, 3, 4, 5]),
      getCodeLineForStep,
      getOperationBadge,
      getPhaseLabel,
      getNodeStatesForStep: (
        currentStep: number,
        executionSteps: ExecutionStep[],
        initialNodeStates: Record<number, LinkedListNodeState>,
      ) => {
        if (currentStep === 0) return { ...initialNodeStates };
        const stepIndex = Math.min(currentStep, executionSteps.length) - 1;
        return { ...executionSteps[stepIndex].nodeStates };
      },
    }),
    [],
  );

  return useGenericLinkedList(config);
}

"use client";

import { useMemo } from "react";
import { useGenericLinkedList } from "@/features/shared/useGenericLinkedList";
import { linkedListPresets, createLinkedListWithCycle, type ListNode, type LinkedListNodeState } from "@/features/shared/linked-list-types";
import { generateLoopStartSteps } from "./engine";
import { getCodeLineForStep, getOperationBadge, getPhaseLabel } from "./selectors";
import type { ExecutionStep } from "./types";

export function useLoopStart() {
  const config = useMemo(
    () => ({
      generateSteps: (head: ListNode | null) => generateLoopStartSteps(head),
      presets: linkedListPresets,
      createSampleList: () => createLinkedListWithCycle([1, 2, 3, 4, 5, 6], 2),
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

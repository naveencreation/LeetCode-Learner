"use client";

import { useMemo } from "react";
import { useGenericLinkedList } from "../shared/useGenericLinkedList";
import { linkedListPresets, createLinkedList, type ListNode, type LinkedListNodeState } from "../shared/linked-list-types";
import { generateRemoveNthSteps } from "./engine";
import { getPhaseLabel, getCodeLineForStep, getOperationBadge } from "./selectors";
import type { ExecutionStep } from "./types";

export function useRemoveNthFromEnd(n: number = 2) {
  const config = useMemo(
    () => ({
      generateSteps: (head: ListNode | null) => generateRemoveNthSteps(head, n),
      presets: linkedListPresets,
      createSampleList: () => createLinkedList([1, 2, 3, 4, 5]),
      getCodeLineForStep: (step: ExecutionStep | undefined) => getCodeLineForStep(step),
      getOperationBadge: (step: ExecutionStep | undefined) => getOperationBadge(step),
      getPhaseLabel: (step: ExecutionStep | undefined) => getPhaseLabel(step),
      getNodeStatesForStep: (
        currentStep: number,
        executionSteps: ExecutionStep[],
        initialNodeStates: Record<number, LinkedListNodeState>,
      ): Record<number, LinkedListNodeState> => {
        if (currentStep === 0 || executionSteps.length === 0) {
          return { ...initialNodeStates };
        }
        const stepIndex = Math.min(currentStep, executionSteps.length) - 1;
        return { ...executionSteps[stepIndex].nodeStates };
      },
    }),
    [n],
  );

  return useGenericLinkedList(config);
}

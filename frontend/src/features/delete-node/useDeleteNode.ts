"use client";

import { useMemo } from "react";
import { useGenericLinkedList } from "@/features/shared/useGenericLinkedList";
import { linkedListPresets, createLinkedList, type LinkedListNodeState, type ListNode } from "@/features/shared/linked-list-types";
import { generateDeleteNodeSteps } from "./engine";
import { getCodeLineForStep, getOperationBadge, getPhaseLabel } from "./selectors";
import type { ExecutionStep } from "./types";

export function useDeleteNode() {
  const config = useMemo(
    () => ({
      generateSteps: (head: ListNode | null) => {
        // Default to deleting the second node (value 2) for visualization
        return generateDeleteNodeSteps(head, 2);
      },
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

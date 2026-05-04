"use client";

import { useMemo } from "react";
import { useGenericLinkedList } from "@/features/shared/useGenericLinkedList";
import { linkedListPresets, createLinkedList, type LinkedListNodeState, type ListNode, type LinkedListPresetKey } from "@/features/shared/linked-list-types";
import { generateReverseKGroupSteps } from "./engine";
import { getCodeLineForStep, getOperationBadge, getPhaseLabel } from "./selectors";
import type { ExecutionStep } from "./types";

export function useReverseKGroup(k: number = 3) {
  const config = useMemo(
    () => ({
      generateSteps: (head: ListNode | null) => generateReverseKGroupSteps(head, k),
      presets: linkedListPresets,
      createSampleList: () => createLinkedList([1, 2, 3, 4, 5, 6, 7]),
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
    [k],
  );

  return useGenericLinkedList(config);
}

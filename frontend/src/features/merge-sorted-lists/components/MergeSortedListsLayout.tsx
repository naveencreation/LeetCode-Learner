"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { LinkedListShell } from "@/features/shared/components/LinkedListShell";
import { UnifiedControlsBar } from "@/features/shared/components/UnifiedControlsBar";
import type { ListNode } from "@/features/shared/linked-list-types";

import { useMergeSortedLists } from "@/features/merge-sorted-lists/useMergeSortedLists";
import { getCodeLineForStep } from "@/features/merge-sorted-lists/selectors";
import { CodePanel } from "@/features/merge-sorted-lists/components/CodePanel";
import { LinkedListPanel } from "@/features/merge-sorted-lists/components/LinkedListPanel";
import { ResultPanel } from "@/features/merge-sorted-lists/components/ResultPanel";
import { PointerStatePanel } from "@/features/merge-sorted-lists/components/PointerStatePanel";
import { ExplanationPanel } from "@/features/merge-sorted-lists/components/ExplanationPanel";

const ListSetupModal = dynamic(() =>
  import("@/features/merge-sorted-lists/components/ListSetupModal").then((m) => m.ListSetupModal),
);

export function MergeSortedListsLayout() {
  const [isListSetupOpen, setIsListSetupOpen] = useState(false);

  const {
    currentCodeLine,
    currentOperation,
    currentPhase,
    currentStep,
    executionSteps,
    originalValues1,
    originalValues2,
    selectedPreset1,
    selectedPreset2,
    executedStep,
    activeStep,
    isAtEnd,
    isAtStart,
    controlMode,
    setControlMode,
    isPlaying,
    autoPlaySpeedMs,
    setAutoPlaySpeedMs,
    playTraversal,
    pauseTraversal,
    nextStep,
    nodeStates,
    previousStep,
    resetTraversal,
    totalSteps,
    applyListConfiguration,
  } = useMergeSortedLists();

  const executionLineNumbers = useMemo(() => {
    const lineNumbers = new Set<number>([currentCodeLine]);
    executionSteps.forEach((step) => {
      lineNumbers.add(getCodeLineForStep(step));
    });
    return Array.from(lineNumbers).sort((a, b) => a - b);
  }, [currentCodeLine, executionSteps]);

  const displayStep = executedStep ?? activeStep;

  // Compute merged count for header stat
  const mergedCount = displayStep?.mergedList.length ?? 0;

  return (
    <LinkedListShell
      title="Merge Two Sorted Lists"
      subtitle="Iterative merge with dummy node for efficient merging"
      guideHref="/problems/linked-list/merge-two-sorted-lists-guide"
      currentHref="/problems/linked-list/merge-two-sorted-lists"
      stats={[
        { label: "Step", value: `${currentStep} / ${totalSteps}` },
        { label: "Phase", value: currentPhase, minWidthClassName: "min-w-[96px]" },
        { label: "Merged", value: mergedCount.toString() },
      ]}
      left={
        <CodePanel
          currentCodeLine={currentCodeLine}
          executionLineNumbers={executionLineNumbers}
        />
      }
      middleTop={
        <LinkedListPanel
          originalValues1={originalValues1}
          originalValues2={originalValues2}
          nodeStates={nodeStates}
          activeStep={displayStep}
          currentOperation={currentOperation}
          currentStep={currentStep}
          totalSteps={totalSteps}
          currentPhase={currentPhase}
          onOpenListSetup={() => setIsListSetupOpen(true)}
        />
      }
      middleBottom={
        <ResultPanel
          mergedList={displayStep?.mergedList ?? []}
          currentPhase={currentPhase}
          currentStep={currentStep}
          totalSteps={totalSteps}
          currentOperation={currentOperation}
          activeStep={displayStep}
        />
      }
      middleFooter={
        <UnifiedControlsBar
          isAtStart={isAtStart}
          isAtEnd={isAtEnd}
          controlMode={controlMode}
          setControlMode={setControlMode}
          isPlaying={isPlaying}
          autoPlaySpeedMs={autoPlaySpeedMs}
          setAutoPlaySpeedMs={setAutoPlaySpeedMs}
          playTraversal={playTraversal}
          pauseTraversal={pauseTraversal}
          nextStep={nextStep}
          previousStep={previousStep}
          resetTraversal={resetTraversal}
        />
      }
      rightTop={
        <PointerStatePanel
          activeStep={displayStep}
        />
      }
      rightBottom={
        <ExplanationPanel
          currentStep={currentStep}
          totalSteps={totalSteps}
          activeStep={displayStep}
          currentCodeLine={currentCodeLine}
        />
      }
      modal={
        isListSetupOpen ? (
          <ListSetupModal
            selectedPreset1={selectedPreset1}
            selectedPreset2={selectedPreset2}
            currentValues1={originalValues1}
            currentValues2={originalValues2}
            onClose={() => setIsListSetupOpen(false)}
            onApply={(list1: ListNode | null, list2: ListNode | null, preset1: string, preset2: string) => {
              applyListConfiguration(list1, list2, preset1, preset2, false);
            }}
            onApplyAndRun={(list1: ListNode | null, list2: ListNode | null, preset1: string, preset2: string) => {
              applyListConfiguration(list1, list2, preset1, preset2, true);
            }}
          />
        ) : null
      }
    />
  );
}

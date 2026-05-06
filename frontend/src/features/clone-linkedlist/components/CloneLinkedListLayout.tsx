"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { LinkedListShell } from "@/features/shared/components/LinkedListShell";
import { UnifiedControlsBar } from "@/features/shared/components/UnifiedControlsBar";

import { useCloneLinkedList } from "../useCloneLinkedList";
import { getCodeLineForStep } from "../selectors";
import type { ListNode } from "@/features/shared/linked-list-types";
import { CodePanel } from "./CodePanel";
import { LinkedListPanel } from "./LinkedListPanel";
import { ResultPanel } from "./ResultPanel";
import { PointerStatePanel } from "./PointerStatePanel";
import { ExplanationPanel } from "./ExplanationPanel";

const ListSetupModal = dynamic(() =>
  import("./ListSetupModal").then((m) => m.ListSetupModal),
);

export function CloneLinkedListLayout() {
  const [isListSetupOpen, setIsListSetupOpen] = useState(false);

  const {
    originalValues,
    nodeStates,
    executionSteps,
    currentStep,
    currentCodeLine,
    currentOperation,
    currentPhase,
    activeStep,
    executedStep,
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
    previousStep,
    resetTraversal,
    totalSteps,
    applyListConfiguration,
    randomMap,
  } = useCloneLinkedList();

  const executionLineNumbers = useMemo(() => {
    const lineNumbers = new Set<number>([currentCodeLine]);
    executionSteps.forEach((step) => {
      lineNumbers.add(getCodeLineForStep(step));
    });
    return Array.from(lineNumbers).sort((a, b) => a - b);
  }, [currentCodeLine, executionSteps]);

  const displayStep = executedStep ?? activeStep;

  return (
    <LinkedListShell
      title="Clone Linked List"
      subtitle="Deep copy a linked list with next and random pointers"
      guideHref="/problems/linked-list/clone-linkedlist-guide"
      currentHref="/problems/linked-list/clone-linkedlist"
      stats={[
        { label: "Step", value: `${currentStep} / ${totalSteps}` },
        { label: "Phase", value: currentPhase, minWidthClassName: "min-w-[96px]" },
        { label: "Nodes", value: originalValues.length },
      ]}
      left={
        <CodePanel
          currentCodeLine={currentCodeLine}
          executionLineNumbers={executionLineNumbers}
        />
      }
      middleTop={
        <LinkedListPanel
          originalValues={originalValues}
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
          currentPhase={currentPhase}
          currentStep={currentStep}
          totalSteps={totalSteps}
          currentOperation={currentOperation}
          activeStep={displayStep}
          originalValues={originalValues}
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
            currentValues={originalValues}
            currentRandomMap={randomMap}
            onClose={() => setIsListSetupOpen(false)}
            onApply={(head: ListNode | null, randomMap: Record<number, number | null>) => {
              applyListConfiguration(head, randomMap, false);
            }}
            onApplyAndRun={(head: ListNode | null, randomMap: Record<number, number | null>) => {
              applyListConfiguration(head, randomMap, true);
            }}
          />
        ) : null
      }
    />
  );
}

"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { LinkedListShell } from "@/features/shared/components/LinkedListShell";
import { UnifiedControlsBar } from "@/features/shared/components/UnifiedControlsBar";

import { useMiddleOfLinkedList } from "../useMiddleOfLinkedList";
import { getCodeLineForStep } from "../selectors";
import type { ListNode } from "@/features/shared/linked-list-types";
import type { LinkedListPresetKey } from "@/features/shared/linked-list-types";
import { CodePanel } from "./CodePanel";
import { LinkedListPanel } from "./LinkedListPanel";
import { ResultPanel } from "./ResultPanel";
import { PointerStatePanel } from "./PointerStatePanel";
import { ExplanationPanel } from "./ExplanationPanel";

const ListSetupModal = dynamic(() =>
  import("./ListSetupModal").then((m) => m.ListSetupModal),
);

export function MiddleOfLinkedListLayout() {
  const [isListSetupOpen, setIsListSetupOpen] = useState(false);

  const {
    currentCodeLine,
    currentOperation,
    currentPhase,
    currentStep,
    executionSteps,
    originalValues,
    selectedPreset,
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
  } = useMiddleOfLinkedList();

  const executionLineNumbers = useMemo(() => {
    const lineNumbers = new Set<number>([currentCodeLine]);
    executionSteps.forEach((step) => {
      lineNumbers.add(getCodeLineForStep(step));
    });
    return Array.from(lineNumbers).sort((a, b) => a - b);
  }, [currentCodeLine, executionSteps]);

  const displayStep = executedStep ?? activeStep;

  // Compute middle node from pointers
  const middleNode = displayStep?.pointers.slow ?? null;

  return (
    <LinkedListShell
      title="Middle of the Linked List"
      subtitle="Tortoise and Hare algorithm with slow/fast pointers"
      guideHref="/problems/linked-list/middle-of-linkedlist-guide"
      currentHref="/problems/linked-list/middle-of-linkedlist"
      stats={[
        { label: "Step", value: `${currentStep} / ${totalSteps}` },
        { label: "Phase", value: currentPhase, minWidthClassName: "min-w-[96px]" },
        { label: "Nodes", value: originalValues.length },
        {
          label: "Middle",
          value: middleNode !== null ? middleNode.toString() : "—",
          minWidthClassName: "min-w-[60px]",
        },
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
          middleNode={middleNode}
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
            selectedPreset={selectedPreset}
            currentValues={originalValues}
            onClose={() => setIsListSetupOpen(false)}
            onApply={(head: ListNode | null, preset: LinkedListPresetKey) => {
              applyListConfiguration(head, preset, false);
            }}
            onApplyAndRun={(head: ListNode | null, preset: LinkedListPresetKey) => {
              applyListConfiguration(head, preset, true);
            }}
          />
        ) : null
      }
    />
  );
}

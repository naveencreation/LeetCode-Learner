"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { LinkedListShell } from "@/features/shared/components/LinkedListShell";
import { UnifiedControlsBar } from "@/features/shared/components/UnifiedControlsBar";

import { useReverseLinkedList } from "../useReverseLinkedList";
import { getCodeLineForStep } from "../selectors";
import { CodePanel } from "./CodePanel";
import { LinkedListPanel } from "./LinkedListPanel";
import { ResultPanel } from "./ResultPanel";
import { PointerStatePanel } from "./PointerStatePanel";
import { ExplanationPanel } from "./ExplanationPanel";

const ListSetupModal = dynamic(() =>
  import("./ListSetupModal").then((m) => m.ListSetupModal),
);

export function ReverseLinkedListLayout() {
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
  } = useReverseLinkedList();

  const executionLineNumbers = useMemo(() => {
    const lineNumbers = new Set<number>([currentCodeLine]);
    executionSteps.forEach((step) => {
      lineNumbers.add(getCodeLineForStep(step));
    });
    return Array.from(lineNumbers).sort((a, b) => a - b);
  }, [currentCodeLine, executionSteps]);

  const displayStep = executedStep ?? activeStep;

  // Compute current node from pointers
  const currentNode = displayStep?.pointers.curr ?? null;

  // Compute reversed portion for header stat
  const reversedSoFar: number[] = [];
  if (displayStep) {
    const links = displayStep.links;
    const prevVal = displayStep.pointers.prev;
    if (prevVal !== null) {
      let v: number | null = prevVal;
      const visited = new Set<number>();
      while (v !== null && !visited.has(v)) {
        visited.add(v);
        reversedSoFar.push(v);
        v = links[v] ?? null;
      }
    }
  }

  return (
    <LinkedListShell
      title="Reverse a Linked List"
      subtitle="Iterative in-place reversal with three pointers"
      guideHref="/problems/linked-list/reverse-a-linkedlist-guide"
      currentHref="/problems/linked-list/reverse-a-linkedlist"
      stats={[
        { label: "Step", value: `${currentStep}/${totalSteps}` },
        { label: "Nodes", value: originalValues.length },
        {
          label: "Result",
          value: reversedSoFar.length > 0 ? `[${reversedSoFar.join(", ")}]` : "[]",
          minWidthClassName: "min-w-[110px]",
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
          onOpenListSetup={() => setIsListSetupOpen(true)}
        />
      }
      middleBottom={
        <ResultPanel
          currentNode={currentNode}
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
            onClose={() => setIsListSetupOpen(false)}
            onApply={(head, preset) => {
              applyListConfiguration(head, preset, false);
            }}
            onApplyAndRun={(head, preset) => {
              applyListConfiguration(head, preset, true);
            }}
          />
        ) : null
      }
    />
  );
}

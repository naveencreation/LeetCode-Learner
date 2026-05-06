"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { LinkedListShell } from "@/features/shared/components/LinkedListShell";
import { UnifiedControlsBar } from "@/features/shared/components/UnifiedControlsBar";

import { useFindIntersection } from "../useFindIntersection";
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

export function FindIntersectionLayout() {
  const {
    listAData,
    listBData,
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
    isListSetupOpen,
    setIsListSetupOpen,
  } = useFindIntersection();

  const executionLineNumbers = useMemo(() => {
    const lineNumbers = new Set<number>([currentCodeLine]);
    executionSteps.forEach((step) => {
      lineNumbers.add(getCodeLineForStep(step));
    });
    return Array.from(lineNumbers).sort((a, b) => a - b);
  }, [currentCodeLine, executionSteps]);

  const displayStep = executedStep ?? activeStep;

  // Compute intersection value
  const intersectionValue = displayStep?.metadata.title.includes("Found") 
    ? parseInt(displayStep.metadata.title.match(/\d+/)?.[0] || "0") 
    : null;

  return (
    <LinkedListShell
      title="Find Intersection Point"
      subtitle="Find the intersection point of two Y-shaped linked lists"
      guideHref="/problems/linked-list/find-intersection-guide"
      currentHref="/problems/linked-list/find-intersection"
      stats={[
        { label: "Step", value: `${currentStep} / ${totalSteps}` },
        { label: "Phase", value: currentPhase, minWidthClassName: "min-w-[96px]" },
        { label: "List A", value: listAData.values.length },
        { label: "List B", value: listBData.values.length },
      ]}
      left={
        <CodePanel
          currentCodeLine={currentCodeLine}
          executionLineNumbers={executionLineNumbers}
        />
      }
      middleTop={
        <LinkedListPanel
          listAData={displayStep?.listA || listAData}
          listBData={displayStep?.listB || listBData}
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
          intersectionValue={intersectionValue}
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
            onClose={() => setIsListSetupOpen(false)}
            onApply={(listA: ListNode | null, listB: ListNode | null) => {
              applyListConfiguration(listA, listB, false);
            }}
            onApplyAndRun={(listA: ListNode | null, listB: ListNode | null) => {
              applyListConfiguration(listA, listB, true);
            }}
          />
        ) : null
      }
    />
  );
}

"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { LinkedListShell } from "@/features/shared/components/LinkedListShell";
import { UnifiedControlsBar } from "@/features/shared/components/UnifiedControlsBar";

import { useAddTwoNumbers } from "../useAddTwoNumbers";
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

export function AddTwoNumbersLayout() {
  const {
    list1Data,
    list2Data,
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
  } = useAddTwoNumbers();

  const executionLineNumbers = useMemo(() => {
    const lineNumbers = new Set<number>([currentCodeLine]);
    executionSteps.forEach((step) => {
      lineNumbers.add(getCodeLineForStep(step));
    });
    return Array.from(lineNumbers).sort((a, b) => a - b);
  }, [currentCodeLine, executionSteps]);

  const displayStep = executedStep ?? activeStep;

  // Compute result list values (excluding dummy head 0)
  const resultValues = displayStep?.result.values.filter(v => v !== 0) || [];

  return (
    <LinkedListShell
      title="Add Two Numbers"
      subtitle="Add two numbers represented as linked lists"
      guideHref="/problems/linked-list/add-two-numbers-guide"
      currentHref="/problems/linked-list/add-two-numbers"
      stats={[
        { label: "Step", value: `${currentStep} / ${totalSteps}` },
        { label: "Phase", value: currentPhase, minWidthClassName: "min-w-[96px]" },
        { label: "L1 Length", value: list1Data.values.length },
        { label: "L2 Length", value: list2Data.values.length },
      ]}
      left={
        <CodePanel
          currentCodeLine={currentCodeLine}
          executionLineNumbers={executionLineNumbers}
        />
      }
      middleTop={
        <LinkedListPanel
          list1Data={displayStep?.list1 || list1Data}
          list2Data={displayStep?.list2 || list2Data}
          resultData={displayStep?.result || { values: [], nodeStates: {}, links: {} }}
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
          resultValues={resultValues}
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
            onApply={(list1: ListNode | null, list2: ListNode | null) => {
              applyListConfiguration(list1, list2, false);
            }}
            onApplyAndRun={(list1: ListNode | null, list2: ListNode | null) => {
              applyListConfiguration(list1, list2, true);
            }}
          />
        ) : null
      }
    />
  );
}

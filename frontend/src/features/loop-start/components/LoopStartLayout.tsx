"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { LinkedListShell } from "@/features/shared/components/LinkedListShell";
import { UnifiedControlsBar } from "@/features/shared/components/UnifiedControlsBar";

import { useLoopStart } from "../useLoopStart";
import { getCodeLineForStep } from "../selectors";
import type { ListNode, LinkedListPresetKey } from "@/features/shared/linked-list-types";
import { CodePanel } from "./CodePanel";
import { LinkedListPanel } from "./LinkedListPanel";
import { ResultPanel } from "./ResultPanel";
import { PointerStatePanel } from "./PointerStatePanel";
import { ExplanationPanel } from "./ExplanationPanel";

const ListSetupModal = dynamic(() =>
  import("./ListSetupModal").then((m) => m.ListSetupModal),
);

export function LoopStartLayout() {
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
    selectedPreset,
  } = useLoopStart();

  const executionLineNumbers = useMemo(() => {
    const lineNumbers = new Set<number>([currentCodeLine]);
    executionSteps.forEach((step) => {
      lineNumbers.add(getCodeLineForStep(step));
    });
    return Array.from(lineNumbers).sort((a, b) => a - b);
  }, [currentCodeLine, executionSteps]);

  const displayStep = executedStep ?? activeStep;
  const cycleStartValue = displayStep?.pointers.cycleStart ?? null;

  return (
    <LinkedListShell
      title="Starting Point of Loop"
      subtitle="Find the node where a cycle begins in a linked list"
      guideHref="/problems/linked-list/loop-start-guide"
      currentHref="/problems/linked-list/loop-start"
      stats={[
        { label: "Step", value: `${currentStep} / ${totalSteps}` },
        { label: "Phase", value: currentPhase, minWidthClassName: "min-w-[96px]" },
        { label: "Nodes", value: originalValues.length },
        {
          label: "Start",
          value: cycleStartValue !== null ? cycleStartValue.toString() : "—",
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
          cycleStartValue={cycleStartValue}
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

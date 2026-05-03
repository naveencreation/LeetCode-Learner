"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { LinkedListShell } from "@/features/shared/components/LinkedListShell";
import { UnifiedControlsBar } from "@/features/shared/components/UnifiedControlsBar";
import type { LinkedListPresetKey, ListNode } from "@/features/shared/linked-list-types";

import { useRemoveNthFromEnd } from "../useRemoveNthFromEnd";
import { getCodeLineForStep } from "../selectors";
import { CodePanel } from "./CodePanel";
import { LinkedListPanel } from "./LinkedListPanel";
import { ResultPanel } from "./ResultPanel";
import { PointerStatePanel } from "./PointerStatePanel";
import { ExplanationPanel } from "./ExplanationPanel";

const ListSetupModal = dynamic(() =>
  import("./ListSetupModal").then((m) => m.ListSetupModal),
);

export function RemoveNthFromEndLayout() {
  const [isListSetupOpen, setIsListSetupOpen] = useState(false);
  const [n, setN] = useState(2);

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
  } = useRemoveNthFromEnd(n);

  const executionLineNumbers = useMemo(() => {
    const lineNumbers = new Set<number>([currentCodeLine]);
    executionSteps.forEach((step) => {
      lineNumbers.add(getCodeLineForStep(step));
    });
    return Array.from(lineNumbers).sort((a, b) => a - b);
  }, [currentCodeLine, executionSteps]);

  const displayStep = executedStep ?? activeStep;

  // Compute target node from pointers
  const targetNode = displayStep?.pointers.target ?? null;

  return (
    <LinkedListShell
      title="Remove N-th Node From End"
      subtitle="Two-pointer technique to remove nth node from end"
      guideHref="/problems/linked-list/remove-nth-from-end-guide"
      currentHref="/problems/linked-list/remove-nth-from-end"
      stats={[
        { label: "Step", value: `${currentStep} / ${totalSteps}` },
        { label: "Phase", value: currentPhase, minWidthClassName: "min-w-[96px]" },
        { label: "Nodes", value: originalValues.length },
        {
          label: "N",
          value: n.toString(),
          minWidthClassName: "min-w-[40px]",
        },
        {
          label: "Target",
          value: targetNode !== null ? targetNode.toString() : "—",
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
          targetNode={targetNode}
          n={n}
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
            currentN={n}
            onClose={() => setIsListSetupOpen(false)}
            onApply={(head: ListNode | null, preset: LinkedListPresetKey, newN: number) => {
              setN(newN);
              applyListConfiguration(head, preset, false);
            }}
            onApplyAndRun={(head: ListNode | null, preset: LinkedListPresetKey, newN: number) => {
              setN(newN);
              applyListConfiguration(head, preset, true);
            }}
          />
        ) : null
      }
    />
  );
}

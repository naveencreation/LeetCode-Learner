"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { LinkedListShell } from "@/features/shared/components/LinkedListShell";
import { UnifiedControlsBar } from "@/features/shared/components/UnifiedControlsBar";

import { useReverseKGroup } from "../useReverseKGroup";
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

export function ReverseKGroupLayout() {
  const [isListSetupOpen, setIsListSetupOpen] = useState(false);
  const [k, setK] = useState(3);

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
  } = useReverseKGroup(k);

  const executionLineNumbers = useMemo(() => {
    const lineNumbers = new Set<number>([currentCodeLine]);
    executionSteps.forEach((step) => {
      lineNumbers.add(getCodeLineForStep(step));
    });
    return Array.from(lineNumbers).sort((a, b) => a - b);
  }, [currentCodeLine, executionSteps]);

  const displayStep = executedStep ?? activeStep;

  const stats = useMemo(
    () => ({
      step: currentStep,
      total: totalSteps,
      operation: currentOperation,
      phase: currentPhase,
      k: activeStep?.pointers.k ?? k,
    }),
    [currentStep, totalSteps, currentOperation, currentPhase, activeStep?.pointers.k, k],
  );

  const handleApplyList = (head: ListNode | null, preset: LinkedListPresetKey) => {
    applyListConfiguration(head, preset);
    resetTraversal();
  };

  const handleApplyAndRun = (head: ListNode | null, preset: LinkedListPresetKey) => {
    applyListConfiguration(head, preset);
    resetTraversal();
    playTraversal();
  };

  return (
    <LinkedListShell
      title="Reverse Nodes in k-Group"
      stats={stats}
      statsConfig={[
        { key: "step", label: "Step" },
        { key: "k", label: "Group Size (k)" },
        { key: "phase", label: "Phase" },
        { key: "operation", label: "Action" },
      ]}
    >
      {(shellProps) => (
        <>
          <UnifiedControlsBar
            currentStep={currentStep}
            totalSteps={totalSteps}
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
            onOpenListSetup={() => setIsListSetupOpen(true)}
            {...shellProps}
          />

          <CodePanel
            currentCodeLine={currentCodeLine}
            executionLineNumbers={executionLineNumbers}
          />

          <ExplanationPanel activeStep={displayStep} />

          <PointerStatePanel activeStep={displayStep} />

          <ResultPanel
            currentStep={currentStep}
            totalSteps={totalSteps}
            currentOperation={currentOperation}
            currentPhase={currentPhase}
            activeStep={displayStep}
            k={k}
          />

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

          {isListSetupOpen && (
            <ListSetupModal
              selectedPreset={selectedPreset}
              currentValues={originalValues}
              onClose={() => setIsListSetupOpen(false)}
              onApply={handleApplyList}
              onApplyAndRun={handleApplyAndRun}
              k={k}
              onKChange={setK}
            />
          )}
        </>
      )}
    </LinkedListShell>
  );
}

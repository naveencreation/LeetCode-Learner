"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { TraversalShell } from "@/features/shared/components/TraversalShell";

import { getCodeLineForStep } from "../selectors";
import { useInorderTraversal } from "../useInorderTraversal";
import { CallStackPanel } from "./CallStackPanel";
import { CodePanel } from "./CodePanel";
import { ControlsBar } from "./ControlsBar";
import { ExplanationPanel } from "./ExplanationPanel";
import { ResultPanel } from "./ResultPanel";
import { TreePanel } from "./TreePanel";

const TreeSetupModal = dynamic(() =>
  import("./TreeSetupModal").then((module) => module.TreeSetupModal),
);

export function InorderLayout() {
  const [isTreeSetupOpen, setIsTreeSetupOpen] = useState(false);

  const {
    currentCodeLine,
    currentNode,
    currentOperation,
    currentPhase,
    currentStep,
    executionSteps,
    root,
    selectedPreset,
    presets,
    customNodePositions,
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
    nodeStates,
    previousStep,
    resetTraversal,
    result,
    totalSteps,
    activeCallStack,
    activeStep,
    applyTreeConfiguration,
  } = useInorderTraversal();

  const executionLineNumbers = useMemo(() => {
    const lineNumbers = new Set<number>([currentCodeLine]);

    executionSteps.forEach((step) => {
      lineNumbers.add(getCodeLineForStep(step));
    });

    return Array.from(lineNumbers).sort((a, b) => a - b);
  }, [currentCodeLine, executionSteps]);

  return (
    <TraversalShell
      title="Inorder Tree Traversal"
      subtitle="Left -> Root -> Right recursion visualizer"
      guideHref="/problems/binary-tree/inorder-guide"
      stats={[
        { label: "Step", value: `${currentStep}/${totalSteps}` },
        { label: "Visited", value: result.length },
        { label: "Result", value: `[${result.join(", ")}]`, minWidthClassName: "min-w-[110px]" },
      ]}
      left={
        <CodePanel
          currentCodeLine={currentCodeLine}
          executionLineNumbers={executionLineNumbers}
        />
      }
      middleTop={
        <TreePanel
          root={root}
          currentOperation={currentOperation}
          nodeStates={nodeStates}
          activeStep={activeStep}
          customNodePositions={customNodePositions}
          onOpenTreeSetup={() => setIsTreeSetupOpen(true)}
        />
      }
      middleBottom={
        <ResultPanel
          currentNode={currentNode}
          currentPhase={currentPhase}
          result={result}
          currentStep={currentStep}
          totalSteps={totalSteps}
          currentOperation={currentOperation}
        />
      }
      middleFooter={
        <ControlsBar
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
      rightTop={<CallStackPanel activeCallStack={activeCallStack} />}
      rightBottom={
        <ExplanationPanel
          currentStep={currentStep}
          totalSteps={totalSteps}
          result={result}
          activeStep={executedStep}
          currentCodeLine={currentCodeLine}
        />
      }
      modal={
        isTreeSetupOpen ? (
          <TreeSetupModal
            root={root}
            selectedPreset={selectedPreset}
            presets={presets}
            customNodePositions={customNodePositions}
            onClose={() => setIsTreeSetupOpen(false)}
            onApply={(nextRoot, nextPositions, preset) =>
              applyTreeConfiguration(nextRoot, nextPositions, preset, false)
            }
            onApplyAndRun={(nextRoot, nextPositions, preset) =>
              applyTreeConfiguration(nextRoot, nextPositions, preset, true)
            }
          />
        ) : null
      }
    />
  );
}

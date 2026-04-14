"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { TraversalShell } from "@/features/shared/components/TraversalShell";
import { UnifiedControlsBar } from "@/features/shared/components/UnifiedControlsBar";
import { UnifiedCallStackPanel } from "@/features/shared/components/UnifiedCallStackPanel";

import { getCodeLineForStep } from "../selectors";
import { CodePanel } from "./CodePanel";
import { ExplanationPanel } from "./ExplanationPanel";
import { ResultPanel } from "./ResultPanel";
import { TreePanel } from "./TreePanel";
import { useBoundaryTreeTraversal } from "../useBoundaryTreeTraversal";

const TreeSetupModal = dynamic(() =>
  import("./TreeSetupModal").then((module) => ({ default: module.TreeSetupModal })),
);

export function BoundaryTreeLayout() {
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
  } = useBoundaryTreeTraversal();

  const executionLineNumbers = useMemo(() => {
    const lineNumbers = new Set<number>([currentCodeLine]);
    executionSteps.forEach((step) => {
      lineNumbers.add(getCodeLineForStep(step));
    });
    return Array.from(lineNumbers).sort((a, b) => a - b);
  }, [currentCodeLine, executionSteps]);

  const boundaryResult = useMemo(() => {
    if (currentStep === 0) return [];
    return (result as number[]) ?? [];
  }, [currentStep, result]);

  return (
    <TraversalShell
      title="Boundary of Binary Tree"
      subtitle="Anti-clockwise boundary: left → leaves → right (reversed)"
      guideHref="/problems/binary-tree/boundary-of-binary-tree-guide"
      currentHref="/problems/binary-tree/boundary-of-binary-tree"
      stats={[
        { label: "Step", value: `${currentStep}/${totalSteps}` },
        { label: "Phase", value: currentPhase ?? "-" },
        { label: "Boundary", value: `[${boundaryResult.join(", ")}]`, minWidthClassName: "min-w-[150px]" },
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
          result={result as number[]}
          currentStep={currentStep}
          totalSteps={totalSteps}
          currentOperation={currentOperation}
          boundaryResult={boundaryResult}
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
        <UnifiedCallStackPanel 
          activeCallStack={activeCallStack}
          title="Call Stack"
          frameFormatter={(frame) => `boundary(${frame.nodeVal ?? "null"})`}
        />
      }
      rightBottom={
        <ExplanationPanel
          currentStep={currentStep}
          totalSteps={totalSteps}
          result={result as number[]}
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

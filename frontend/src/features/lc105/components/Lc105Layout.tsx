"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { TraversalShell } from "../../shared/components/TraversalShell";
import { UnifiedControlsBar } from "../../shared/components/UnifiedControlsBar";
import { UnifiedCallStackPanel } from "../../shared/components/UnifiedCallStackPanel";

import { getCodeLineForStep } from "../selectors";
import { useLc105Traversal } from "../useLc105Traversal";
import { deriveTraversals } from "../engine";
import { CodePanel } from "./CodePanel";
import { TreePanel } from "./TreePanel";
import { ResultPanel } from "./ResultPanel";
import { ExplanationPanel } from "./ExplanationPanel";

const TreeSetupModal = dynamic(() =>
  import("@/features/inorder/components/TreeSetupModal").then((module) => module.TreeSetupModal),
);

export function Lc105Layout() {
  const [isTreeSetupOpen, setIsTreeSetupOpen] = useState(false);

  const {
    root,
    selectedPreset,
    presets,
    customNodePositions,
    executionSteps,
    currentCodeLine,
    currentOperation,
    currentStep,
    totalSteps,
    nodeStates,
    createdOrder,
    preorderPointer,
    currentRange,
    inorderPivot,
    activeStep,
    executedStep,
    activeCallStack,
    isAtStart,
    isAtEnd,
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
    applyTreeConfiguration,
  } = useLc105Traversal();

  const { preorder, inorder } = useMemo(() => deriveTraversals(root), [root]);

  const executionLineNumbers = useMemo(() => {
    const lineNumbers = new Set<number>([currentCodeLine]);
    executionSteps.forEach((step) => {
      lineNumbers.add(getCodeLineForStep(step));
    });

    return Array.from(lineNumbers).sort((a, b) => a - b);
  }, [currentCodeLine, executionSteps]);

  return (
    <TraversalShell
      title="Construct Binary Tree from Inorder and Preorder"
      subtitle="Root pick from preorder + inorder range partitioning"
      guideHref="/problems/binary-tree/construct-binary-tree-from-inorder-and-preorder-guide"
      stats={[
        { label: "Step", value: `${currentStep}/${totalSteps}` },
        { label: "Created", value: `${createdOrder.length}` },
        { label: "Preorder Ptr", value: `${preorderPointer}`, minWidthClassName: "min-w-[110px]" },
      ]}
      left={<CodePanel currentCodeLine={currentCodeLine} executionLineNumbers={executionLineNumbers} />}
      middleTop={
        <TreePanel
          root={root}
          nodeStates={nodeStates}
          currentOperation={currentOperation}
          activeStep={activeStep}
          customNodePositions={customNodePositions}
          onOpenTreeSetup={() => setIsTreeSetupOpen(true)}
        />
      }
      middleBottom={
        <ResultPanel
          preorder={preorder}
          inorder={inorder}
          createdOrder={createdOrder}
          preorderPointer={preorderPointer}
          currentRange={currentRange}
          inorderPivot={inorderPivot}
          currentStep={currentStep}
          totalSteps={totalSteps}
          currentOperation={currentOperation}
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
          title="Build Stack"
          frameFormatter={(frame) => `build(node=${frame.nodeVal})`}
        />
      }
      rightBottom={
        <ExplanationPanel
          currentStep={currentStep}
          totalSteps={totalSteps}
          createdOrder={createdOrder}
          currentCodeLine={currentCodeLine}
          activeStep={executedStep ?? activeStep}
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

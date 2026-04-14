"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { TraversalShell } from "../../shared/components/TraversalShell";
import { UnifiedControlsBar } from "../../shared/components/UnifiedControlsBar";
import { UnifiedCallStackPanel } from "../../shared/components/UnifiedCallStackPanel";

import { getCodeLineForStep } from "../selectors";
import { useLc114Traversal } from "../useLc114Traversal";
import { deriveFlattenOrder } from "../engine";
import { CodePanel } from "./CodePanel";
import { TreePanel } from "./TreePanel";
import { ResultPanel } from "./ResultPanel";
import { ExplanationPanel } from "./ExplanationPanel";

const TreeSetupModal = dynamic(() =>
  import("@/features/inorder/components/TreeSetupModal").then((module) => module.TreeSetupModal),
);

export function Lc114Layout() {
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
    chain,
    preorderPointer,
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
  } = useLc114Traversal();

  const { preorder: preorderTarget } = useMemo(() => deriveFlattenOrder(root), [root]);

  const executionLineNumbers = useMemo(() => {
    const lineNumbers = new Set<number>([currentCodeLine]);
    executionSteps.forEach((step) => {
      lineNumbers.add(getCodeLineForStep(step));
    });

    return Array.from(lineNumbers).sort((a, b) => a - b);
  }, [currentCodeLine, executionSteps]);

  return (
    <TraversalShell
      title="Flatten Binary Tree to Linked List"
      subtitle="In-place pointer rewiring into preorder right chain"
      guideHref="/problems/binary-tree/flatten-binary-tree-to-linkedlist-guide"
      currentHref="/problems/binary-tree/flatten-binary-tree-to-linkedlist"
      stats={[
        { label: "Step", value: `${currentStep}/${totalSteps}` },
        { label: "Chain Size", value: `${chain.length}` },
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
          preorderTarget={preorderTarget}
          chain={chain}
          preorderPointer={preorderPointer}
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
          title="Flatten Stack"
          frameFormatter={(frame) => `flatten(node=${frame.nodeVal})`}
        />
      }
      rightBottom={
        <ExplanationPanel
          currentStep={currentStep}
          totalSteps={totalSteps}
          chain={chain}
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

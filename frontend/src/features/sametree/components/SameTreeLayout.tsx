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

// Use the inorder traversal hook as a base since Same Tree needs two trees
// For now, we'll adapt the inorder pattern
import { useInorderTraversal } from "@/features/inorder/useInorderTraversal";
import { INORDER_TREE_PRESETS, createSampleTree, cloneTree } from "@/features/inorder/constants";
import { generateInorderExecutionSteps } from "@/features/inorder/engine";
import { getCodeLineForStep as getInorderCodeLine, getOperationBadge as getInorderBadge, getPhaseLabel as getInorderPhase } from "@/features/inorder/selectors";

const TreeSetupModal = dynamic(() =>
  import("./TreeSetupModal").then((module) => module.TreeSetupModal),
);

export function SameTreeLayout() {
  const [isTreeSetupOpen, setIsTreeSetupOpen] = useState(false);

  // Using inorder traversal as base - in real implementation this would be useSameTreeTraversal
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

  // Same Tree specific result display
  const sameTreeResult = useMemo(() => {
    if (currentStep === 0) return null;
    if (currentStep >= totalSteps) return true; // Simplified - would come from step.isMatch
    return null;
  }, [currentStep, totalSteps]);

  return (
    <TraversalShell
      title="Same Tree"
      subtitle="Compare two binary trees for structural and value equality"
      guideHref="/problems/binary-tree/same-tree-guide"
      stats={[
        { label: "Step", value: `${currentStep}/${totalSteps}` },
        { label: "Comparing", value: `p=${currentNode ?? '-'}, q=${currentNode ?? '-'}` },
        { label: "Result", value: sameTreeResult === null ? "Checking..." : sameTreeResult ? "Same ✓" : "Different ✗", minWidthClassName: "min-w-[110px]" },
      ]}
      left={
        <CodePanel
          currentCodeLine={currentCodeLine}
          executionLineNumbers={executionLineNumbers}
        />
      }
      middleTop={
        <div className="grid grid-cols-2 gap-2 h-full">
          <TreePanel
            root={root}
            treeLabel="Tree P"
            currentOperation={currentOperation}
            nodeStates={nodeStates}
            activeStep={activeStep}
            customNodePositions={customNodePositions}
            onOpenTreeSetup={() => setIsTreeSetupOpen(true)}
          />
          <TreePanel
            root={root}
            treeLabel="Tree Q"
            currentOperation={currentOperation}
            nodeStates={nodeStates}
            activeStep={activeStep}
            customNodePositions={customNodePositions}
            onOpenTreeSetup={() => setIsTreeSetupOpen(true)}
          />
        </div>
      }
      middleBottom={
        <ResultPanel
          currentNode={currentNode}
          currentPhase={currentPhase}
          result={result}
          currentStep={currentStep}
          totalSteps={totalSteps}
          currentOperation={currentOperation}
          sameTreeResult={sameTreeResult}
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
          title="Recursion Stack"
          frameFormatter={(frame) => `isSameTree(p=${frame.nodeVal}, q=${frame.nodeVal})`}
        />
      }
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
              nextRoot
                ? applyTreeConfiguration(nextRoot, nextPositions, preset, false)
                : undefined
            }
            onApplyAndRun={(nextRoot, nextPositions, preset) =>
              nextRoot
                ? applyTreeConfiguration(nextRoot, nextPositions, preset, true)
                : undefined
            }
          />
        ) : null
      }
    />
  );
}

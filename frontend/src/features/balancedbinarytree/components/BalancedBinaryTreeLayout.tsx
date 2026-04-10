"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { TraversalShell } from "@/features/shared/components/TraversalShell";
import { UnifiedControlsBar } from "@/features/shared/components/UnifiedControlsBar";
import { UnifiedCallStackPanel } from "@/features/shared/components/UnifiedCallStackPanel";

import { getCodeLineForStep } from "../selectors";
import { useBalancedBinaryTreeTraversal } from "../useBalancedBinaryTreeTraversal";
import { CodePanel } from "./CodePanel";
import { ExplanationPanel } from "./ExplanationPanel";
import { ResultPanel } from "./ResultPanel";
import { TreePanel } from "./TreePanel";

const TreeSetupModal = dynamic(() =>
  import("./TreeSetupModal").then((module) => module.TreeSetupModal),
);

export function BalancedbinarytreeLayout() {
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
  } = useBalancedBinaryTreeTraversal();

  const executionLineNumbers = useMemo(() => {
    const lineNumbers = new Set<number>([currentCodeLine]);

    executionSteps.forEach((step) => {
      lineNumbers.add(getCodeLineForStep(step));
    });

    return Array.from(lineNumbers).sort((a, b) => a - b);
  }, [currentCodeLine, executionSteps]);

  const processedCount = useMemo(
    () => Object.values(nodeStates).filter((state) => state !== "unvisited").length,
    [nodeStates],
  );

  return (
    <TraversalShell
      title="Balanced Binary Tree"
      subtitle="Check if tree is height-balanced using recursive DFS"
      guideHref="/problems/binary-tree/balanced-binary-tree-guide"
      stats={[
        { label: "Step", value: `${currentStep}/${totalSteps}` },
        { label: "Processed", value: processedCount },
        { label: "Result", value: result ? "BALANCED ✓" : "UNBALANCED ✗", minWidthClassName: "min-w-[110px]" },
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
          frameFormatter={(frame) => `check(${frame.nodeVal})`}
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

export { BalancedbinarytreeLayout as BalancedBinaryTreeLayout };

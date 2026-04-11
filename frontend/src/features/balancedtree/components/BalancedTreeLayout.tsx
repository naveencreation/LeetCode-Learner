"use client";

import { useMemo, useState } from "react";
import { useBalancedTreeTraversal } from "../useBalancedTreeTraversal";
import { CodePanel } from "./CodePanel";
import { ExplanationPanel } from "./ExplanationPanel";
import { ResultPanel } from "./ResultPanel";
import { TreePanel } from "./TreePanel";
import { TreeSetupModal } from "./TreeSetupModal";
import { UnifiedControlsBar } from "@/features/shared/components/UnifiedControlsBar";
import { UnifiedCallStackPanel } from "@/features/shared/components/UnifiedCallStackPanel";
import { TraversalShell } from "@/features/shared/components/TraversalShell";
import type { BalancedTreeExecutionStep } from "../types";

export function BalancedTreeLayout() {
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
  } = useBalancedTreeTraversal();

  const executionLineNumbers = useMemo(() => {
    const lineNumbers = new Set<number>([currentCodeLine]);

    executionSteps.forEach((step: BalancedTreeExecutionStep) => {
      lineNumbers.add(step.lineNumber);
    });

    return Array.from(lineNumbers).sort((a, b) => a - b);
  }, [currentCodeLine, executionSteps]);

  return (
    <TraversalShell
      title="Balanced Binary Tree"
      subtitle="Check if tree is height-balanced"
      guideHref="/problems/binary-tree/balanced-binary-tree-guide"
      stats={[
        { label: "Step", value: `${currentStep}/${totalSteps}` },
        { label: "Status", value: result === true ? "Balanced" : result === false ? "Unbalanced" : "-" },
        { label: "Current", value: currentNode ?? "-" },
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
          nodeStates={nodeStates}
          currentNode={currentNode}
          activeStep={activeStep}
          customNodePositions={customNodePositions}
          onOpenTreeSetup={() => setIsTreeSetupOpen(true)}
        />
      }
      middleBottom={
        <ResultPanel
          currentNode={currentNode}
          currentPhase={currentPhase}
          result={result as boolean | null}
          currentStep={currentStep}
          totalSteps={totalSteps}
          currentOperation={currentOperation}
          isBalanced={result as boolean | undefined}
          leftHeight={executedStep?.leftHeight}
          rightHeight={executedStep?.rightHeight}
          currentHeight={executedStep?.currentHeight}
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
          frameFormatter={(frame) => `check(${frame.nodeVal ?? "null"})`}
        />
      }
      rightBottom={
        <ExplanationPanel
          explanation={executedStep?.explanation ?? "Click Run to start"}
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
                ? applyTreeConfiguration(nextRoot, nextPositions, preset as import("../types").BalancedTreePresetKey, false)
                : undefined
            }
            onApplyAndRun={(nextRoot, nextPositions, preset) =>
              nextRoot
                ? applyTreeConfiguration(nextRoot, nextPositions, preset as import("../types").BalancedTreePresetKey, true)
                : undefined
            }
          />
        ) : null
      }
    />
  );
}

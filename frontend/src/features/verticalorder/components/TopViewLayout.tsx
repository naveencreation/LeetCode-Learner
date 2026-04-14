"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { TraversalShell } from "@/features/shared/components/TraversalShell";
import { UnifiedCallStackPanel } from "@/features/shared/components/UnifiedCallStackPanel";
import { UnifiedControlsBar } from "@/features/shared/components/UnifiedControlsBar";

import { getCodeLineForStep } from "../selectors";
import { useVerticalOrderTraversal } from "../useTopViewTraversal";
import { CodePanel } from "./CodePanel";
import { ExplanationPanel } from "./ExplanationPanel";
import { ResultPanel } from "./ResultPanel";
import { TreePanel } from "./TreePanel";

const TreeSetupModal = dynamic(() =>
  import("@/features/inorder/components/TreeSetupModal").then((module) => module.TreeSetupModal),
);

export function TopViewLayout() {
  const [isTreeSetupOpen, setIsTreeSetupOpen] = useState(false);

  const {
    root,
    selectedPreset,
    presets,
    customNodePositions,
    currentCodeLine,
    currentNode,
    currentOperation,
    currentPhase,
    currentStep,
    executionSteps,
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
    columnKeys,
    totalSteps,
    activeCallStack,
    activeStep,
    applyTreeConfiguration,
  } = useVerticalOrderTraversal();

  const resultText = useMemo(
    () => result.map((column, index) => `[${columnKeys[index] ?? "?"}:${column.join(",")}]`).join(" "),
    [result, columnKeys],
  );

  const openTreeSetup = useCallback(() => {
    setIsTreeSetupOpen(true);
  }, []);

  const closeTreeSetup = useCallback(() => {
    setIsTreeSetupOpen(false);
  }, []);

  const applyConfiguration = useCallback(
    (nextRoot: typeof root, nextPositions: typeof customNodePositions, preset: typeof selectedPreset) => {
      applyTreeConfiguration(nextRoot, nextPositions, preset, false);
    },
    [applyTreeConfiguration],
  );

  const applyAndRunConfiguration = useCallback(
    (nextRoot: typeof root, nextPositions: typeof customNodePositions, preset: typeof selectedPreset) => {
      applyTreeConfiguration(nextRoot, nextPositions, preset, true);
    },
    [applyTreeConfiguration],
  );

  const executionLineNumbers = useMemo(() => {
    const lineNumbers = new Set<number>([currentCodeLine]);

    executionSteps.forEach((step) => {
      lineNumbers.add(getCodeLineForStep(step));
    });

    return Array.from(lineNumbers).sort((a, b) => a - b);
  }, [currentCodeLine, executionSteps]);

  return (
    <TraversalShell
      title="Vertical Order Traversal of Binary Tree"
      subtitle="Level-order visualizer: collect nodes by column, then sort by row/value"
      guideHref="/problems/binary-tree/verticalorder-guide"
      currentHref="/problems/binary-tree/vertical-order-traversal"
      stats={[
        { label: "Step", value: `${currentStep}/${totalSteps}` },
        { label: "Columns", value: result.length },
        { label: "Result", value: resultText || "[]", minWidthClassName: "min-w-[180px]" },
      ]}
      left={<CodePanel currentCodeLine={currentCodeLine} executionLineNumbers={executionLineNumbers} />}
      middleTop={
        <TreePanel
          root={root}
          currentOperation={currentOperation}
          nodeStates={nodeStates}
          activeStep={activeStep}
          currentStep={currentStep}
          executionSteps={executionSteps}
          customNodePositions={customNodePositions}
          onOpenTreeSetup={openTreeSetup}
        />
      }
      middleBottom={
        <ResultPanel
          currentNode={currentNode}
          currentPhase={currentPhase}
          result={result}
          columnKeys={columnKeys}
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
          title="Processing Stack"
          frameFormatter={(frame) => `verticalTraversal(level=${frame.depth}, node=${frame.nodeVal})`}
        />
      }
      rightBottom={
        <ExplanationPanel
          currentStep={currentStep}
          totalSteps={totalSteps}
          result={result}
          columnKeys={columnKeys}
          activeStep={executedStep}
        />
      }
      contentGapClassName="gap-[5px]"
      gridClassName="xl:grid-cols-[minmax(300px,1.2fr)_minmax(380px,1.45fr)_minmax(280px,1.05fr)]"
      modal={
        isTreeSetupOpen ? (
          <TreeSetupModal
            root={root}
            selectedPreset={selectedPreset}
            presets={presets}
            customNodePositions={customNodePositions}
            onClose={closeTreeSetup}
            onApply={applyConfiguration}
            onApplyAndRun={applyAndRunConfiguration}
          />
        ) : null
      }
    />
  );
}

export const VerticalOrderLayout = TopViewLayout;


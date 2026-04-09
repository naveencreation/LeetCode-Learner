"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { TraversalShell } from "@/features/shared/components/TraversalShell";

import { getCodeLineForStep } from "../selectors";
import { useLevelOrderTraversal } from "../useLevelOrderTraversal";
import { CallStackPanel } from "./CallStackPanel";
import { CodePanel } from "./CodePanel";
import { ControlsBar } from "./ControlsBar";
import { ExplanationPanel } from "./ExplanationPanel";
import { ResultPanel } from "./ResultPanel";
import { TreePanel } from "./TreePanel";

const TreeSetupModal = dynamic(() =>
  import("./TreeSetupModal").then((module) => module.TreeSetupModal),
);

export function LevelOrderLayout() {
  const [isTreeSetupOpen, setIsTreeSetupOpen] = useState(false);

  const {
    root,
    selectedPreset,
    presets,
    customNodePositions,
    currentCodeLine,
    currentNode,
    currentLevel,
    currentWidth,
    maxWidth,
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
    totalSteps,
    activeCallStack,
    activeStep,
    applyTreeConfiguration,
  } = useLevelOrderTraversal();

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
      title="Level Order of Binary Tree"
      subtitle="Queue-based BFS visualizer for level-by-level traversal"
      guideHref="/problems/binary-tree/levelorder-guide"
      stats={[
        { label: "Step", value: `${currentStep}/${totalSteps}` },
        { label: "Levels", value: result.length },
        { label: "Max Level Size", value: maxWidth, minWidthClassName: "min-w-[110px]" },
      ]}
      left={<CodePanel currentCodeLine={currentCodeLine} executionLineNumbers={executionLineNumbers} />}
      middleTop={
        <TreePanel
          root={root}
          currentOperation={currentOperation}
          nodeStates={nodeStates}
          activeStep={activeStep}
          customNodePositions={customNodePositions}
          onOpenTreeSetup={openTreeSetup}
        />
      }
      middleBottom={
        <ResultPanel
          currentNode={currentNode}
          currentLevel={currentLevel}
          currentWidth={currentWidth}
          maxWidth={maxWidth}
          currentPhase={currentPhase}
          result={result}
          currentStep={currentStep}
          totalSteps={totalSteps}
          currentOperation={currentOperation}
          activeStep={executedStep}
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
          maxWidth={maxWidth}
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


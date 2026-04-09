"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { TraversalShell } from "@/features/shared/components/TraversalShell";

import { getCodeLineForStep } from "../selectors";
import { useBottomViewTraversal } from "../useBottomViewTraversal";
import { CallStackPanel } from "./CallStackPanel";
import { CodePanel } from "./CodePanel";
import { ControlsBar } from "./ControlsBar";
import { ExplanationPanel } from "./ExplanationPanel";
import { ResultPanel } from "./ResultPanel";
import { TreePanel } from "./TreePanel";

const TreeSetupModal = dynamic(() =>
  import("./TreeSetupModal").then((module) => module.TreeSetupModal),
);

export function BottomViewLayout() {
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
    queueBefore,
    queueAfter,
    currentLevel,
    indexInLevel,
    dequeuedNode,
    enqueuedNodes,
    capturedNode,
    previousStep,
    resetTraversal,
    result,
    totalSteps,
    activeStep,
    applyTreeConfiguration,
  } = useBottomViewTraversal();

  const executionLineNumbers = useMemo(() => {
    const lineNumbers = new Set<number>([currentCodeLine]);

    executionSteps.forEach((step) => {
      lineNumbers.add(getCodeLineForStep(step));
    });

    return Array.from(lineNumbers).sort((a, b) => a - b);
  }, [currentCodeLine, executionSteps]);

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

  return (
    <TraversalShell
      title="Bottom View of Binary Tree"
      subtitle="Level-order visualizer: deepest visible node per horizontal distance"
      guideHref="/problems/binary-tree/bottomview-guide"
      stats={[
        { label: "Step", value: `${currentStep}/${totalSteps}` },
        { label: "Visited", value: result.length },
        { label: "Result", value: `[${result.join(", ")}]`, minWidthClassName: "min-w-[110px]" },
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
          currentStep={currentStep}
          totalSteps={totalSteps}
          currentOperation={currentOperation}
          currentLevel={currentLevel}
          capturedNode={capturedNode}
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
      rightTop={
        <CallStackPanel
          queueBefore={queueBefore}
          queueAfter={queueAfter}
          currentLevel={currentLevel}
          indexInLevel={indexInLevel}
          dequeuedNode={dequeuedNode}
          enqueuedNodes={enqueuedNodes}
        />
      }
      rightBottom={
        <ExplanationPanel
          currentStep={currentStep}
          totalSteps={totalSteps}
          result={result}
          activeStep={executedStep}
          currentCodeLine={currentCodeLine}
          queueBefore={queueBefore}
          queueAfter={queueAfter}
          currentLevel={currentLevel}
          indexInLevel={indexInLevel}
          dequeuedNode={dequeuedNode}
          enqueuedNodes={enqueuedNodes}
          capturedNode={capturedNode}
        />
      }
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





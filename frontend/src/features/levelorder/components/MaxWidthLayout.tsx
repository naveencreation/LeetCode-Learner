"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { ProblemFocusHeader } from "@/components/problem-focus-header";
import { ResizableTraversalGrid } from "@/features/shared/components/ResizableTraversalGrid";

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
  const [resetLayout, setResetLayout] = useState<(() => void) | null>(null);

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
    <section className="relative h-full min-h-0 overflow-hidden bg-[linear-gradient(140deg,#eff6ff_0%,#fdfdfc_60%,#eefbf9_100%)]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_15%_20%,#dff6f2_0%,transparent_30%),radial-gradient(circle_at_82%_10%,#fff4e8_0%,transparent_24%)]" />

      <div className="relative z-[1] grid h-full min-h-0 grid-rows-[auto_1fr] gap-[5px]">
        <ProblemFocusHeader
          title="Level Order of Binary Tree"
          subtitle="Queue-based BFS visualizer for level-by-level traversal"
          guideHref="/problems/binary-tree/levelorder-guide"
          extraActions={
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => resetLayout?.()}
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.04em] text-slate-700 transition hover:bg-slate-50"
                title="Reset all panel sizes"
              >
                Reset Layout
              </button>
            </div>
          }
          stats={[
            { label: "Step", value: `${currentStep}/${totalSteps}` },
            { label: "Levels", value: result.length },
            { label: "Max Level Size", value: maxWidth, minWidthClassName: "min-w-[110px]" },
          ]}
        />

      <ResizableTraversalGrid
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
        onResetReady={(resetFn) => setResetLayout(() => resetFn)}
        className="xl:grid-cols-[minmax(300px,1.2fr)_minmax(380px,1.45fr)_minmax(280px,1.05fr)]"
      />

      {isTreeSetupOpen ? (
        <TreeSetupModal
          root={root}
          selectedPreset={selectedPreset}
          presets={presets}
          customNodePositions={customNodePositions}
          onClose={closeTreeSetup}
          onApply={applyConfiguration}
          onApplyAndRun={applyAndRunConfiguration}
        />
      ) : null}
      </div>
    </section>
  );
}


"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { ProblemFocusHeader } from "@/components/problem-focus-header";

import { getCodeLineForStep } from "../selectors";
import { useVerticalOrderTraversal } from "../useTopViewTraversal";
import { CallStackPanel } from "./CallStackPanel";
import { CodePanel } from "./CodePanel";
import { ControlsBar } from "./ControlsBar";
import { ExplanationPanel } from "./ExplanationPanel";
import { ResultPanel } from "./ResultPanel";
import { TreePanel } from "./TreePanel";

const TreeSetupModal = dynamic(() =>
  import("./TreeSetupModal").then((module) => module.TreeSetupModal),
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
    operationBadge,
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
    <section className="relative h-full min-h-0 overflow-hidden bg-[linear-gradient(140deg,#eff6ff_0%,#fdfdfc_60%,#eefbf9_100%)]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_15%_20%,#dff6f2_0%,transparent_30%),radial-gradient(circle_at_82%_10%,#fff4e8_0%,transparent_24%)]" />

      <div className="relative z-[1] grid h-full min-h-0 grid-rows-[auto_1fr] gap-[5px]">
        <ProblemFocusHeader
          title="Vertical Order Traversal of Binary Tree"
          subtitle="Level-order visualizer: collect nodes by column, then sort by row/value"
          guideHref="/problems/binary-tree/verticalorder-guide"
          stats={[
            { label: "Step", value: `${currentStep}/${totalSteps}` },
            { label: "Columns", value: result.length },
            { label: "Result", value: resultText || "[]", minWidthClassName: "min-w-[180px]" },
          ]}
        />

      <div className="grid min-h-0 overflow-hidden gap-1.5 px-2 pb-2 md:px-3 md:pb-3 xl:grid-cols-[minmax(300px,1.2fr)_minmax(380px,1.45fr)_minmax(280px,1.05fr)] xl:grid-rows-[minmax(0,1.08fr)_minmax(0,0.92fr)_auto]">
        <div className="min-h-0 xl:row-span-3">
          <CodePanel currentCodeLine={currentCodeLine} executionLineNumbers={executionLineNumbers} />
        </div>

        <div className="min-h-0 xl:col-start-2 xl:row-start-1">
          <TreePanel
            root={root}
            currentOperation={currentOperation}
            operationBadge={operationBadge}
            nodeStates={nodeStates}
            activeStep={activeStep}
            currentStep={currentStep}
            executionSteps={executionSteps}
            customNodePositions={customNodePositions}
            onOpenTreeSetup={openTreeSetup}
          />
        </div>
        <div className="min-h-0 xl:col-start-2 xl:row-start-2">
          <ResultPanel
            currentNode={currentNode}
            currentPhase={currentPhase}
            result={result}
            columnKeys={columnKeys}
            currentStep={currentStep}
            totalSteps={totalSteps}
            currentOperation={currentOperation}
          />
        </div>

        <div className="min-h-0 grid gap-1 xl:col-start-3 xl:row-span-3 xl:grid-rows-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="min-h-0">
            <CallStackPanel activeCallStack={activeCallStack} />
          </div>
          <div className="min-h-0">
            <ExplanationPanel
              currentStep={currentStep}
              totalSteps={totalSteps}
              result={result}
              columnKeys={columnKeys}
              activeStep={executedStep}
            />
          </div>
        </div>

        <div className="min-h-0 self-end xl:col-start-2 xl:row-start-3">
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
        </div>
      </div>

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

export const VerticalOrderLayout = TopViewLayout;

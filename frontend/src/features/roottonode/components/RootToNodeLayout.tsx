"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { ProblemFocusHeader } from "@/components/problem-focus-header";
import { ResizableTraversalGrid } from "@/features/shared/components/ResizableTraversalGrid";

import { getCodeLineForStep } from "../selectors";
import { useRootToNodeTraversal } from "../useRootToNodeTraversal";
import { CallStackPanel } from "./CallStackPanel";
import { CodePanel } from "./CodePanel";
import { ControlsBar } from "./ControlsBar";
import { ExplanationPanel } from "./ExplanationPanel";
import { ResultPanel } from "./ResultPanel";
import { TreePanel } from "./TreePanel";

const TreeSetupModal = dynamic(() =>
  import("./TreeSetupModal").then((module) => module.TreeSetupModal),
);

export function RootToNodeLayout() {
  const [isTreeSetupOpen, setIsTreeSetupOpen] = useState(false);
  const [resetLayout, setResetLayout] = useState<(() => void) | null>(null);

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
    found,
    targetValue,
    setTargetValue,
    nodeValues,
    totalSteps,
    activeCallStack,
    activeStep,
    applyTreeConfiguration,
  } = useRootToNodeTraversal();

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

      <div className="relative z-[1] grid h-full min-h-0 grid-rows-[auto_1fr] gap-1.5">
        <ProblemFocusHeader
          title="Root To Node Path in Binary Tree"
          subtitle="DFS with backtracking path visualizer"
          guideHref="/problems/binary-tree/roottonode-guide"
          extraActions={
            <div className="flex items-center gap-1.5">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-slate-500">
                  Target
                </span>
                <select
                  value={String(targetValue)}
                  onChange={(event) => setTargetValue(Number(event.target.value))}
                  className="h-6 rounded border border-slate-300 bg-white px-1.5 text-[11px] font-extrabold text-slate-900 outline-none"
                >
                  {nodeValues.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

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
            { label: "Path", value: found ? `[${result.join(", ")}]` : "Not Found", minWidthClassName: "min-w-[110px]" },
          ]}
        />

      <ResizableTraversalGrid
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
            found={found}
            targetValue={targetValue}
            currentStep={currentStep}
            totalSteps={totalSteps}
            currentOperation={currentOperation}
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
            found={found}
            targetValue={targetValue}
            activeStep={executedStep}
            currentCodeLine={currentCodeLine}
          />
        }
        onResetReady={(resetFn) => setResetLayout(() => resetFn)}
        className="xl:grid-cols-[minmax(300px,1.2fr)_minmax(380px,1.45fr)_minmax(250px,0.95fr)]"
      />

      {isTreeSetupOpen ? (
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
      ) : null}
      </div>
    </section>
  );
}




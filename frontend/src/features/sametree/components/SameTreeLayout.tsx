"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { TraversalShell } from "@/features/shared/components/TraversalShell";
import { UnifiedControlsBar } from "@/features/shared/components/UnifiedControlsBar";

import { CodePanel } from "./CodePanel";
import { ExplanationPanel } from "./ExplanationPanel";
import { ResultPanel } from "./ResultPanel";
import { TreePanel } from "./TreePanel";
import { useSameTreeTraversal } from "../useSameTreeTraversal";
import { getCodeLineForStep } from "../selectors";

const TreeSetupModal = dynamic(() =>
  import("./TreeSetupModal").then((module) => module.TreeSetupModal),
);

export function SameTreeLayout() {
  const [isTreeSetupOpen, setIsTreeSetupOpen] = useState(false);

  const {
    currentCodeLine,
    currentNodeP,
    currentNodeQ,
    currentOperation,
    currentPhase,
    currentStep,
    executionSteps,
    rootP,
    rootQ,
    selectedPreset,
    presets,
    customNodePositionsP,
    customNodePositionsQ,
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
    nodeStatesP,
    nodeStatesQ,
    previousStep,
    resetTraversal,
    result,
    totalSteps,
    activeCallStack,
    activeStep,
    applyTreeConfiguration,
  } = useSameTreeTraversal();

  const executionLineNumbers = useMemo(() => {
    const lineNumbers = new Set<number>([currentCodeLine]);

    executionSteps.forEach((step) => {
      lineNumbers.add(getCodeLineForStep(step));
    });

    return Array.from(lineNumbers).sort((a, b) => a - b);
  }, [currentCodeLine, executionSteps]);

  const sameTreeResultText =
    result === null ? "Checking..." : result ? "Same \u2713" : "Different \u2717";

  const stackRows = activeCallStack.map((frame, index) => {
    const pair = frame as unknown as { nodeValP: number | null; nodeValQ: number | null; state: string; depth: number; id: number };

    return {
      id: pair.id ?? index,
      depth: pair.depth ?? 0,
      state: pair.state ?? "pending",
      label: `isSameTree(p=${pair.nodeValP ?? "null"}, q=${pair.nodeValQ ?? "null"})`,
    };
  });

  return (
    <TraversalShell
      title="Same Tree"
      subtitle="Compare two binary trees for structural and value equality"
      guideHref="/problems/binary-tree/same-tree-guide"
      currentHref="/problems/binary-tree/same-tree"
      stats={[
        { label: "Step", value: `${currentStep}/${totalSteps}` },
        { label: "Comparing", value: `p=${currentNodeP ?? "-"}, q=${currentNodeQ ?? "-"}` },
        { label: "Result", value: sameTreeResultText, minWidthClassName: "min-w-[130px]" },
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
            title="Tree P"
            root={rootP}
            currentOperation={currentOperation}
            nodeStates={nodeStatesP}
            treeKeyPrefix="p_"
            customNodePositions={customNodePositionsP}
            onOpenTreeSetup={() => setIsTreeSetupOpen(true)}
          />
          <TreePanel
            title="Tree Q"
            root={rootQ}
            currentOperation={currentOperation}
            nodeStates={nodeStatesQ}
            treeKeyPrefix="q_"
            customNodePositions={customNodePositionsQ}
            onOpenTreeSetup={() => setIsTreeSetupOpen(true)}
          />
        </div>
      }
      middleBottom={
        <ResultPanel
          currentNodeP={currentNodeP}
          currentNodeQ={currentNodeQ}
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
        <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_1fr] gap-2 p-2.5">
          <div className="traversal-panel-header">
            <h2 className="traversal-panel-title">Recursion Stack</h2>
          </div>
          <div className="min-h-0 space-y-1.5 overflow-auto rounded-[10px] border border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 p-2">
            {stackRows.length === 0 ? (
              <p className="flex min-h-full items-center justify-center py-8 text-center text-xs italic text-slate-500">
                Stack is empty. Click Next to begin!
              </p>
            ) : (
              stackRows.map((frame) => (
                <div
                  key={frame.id}
                  className={`rounded-lg border px-2 py-1.5 text-[11px] ${
                    frame.state === "executing"
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : frame.state === "returned"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-amber-200 bg-amber-50 text-amber-900"
                  }`}
                  style={{ marginLeft: `${frame.depth * 10}px` }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-800">{frame.label}</span>
                    <span className="rounded-full bg-black/5 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide">
                      {frame.state}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
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
            rootP={rootP}
            rootQ={rootQ}
            selectedPreset={selectedPreset}
            presets={presets}
            customNodePositionsP={customNodePositionsP}
            customNodePositionsQ={customNodePositionsQ}
            onClose={() => setIsTreeSetupOpen(false)}
            onApply={(nextP, nextQ, nextPositionsP, nextPositionsQ, preset) =>
              applyTreeConfiguration(
                nextP,
                nextQ,
                nextPositionsP,
                nextPositionsQ,
                preset,
                false,
              )
            }
            onApplyAndRun={(nextP, nextQ, nextPositionsP, nextPositionsQ, preset) =>
              applyTreeConfiguration(
                nextP,
                nextQ,
                nextPositionsP,
                nextPositionsQ,
                preset,
                true,
              )
            }
          />
        ) : null
      }
    />
  );
}

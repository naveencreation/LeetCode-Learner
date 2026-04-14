"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { TraversalShell } from "@/features/shared/components/TraversalShell";

import { getCodeLineForStep } from "../selectors";
import { useRootToNodeTraversal } from "../useRootToNodeTraversal";
import { UnifiedControlsBar } from "@/features/shared/components/UnifiedControlsBar";
import { UnifiedCallStackPanel } from "@/features/shared/components/UnifiedCallStackPanel";
import { CodePanel } from "./CodePanel";
import { ExplanationPanel } from "./ExplanationPanel";
import { ResultPanel } from "./ResultPanel";
import { TreePanel } from "./TreePanel";

const TreeSetupModal = dynamic(() =>
  import("./TreeSetupModal").then((module) => module.TreeSetupModal),
);

export function RootToNodeLayout() {
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
    <TraversalShell
      title="Root To Node Path in Binary Tree"
      subtitle="DFS with backtracking path visualizer"
      guideHref="/problems/binary-tree/roottonode-guide"
      currentHref="/problems/binary-tree/root-to-node-path-in-a-binary-tree"
      stats={[
        { label: "Step", value: `${currentStep}/${totalSteps}` },
        { label: "Path", value: found ? `[${result.join(", ")}]` : "Not Found", minWidthClassName: "min-w-[110px]" },
      ]}
      headerExtraActions={
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
      }
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
          frameFormatter={(frame) => `dfs(${frame.nodeVal})`}
        />
      }
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




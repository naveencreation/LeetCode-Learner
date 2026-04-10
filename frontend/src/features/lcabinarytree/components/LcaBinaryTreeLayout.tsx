"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { TraversalShell } from "@/features/shared/components/TraversalShell";
import { UnifiedControlsBar } from "@/features/shared/components/UnifiedControlsBar";
import { UnifiedCallStackPanel } from "@/features/shared/components/UnifiedCallStackPanel";

import { getCodeLineForStep } from "../selectors";
import { useLcaTraversal } from "../useLcaTraversal";
import { CodePanel } from "./CodePanel";
import { ExplanationPanel } from "./ExplanationPanel";
import { ResultPanel } from "./ResultPanel";
import { TreePanel } from "./TreePanel";

const TreeSetupModal = dynamic(() =>
  import("./TreeSetupModal").then((module) => module.TreeSetupModal),
);

export function LcaBinaryTreeLayout() {
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
    targetP,
    targetQ,
    setTargetNodes,
  } = useLcaTraversal();

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
      title="LCA in Binary Tree"
      subtitle="Find the lowest common ancestor using one recursive traversal"
      guideHref="/problems/binary-tree/lca-in-binary-tree-guide"
      headerExtraActions={
        <div className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.04em] text-emerald-800">
          <span className="text-emerald-700">Targets:</span>
          <span className="rounded-full border border-emerald-300 bg-white px-2 py-0.5 text-emerald-900">
            p={targetP ?? "-"}
          </span>
          <span className="rounded-full border border-emerald-300 bg-white px-2 py-0.5 text-emerald-900">
            q={targetQ ?? "-"}
          </span>
        </div>
      }
      stats={[
        { label: "Step", value: `${currentStep}/${totalSteps}` },
        { label: "Processed", value: processedCount },
        { label: "Result", value: result !== null ? `LCA=${result}` : "LCA=?", minWidthClassName: "min-w-[110px]" },
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
          frameFormatter={(frame) => `lca(${frame.nodeVal})`}
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
            selectedTargetP={targetP}
            selectedTargetQ={targetQ}
            onClose={() => setIsTreeSetupOpen(false)}
            onApply={(nextRoot, nextPositions, preset, nextTargetP, nextTargetQ) => {
              setTargetNodes(nextTargetP, nextTargetQ);
              applyTreeConfiguration(nextRoot, nextPositions, preset, false)
            }}
            onApplyAndRun={(nextRoot, nextPositions, preset, nextTargetP, nextTargetQ) => {
              setTargetNodes(nextTargetP, nextTargetQ);
              applyTreeConfiguration(nextRoot, nextPositions, preset, true)
            }}
          />
        ) : null
      }
    />
  );
}


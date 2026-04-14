"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { TraversalShell } from "@/features/shared/components/TraversalShell";
import { UnifiedControlsBar } from "@/features/shared/components/UnifiedControlsBar";
import { UnifiedCallStackPanel } from "@/features/shared/components/UnifiedCallStackPanel";

import { getCodeLineForStep } from "../selectors";
import { CodePanel } from "./CodePanel";
import { ExplanationPanel } from "./ExplanationPanel";
import { ResultPanel } from "./ResultPanel";
import { TreePanel } from "./TreePanel";
import { useSymmetricTreeTraversal } from "../useSymmetricTreeTraversal";

const TreeSetupModal = dynamic(() =>
  import("./TreeSetupModal").then((module) => ({ default: module.TreeSetupModal })),
);

export function SymmetricTreeLayout() {
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
  } = useSymmetricTreeTraversal();

  const executionLineNumbers = useMemo(() => {
    const lineNumbers = new Set<number>([currentCodeLine]);
    executionSteps.forEach((step) => {
      lineNumbers.add(getCodeLineForStep(step));
    });
    return Array.from(lineNumbers).sort((a, b) => a - b);
  }, [currentCodeLine, executionSteps]);

  const symmetricResult = useMemo<boolean | null>(() => {
    if (currentStep === 0) return null;
    if (currentStep >= totalSteps) return result as boolean | null;
    return null;
  }, [currentStep, totalSteps, result]);

  return (
    <TraversalShell
      title="Symmetric Tree"
      subtitle="Check if a binary tree is a mirror of itself"
      guideHref="/problems/binary-tree/symmetric-tree-guide"
      currentHref="/problems/binary-tree/symmetric-tree"
      stats={[
        { label: "Step", value: `${currentStep}/${totalSteps}` },
        { label: "Comparing", value: currentNode ?? "-" },
        { 
          label: "Result", 
          value: symmetricResult === null ? "Checking..." : <span className="inline-flex items-center gap-1">{symmetricResult ? <><CheckCircle2 size={12} className="text-emerald-600" />Symmetric</> : <><XCircle size={12} className="text-rose-500" />Not Symmetric</>}</span>, 
          minWidthClassName: "min-w-[130px]" 
        },
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
          result={result as boolean | null}
          currentStep={currentStep}
          totalSteps={totalSteps}
          currentOperation={currentOperation}
          symmetricResult={symmetricResult}
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
          frameFormatter={(frame) => `isMirror(${frame.nodeVal ?? 'null'}, ${frame.nodeVal ?? 'null'})`}
        />
      }
      rightBottom={
        <ExplanationPanel
          currentStep={currentStep}
          totalSteps={totalSteps}
          result={result as boolean | null}
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

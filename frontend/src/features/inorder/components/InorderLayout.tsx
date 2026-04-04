"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import { getCodeLineForStep } from "../selectors";
import { useInorderTraversal } from "../useInorderTraversal";
import { CallStackPanel } from "./CallStackPanel";
import { CodePanel } from "./CodePanel";
import { ControlsBar } from "./ControlsBar";
import { ExplanationPanel } from "./ExplanationPanel";
import { ResultPanel } from "./ResultPanel";
import { TreePanel } from "./TreePanel";

const TreeSetupModal = dynamic(() =>
  import("./TreeSetupModal").then((module) => module.TreeSetupModal),
);

export function InorderLayout() {
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
    operationBadge,
    previousStep,
    resetTraversal,
    result,
    totalSteps,
    activeCallStack,
    activeStep,
    applyTreeConfiguration,
  } = useInorderTraversal();

  const executionLineNumbers = useMemo(() => {
    const lineNumbers = new Set<number>([currentCodeLine]);

    executionSteps.forEach((step) => {
      lineNumbers.add(getCodeLineForStep(step));
    });

    return Array.from(lineNumbers).sort((a, b) => a - b);
  }, [currentCodeLine, executionSteps]);

  return (
    <section className="relative h-full min-h-0 overflow-hidden rounded-[18px] border border-white/80 bg-[linear-gradient(140deg,#eff6ff_0%,#fdfdfc_60%,#eefbf9_100%)] p-2.5 shadow-[0_12px_34px_rgba(15,23,42,0.12)]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_15%_20%,#dff6f2_0%,transparent_30%),radial-gradient(circle_at_82%_10%,#fff4e8_0%,transparent_24%)]" />

      <div className="relative z-[1] grid h-full min-h-0 grid-rows-[auto_1fr] gap-1.5">
      <header className="shrink-0 grid items-center gap-1.5 lg:grid-cols-[minmax(280px,1fr)_auto]">
        <div className="min-w-0">
          <h1 className="text-[clamp(20px,2vw,28px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-slate-900">
            Inorder Tree Traversal
          </h1>
          <p className="mt-0.5 text-xs font-semibold text-slate-500">
            Left -&gt; Root -&gt; Right recursion visualizer
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-start gap-2 lg:justify-end">
            <Link
              href="/problems/binary-tree/inorder-guide"
              className="inline-flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1.5 text-[12px] font-extrabold text-teal-700 transition hover:bg-teal-100"
            >
              Read Here
            </Link>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-slate-500">
              Step
            </span>
            <span className="text-[13px] font-extrabold text-slate-900">
              {currentStep}/{totalSteps}
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-slate-500">
              Visited
            </span>
            <span className="text-[13px] font-extrabold text-slate-900">{result.length}</span>
          </div>
          <div className="inline-flex min-w-[110px] items-center justify-between gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-slate-500">
              Result
            </span>
            <span className="truncate text-[13px] font-extrabold text-slate-900">[{result.join(", ")}]</span>
          </div>
          <Link
            href="/problems/topics/trees#problem-list"
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            ← Back To Trees List
          </Link>
        </div>
      </header>

      <div className="grid min-h-0 overflow-hidden gap-1.5 xl:grid-cols-[minmax(300px,1.2fr)_minmax(380px,1.45fr)_minmax(250px,0.95fr)] xl:grid-rows-[minmax(0,1.26fr)_minmax(0,0.74fr)_auto]">
        <div className="min-h-0 xl:row-span-3">
          <CodePanel
            currentCodeLine={currentCodeLine}
            executionLineNumbers={executionLineNumbers}
          />
        </div>

        <div className="min-h-0 xl:col-start-2 xl:row-start-1">
          <TreePanel
            root={root}
            currentOperation={currentOperation}
            operationBadge={operationBadge}
            nodeStates={nodeStates}
            activeStep={activeStep}
            customNodePositions={customNodePositions}
            onOpenTreeSetup={() => setIsTreeSetupOpen(true)}
          />
        </div>
        <div className="min-h-0 xl:col-start-2 xl:row-start-2">
          <ResultPanel
            currentNode={currentNode}
            currentPhase={currentPhase}
            result={result}
            currentStep={currentStep}
            totalSteps={totalSteps}
            currentOperation={currentOperation}
          />
        </div>

        <div className="min-h-0 grid gap-1.5 xl:col-start-3 xl:row-span-3 xl:grid-rows-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <div className="min-h-0">
            <CallStackPanel activeCallStack={activeCallStack} />
          </div>
          <div className="min-h-0">
            <ExplanationPanel
              currentStep={currentStep}
              totalSteps={totalSteps}
              result={result}
              activeStep={executedStep}
              currentCodeLine={currentCodeLine}
            />
          </div>
        </div>

        <div className="min-h-0 xl:col-start-2 xl:row-start-3">
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

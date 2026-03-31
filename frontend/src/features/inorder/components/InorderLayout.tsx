"use client";

import { useInorderTraversal } from "../useInorderTraversal";
import { CallStackPanel } from "./CallStackPanel";
import { CodePanel } from "./CodePanel";
import { ControlsBar } from "./ControlsBar";
import { ExplanationPanel } from "./ExplanationPanel";
import { ResultPanel } from "./ResultPanel";
import { TreePanel } from "./TreePanel";

export function InorderLayout() {
  const {
    currentCodeLine,
    currentNode,
    currentOperation,
    currentPhase,
    currentStep,
    executedStep,
    isAtEnd,
    isAtStart,
    nextStep,
    nodeStates,
    operationBadge,
    previousStep,
    resetTraversal,
    result,
    totalSteps,
    activeCallStack,
    activeStep,
  } = useInorderTraversal();

  return (
    <section className="relative h-full min-h-0 overflow-hidden rounded-[18px] border border-white/80 bg-[linear-gradient(140deg,#eff6ff_0%,#fdfdfc_60%,#eefbf9_100%)] p-3 shadow-[0_12px_34px_rgba(15,23,42,0.12)]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_15%_20%,#dff6f2_0%,transparent_30%),radial-gradient(circle_at_82%_10%,#fff4e8_0%,transparent_24%)]" />

      <div className="relative z-[1] grid h-full min-h-0 grid-rows-[auto_1fr_auto] gap-2">
      <header className="grid items-center gap-2 lg:grid-cols-[minmax(280px,1fr)_auto]">
        <div className="min-w-0">
          <h1 className="text-[clamp(20px,2vw,28px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-slate-900">
            Inorder Tree Traversal
          </h1>
          <p className="mt-0.5 text-xs font-semibold text-slate-500">
            Left -&gt; Root -&gt; Right recursion visualizer
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-start gap-2 lg:justify-end">
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
        </div>
      </header>

      <div className="grid min-h-0 gap-2 xl:grid-cols-[minmax(250px,1.05fr)_minmax(390px,1.5fr)_minmax(260px,1.1fr)] xl:grid-rows-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="space-y-2 xl:row-span-2">
          <CodePanel currentCodeLine={currentCodeLine} />
        </div>

        <div className="space-y-2 xl:col-start-2 xl:row-start-1">
          <TreePanel
            currentOperation={currentOperation}
            operationBadge={operationBadge}
            nodeStates={nodeStates}
            activeStep={activeStep}
          />
        </div>
        <div className="space-y-2 xl:col-start-2 xl:row-start-2">
          <ResultPanel
            currentNode={currentNode}
            currentPhase={currentPhase}
            result={result}
            currentStep={currentStep}
            totalSteps={totalSteps}
            currentOperation={currentOperation}
          />
        </div>

        <div className="space-y-2 xl:col-start-3 xl:row-start-1">
          <CallStackPanel activeCallStack={activeCallStack} />
        </div>
        <div className="space-y-2 xl:col-start-3 xl:row-start-2">
          <ExplanationPanel
            currentStep={currentStep}
            totalSteps={totalSteps}
            result={result}
            activeStep={executedStep}
          />
        </div>
      </div>

      <ControlsBar
        isAtStart={isAtStart}
        isAtEnd={isAtEnd}
        nextStep={nextStep}
        previousStep={previousStep}
        resetTraversal={resetTraversal}
      />
      </div>
    </section>
  );
}

import { CheckCircle2, ArrowRight } from "lucide-react";
import type { ExecutionStep } from "../types";

interface ResultPanelProps {
  targetNode: number | null;
  n: number;
  currentPhase: string;
  currentStep: number;
  totalSteps: number;
  currentOperation: string;
  activeStep: ExecutionStep | undefined;
}

export function ResultPanel({
  targetNode,
  n,
  currentPhase,
  currentStep,
  totalSteps,
  currentOperation,
  activeStep,
}: ResultPanelProps) {
  const completionMessage =
    currentStep === 0
      ? `Press "Start" to create dummy node and initialize pointers, n = ${n}.`
      : currentStep >= totalSteps
      ? `Complete! Removed node ${targetNode ?? "—"}. Return dummy.next as new head.`
      : `Step ${currentStep} / ${totalSteps}: ${currentOperation}`;

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_minmax(0,1fr)] gap-1.5 p-2">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">Algorithm Progress</h2>
      </div>

      <div className="ui-scrollbar min-h-0 overflow-y-auto pr-1">
        <div className="grid content-start gap-1.5">
          {/* Target Node + Phase cards */}
          <div className="grid grid-cols-2 gap-1.5">
            <div className="rounded-lg border bg-gradient-to-br from-rose-700 to-rose-500 p-1.5 text-center text-white transition-all duration-200">
              <p className="text-[10px] font-bold uppercase tracking-[0.03em] text-rose-100">
                Target Node
              </p>
              <p className="mt-0.5 text-xl font-extrabold">{targetNode ?? "—"}</p>
            </div>
            <div className="rounded-lg border bg-gradient-to-br from-teal-700 to-teal-500 p-1.5 text-center text-white transition-all duration-200">
              <p className="text-[10px] font-bold uppercase tracking-[0.03em] text-teal-100">
                Phase
              </p>
              <p className="mt-0.5 truncate text-xl font-extrabold">{currentPhase}</p>
            </div>
          </div>

          {/* Pointers visualization */}
          <div className="grid gap-1 rounded-lg">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.03em] text-slate-700">
              Pointer Positions
            </p>
            <div className="grid grid-cols-3 gap-1.5 rounded-lg border border-slate-200 bg-white p-1.5">
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-1.5 text-center">
                <p className="text-[9px] font-bold uppercase tracking-wide text-amber-600">Slow</p>
                <p className="text-[14px] font-extrabold text-amber-800">{activeStep?.pointers.slow === null ? "dummy" : activeStep?.pointers.slow}</p>
              </div>
              <div className="rounded-lg border border-blue-200 bg-blue-50 px-2 py-1.5 text-center">
                <p className="text-[9px] font-bold uppercase tracking-wide text-blue-600">Fast</p>
                <p className="text-[14px] font-extrabold text-blue-800">{activeStep?.pointers.fast ?? "None"}</p>
              </div>
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1.5 text-center">
                <p className="text-[9px] font-bold uppercase tracking-wide text-rose-600">Target</p>
                <p className="text-[14px] font-extrabold text-rose-800">{activeStep?.pointers.target ?? "—"}</p>
              </div>
            </div>
          </div>

          {/* N parameter */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-2">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
              N Parameter
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-slate-700">
              Remove the {n}{n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th"} node from the end of the list.
            </p>
          </div>

          {/* Algorithm insight */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-2">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
              Algorithm Insight
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-slate-700">
              The dummy node pattern: create a node (0) pointing to head. Fast starts at head, 
              slow at dummy. Fast moves n steps ahead, then both move until fast is null. 
              Slow ends up before target. Works for all cases including head removal. O(n) time, O(1) space.
            </p>
          </div>

          {/* Step message */}
          <div
            className={`rounded-lg border px-2 py-1.5 text-[11px] leading-snug transition-all duration-300 ${
              currentStep >= totalSteps
                ? "border-emerald-200 bg-emerald-50 font-bold text-emerald-900"
                : "border-amber-200 bg-amber-50 text-amber-900"
            }`}
          >
            {currentStep >= totalSteps ? (
              <><CheckCircle2 size={14} className="inline shrink-0 text-emerald-600" />{" "}</>
            ) : (
              <><ArrowRight size={14} className="inline shrink-0 text-amber-500" />{" "}</>
            )}
            <span className="font-bold">{completionMessage}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

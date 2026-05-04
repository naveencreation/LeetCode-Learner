import { CheckCircle2, ArrowRight } from "lucide-react";
import type { ExecutionStep } from "../types";

interface ResultPanelProps {
  currentStep: number;
  totalSteps: number;
  currentOperation: string;
  currentPhase: string;
  activeStep: ExecutionStep | undefined;
  k: number;
}

export function ResultPanel({
  currentStep,
  totalSteps,
  currentOperation,
  currentPhase,
  activeStep,
  k,
}: ResultPanelProps) {
  const completionMessage =
    currentStep === 0
      ? `Press "Start" to reverse nodes in groups of size ${k}.`
      : currentStep >= totalSteps
      ? `Complete! Reversed ${activeStep?.pointers.groupEnd ?? 0} nodes in groups of ${k}.`
      : `Step ${currentStep} / ${totalSteps}: ${currentOperation}`;

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_minmax(0,1fr)] gap-1.5 p-2">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">Algorithm Progress</h2>
      </div>

      <div className="ui-scrollbar min-h-0 overflow-y-auto pr-1">
        <div className="grid content-start gap-1.5">
          {/* Group Size + Phase cards */}
          <div className="grid grid-cols-2 gap-1.5">
            <div className="rounded-lg border bg-gradient-to-br from-violet-700 to-violet-500 p-1.5 text-center text-white transition-all duration-200">
              <p className="text-[10px] font-bold uppercase tracking-[0.03em] text-violet-100">
                Group Size (k)
              </p>
              <p className="mt-0.5 text-xl font-extrabold">{k}</p>
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
            <div className="grid grid-cols-2 gap-1.5 rounded-lg border border-slate-200 bg-white p-1.5">
              <div className="rounded-lg border border-violet-200 bg-violet-50 px-2 py-1.5 text-center">
                <p className="text-[9px] font-bold uppercase tracking-wide text-violet-600">Current</p>
                <p className="text-[14px] font-extrabold text-violet-800">{activeStep?.pointers.current ?? "None"}</p>
              </div>
              <div className="rounded-lg border border-blue-200 bg-blue-50 px-2 py-1.5 text-center">
                <p className="text-[9px] font-bold uppercase tracking-wide text-blue-600">Group Start</p>
                <p className="text-[14px] font-extrabold text-blue-800">{activeStep?.pointers.groupStart ?? "None"}</p>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1.5 text-center">
                <p className="text-[9px] font-bold uppercase tracking-wide text-emerald-600">Group End</p>
                <p className="text-[14px] font-extrabold text-emerald-800">{activeStep?.pointers.groupEnd ?? "None"}</p>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-1.5 text-center">
                <p className="text-[9px] font-bold uppercase tracking-wide text-amber-600">Prev Group End</p>
                <p className="text-[14px] font-extrabold text-amber-800">{activeStep?.pointers.prevGroupEnd ?? "None"}</p>
              </div>
            </div>
          </div>

          {/* Algorithm insight */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-2">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
              Algorithm Insight
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-slate-700">
              Reverse nodes in groups of size k using three-pointer technique. 
              Incomplete groups at the end stay in original order. O(n) time, O(1) space.
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

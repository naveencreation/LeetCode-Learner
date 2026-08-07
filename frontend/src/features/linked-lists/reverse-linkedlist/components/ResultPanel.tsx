import { CheckCircle2, ArrowRight } from "lucide-react";
import type { ExecutionStep } from "../types";

interface ResultPanelProps {
  currentNode: number | null;
  currentPhase: string;
  currentStep: number;
  totalSteps: number;
  currentOperation: string;
  activeStep: ExecutionStep | undefined;
}

export function ResultPanel({
  currentNode,
  currentPhase,
  currentStep,
  totalSteps,
  currentOperation,
  activeStep,
}: ResultPanelProps) {
  // Build reversed list so far from the links snapshot
  const reversedSoFar: number[] = [];
  if (activeStep) {
    const links = activeStep.links;
    const prevVal = activeStep.pointers.prev;
    if (prevVal !== null) {
      let v: number | null = prevVal;
      const visited = new Set<number>();
      while (v !== null && !visited.has(v)) {
        visited.add(v);
        reversedSoFar.push(v);
        v = links[v] ?? null;
      }
    }
  }

  const completionMessage =
    currentStep === 0
      ? "Press Next to initialize pointers."
      : currentStep >= totalSteps
      ? `Complete! Reversed: [${reversedSoFar.join(", ")}]`
      : `Step ${currentStep} / ${totalSteps}: ${currentOperation}`;

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_minmax(0,1fr)] gap-1.5 p-2">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">Reversal Progress</h2>
      </div>

      <div className="ui-scrollbar min-h-0 overflow-y-auto pr-1">
        <div className="grid content-start gap-1.5">
          {/* Current Node + Phase cards */}
          <div className="grid grid-cols-2 gap-1.5">
            <div className="rounded-lg border bg-gradient-to-br from-teal-700 to-teal-500 p-1.5 text-center text-white transition-all duration-200">
              <p className="text-[10px] font-bold uppercase tracking-[0.03em] text-teal-100">
                Current Node
              </p>
              <p className="mt-0.5 text-xl font-extrabold">{currentNode ?? "-"}</p>
            </div>
            <div className="rounded-lg border bg-gradient-to-br from-teal-700 to-teal-500 p-1.5 text-center text-white transition-all duration-200">
              <p className="text-[10px] font-bold uppercase tracking-[0.03em] text-teal-100">
                Phase
              </p>
              <p className="mt-0.5 truncate text-xl font-extrabold">{currentPhase}</p>
            </div>
          </div>

          {/* Reversed portion — animated badges */}
          <div className="grid gap-1 rounded-lg">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.03em] text-slate-700">
              Reversed So Far
            </p>
            <div className="flex min-h-[36px] flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-1.5">
              {reversedSoFar.length === 0 ? (
                <span className="text-[11px] text-slate-400">
                  Reversed nodes appear here...
                </span>
              ) : (
                reversedSoFar.map((value, index) => (
                  <span
                    key={`${value}-${index}`}
                    className="animate-badge-pop inline-flex items-center justify-center rounded-full bg-gradient-to-r from-teal-700 to-teal-400 px-2.5 py-1 text-xs font-extrabold text-white"
                  >
                    {value}
                  </span>
                ))
              )}
            </div>
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

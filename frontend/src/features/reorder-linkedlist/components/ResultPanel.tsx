import { CheckCircle2, ArrowRight } from "lucide-react";
import type { ExecutionStep, ReorderPhase } from "../types";

interface ResultPanelProps {
  currentPhase: ReorderPhase | string;
  currentStep: number;
  totalSteps: number;
  currentOperation: string;
  activeStep: ExecutionStep | undefined;
  originalValues: number[];
}

/** Computes the reordered chain so far by walking the links map from head. */
function computeReorderedSoFar(
  activeStep: ExecutionStep | undefined,
  originalValues: number[],
): number[] {
  if (!activeStep) return [];
  const links = activeStep.links;
  const head = originalValues[0];
  if (head === undefined) return [];

  const result: number[] = [];
  const visited = new Set<number>();
  let v: number | null = head;
  while (v !== null && !visited.has(v)) {
    visited.add(v);
    result.push(v);
    v = links[v] ?? null;
  }
  return result;
}

const PHASE_GRADIENT: Record<string, string> = {
  "Find Middle": "from-cyan-700 to-cyan-500",
  "Reverse":     "from-purple-700 to-purple-500",
  "Merge":       "from-amber-700 to-amber-500",
  "Done":        "from-emerald-700 to-emerald-500",
};

export function ResultPanel({
  currentPhase,
  currentStep,
  totalSteps,
  currentOperation,
  activeStep,
  originalValues,
}: ResultPanelProps) {
  const reorderedSoFar = computeReorderedSoFar(activeStep, originalValues);

  const completionMessage =
    currentStep === 0
      ? "Press Next to begin."
      : currentStep >= totalSteps
      ? `Complete! Result: [${reorderedSoFar.join(" → ")}]`
      : `Step ${currentStep} / ${totalSteps}: ${currentOperation}`;

  const phaseGradient = PHASE_GRADIENT[currentPhase] ?? PHASE_GRADIENT["Find Middle"];

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_minmax(0,1fr)] gap-1.5 p-2">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">Reorder Progress</h2>
      </div>

      <div className="ui-scrollbar min-h-0 overflow-y-auto pr-1">
        <div className="grid content-start gap-1.5">
          {/* Phase card */}
          <div
            className={`rounded-lg border bg-gradient-to-br ${phaseGradient} p-1.5 text-center text-white transition-all duration-300`}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.03em] text-white/70">
              Current Phase
            </p>
            <p className="mt-0.5 truncate text-xl font-extrabold">{currentPhase}</p>
          </div>

          {/* Reordered chain so far */}
          <div className="grid gap-1 rounded-lg">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.03em] text-slate-700">
              Reordered Chain
            </p>
            <div className="flex min-h-[36px] flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-white p-1.5">
              {reorderedSoFar.length === 0 ? (
                <span className="text-[11px] text-slate-400">
                  Reordered nodes appear here...
                </span>
              ) : (
                reorderedSoFar.map((value, index) => (
                  <span key={`${value}-${index}`} className="inline-flex items-center gap-0.5">
                    <span className="animate-badge-pop inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-700 to-indigo-400 px-2.5 py-1 text-xs font-extrabold text-white">
                      {value}
                    </span>
                    {index < reorderedSoFar.length - 1 && (
                      <ArrowRight size={10} className="text-slate-400" />
                    )}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Phase legend */}
          <div className="grid grid-cols-2 gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-[10px]">
            <div className="flex items-center gap-1 rounded px-1 py-0.5">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
              <span className="font-bold text-slate-700">Find Middle</span>
            </div>
            <div className="flex items-center gap-1 rounded px-1 py-0.5">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
              <span className="font-bold text-slate-700">Reverse Half</span>
            </div>
            <div className="flex items-center gap-1 rounded px-1 py-0.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span className="font-bold text-slate-700">Merge/Interleave</span>
            </div>
            <div className="flex items-center gap-1 rounded px-1 py-0.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="font-bold text-slate-700">Done</span>
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

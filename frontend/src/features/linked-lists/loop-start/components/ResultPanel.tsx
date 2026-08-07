import type { ExecutionStep } from "../types";

interface ResultPanelProps {
  cycleStartValue: number | null;
  currentPhase: string;
  currentStep: number;
  totalSteps: number;
  currentOperation: string;
  activeStep: ExecutionStep | undefined;
}

export function ResultPanel({
  cycleStartValue,
  currentPhase,
  currentStep,
  totalSteps,
}: ResultPanelProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_1fr] gap-2 p-2.5">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">Progress</h2>
      </div>

      <div className="flex flex-col gap-2">
        <div className="relative h-2 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-sky-500 to-sky-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {currentPhase === "Result" && cycleStartValue !== null ? (
          <div className="rounded-[10px] border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600 mb-1">
              Cycle Start Found
            </p>
            <p className="text-sm font-semibold text-emerald-800 mb-1">
              Cycle starts at node {cycleStartValue}
            </p>
            <p className="text-[11px] text-slate-600">
              Time O(n), Space O(1)
            </p>
          </div>
        ) : currentPhase === "Result" && cycleStartValue === null ? (
          <div className="rounded-[10px] border border-slate-200 bg-slate-50 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1">
              No Cycle Found
            </p>
            <p className="text-sm font-semibold text-slate-800">
              This linked list has no cycle.
            </p>
          </div>
        ) : (
          <div className="rounded-[10px] border border-slate-200 bg-white p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1">
              Processing
            </p>
            <p className="text-xs text-slate-600">
              Searching for the starting point of the cycle...
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

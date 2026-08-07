import type { ExecutionStep } from "../types";

interface ResultPanelProps {
  currentPhase: string;
  currentStep: number;
  totalSteps: number;
  currentOperation: string;
  activeStep: ExecutionStep | undefined;
  originalValues: number[];
}

export function ResultPanel({ currentPhase, currentStep, totalSteps }: ResultPanelProps) {
  const progress = (currentStep / totalSteps) * 100;
  const isDone = currentPhase === "Result";

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_1fr] gap-2 p-2.5">
      <div className="traversal-panel-header"><h2 className="traversal-panel-title">Progress</h2></div>
      <div className="flex flex-col gap-2">
        <div className="relative h-2 rounded-full bg-slate-200 overflow-hidden">
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-sky-500 to-sky-600 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        {isDone ? (
          <div className="rounded-[10px] border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600 mb-1">Clone Complete</p>
            <p className="text-sm font-semibold text-emerald-800 mb-1">Deep copy created successfully.</p>
            <p className="text-[11px] text-slate-600">Time O(n), Space O(1) extra (in-place weaving)</p>
          </div>
        ) : (
          <div className="rounded-[10px] border border-slate-200 bg-white p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1">Processing</p>
            <p className="text-xs text-slate-600">Creating deep copy with next and random pointers...</p>
          </div>
        )}
      </div>
    </section>
  );
}

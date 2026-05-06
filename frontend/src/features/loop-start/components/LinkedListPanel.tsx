import { Info } from "lucide-react";
import { LinkedListSVG } from "@/features/shared/components/LinkedListSVG";
import type { LinkedListNodeState } from "@/features/shared/linked-list-types";
import type { ExecutionStep } from "../types";

interface LinkedListPanelProps {
  originalValues: number[];
  nodeStates: Record<number, LinkedListNodeState>;
  activeStep: ExecutionStep | undefined;
  currentOperation: string;
  currentStep: number;
  totalSteps: number;
  currentPhase: string;
  onOpenListSetup: () => void;
}

export function LinkedListPanel({
  originalValues,
  nodeStates,
  activeStep,
  currentOperation,
  currentStep,
  totalSteps,
  currentPhase,
  onOpenListSetup,
}: LinkedListPanelProps) {
  const pointers = {
    prev: null as number | null,
    curr: activeStep?.pointers.slow ?? null,
    nextSaved: activeStep?.pointers.fast ?? null,
    slow: activeStep?.pointers.slow ?? null,
    fast: activeStep?.pointers.fast ?? null,
  };

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_auto_1fr] gap-2 p-2.5">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">Linked List</h2>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-md border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-sky-700">
            <Info size={12} strokeWidth={2.3} aria-hidden="true" />
            <span>{currentOperation}</span>
          </span>
          <button
            type="button"
            onClick={onOpenListSetup}
            className="traversal-pill"
          >
            List Setup
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5 rounded-[10px] border border-slate-200 bg-white/85 p-1.5">
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-center">
          <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Step</p>
          <p className="text-[11px] font-extrabold text-slate-800">{currentStep} / {totalSteps}</p>
        </div>
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-2 py-1 text-center">
          <p className="text-[9px] font-bold uppercase tracking-wide text-cyan-600">Phase</p>
          <p className="truncate text-[11px] font-extrabold text-cyan-800">{currentPhase}</p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-center">
          <p className="text-[9px] font-bold uppercase tracking-wide text-emerald-600">Nodes</p>
          <p className="text-[11px] font-extrabold text-emerald-800">{originalValues.length}</p>
        </div>
      </div>

      <div className="rounded-[10px] border border-slate-200 bg-gradient-to-b from-[#f8faff] to-[#f0f4fb] p-3">
        <LinkedListSVG
          values={originalValues}
          nodeStates={nodeStates}
          links={activeStep?.links ?? {}}
          pointers={pointers}
        />
      </div>
    </section>
  );
}

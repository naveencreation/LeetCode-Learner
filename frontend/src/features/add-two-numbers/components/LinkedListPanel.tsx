import { Info } from "lucide-react";
import { LinkedListSVG } from "@/features/shared/components/LinkedListSVG";
import type { LinkedListNodeState } from "@/features/shared/linked-list-types";
import type { ExecutionStep, ListData } from "../types";

interface LinkedListPanelProps {
  list1Data: ListData;
  list2Data: ListData;
  resultData: ListData;
  activeStep: ExecutionStep | undefined;
  currentOperation: string;
  currentStep: number;
  totalSteps: number;
  currentPhase: string;
  onOpenListSetup: () => void;
}

export function LinkedListPanel({
  list1Data,
  list2Data,
  resultData,
  activeStep,
  currentOperation,
  currentStep,
  totalSteps,
  currentPhase,
  onOpenListSetup,
}: LinkedListPanelProps) {
  const pointers = {
    prev: null as number | null,
    curr: activeStep?.pointers.current ?? null,
    nextSaved: null as number | null,
    slow: null as number | null,
    fast: null as number | null,
  };

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_auto_1fr] gap-2 p-2.5">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">Linked Lists</h2>
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
            Configure Lists
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
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-center">
          <p className="text-[9px] font-bold uppercase tracking-wide text-amber-600">Carry</p>
          <p className="text-[11px] font-extrabold text-amber-800">{activeStep?.pointers.carry ?? 0}</p>
        </div>
      </div>

      <div className="grid grid-rows-3 gap-2 h-full min-h-0 overflow-hidden">
        <div className="rounded-[10px] border border-slate-200 bg-gradient-to-b from-[#f8faff] to-[#f0f4fb] p-2">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1">List 1</p>
          <div className="flex items-center justify-center h-16">
            <LinkedListSVG
              values={list1Data.values}
              nodeStates={list1Data.nodeStates}
              links={list1Data.links}
              pointers={{ prev: null, curr: activeStep?.pointers.l1 ?? null, nextSaved: null, slow: null, fast: null }}
            />
          </div>
        </div>

        <div className="rounded-[10px] border border-slate-200 bg-gradient-to-b from-[#f8faff] to-[#f0f4fb] p-2">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1">List 2</p>
          <div className="flex items-center justify-center h-16">
            <LinkedListSVG
              values={list2Data.values}
              nodeStates={list2Data.nodeStates}
              links={list2Data.links}
              pointers={{ prev: null, curr: activeStep?.pointers.l2 ?? null, nextSaved: null, slow: null, fast: null }}
            />
          </div>
        </div>

        <div className="rounded-[10px] border border-emerald-200 bg-gradient-to-b from-[#f0fdf4] to-[#dcfce7] p-2">
          <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600 mb-1">Result</p>
          <div className="flex items-center justify-center h-16">
            <LinkedListSVG
              values={resultData.values}
              nodeStates={resultData.nodeStates}
              links={resultData.links}
              pointers={pointers}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

import { Info } from "lucide-react";
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
  originalValues, nodeStates, activeStep, currentOperation, currentStep, totalSteps, currentPhase, onOpenListSetup,
}: LinkedListPanelProps) {
  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_auto_1fr] gap-2 p-2.5">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">Linked List</h2>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-md border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-sky-700">
            <Info size={12} strokeWidth={2.3} aria-hidden="true" />
            <span>{currentOperation}</span>
          </span>
          <button type="button" onClick={onOpenListSetup} className="traversal-pill">List Setup</button>
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
      <div className="rounded-[10px] border border-slate-200 bg-gradient-to-b from-[#f8faff] to-[#f0f4fb] p-3 flex items-center justify-center">
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {originalValues.map((val, i) => {
            const state = nodeStates[i] ?? "unvisited";
            const isCurrent = state === "current";
            const isVisited = state === "completed" || state === "prev" || state === "next_saved" || state === "reversed";
            const link = activeStep?.links[i];
            const randomTarget = link?.random;
            const nextTarget = link?.next;
            return (
              <div key={i} className="relative flex flex-col items-center gap-1">
                <div className={`flex items-center justify-center rounded-lg border-2 px-3 py-2 text-sm font-bold shadow-sm transition-all ${
                  isCurrent ? "border-sky-500 bg-sky-50 text-sky-800 shadow-md" :
                  isVisited ? "border-emerald-300 bg-emerald-50 text-emerald-800" :
                  "border-slate-300 bg-white text-slate-700"
                }`}>
                  {val}
                </div>
                <div className="flex gap-1 text-[9px] text-slate-500 font-mono">
                  {nextTarget !== null && <span className="text-blue-500">n:{nextTarget}</span>}
                  {randomTarget !== null && <span className="text-purple-500">r:{randomTarget}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

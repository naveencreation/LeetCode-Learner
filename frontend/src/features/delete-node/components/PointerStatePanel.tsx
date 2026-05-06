import type { ExecutionStep } from "../types";

interface PointerStatePanelProps {
  activeStep: ExecutionStep | undefined;
}

export function PointerStatePanel({ activeStep }: PointerStatePanelProps) {
  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_1fr] gap-2 p-2.5">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">Pointer State</h2>
      </div>

      <div className="flex flex-col gap-2">
        <div className="rounded-[10px] border border-slate-200 bg-white p-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-2">
            Pointers
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[9px] text-slate-500">current</p>
              <p className="text-sm font-semibold text-slate-800">
                {activeStep?.pointers.current ?? "null"}
              </p>
            </div>
            <div>
              <p className="text-[9px] text-slate-500">next</p>
              <p className="text-sm font-semibold text-slate-800">
                {activeStep?.pointers.next ?? "null"}
              </p>
            </div>
            <div>
              <p className="text-[9px] text-slate-500">nextNext</p>
              <p className="text-sm font-semibold text-slate-800">
                {activeStep?.pointers.nextNext ?? "null"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[10px] border border-amber-200 bg-amber-50 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-amber-600 mb-1">
            Key Insight
          </p>
          <p className="text-[11px] text-slate-700 leading-relaxed">
            Since we don't have access to the previous node, we copy the next node's value and skip over it instead.
          </p>
        </div>
      </div>
    </section>
  );
}

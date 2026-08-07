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
              <p className="text-[9px] text-slate-500">pointerA</p>
              <p className="text-sm font-semibold text-slate-800">
                {activeStep?.pointers.pointerA ?? "null"}
              </p>
            </div>
            <div>
              <p className="text-[9px] text-slate-500">pointerB</p>
              <p className="text-sm font-semibold text-slate-800">
                {activeStep?.pointers.pointerB ?? "null"}
              </p>
            </div>
            <div>
              <p className="text-[9px] text-slate-500">lengthA</p>
              <p className="text-sm font-semibold text-slate-800">
                {activeStep?.pointers.lengthA ?? 0}
              </p>
            </div>
            <div>
              <p className="text-[9px] text-slate-500">lengthB</p>
              <p className="text-sm font-semibold text-slate-800">
                {activeStep?.pointers.lengthB ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[10px] border border-amber-200 bg-amber-50 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-amber-600 mb-1">
            Key Insight
          </p>
          <p className="text-[11px] text-slate-700 leading-relaxed">
            Calculate lengths first, then align pointers to the same starting position before advancing both together.
          </p>
        </div>
      </div>
    </section>
  );
}

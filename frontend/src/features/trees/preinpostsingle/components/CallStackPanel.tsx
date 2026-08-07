import type { CallStackFrame } from "../types";

interface CallStackPanelProps {
  activeCallStack: CallStackFrame[];
}

const frameStyles: Record<CallStackFrame["state"], string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-900",
  executing: "border-primary/30 bg-primary/10 text-primary",
  returned: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

const traversalStateBadgeStyles: Record<CallStackFrame["traversalState"], string> = {
  1: "border-cyan-200 bg-cyan-50 text-cyan-800",
  2: "border-violet-200 bg-violet-50 text-violet-800",
  3: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

const traversalStateLabels: Record<CallStackFrame["traversalState"], string> = {
  1: "S1 PRE",
  2: "S2 IN",
  3: "S3 POST",
};

export function CallStackPanel({ activeCallStack }: CallStackPanelProps) {
  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_1fr] gap-2 p-2.5">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">
          State Stack
        </h2>
</div>

      <div className="min-h-0 space-y-1.5 overflow-auto rounded-[10px] border border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 p-2">
        {activeCallStack.length === 0 ? (
          <p className="flex min-h-full items-center justify-center py-8 text-center text-xs italic text-slate-500">
            Stack is empty. Click Next to begin!
          </p>
        ) : (
          activeCallStack.map((frame, index) => {
            const isTopFrame = index === activeCallStack.length - 1;

            return (
              <div
                key={frame.id}
                className={`rounded-lg border px-2 py-1.5 text-[11px] ${frameStyles[frame.state]} ${
                  isTopFrame ? "ring-1 ring-cyan-300/70" : ""
                }`}
                style={{ marginLeft: `${frame.depth * 10}px` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-[var(--font-geist-mono)] font-bold text-slate-800">({frame.nodeVal}, {frame.traversalState})</span>
                  <div className="flex items-center gap-1">
                    <span
                      className={`rounded-full border px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide ${traversalStateBadgeStyles[frame.traversalState]}`}
                    >
                      {traversalStateLabels[frame.traversalState]}
                    </span>
                    <span className="rounded-full bg-black/5 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide">
                      {frame.state}
                    </span>
                    {isTopFrame ? (
                      <span className="rounded-full bg-cyan-600 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-white">
                        Top
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}


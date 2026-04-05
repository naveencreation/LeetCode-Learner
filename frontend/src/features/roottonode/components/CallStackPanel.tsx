import type { CallStackFrame } from "../types";

interface CallStackPanelProps {
  activeCallStack: CallStackFrame[];
}

const frameStyles: Record<CallStackFrame["state"], string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-900",
  executing: "border-primary/30 bg-primary/10 text-primary",
  returned: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

export function CallStackPanel({ activeCallStack }: CallStackPanelProps) {
  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_1fr] gap-2 p-2.5">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">
          Recursion Stack
        </h2>
        <span className="rounded-full bg-gradient-to-r from-amber-500 to-amber-300 px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.04em] text-white shadow-sm">
          Live
        </span>
      </div>

      <div className="min-h-0 space-y-1.5 overflow-auto rounded-[10px] border border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 p-2">
        {activeCallStack.length === 0 ? (
          <p className="flex min-h-full items-center justify-center py-8 text-center text-xs italic text-slate-500">
            Stack is empty. Click Next to begin!
          </p>
        ) : (
          activeCallStack.map((frame) => (
            <div
              key={frame.id}
              className={`rounded-lg border px-2 py-1.5 text-[11px] ${frameStyles[frame.state]}`}
              style={{ marginLeft: `${frame.depth * 10}px` }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-800">dfs({frame.nodeVal})</span>
                <span className="rounded-full bg-black/5 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide">
                  {frame.state}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

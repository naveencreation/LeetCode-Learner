import type { ExecutionStep } from "../types";

interface PointerStatePanelProps {
  activeStep: ExecutionStep | undefined;
}

const pointerConfig = [
  {
    key: "slow" as const,
    label: "slow",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    glow: "rgba(245, 158, 11, 0.35)",
  },
  {
    key: "fast" as const,
    label: "fast",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    glow: "rgba(59, 130, 246, 0.35)",
  },
];

function getInvariantMessage(step: ExecutionStep | undefined): string {
  if (!step) {
    return "Initialize both pointers at head. The slow pointer will lag behind the fast pointer.";
  }

  switch (step.type) {
    case "init":
      return "Both pointers start at head. Slow moves 1 step, fast moves 2 steps per iteration.";
    case "check_loop":
      return "Check if fast can advance. If fast reaches null or fast.next is null, we've reached the end.";
    case "advance_slow":
      return "Slow pointer advances by 1. This pointer will eventually reach the middle.";
    case "advance_fast":
      return "Fast pointer advances by 2. This pointer finds the end of the list twice as fast.";
    case "found_middle":
      return "Fast reached the end! Slow is now at the middle node. Algorithm complete.";
    default:
      return "The slow pointer moves at half the speed of fast pointer, so it ends at middle.";
  }
}

export function PointerStatePanel({ activeStep }: PointerStatePanelProps) {
  const pointers = activeStep?.pointers ?? { slow: null, fast: null };
  const invariantMessage = getInvariantMessage(activeStep);

  return (
    <div className="traversal-panel flex h-full flex-col overflow-hidden">
      <div className="traversal-panel-header px-3 py-2">
        <h2 className="traversal-panel-title">Pointer State</h2>
      </div>

      <div className="ui-scrollbar min-h-0 flex-1 overflow-y-auto px-3 py-2">
        <div className="space-y-2">
          {pointerConfig.map((ptr) => {
            const val = pointers[ptr.key];
            const isActive = val !== null && val !== undefined;
            return (
              <div
                key={ptr.key}
                className={`flex items-center justify-between rounded-xl border ${ptr.border} ${ptr.bg} px-3 py-2.5 transition-all duration-200 ${
                  isActive ? "scale-[1.01]" : ""
                }`}
                style={
                  isActive
                    ? {
                        boxShadow: `0 0 0 1px ${ptr.glow}, 0 8px 18px -14px ${ptr.glow}`,
                      }
                    : undefined
                }
              >
                <span className={`text-[12px] font-extrabold ${ptr.color}`}>
                  {ptr.label}
                </span>
                <span className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-[14px] font-extrabold tabular-nums text-slate-800">
                  {val !== null && val !== undefined ? val : "None"}
                </span>
              </div>
            );
          })}

          <div className="mt-3 rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wide text-cyan-700">
              Algorithm Insight
            </p>
            <p className="mt-1 text-[12px] font-semibold leading-relaxed text-cyan-900">
              {invariantMessage}
            </p>
          </div>

          {activeStep ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                Current Action
              </p>
              <p className="mt-1 text-[12px] font-semibold text-slate-700">
                {activeStep.operation}
              </p>
            </div>
          ) : (
            <p className="pt-1 text-[12px] font-medium text-slate-400">
              Click Next to initialize slow and fast pointers.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

import type { ExecutionStep } from "../types";

interface PointerStatePanelProps {
  activeStep: ExecutionStep | undefined;
}

const pointerConfig = [
  {
    key: "current" as const,
    label: "current",
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    glow: "rgba(139, 92, 246, 0.35)",
  },
  {
    key: "groupStart" as const,
    label: "groupStart",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    glow: "rgba(59, 130, 246, 0.35)",
  },
  {
    key: "groupEnd" as const,
    label: "groupEnd",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    glow: "rgba(16, 185, 129, 0.35)",
  },
  {
    key: "prevGroupEnd" as const,
    label: "prevGroupEnd",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    glow: "rgba(245, 158, 11, 0.35)",
  },
];

function getInvariantMessage(step: ExecutionStep | undefined): string {
  if (!step) {
    return "Initialize with k value. The algorithm reverses nodes in groups of size k.";
  }

  switch (step.type) {
    case "init":
      return "Set k to determine group size. Each group of k nodes will be reversed.";
    case "check_group":
      return "Check if remaining nodes are >= k. If not, keep them in original order.";
    case "reverse_group":
      return "Reverse k nodes using three-pointer technique (prev, curr, next).";
    case "connect_groups":
      return "Connect reversed group to the previous group's end node.";
    case "incomplete":
      return "Remaining nodes less than k, so they stay unchanged.";
    case "complete":
      return "All groups processed. Time O(n), space O(1).";
    default:
      return "Reverse nodes in groups of size k.";
  }
}

export function PointerStatePanel({ activeStep }: PointerStatePanelProps) {
  const pointers = activeStep?.pointers ?? {
    current: null,
    groupStart: null,
    groupEnd: null,
    prevGroupEnd: null,
    k: 3,
  };
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

          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
              Group Size (k)
            </p>
            <p className="mt-1 text-[14px] font-extrabold text-slate-800">
              {pointers.k}
            </p>
          </div>

          <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wide text-cyan-700">
              Why This Step Matters
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
              Click Next to start reversing nodes in groups.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

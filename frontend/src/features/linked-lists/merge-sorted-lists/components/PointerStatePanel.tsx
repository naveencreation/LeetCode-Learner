import type { ExecutionStep } from "../types";

interface PointerStatePanelProps {
  activeStep: ExecutionStep | undefined;
}

const pointerConfig = [
  {
    key: "list1" as const,
    label: "list1",
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    glow: "rgba(139, 92, 246, 0.35)",
  },
  {
    key: "list2" as const,
    label: "list2",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    glow: "rgba(16, 185, 129, 0.35)",
  },
];

function getInvariantMessage(step: ExecutionStep | undefined): string {
  if (!step) {
    return "Both lists are sorted. We'll merge them by comparing nodes and attaching the smaller one to the result.";
  }

  switch (step.type) {
    case "init":
      return "Dummy node created to simplify edge cases. Current pointer will build the merged list.";
    case "compare":
      return "Compare current nodes from both lists. The smaller value gets attached to the merged result.";
    case "attach_list1":
      return "List1 node is smaller or equal. Attach it to current.next and advance list1.";
    case "attach_list2":
      return "List2 node is smaller. Attach it to current.next and advance list2.";
    case "advance_current":
      return "Move current pointer forward to the newly attached node.";
    case "append_remaining_list1":
      return "List1 still has nodes. Append all remaining nodes to the result.";
    case "append_remaining_list2":
      return "List2 still has nodes. Append all remaining nodes to the result.";
    case "complete":
      return "Both lists exhausted. Return dummy.next as the head of the merged list.";
    default:
      return "Compare and merge in sorted order.";
  }
}

export function PointerStatePanel({ activeStep }: PointerStatePanelProps) {
  const pointers = activeStep?.pointers ?? { list1: null, list2: null, current: null };
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
              Click Next to start the merge process.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

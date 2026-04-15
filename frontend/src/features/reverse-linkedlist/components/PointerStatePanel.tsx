import type { ExecutionStep } from "../types";

interface PointerStatePanelProps {
  activeStep: ExecutionStep | undefined;
}

const pointerConfig = [
  {
    key: "prev" as const,
    label: "prev",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
    glow: "rgba(244, 63, 94, 0.35)",
  },
  {
    key: "curr" as const,
    label: "curr",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    glow: "rgba(245, 158, 11, 0.35)",
  },
  {
    key: "nextSaved" as const,
    label: "next_node",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    glow: "rgba(59, 130, 246, 0.35)",
  },
];

function getInvariantMessage(step: ExecutionStep | undefined): string {
  if (!step) {
    return "Invariant: prev is None and curr points to head before the loop starts.";
  }

  switch (step.type) {
    case "loop_check":
      return "Check curr first: if it is not None, we run one more reversal cycle.";
    case "save_next":
      return "Store next_node first so the remaining list is not lost after reversing the link.";
    case "reverse_link":
      return "Set curr.next = prev to reverse one link.";
    case "move_prev":
      return "Move prev forward to the current node (new head of reversed part).";
    case "move_curr":
      return "Move curr to next_node to continue with the next unreversed node.";
    case "loop_exit":
      return "curr is None, so the loop exits and prev is ready to be returned.";
    case "complete":
      return "Loop ends when curr is None. prev is the new head.";
    default:
      return "Before each iteration: nodes before prev are reversed, nodes from curr onward are not.";
  }
}

export function PointerStatePanel({ activeStep }: PointerStatePanelProps) {
  const pointers = activeStep?.pointers ?? { prev: null, curr: null, nextSaved: null };
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
              Click Next to initialize prev, curr, and next_node.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

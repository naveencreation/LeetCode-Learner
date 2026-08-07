import type { ExecutionStep, ReorderPhase } from "../types";

interface PointerStatePanelProps {
  activeStep: ExecutionStep | undefined;
}

/** Pointer rows to render per phase */
interface PointerRow {
  key: string;
  label: string;
  color: string;
  bg: string;
  border: string;
  glow: string;
  value: number | null | undefined;
}

function buildPointerRows(step: ExecutionStep | undefined): PointerRow[] {
  if (!step) {
    return [
      { key: "slow", label: "slow", color: "text-cyan-700", bg: "bg-cyan-50", border: "border-cyan-200", glow: "rgba(6,182,212,0.35)", value: null },
      { key: "fast", label: "fast", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200", glow: "rgba(168,85,247,0.35)", value: null },
    ];
  }

  const phase: ReorderPhase = step.metadata?.phase ?? "Find Middle";
  const p = step.pointers;

  switch (phase) {
    case "Find Middle":
      return [
        { key: "slow", label: "slow", color: "text-cyan-700", bg: "bg-cyan-50", border: "border-cyan-200", glow: "rgba(6,182,212,0.35)", value: p.slow },
        { key: "fast", label: "fast", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200", glow: "rgba(168,85,247,0.35)", value: p.fast },
      ];
    case "Reverse":
      return [
        { key: "prev", label: "prev", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200", glow: "rgba(244,63,94,0.35)", value: p.prev },
        { key: "curr", label: "curr", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", glow: "rgba(245,158,11,0.35)", value: p.curr },
        { key: "nextSaved", label: "tmp", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", glow: "rgba(59,130,246,0.35)", value: p.nextSaved },
      ];
    case "Merge":
      return [
        { key: "curr",      label: "p1",      color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200", glow: "rgba(99,102,241,0.35)", value: p.curr },
        { key: "nextSaved", label: "p2",      color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200",  glow: "rgba(245,158,11,0.35)", value: p.nextSaved },
      ];
    case "Done":
      return [
        { key: "curr", label: "p1", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", glow: "rgba(16,185,129,0.35)", value: null },
        { key: "nextSaved", label: "p2", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", glow: "rgba(16,185,129,0.35)", value: null },
      ];
    default:
      return [];
  }
}

function getInvariantMessage(step: ExecutionStep | undefined): string {
  if (!step) {
    return "Click Next to start. slow and fast both begin at head.";
  }

  switch (step.type) {
    case "init":
      return "Both slow and fast start at head. fast moves twice as fast.";
    case "find_middle_check":
      return "We check that fast.next and fast.next.next exist before moving.";
    case "find_middle_move":
      return "slow advances 1 step, fast advances 2. The gap grows each iteration.";
    case "find_middle_done":
      return "fast can't move 2 steps — slow is at the exact midpoint.";
    case "split_halves":
      return "We cut the link at slow.next = None to split into two independent halves.";
    case "reverse_init":
      return "prev = None, curr = head of second half. Standard iterative reversal begins.";
    case "reverse_loop_check":
      return "While curr is not None, we reverse one link per iteration.";
    case "reverse_save_next":
      return "Save tmp = curr.next before overwriting the link — cardinal rule of reversal.";
    case "reverse_link":
      return "Flip: curr.next = prev. Exactly one arrow reverses per step.";
    case "reverse_advance":
      return "Move prev forward to curr (new tail of reversed chain), curr to tmp.";
    case "reverse_done":
      return "prev is now the head of the fully reversed second half.";
    case "merge_init":
      return "p1 = head of first half, p2 = head of reversed second half.";
    case "merge_loop_check":
      return "While p2 is not None, we interleave another pair of nodes.";
    case "merge_save":
      return "Save both p1.next and p2.next before rewiring — two pointers at risk!";
    case "merge_link_p1":
      return "p1.next = p2 — insert the tail element right after the current front.";
    case "merge_link_p2":
      return "p2.next = p1_next — rejoin the remaining first-half chain.";
    case "merge_advance":
      return "Both p1 and p2 advance to their saved next pointers.";
    case "complete":
      return "Done! Three passes, O(n) time, O(1) space. The list is reordered in-place.";
    default:
      return "Examine the pointer values to track algorithm state.";
  }
}

export function PointerStatePanel({ activeStep }: PointerStatePanelProps) {
  const rows = buildPointerRows(activeStep);
  const invariantMessage = getInvariantMessage(activeStep);

  return (
    <div className="traversal-panel flex h-full flex-col overflow-hidden">
      <div className="traversal-panel-header px-3 py-2">
        <h2 className="traversal-panel-title">Pointer State</h2>
      </div>

      <div className="ui-scrollbar min-h-0 flex-1 overflow-y-auto px-3 py-2">
        <div className="space-y-2">
          {rows.map((ptr) => {
            const isActive = ptr.value !== null && ptr.value !== undefined;
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
                  {isActive ? ptr.value : "None"}
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
              Click Next to initialize pointers.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

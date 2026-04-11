import { LC114_LINE_GUIDE } from "../constants";
import type { ExecutionStep } from "../types";

interface ExplanationPanelProps {
  currentStep: number;
  totalSteps: number;
  chain: number[];
  currentCodeLine: number;
  activeStep: ExecutionStep | undefined;
}

export function ExplanationPanel({
  currentStep,
  totalSteps,
  chain,
  currentCodeLine,
  activeStep,
}: ExplanationPanelProps) {
  const guide = LC114_LINE_GUIDE[currentCodeLine];
  const isDone = currentStep >= totalSteps;

  const title = isDone
    ? "Flatten Complete"
    : `Line ${currentCodeLine + 1}: ${activeStep?.type ?? "flatten context"}`;

  const description = isDone
    ? `All rewiring steps are complete. Final right chain is [${chain.join(", ")}].`
    : activeStep?.operation ??
      'Click "Next Step" to start flattening pointers into a right-only chain.';

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_1fr_auto] gap-2 p-2.5">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">
          Step Explanation
        </h2>
      </div>

      <div className="min-h-0 space-y-2 overflow-auto rounded-[10px] border border-sky-200 bg-gradient-to-b from-cyan-50 to-sky-50 p-2">
        <h3 className="text-[13px] font-extrabold text-cyan-900">{title}</h3>
        <p className="text-[11px] leading-[1.45] text-cyan-800">{description}</p>
        <ul className="grid gap-1 text-[11px]">
          {guide ? (
            <>
              <li className="rounded-lg border border-sky-200 bg-white/80 px-2 py-1 text-cyan-900">
                &gt; Meaning: {guide.meaning}
              </li>
              <li className="rounded-lg border border-sky-200 bg-white/80 px-2 py-1 text-cyan-900">
                &gt; Why: {guide.why}
              </li>
              <li className="rounded-lg border border-sky-200 bg-white/80 px-2 py-1 text-cyan-900">
                &gt; Next: {guide.next}
              </li>
            </>
          ) : (
            <li className="rounded-lg border border-sky-200 bg-white/80 px-2 py-1 text-cyan-900">
              &gt; Rewiring uses preorder order so chain builds as root, then left, then right subtree.
            </li>
          )}
          <li className="rounded-lg border border-sky-200 bg-white/80 px-2 py-1 text-cyan-900">
            &gt; Progress snapshot: {currentStep}/{totalSteps} steps, chain size {chain.length}.
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-1.5 rounded-[10px] border border-slate-200 bg-slate-50 p-2 text-[10px] text-slate-700">
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full bg-slate-300" /> Unvisited
          </span>
        </div>
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full bg-sky-400" /> Left
          </span>
        </div>
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full bg-amber-400" /> Current
          </span>
        </div>
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full bg-violet-400" /> Right
          </span>
        </div>
        <div className="col-span-2 rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full bg-emerald-500" /> Done
          </span>
        </div>
      </div>
    </section>
  );
}

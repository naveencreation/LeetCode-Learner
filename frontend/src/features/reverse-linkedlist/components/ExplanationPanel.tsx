import type { ExecutionStep } from "../types";

interface ExplanationPanelProps {
  currentStep: number;
  totalSteps: number;
  activeStep: ExecutionStep | undefined;
  currentCodeLine: number;
}

function getExplanation(
  step: ExecutionStep | undefined,
  currentStep: number,
  totalSteps: number,
  currentCodeLine: number,
) {
  if (!step && currentStep === 0) {
    return {
      title: "Ready to Start",
      description:
        'Click "Next Step" to begin. We will reverse the linked list in-place using three pointers.',
      details: [
        "prev tracks the already-reversed portion.",
        "curr is the node we're about to process.",
        "next_node saves the reference before we break the link.",
      ],
    };
  }

  if (currentStep >= totalSteps) {
    return {
      title: "Reversal Complete",
      description: "All nodes processed. prev is the new head of the reversed list.",
      details: [
        `Total execution steps: ${totalSteps}`,
        "Use Previous to replay each pointer movement slowly.",
      ],
    };
  }

  switch (step?.type) {
    case "init":
      return {
        title: "Initialize Pointers",
        description: "Set prev = None and curr = head to begin the traversal.",
        details: [
          "prev starts as None — nothing is reversed yet.",
          "curr starts at head — the first node to process.",
        ],
      };
    case "save_next":
      return {
        title: "Save Next Reference",
        description: "Before breaking the link, save curr.next so we don't lose the rest of the list.",
        details: [
          "Without this step, we'd lose access to remaining nodes.",
          `Line ${currentCodeLine}: next_node = curr.next`,
        ],
      };
    case "reverse_link":
      return {
        title: "Reverse the Link",
        description: "Point curr.next backwards to prev. This is the core reversal operation.",
        details: [
          "The forward link is now broken.",
          "curr now points backward to the reversed portion.",
          `Line ${currentCodeLine}: curr.next = prev`,
        ],
      };
    case "move_prev":
      return {
        title: "Advance prev",
        description: "Move prev forward to curr. The reversed portion grows by one node.",
        details: [
          "prev always points to the head of the reversed sub-list.",
          `Line ${currentCodeLine}: prev = curr`,
        ],
      };
    case "move_curr":
      return {
        title: "Advance curr",
        description: "Move curr to the saved next_node. Ready to process the next node.",
        details: [
          "If curr becomes None, the loop ends.",
          `Line ${currentCodeLine}: curr = next_node`,
        ],
      };
    case "complete":
      return {
        title: "Return New Head",
        description: "curr is None, loop is done. prev is the new head of the fully reversed list.",
        details: [
          `Line ${currentCodeLine}: return prev`,
          "Time complexity: O(n), Space: O(1).",
        ],
      };
    default:
      return {
        title: "Step Insight",
        description: "Traversal state updated.",
        details: [],
      };
  }
}

export function ExplanationPanel({
  currentStep,
  totalSteps,
  activeStep,
  currentCodeLine,
}: ExplanationPanelProps) {
  const explanation = getExplanation(activeStep, currentStep, totalSteps, currentCodeLine);

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_1fr_auto] gap-2 p-2.5">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">Step Explanation</h2>
      </div>

      <div className="min-h-0 space-y-2 overflow-auto rounded-[10px] border border-sky-200 bg-gradient-to-b from-cyan-50 to-sky-50 p-2">
        <h3 className="text-[13px] font-extrabold text-cyan-900">{explanation.title}</h3>
        <p className="text-[11px] leading-[1.45] text-cyan-800">{explanation.description}</p>
        <ul className="grid gap-1 text-[11px]">
          {explanation.details.map((detail) => (
            <li key={detail} className="rounded-lg border border-sky-200 bg-white/80 px-2 py-1 text-cyan-900">
              &gt; {detail}
            </li>
          ))}
        </ul>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-1.5 rounded-[10px] border border-slate-200 bg-slate-50 p-2 text-[10px] text-slate-700">
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#e5e7eb" }} /> Unvisited
          </span>
        </div>
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#fbbf24" }} /> Current
          </span>
        </div>
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#fda4af" }} /> Prev
          </span>
        </div>
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#93c5fd" }} /> Next Saved
          </span>
        </div>
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#c4b5fd" }} /> Reversing
          </span>
        </div>
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#86efac" }} /> Done
          </span>
        </div>
      </div>
    </section>
  );
}

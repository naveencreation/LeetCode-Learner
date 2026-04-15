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
      title: "Ready to Reverse",
      description:
        'Click "Next Step" to begin. We use the standard 3-pointer method: prev, curr, next_node.',
      details: [
        "prev points to the reversed part.",
        "curr points to the node being processed.",
        "next_node stores curr.next before changing links.",
      ],
    };
  }

  if (currentStep >= totalSteps) {
    return {
      title: "Reversal Complete",
      description: "All nodes are processed. prev now points to the new head.",
      details: [
        `Total execution steps: ${totalSteps}`,
        "Use Previous to replay each pointer movement step by step.",
      ],
    };
  }

  switch (step?.type) {
    case "init":
      return {
        title: "Initialize Pointers",
        description: "Set prev = None and curr = head.",
        details: [
          "Nothing is reversed yet.",
          "curr starts at the first node.",
        ],
      };
    case "save_next":
      return {
        title: "Store next_node",
        description: "Save curr.next before changing the link.",
        details: [
          "This prevents losing the rest of the list.",
          `Line ${currentCodeLine}: next_node = curr.next`,
        ],
      };
    case "reverse_link":
      return {
        title: "Reverse curr.next",
        description: "Point curr.next to prev to reverse one link.",
        details: [
          "Current node now points backward.",
          "Reversed part grows by one node each iteration.",
          `Line ${currentCodeLine}: curr.next = prev`,
        ],
      };
    case "move_prev":
      return {
        title: "Move prev to curr",
        description: "Set prev = curr.",
        details: [
          "prev becomes the new head of reversed part.",
          `Line ${currentCodeLine}: prev = curr`,
        ],
      };
    case "move_curr":
      return {
        title: "Move curr Forward",
        description: "Set curr = next_node and continue.",
        details: [
          "If curr becomes None, the loop ends.",
          `Line ${currentCodeLine}: curr = next_node`,
        ],
      };
    case "complete":
      return {
        title: "Return Reversed Head",
        description: "curr is None, traversal is done. prev is now the reversed head.",
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

import type { ExecutionStep } from "../types";

interface ExplanationPanelProps {
  currentStep: number;
  totalSteps: number;
  result: number[][];
  columnKeys: number[];
  activeStep: ExecutionStep | undefined;
}

function getExplanation(
  step: ExecutionStep | undefined,
  currentStep: number,
  totalSteps: number,
  result: number[][],
  columnKeys: number[],
) {
  if (!step && currentStep === 0) {
    return {
      title: "Ready to Start",
      description:
        'Click "Next Step" to begin Vertical Order traversal. The flow is level-order (BFS).',
      details: ["Each node is captured with (row, col), then grouped and sorted by col, row, value."],
    };
  }

  if (currentStep >= totalSteps) {
    return {
      title: "Traversal Complete",
      description: `All levels processed. Final vertical order result is ${JSON.stringify(result)}.`,
      details: [
        `Total execution steps: ${totalSteps}`,
        `Column order: [${columnKeys.join(", ")}]`,
        "Use Previous to replay each BFS action.",
      ],
    };
  }

  switch (step?.type) {
    case "enter_function":
      return {
        title: `Process node ${step.value} from queue`,
        description: "A node is popped with its row/column coordinates.",
        details: ["Next action: append this node into its column bucket."],
      };
    case "traverse_left":
      return {
        title: `Queue left child from ${step.value}`,
        description: "Left child is enqueued with row + 1 and col - 1.",
        details: ["Left move means one column to the left."],
      };
    case "visit":
      return {
        title: `Append node ${step.value} into its column`,
        description: "Vertical order keeps all nodes in that column, then sorts by row and value.",
        details: [`Columns captured so far: ${result.length}`],
      };
    case "traverse_right":
      return {
        title: `Queue right child from ${step.value}`,
        description: "Right child is enqueued with row + 1 and col + 1.",
        details: ["Right move means one column to the right."],
      };
    case "exit_function":
      return {
        title: `Complete node processing`,
        description: "This node is fully handled for vertical-order capture.",
        details: ["Traversal continues with remaining queue entries."],
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
  result,
  columnKeys,
  activeStep,
}: ExplanationPanelProps) {
  const explanation = getExplanation(activeStep, currentStep, totalSteps, result, columnKeys);

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_1fr_auto] gap-1.5 p-1.5">
      <div className="traversal-panel-header mb-px">
        <h2 className="traversal-panel-title">
          Step Explanation
        </h2>
        <span className="rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.04em] text-white">
          Info
        </span>
      </div>

      <div className="min-h-0 space-y-1 rounded-[10px] border border-sky-200 bg-gradient-to-b from-cyan-50 to-sky-50 p-1.5">
        <h3 className="text-[12px] font-extrabold text-cyan-900">{explanation.title}</h3>
        <p className="text-[10px] leading-[1.35] text-cyan-800">{explanation.description}</p>
        <ul className="grid max-h-[180px] gap-1 overflow-auto pr-0.5 text-[9px]">
          {explanation.details.map((detail) => (
            <li key={detail} className="rounded border border-sky-200 bg-white/90 px-1.5 py-0.5 text-cyan-900">
              &gt; {detail}
            </li>
          ))}
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

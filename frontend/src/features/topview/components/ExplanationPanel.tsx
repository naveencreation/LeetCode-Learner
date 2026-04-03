import type { ExecutionStep } from "../types";

interface ExplanationPanelProps {
  currentStep: number;
  totalSteps: number;
  result: number[];
  activeStep: ExecutionStep | undefined;
}

function getExplanation(
  step: ExecutionStep | undefined,
  currentStep: number,
  totalSteps: number,
  result: number[],
) {
  if (!step && currentStep === 0) {
    return {
      title: "Ready to Start",
      description:
        'Click "Next Step" to begin Top View traversal. The flow is level-order (BFS).',
      details: ["For each horizontal distance, only the first visible node is captured."],
    };
  }

  if (currentStep >= totalSteps) {
    return {
      title: "Traversal Complete",
      description: `All levels processed. Final left view result is [${result.join(", ")}].`,
      details: [
        `Total execution steps: ${totalSteps}`,
        "Use Previous to replay each BFS action.",
      ],
    };
  }

  switch (step?.type) {
    case "enter_function":
      return {
        title: `Process node ${step.value} from queue`,
        description: "A node is popped with its horizontal distance for visibility checks.",
        details: ["Next action: capture only if this horizontal distance is first-seen."],
      };
    case "traverse_left":
      return {
        title: `Queue left child from ${step.value}`,
        description: "Left child is enqueued with hd - 1.",
        details: ["Horizontal distance shifts left for visibility ordering."],
      };
    case "visit":
      return {
        title: `Capture top view node ${step.value}`,
        description: "This node is first-seen at this horizontal distance, so it is recorded.",
        details: [`Result length after this step: ${result.length + 1}`],
      };
    case "traverse_right":
      return {
        title: `Queue right child from ${step.value}`,
        description: "Right child is enqueued with hd + 1.",
        details: ["Horizontal distance shifts right for visibility ordering."],
      };
    case "exit_function":
      return {
        title: `Complete node processing`,
        description: "This node is fully handled for top-view logic.",
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
  activeStep,
}: ExplanationPanelProps) {
  const explanation = getExplanation(activeStep, currentStep, totalSteps, result);

  return (
    <section className="grid min-h-0 grid-rows-[auto_1fr_auto] gap-2 rounded-xl border border-slate-200 bg-white p-2.5 shadow-[0_2px_10px_rgba(17,24,39,0.06)]">
      <div className="mb-0.5 flex items-center justify-between">
        <h2 className="text-[13px] font-extrabold uppercase tracking-[0.01em] text-slate-700">
          Step Explanation
        </h2>
        <span className="rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.04em] text-white">
          Info
        </span>
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

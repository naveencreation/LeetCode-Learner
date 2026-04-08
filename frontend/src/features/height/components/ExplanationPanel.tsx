import type { ExecutionStep } from "../types";

interface ExplanationPanelProps {
  currentStep: number;
  totalSteps: number;
  result: Array<{ node: number; height: number }>;
  maxHeight: number;
  currentComputedHeight: number;
  activeStep: ExecutionStep | undefined;
}

function getExplanation(
  step: ExecutionStep | undefined,
  currentStep: number,
  totalSteps: number,
  result: Array<{ node: number; height: number }>,
  maxHeight: number,
  currentComputedHeight: number,
) {
  if (!step && currentStep === 0) {
    return {
      title: "Ready to Start",
      description:
        'Click "Next Step" to begin recursive height traversal. DFS computes height bottom-up.',
      details: ["Each node returns 1 + max(left_height, right_height)."],
    };
  }

  if (currentStep >= totalSteps) {
    return {
      title: "Traversal Complete",
      description: "All recursive calls resolved and final maximum depth computed.",
      details: [
        `Total execution steps: ${totalSteps}`,
        `Maximum depth: ${maxHeight}`,
      ],
    };
  }

  switch (step?.type) {
    case "enter_function":
      return {
        title: `Enter node ${step.value}`,
        description: "Start computing height for this subtree.",
        details: [
          `depth=${step.depth}`,
        ],
      };
    case "traverse_left":
      return {
        title: `Explore left from ${step.value}`,
        description: "Recurse into left subtree to compute its height.",
        details: ["Left subtree height is needed before current node can return."],
      };
    case "traverse_right":
      return {
        title: `Explore right from ${step.value}`,
        description: "Recurse into right subtree to compute its height.",
        details: ["Right subtree completes the inputs for max(left, right)."],
      };
    case "compute_height":
      return {
        title: `Compute height(${step.value})`,
        description: "Combine left and right subtree heights.",
        details: [
          `left=${step.leftHeight ?? 0}, right=${step.rightHeight ?? 0}`,
          `height=${step.computedHeight ?? currentComputedHeight}`,
          `max_so_far=${step.maxHeight ?? maxHeight}`,
        ],
      };
    case "exit_function":
      return {
        title: `Return from node ${step.value}`,
        description: "This subtree height returns to parent call.",
        details: [`return=${step.computedHeight ?? currentComputedHeight}`],
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
  maxHeight,
  currentComputedHeight,
  activeStep,
}: ExplanationPanelProps) {
  const explanation = getExplanation(activeStep, currentStep, totalSteps, result, maxHeight, currentComputedHeight);

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

import type { ExecutionStep } from "../types";

interface ExplanationPanelProps {
  currentStep: number;
  totalSteps: number;
  result: number[];
  maxWidth: number;
  activeStep: ExecutionStep | undefined;
}

function getExplanation(
  step: ExecutionStep | undefined,
  currentStep: number,
  totalSteps: number,
  result: number[],
  maxWidth: number,
) {
  if (!step && currentStep === 0) {
    return {
      title: "Ready to Start",
      description:
        'Click "Next Step" to begin max-width traversal. The flow is level-order BFS with virtual indices.',
      details: ["At each level, width = last_index - first_index + 1."],
    };
  }

  if (currentStep >= totalSteps) {
    return {
      title: "Traversal Complete",
      description: `All levels processed. Maximum width is ${maxWidth}.`,
      details: [
        `Total execution steps: ${totalSteps}`,
        `Level widths observed: [${result.join(", ")}]`,
      ],
    };
  }

  switch (step?.type) {
    case "level_start":
      return {
        title: `Start level ${step.level}`,
        description: "Read first and last virtual indices for this level before processing nodes.",
        details: [
          `first=${step.levelStartIndex}, last=${step.levelEndIndex}`,
          `width=${step.width}, max=${step.maxWidth}`,
        ],
      };
    case "enter_function":
      return {
        title: `Process node ${step.value}`,
        description: "Node is dequeued and index is normalized by subtracting the level's first index.",
        details: ["Normalization prevents index overflow on deep trees."],
      };
    case "traverse_left":
      return {
        title: `Queue left child from ${step.value}`,
        description: "Left child gets index 2*i + 1.",
        details: ["This mirrors heap-style indexing for gap-aware width."],
      };
    case "visit":
      return {
        title: `Update width metrics at level ${step.level}`,
        description: "Current level width and global maximum are compared here.",
        details: [`width=${step.width}, max=${step.maxWidth}`],
      };
    case "traverse_right":
      return {
        title: `Queue right child from ${step.value}`,
        description: "Right child gets index 2*i + 2.",
        details: ["Right index is always one more than left sibling index."],
      };
    case "exit_function":
      return {
        title: `Complete node processing`,
        description: "Node's contribution is done for this level.",
        details: ["Traversal continues with remaining queue entries."],
      };
    case "level_end":
      return {
        title: `Level ${step.level} complete`,
        description: "This level width is committed to the level summary.",
        details: [`Width list grows with this value: ${step.width}`],
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
  maxWidth,
  activeStep,
}: ExplanationPanelProps) {
  const explanation = getExplanation(activeStep, currentStep, totalSteps, result, maxWidth);

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

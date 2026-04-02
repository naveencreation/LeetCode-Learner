import type { ExecutionStep } from "../types";
import { PREORDER_LINE_GUIDE, PREORDER_LINE_LABELS } from "../constants";

interface ExplanationPanelProps {
  currentStep: number;
  totalSteps: number;
  result: number[];
  activeStep: ExecutionStep | undefined;
  currentCodeLine: number;
}

function getExplanation(
  step: ExecutionStep | undefined,
  currentStep: number,
  totalSteps: number,
  result: number[],
  currentCodeLine: number,
) {
  const lineGuide = PREORDER_LINE_GUIDE[currentCodeLine];
  const lineLabel = PREORDER_LINE_LABELS[currentCodeLine] ?? "Traversal Context";

  if (!step && currentStep === 0) {
    return {
      title: "Ready to Start",
      description:
        'Click "Next Step" to begin. We will follow Root -> Left -> Right and explain each highlighted code line.',
      details: [
        "Start from recursivePreorder(root, arr).",
        "Watch call stack, highlighted line, and result array together.",
      ],
    };
  }

  if (currentStep >= totalSteps) {
    return {
      title: "Traversal Complete",
      description: `All steps finished. Final preorder result is [${result.join(", ")}].`,
      details: [
        `Total execution steps: ${totalSteps}`,
        "Use Previous to replay each recursive action slowly.",
      ],
    };
  }

  if (lineGuide) {
    return {
      title: `Line ${currentCodeLine + 1}: ${lineLabel}`,
      description: lineGuide.meaning,
      details: [
        `Why this line matters: ${lineGuide.why}`,
        `What happens next: ${lineGuide.next}`,
        `Current result snapshot: [${result.join(", ")}]`,
      ],
    };
  }

  switch (step?.type) {
    case "enter_function":
      return {
        title: `Entering preorder(${step.value})`,
        description: "A new recursive frame is pushed to the call stack.",
        details: ["Next action: process current node first."],
      };
    case "traverse_left":
      return {
        title: `Traverse Left from ${step.value}`,
        description: "After processing root, preorder explores left subtree.",
        details: ["Flow remains Root -> Left -> Right."],
      };
    case "visit":
      return {
        title: `Process Node ${step.value}`,
        description: "Current node value is appended to the result array.",
        details: [`Result length after this step: ${result.length + 1}`],
      };
    case "traverse_right":
      return {
        title: `Traverse Right from ${step.value}`,
        description: "After processing root, recursion enters right subtree.",
        details: ["This completes Root -> Left -> Right order."],
      };
    case "exit_function":
      return {
        title: `Return from preorder(${step.value})`,
        description: "Current recursive frame is complete and returns.",
        details: ["Control goes back to parent frame."],
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
  currentCodeLine,
}: ExplanationPanelProps) {
  const explanation = getExplanation(
    activeStep,
    currentStep,
    totalSteps,
    result,
    currentCodeLine,
  );

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_1fr_auto] gap-2 p-2.5">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">
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


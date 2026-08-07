import type { ExecutionStep } from "../types";
import { PRE_IN_POST_LINE_GUIDE, PRE_IN_POST_LINE_LABELS } from "../constants";

interface ExplanationPanelProps {
  currentStep: number;
  totalSteps: number;
  preResult: number[];
  inResult: number[];
  postResult: number[];
  activeStep: ExecutionStep | undefined;
  currentCodeLine: number;
}

function getExplanation(
  step: ExecutionStep | undefined,
  currentStep: number,
  totalSteps: number,
  preResult: number[],
  inResult: number[],
  postResult: number[],
  currentCodeLine: number,
) {
  const lineGuide = PRE_IN_POST_LINE_GUIDE[currentCodeLine];
  const lineLabel = PRE_IN_POST_LINE_LABELS[currentCodeLine] ?? "Traversal Context";

  if (!step && currentStep === 0) {
    return {
      title: "Ready to Start",
      description:
        'Click "Next Step" to begin. We will process each node in three phases: PRE -> IN -> POST.',
      details: [
        "Stack stores tuples of (node, state) where state is 1, 2, or 3.",
        "Watch tree, stack, and all three arrays update together.",
      ],
    };
  }

  if (currentStep >= totalSteps) {
    return {
      title: "Traversal Complete",
      description: `Finished. Pre=[${preResult.join(", ")}], In=[${inResult.join(", ")}], Post=[${postResult.join(", ")}].`,
      details: [
        `Total execution steps: ${totalSteps}`,
        "Use Previous to replay each stack state transition slowly.",
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
        `Current snapshots -> Pre:[${preResult.join(", ")}], In:[${inResult.join(", ")}], Post:[${postResult.join(", ")}]`,
      ],
    };
  }

  switch (step?.type) {
    case "pre_visit":
      return {
        title: `Preorder append for node ${step.value}`,
        description: "State 1 corresponds to preorder work.",
        details: ["Next action: schedule state 2 and go left if available."],
      };
    case "in_visit":
      return {
        title: `Inorder append for node ${step.value}`,
        description: "State 2 corresponds to inorder work.",
        details: ["Next action: schedule state 3 and go right if available."],
      };
    case "post_visit":
      return {
        title: `Postorder append for node ${step.value}`,
        description: "State 3 completes the node.",
        details: ["Node becomes completed in visual state."],
      };
    case "traverse_left":
      return {
        title: `Push left child from ${step.value}`,
        description: "Left child enters stack with state 1.",
        details: ["This guarantees PRE before IN/POST for that child."],
      };
    case "traverse_right":
      return {
        title: `Push right child from ${step.value}`,
        description: "Right child enters stack with state 1.",
        details: ["It will later contribute PRE, IN, and POST."],
      };
    case "schedule_in":
      return {
        title: `Schedule IN state for ${step.value}`,
        description: "Same node is re-pushed with state 2.",
        details: ["This avoids recursion while preserving traversal order."],
      };
    case "schedule_post":
      return {
        title: `Schedule POST state for ${step.value}`,
        description: "Same node is re-pushed with state 3.",
        details: ["Final postorder append occurs when state 3 is popped."],
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
  preResult,
  inResult,
  postResult,
  activeStep,
  currentCodeLine,
}: ExplanationPanelProps) {
  const explanation = getExplanation(
    activeStep,
    currentStep,
    totalSteps,
    preResult,
    inResult,
    postResult,
    currentCodeLine,
  );

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_minmax(0,1fr)_auto] gap-1.5 p-2.5">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">Step Explanation</h2>
      </div>

      <div className="ui-scrollbar min-h-0 overflow-y-auto pr-1">
        <div className="space-y-2 rounded-[10px] border border-sky-200 bg-gradient-to-b from-cyan-50 to-sky-50 p-2">
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


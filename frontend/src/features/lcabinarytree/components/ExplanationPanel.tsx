import type { ExecutionStep } from "../types";
import { LCA_BINARY_TREE_LINE_GUIDE, LCA_BINARY_TREE_LINE_LABELS } from "../constants";

interface ExplanationPanelProps {
  currentStep: number;
  totalSteps: number;
  result: number | null;
  activeStep: ExecutionStep | undefined;
  currentCodeLine: number;
}

function getExplanation(
  step: ExecutionStep | undefined,
  currentStep: number,
  totalSteps: number,
  result: number | null,
  currentCodeLine: number,
) {
  const lineGuide = LCA_BINARY_TREE_LINE_GUIDE[currentCodeLine];
  const lineLabel = LCA_BINARY_TREE_LINE_LABELS[currentCodeLine] ?? "LCA Context";

  if (!step && currentStep === 0) {
    return {
      title: "Ready to Start",
      description:
        'Click "Next Step" to begin. We will recursively search for the lowest common ancestor.',
      details: [
        "Start from lca(root, p, q).",
        "Watch how left and right returns combine at each node.",
      ],
    };
  }

  if (currentStep >= totalSteps) {
    return {
      title: "LCA Search Complete",
      description: result !== null ? `LCA found: node ${result}.` : "LCA not found in the current tree.",
      details: [
        `Total execution steps: ${totalSteps}`,
        "Use Previous to replay each recursive merge decision step by step.",
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
        `Current known LCA: ${result ?? "not fixed yet"}`,
      ],
    };
  }

  switch (step?.type) {
    case "enter_function":
      return {
        title: `Entering lca(${step.value})`,
        description: `Start recursion at node ${step.value}.`,
        details: ["Base case: null or target.", "Otherwise recurse left and right."],
      };
    case "found_target":
      return {
        title: `Target Found at ${step.value}`,
        description: `Node ${step.value} matches p or q. Return it upward.`,
        details: ["This node becomes a signal for ancestors.", "Split may be found higher in recursion."],
      };
    case "recurse_left":
      return {
        title: `Explore Left of ${step.value}`,
        description: "Search left subtree for p and q.",
        details: ["Left return may contain target or LCA candidate."],
      };
    case "recurse_right":
      return {
        title: `Explore Right of ${step.value}`,
        description: "Search right subtree for p and q.",
        details: ["Now both branch returns can be combined."],
      };
    case "check_split":
      return {
        title: `Check Split at ${step.value}`,
        description: "If left and right are both non-null, this node is the LCA.",
        details: ["One target on each side implies split point.", "Otherwise propagate whichever side is non-null."],
      };
    case "return_lca":
      return {
        title: `LCA Found at ${step.value}`,
        description: `Node ${step.value} is the lowest split point for p and q.`,
        details: ["This value is final LCA and will bubble to root call."],
      };
    case "propagate":
      return {
        title: `Propagate Return from ${step.node?.val ?? "-"}`,
        description: step.returnValue
          ? `Pass node ${step.returnValue} upward.`
          : "No target in this branch, return null.",
        details: ["Ancestor keeps combining branch signals until split is found."],
      };
    case "exit_function":
      return {
        title: "Final Result",
        description: step.lcaValue !== null
          ? `Lowest Common Ancestor is ${step.lcaValue}.`
          : "Could not determine LCA from current targets.",
        details: ["Recursive search complete."],
      };
    default:
      return {
        title: "Traversal Step",
        description: step?.operation ?? "Processing node...",
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
  const explanation = getExplanation(activeStep, currentStep, totalSteps, result, currentCodeLine);

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_1fr_auto] gap-2 p-2.5">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">Step Explanation</h2>
      </div>

      <div className="min-h-0 space-y-2 overflow-auto rounded-[10px] border border-sky-200 bg-gradient-to-b from-cyan-50 to-sky-50 p-2">
        <h3 className="text-[13px] font-extrabold text-cyan-900">{explanation.title}</h3>
        <p className="text-[11px] leading-[1.45] text-cyan-800">{explanation.description}</p>
        <ul className="grid gap-1 text-[11px]">
          {explanation.details.map((detail, index) => (
            <li
              key={`detail-${index}`}
              className="rounded-lg border border-sky-200 bg-white/80 px-2 py-1 text-cyan-900"
            >
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
            <span className="h-3 w-3 rounded-full bg-sky-400" /> Left Search
          </span>
        </div>
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full bg-amber-400" /> Current
          </span>
        </div>
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full bg-violet-400" /> Merge
          </span>
        </div>
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full bg-[#2dd4bf]" /> Right Search
          </span>
        </div>
        <div className="col-span-2 rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full bg-emerald-500" /> Returned Up
          </span>
        </div>
      </div>
    </section>
  );
}

import type { ExecutionStep } from "../types";
import { ROOT_TO_NODE_LINE_GUIDE, ROOT_TO_NODE_LINE_LABELS } from "../constants";

interface ExplanationPanelProps {
  currentStep: number;
  totalSteps: number;
  result: number[];
  found: boolean;
  targetValue: number;
  activeStep: ExecutionStep | undefined;
  currentCodeLine: number;
}

function getExplanation(
  step: ExecutionStep | undefined,
  currentStep: number,
  totalSteps: number,
  result: number[],
  found: boolean,
  targetValue: number,
  currentCodeLine: number,
) {
  const lineGuide = ROOT_TO_NODE_LINE_GUIDE[currentCodeLine];
  const lineLabel = ROOT_TO_NODE_LINE_LABELS[currentCodeLine] ?? "Traversal Context";

  if (!step && currentStep === 0) {
    return {
      title: "Ready to Start",
      description:
        `Click "Next Step" to search path for target ${targetValue}. DFS will push nodes and backtrack on dead ends.`,
      details: [
        "Start from dfs(root).",
        "Watch call stack, highlighted line, and path array together.",
      ],
    };
  }

  if (currentStep >= totalSteps) {
    return {
      title: "Traversal Complete",
      description: found
        ? `Path found for target ${targetValue}: [${result.join(", ")}].`
        : `Search finished. Target ${targetValue} is not present in the tree.`,
      details: [
        `Total execution steps: ${totalSteps}`,
        "Use Previous to replay each DFS/backtracking action.",
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
        title: `Entering dfs(${step.value})`,
        description: "A new recursive frame is pushed to the call stack.",
        details: ["Next action: add this node into path."],
      };
    case "traverse_left":
      return {
        title: `Try Left from ${step.value}`,
        description: "Search enters left subtree first.",
        details: ["If found there, recursion returns true upward."],
      };
    case "visit":
      return {
        title: `Add Node ${step.value} To Path`,
        description: "Node is pushed to path before checking target.",
        details: [`Current path length: ${result.length}`],
      };
    case "traverse_right":
      return {
        title: `Try Right from ${step.value}`,
        description: "Right subtree is explored only after left fails.",
        details: ["Still part of DFS backtracking search."],
      };
    case "found_target":
      return {
        title: `Target ${targetValue} Found`,
        description: "Search is successful. Current path is the answer.",
        details: [`Path: [${result.join(", ")}]`],
      };
    case "backtrack":
      return {
        title: `Backtrack at ${step.value}`,
        description: "Node removed from path because target was not found in this branch.",
        details: ["Return false and continue search at parent."],
      };
    case "exit_function":
      return {
        title: `Return from dfs(${step.value})`,
        description: "Current recursive frame completed and returned to parent.",
        details: ["Return value indicates found or not found state."],
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
  found,
  targetValue,
  activeStep,
  currentCodeLine,
}: ExplanationPanelProps) {
  const explanation = getExplanation(
    activeStep,
    currentStep,
    totalSteps,
    result,
    found,
    targetValue,
    currentCodeLine,
  );

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_1fr_auto] gap-2 p-2.5">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">
          Step Explanation
        </h2>
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



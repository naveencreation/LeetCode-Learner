import type { ExecutionStep } from "../types";
import { BALANCED_BINARY_TREE_LINE_GUIDE, BALANCED_BINARY_TREE_LINE_LABELS } from "../constants";

interface ExplanationPanelProps {
  currentStep: number;
  totalSteps: number;
  result: boolean;
  activeStep: ExecutionStep | undefined;
  currentCodeLine: number;
}

function getExplanation(
  step: ExecutionStep | undefined,
  currentStep: number,
  totalSteps: number,
  result: boolean,
  currentCodeLine: number,
) {
  const lineGuide = BALANCED_BINARY_TREE_LINE_GUIDE[currentCodeLine];
  const lineLabel = BALANCED_BINARY_TREE_LINE_LABELS[currentCodeLine] ?? "Balance Check Context";

  if (!step && currentStep === 0) {
    return {
      title: "Ready to Start",
      description:
        'Click "Next Step" to begin. We will recursively check if the tree is height-balanced.',
      details: [
        "Start from check(root).",
        "Watch recursion stack, height values, and balance results.",
      ],
    };
  }

  if (currentStep >= totalSteps) {
    return {
      title: "Balance Check Complete",
      description: `All steps finished. Tree is ${result ? "balanced ✓" : "unbalanced ✗"}.`,
      details: [
        `Total execution steps: ${totalSteps}`,
        "Use Previous to replay each recursive check step by step.",
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
        `Current status: ${result ? "Balanced so far" : "Unbalanced detected or pending"}`,
      ],
    };
  }

  switch (step?.type) {
    case "enter_function":
      return {
        title: `Entering check(${step.value})`,
        description: `Starting recursive check for node ${step.value}. Will check left subtree first.`,
        details: ["Base case: null returns 0.", "Recursive case: check left, then right."],
      };
    case "check_left":
      return {
        title: `Checking Left Subtree of ${step.value}`,
        description: "Recursively exploring the left subtree to get its height.",
        details: ["Will use the height result to compare with right height."],
      };
    case "check_right":
      return {
        title: `Checking Right Subtree of ${step.value}`,
        description: "Recursively exploring the right subtree to get its height.",
        details: ["About to perform height difference check."],
      };
    case "check_balance":
      return {
        title: `Validating Balance at Node ${step.value}`,
        description: "Comparing left and right subtree heights.",
        details: [`Balance condition: |left - right| ≤ 1`],
      };
    case "return_height":
      return {
        title: `Node ${step.value} is Balanced`,
        description: `Returning height ${step.currentHeight} from node ${step.value}.`,
        details: ["Height will be passed to parent for parent's balance check."],
      };
    case "return_unbalanced":
      return {
        title: `Node ${step.value} is Unbalanced`,
        description: `Height difference exceeds limit. Returning -1 sentinel (unbalanced).`,
        details: [
          "-1 will propagate immediately up the tree.",
          "No need to check siblings — tree is already unbalanced.",
        ],
      };
    case "exit_function":
      return {
        title: "Final Result",
        description: step.isBalanced
          ? "Root returned valid height. Tree is balanced!"
          : "Root returned -1. Tree is unbalanced!",
        details: [result ? "✓ All nodes satisfy balance property." : "✗ At least one node violates property."],
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
            <span className="h-3 w-3 rounded-full bg-violet-400" /> Processing
          </span>
        </div>
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full bg-[#2dd4bf]" /> Right
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

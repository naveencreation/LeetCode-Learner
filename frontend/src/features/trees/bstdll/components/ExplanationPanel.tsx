import type { ExecutionStep } from "../types";
import { BSTDLL_LINE_GUIDE, BSTDLL_LINE_LABELS } from "../constants";

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
  const lineGuide = BSTDLL_LINE_GUIDE[currentCodeLine];
  const lineLabel = BSTDLL_LINE_LABELS[currentCodeLine] ?? "Traversal Context";

  if (!step && currentStep === 0) {
    return {
      title: "Ready to Start",
      description:
        'Click "Next Step" to begin. We will run inorder DFS and rewire pointers into a circular DLL.',
      details: [
        "Track head and prev updates at every visit.",
        "Watch call stack, highlighted line, and DLL order together.",
      ],
    };
  }

  if (currentStep >= totalSteps) {
    return {
      title: "Traversal Complete",
      description: `All steps finished. Final circular DLL order is [${result.join(", ")}].`,
      details: [
        `Total execution steps: ${totalSteps}`,
        "Use Previous to replay pointer-link actions slowly.",
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
        title: `Entering inorder(${step.value})`,
        description: "A new recursive frame is pushed to the call stack.",
        details: ["Next action: explore left subtree first."],
      };
    case "set_head":
      return {
        title: `Head initialized at ${step.value}`,
        description: "The first inorder node becomes the DLL head.",
        details: ["This is the smallest value in BST order."],
      };
    case "link_prev_curr":
      return {
        title: `Link previous with ${step.value}`,
        description: "Pointers are rewired in-place: prev.right = curr and curr.left = prev.",
        details: ["No extra nodes are created."],
      };
    case "traverse_left":
      return {
        title: `Traverse Left from ${step.value}`,
        description: "Inorder visits left subtree before linking current node.",
        details: ["This preserves sorted order for BST-like structures."],
      };
    case "visit":
      return {
        title: `Process Node ${step.value}`,
        description: "Current node is now part of the DLL order and becomes new prev.",
        details: [`Result length after this step: ${result.length + 1}`],
      };
    case "traverse_right":
      return {
        title: `Traverse Right from ${step.value}`,
        description: "After linking current node, recursion enters right subtree.",
        details: ["This completes Left -> Root -> Right order."],
      };
    case "close_cycle":
      return {
        title: "Close circular links",
        description: "Tail points to head and head points back to tail.",
        details: ["This converts linear DLL into circular DLL."],
      };
    case "exit_function":
      return {
        title: `Return from inorder(${step.value})`,
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


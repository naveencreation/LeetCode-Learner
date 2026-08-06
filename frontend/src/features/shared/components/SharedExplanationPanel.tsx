"use client";

import type { GenericExecutionStep } from "../tree-types";

export interface LineGuideItem {
  meaning: string;
  why: string;
  next: string;
}

export interface ExplanationInfo {
  title: string;
  description: string;
  details: string[];
}

export interface SharedExplanationPanelProps<TStep extends GenericExecutionStep = GenericExecutionStep> {
  currentStep: number;
  totalSteps: number;
  result?: unknown[];
  activeStep: TStep | undefined;
  currentCodeLine: number;
  lineGuideMap?: Record<number, LineGuideItem>;
  lineLabelMap?: Record<number, string>;
  getCustomStepExplanation?: (
    step: TStep | undefined,
    currentStep: number,
    totalSteps: number,
    result: unknown[],
    currentCodeLine: number,
  ) => ExplanationInfo | null;
  algorithmName?: string;
  traversalOrderText?: string;
}

export function SharedExplanationPanel<TStep extends GenericExecutionStep = GenericExecutionStep>({
  currentStep,
  totalSteps,
  result = [],
  activeStep,
  currentCodeLine,
  lineGuideMap = {},
  lineLabelMap = {},
  getCustomStepExplanation,
  algorithmName = "traversal",
  traversalOrderText = "Left -> Root -> Right",
}: SharedExplanationPanelProps<TStep>) {
  const lineGuide = lineGuideMap[currentCodeLine];
  const lineLabel = lineLabelMap[currentCodeLine] ?? "Traversal Context";

  let explanation: ExplanationInfo;

  const customExplanation = getCustomStepExplanation?.(
    activeStep,
    currentStep,
    totalSteps,
    result,
    currentCodeLine,
  );

  if (customExplanation) {
    explanation = customExplanation;
  } else if (!activeStep && currentStep === 0) {
    explanation = {
      title: "Ready to Start",
      description: `Click "Next Step" to begin. We will follow ${traversalOrderText} and explain each highlighted code line.`,
      details: [
        `Start from recursive execution.`,
        "Watch call stack, highlighted line, and result array together.",
      ],
    };
  } else if (currentStep >= totalSteps) {
    const formattedResult = Array.isArray(result) ? result.join(", ") : String(result);
    explanation = {
      title: "Traversal Complete",
      description: `All steps finished. Final ${algorithmName} result is [${formattedResult}].`,
      details: [
        `Total execution steps: ${totalSteps}`,
        "Use Previous to replay each recursive action slowly.",
      ],
    };
  } else if (lineGuide) {
    const formattedResult = Array.isArray(result) ? result.join(", ") : String(result);
    explanation = {
      title: `Line ${currentCodeLine + 1}: ${lineLabel}`,
      description: lineGuide.meaning,
      details: [
        `Why this line matters: ${lineGuide.why}`,
        `What happens next: ${lineGuide.next}`,
        `Current result snapshot: [${formattedResult}]`,
      ],
    };
  } else {
    switch (activeStep?.type) {
      case "enter_function":
        explanation = {
          title: `Entering node ${activeStep.value ?? ""}`,
          description: "A new recursive frame is pushed to the call stack.",
          details: ["Next action: explore subtree."],
        };
        break;
      case "traverse_left":
        explanation = {
          title: `Traverse Left from ${activeStep.value ?? ""}`,
          description: "Recursion moves to the left child node.",
          details: ["Explores left subtree deeper."],
        };
        break;
      case "visit":
        explanation = {
          title: `Process Node ${activeStep.value ?? ""}`,
          description: "Current node value is appended to the result array.",
          details: [`Result length after this step: ${result.length + 1}`],
        };
        break;
      case "traverse_right":
        explanation = {
          title: `Traverse Right from ${activeStep.value ?? ""}`,
          description: "Recursion moves to the right child node.",
          details: ["Explores right subtree deeper."],
        };
        break;
      case "exit_function":
        explanation = {
          title: `Return from node ${activeStep.value ?? ""}`,
          description: "Current recursive frame is complete and returns.",
          details: ["Control goes back to parent frame."],
        };
        break;
      default:
        explanation = {
          title: "Step Insight",
          description: "Traversal state updated.",
          details: [],
        };
    }
  }

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_1fr_auto] gap-2 p-2.5">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">Step Explanation</h2>
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

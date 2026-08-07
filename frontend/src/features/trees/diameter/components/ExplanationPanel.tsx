import type { ExecutionStep } from "../types";
import { DIAMETER_LINE_GUIDE, DIAMETER_LINE_LABELS } from "../constants";

interface ExplanationPanelProps {
  currentStep: number;
  totalSteps: number;
  currentDiameter: number;
  activeStep: ExecutionStep | undefined;
  currentCodeLine: number;
}

function getExplanation(
  step: ExecutionStep | undefined,
  currentStep: number,
  totalSteps: number,
  currentDiameter: number,
  currentCodeLine: number,
) {
  const lineGuide = DIAMETER_LINE_GUIDE[currentCodeLine];
  const lineLabel = DIAMETER_LINE_LABELS[currentCodeLine] ?? "Diameter Context";

  if (!step && currentStep === 0) {
    return {
      title: "Ready to Start",
      description: "Click Next Step to begin diameter computation with DFS heights.",
      details: [
        "Each node computes left height and right height.",
        "Global best updates using leftHeight + rightHeight.",
      ],
    };
  }

  if (currentStep >= totalSteps) {
    return {
      title: "Computation Complete",
      description: `All steps finished. Final diameter is ${currentDiameter}.`,
      details: [
        `Total execution steps: ${totalSteps}`,
        "Replay using Previous to inspect every update.",
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
        `Current best diameter: ${currentDiameter}`,
      ],
    };
  }

  switch (step?.type) {
    case "enter_function":
      return {
        title: `Enter heights(${step.node?.val})`,
        description: "Push frame and start subtree height evaluation.",
        details: ["Left subtree is evaluated before right subtree."],
      };
    case "compute_left":
      return {
        title: "Compute Left Height",
        description: "Traverse left subtree and get its height.",
        details: ["Left height contributes to local diameter candidate."],
      };
    case "compute_right":
      return {
        title: "Compute Right Height",
        description: "Traverse right subtree and get its height.",
        details: ["Now both heights are available for candidate calculation."],
      };
    case "update_diameter":
      return {
        title: "Evaluate Diameter Candidate",
        description: "Compare leftHeight + rightHeight with global maximum.",
        details: [`Current best diameter: ${currentDiameter}`],
      };
    case "return_height":
      return {
        title: `Return Height from ${step.node?.val}`,
        description: "Return subtree height to parent recursion frame.",
        details: ["Parent uses this to compute its own candidate."],
      };
    default:
      return {
        title: "Step Insight",
        description: "Diameter state updated.",
        details: [],
      };
  }
}

export function ExplanationPanel({
  currentStep,
  totalSteps,
  currentDiameter,
  activeStep,
  currentCodeLine,
}: ExplanationPanelProps) {
  const explanation = getExplanation(
    activeStep,
    currentStep,
    totalSteps,
    currentDiameter,
    currentCodeLine,
  );

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_1fr] gap-2 p-2.5">
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
    </section>
  );
}

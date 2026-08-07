import type { ZigzagTreeExecutionStep } from "../types";
import { ZIGZAG_LINE_GUIDE, ZIGZAG_LINE_LABELS } from "../constants";

interface ExplanationPanelProps {
  currentStep: number;
  totalSteps: number;
  result: number[][];
  activeStep: ZigzagTreeExecutionStep | undefined;
  currentCodeLine: number;
}

function getExplanation(
  step: ZigzagTreeExecutionStep | undefined,
  currentStep: number,
  totalSteps: number,
  result: number[][],
  currentCodeLine: number,
) {
  const lineGuide = ZIGZAG_LINE_GUIDE[currentCodeLine];
  const lineLabel = ZIGZAG_LINE_LABELS[currentCodeLine] ?? "BFS Traversal";

  if (!step && currentStep === 0) {
    return {
      title: "Ready to Start",
      description:
        'Click "Next Step" to begin. We will traverse the tree level by level, alternating direction each level.',
      details: [
        "Start from root node.",
        "Watch BFS queue, highlighted line, and level results.",
      ],
    };
  }

  if (currentStep >= totalSteps) {
    return {
      title: "Traversal Complete",
      description: `All steps finished. Final zigzag result is ${JSON.stringify(result)}.`,
      details: [
        `Total execution steps: ${totalSteps}`,
        "Use Previous to replay each BFS action slowly.",
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
        `Current result snapshot: ${JSON.stringify(result)}`,
      ],
    };
  }

  switch (step?.type) {
    case "init_queue":
      return {
        title: "Initialize BFS",
        description: "Setup queue with root node and prepare result array.",
        details: ["Next: Process first level of the tree."],
      };
    case "start_level":
    case "get_level_size":
      return {
        title: `Processing Level ${step.currentLevel}`,
        description: `Queue has ${step.queueState.length} nodes. Processing current level.`,
        details: [`Direction: ${step.leftToRight ? "Left to Right" : "Right to Left"}`],
      };
    case "process_node":
      return {
        title: `Process Node ${step.currentNode?.val ?? "null"}`,
        description: "Adding node value to current level result.",
        details: ["Children will be added to queue for next level."],
      };
    case "add_left_child":
    case "add_right_child":
      return {
        title: "Queue Children",
        description: "Adding left and right children to BFS queue.",
        details: ["These will be processed in the next level."],
      };
    case "add_level_result":
    case "reverse_level":
      return {
        title: `Level ${step.currentLevel} Complete`,
        description: "Current level finished. Result added to output.",
        details: [`Level result: [${step.levelResult?.join(", ") ?? ""}]`, "Direction will reverse for next level."],
      };
    case "complete":
      return {
        title: "Traversal Done",
        description: "All levels processed. Returning final result.",
        details: [`Final result: ${JSON.stringify(result)}`],
      };
    default:
      return {
        title: "BFS Step",
        description: "Processing tree nodes level by level.",
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
            <span className="h-3 w-3 rounded-full bg-sky-400" /> Queued
          </span>
        </div>
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full bg-amber-400" /> Processing
          </span>
        </div>
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full bg-violet-400" /> Current Level
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


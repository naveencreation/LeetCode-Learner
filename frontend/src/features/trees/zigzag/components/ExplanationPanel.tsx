import type { ExecutionStep } from "../types";
import { ZIGZAG_LINE_GUIDE, ZIGZAG_LINE_LABELS } from "../constants";

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
  const lineGuide = ZIGZAG_LINE_GUIDE[currentCodeLine];
  const lineLabel = ZIGZAG_LINE_LABELS[currentCodeLine] ?? "Traversal Context";

  if (!step && currentStep === 0) {
    return {
      title: "Ready to Start Zigzag Traversal",
      description:
        'Click "Next Step" to begin. We process tree levels with BFS, alternating output direction each level.',
      details: [
        "Start with queue initialized to root.",
        "Track level boundaries using queue length.",
        "Watch highlighted line, queue snapshot, and nested result together.",
      ],
    };
  }

  if (currentStep >= totalSteps) {
    return {
      title: "Zigzag Traversal Complete!",
      description: `All levels processed. Final zigzag result: [${result.join(", ")}].`,
      details: [
        `Total execution steps: ${totalSteps}`,
        "Use Previous to replay queue transitions carefully.",
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
        `Current flattened snapshot: [${result.join(", ")}]`,
      ],
    };
  }

  switch (step?.type) {
    case "enqueue":
      return {
        title: `Enqueue Node ${step.value}`,
        description: "A child node is added to the queue for processing in next level.",
        details: [
          "Child nodes are enqueued after processing current level",
          "Maintains breadth-first order",
        ],
      };
    case "dequeue":
      return {
        title: `Dequeue Node ${step.value}`,
        description: "Remove and process the next node from the front of the queue.",
        details: ["Queue processes nodes in FIFO order (breadth-first)"],
      };
    case "process_level":
      return {
        title: `Process Node ${step.value}`,
        description: "Current node value is added to the level being processed.",
        details: [
          `Level nodes added: ${result.length + 1}`,
          "After processing all nodes at current level, reverse if odd-indexed",
        ],
      };
    case "flip_direction":
      return {
        title: "Flip Direction for Next Level",
        description:
          "Direction switches for next level. Odd levels are reversed to create zigzag pattern.",
        details: [
          "Even levels: left-to-right (no reverse)",
          "Odd levels: right-to-left (reversed)",
          "This alternation creates the zigzag pattern",
        ],
      };
    case "complete":
      return {
        title: "Traversal Complete",
        description: "All levels have been processed in zigzag order.",
        details: [`Final result: [${result.join(", ")}]`],
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
          {explanation.details.map((detail) => (
            <li
              key={detail}
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
            <span className="h-3 w-3 rounded-full bg-sky-400" /> Enqueued Left
          </span>
        </div>
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full bg-amber-400" /> Dequeued
          </span>
        </div>
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full bg-violet-400" /> Enqueued Right / Processing
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

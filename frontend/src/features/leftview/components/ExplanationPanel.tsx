import type { ExecutionStep } from "../types";
import { LEFTVIEW_LINE_GUIDE, LEFTVIEW_LINE_LABELS } from "../constants";

interface ExplanationPanelProps {
  currentStep: number;
  totalSteps: number;
  result: number[];
  activeStep: ExecutionStep | undefined;
  currentCodeLine: number;
  queueBefore: number[];
  queueAfter: number[];
  currentLevel: number;
  indexInLevel: number;
  dequeuedNode: number | null;
  enqueuedNodes: number[];
  capturedNode: number | null;
}

function getExplanation(
  step: ExecutionStep | undefined,
  currentStep: number,
  totalSteps: number,
  result: number[],
  currentCodeLine: number,
  queueBefore: number[],
  queueAfter: number[],
  currentLevel: number,
  indexInLevel: number,
  dequeuedNode: number | null,
  enqueuedNodes: number[],
  capturedNode: number | null,
) {
  const lineGuide = LEFTVIEW_LINE_GUIDE[currentCodeLine];
  const lineLabel = LEFTVIEW_LINE_LABELS[currentCodeLine] ?? "Traversal Context";

  if (!step && currentStep === 0) {
    return {
      title: "Ready to Start",
      reason:
        'Click "Next Step" to begin. We will process tree level by level and capture the first node from each level.',
      details: [
        "Start from leftView(root).",
        "Watch queue, highlighted line, and result array together.",
      ],
    };
  }

  if (currentStep >= totalSteps) {
    return {
      title: "Traversal Complete",
      reason: `All steps finished. Final leftview result is [${result.join(", ")}].`,
      details: [
        `Total execution steps: ${totalSteps}`,
        "Use Previous to replay each recursive action slowly.",
      ],
    };
  }

  if (lineGuide) {
    return {
      title: `Line ${currentCodeLine + 1}: ${lineLabel}`,
      reason: lineGuide.meaning,
      details: [
        `Why this line matters: ${lineGuide.why}`,
        `What happens next: ${lineGuide.next}`,
        `Queue before -> after: [${queueBefore.join(", ")}] -> [${queueAfter.join(", ")}]`,
        `Level ${currentLevel}, index ${indexInLevel}`,
        `Current result snapshot: [${result.join(", ")}]`,
      ],
    };
  }

  switch (step?.type) {
    case "start_level":
      return {
        title: `Start Level ${currentLevel}`,
        reason: "A new level is about to be processed in BFS order.",
        details: [
          "Next action: iterate nodes in this level.",
          `Queue: [${queueAfter.join(", ")}]`,
        ],
      };
    case "dequeue":
      return {
        title: `Dequeue Node ${dequeuedNode ?? step.value}`,
        reason: "The front node is removed from the queue for processing.",
        details: [
          `Queue before pop: [${queueBefore.join(", ")}]`,
          `Queue after pop: [${queueAfter.join(", ")}]`,
        ],
      };
    case "enqueue_left":
      return {
        title: `Queue Left Child from ${step.value}`,
        reason: "Left child is queued for the next BFS level.",
        details: [
          `Enqueued: [${enqueuedNodes.join(", ")}]`,
          `Queue now: [${queueAfter.join(", ")}]`,
        ],
      };
    case "capture_left_view":
      return {
        title: `Capture Left View Node ${capturedNode ?? step.value}`,
        reason: "This is the first node in current level, so it enters left view.",
        details: [
          `Level ${currentLevel}, index ${indexInLevel} -> captured`,
          `Result length after this step: ${result.length + 1}`,
        ],
      };
    case "enqueue_right":
      return {
        title: `Queue Right Child from ${step.value}`,
        reason: "Right child is also queued for the next BFS level.",
        details: [
          `Enqueued: [${enqueuedNodes.join(", ")}]`,
          `Queue now: [${queueAfter.join(", ")}]`,
        ],
      };
    case "end_level":
      return {
        title: `Complete Level ${currentLevel}`,
        reason: "Current level is done; move on to next queued level.",
        details: [
          `Queue ready for next level: [${queueAfter.join(", ")}]`,
          "Loop continues until queue becomes empty.",
        ],
      };
    case "finish":
      return {
        title: "Traversal Complete",
        reason: `Final left view is [${result.join(", ")}].`,
        details: ["Queue is empty; traversal finished."],
      };
    default:
      return {
        title: "Step Insight",
        reason: "Traversal state updated.",
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
  queueBefore,
  queueAfter,
  currentLevel,
  indexInLevel,
  dequeuedNode,
  enqueuedNodes,
  capturedNode,
}: ExplanationPanelProps) {
  const explanation = getExplanation(
    activeStep,
    currentStep,
    totalSteps,
    result,
    currentCodeLine,
    queueBefore,
    queueAfter,
    currentLevel,
    indexInLevel,
    dequeuedNode,
    enqueuedNodes,
    capturedNode,
  );

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_1fr] gap-1.5 p-1.5">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">
          Step Explanation
        </h2>
        <span className="rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.04em] text-white">
          Info
        </span>
      </div>

      <div className="min-h-0 space-y-1 rounded-[10px] border border-sky-200 bg-gradient-to-b from-cyan-50 to-sky-50 p-1.5">
        <h3 className="line-clamp-1 text-[12px] font-extrabold text-cyan-900">{explanation.title}</h3>
        <p className="line-clamp-2 text-[10px] leading-[1.35] text-cyan-800">{explanation.reason}</p>

        <div className="grid grid-cols-2 gap-1 text-[9px] font-semibold text-cyan-900">
          <span className="truncate rounded-md border border-sky-200 bg-white/80 px-1.5 py-0.5">Line {currentCodeLine + 1}</span>
          <span className="truncate rounded-md border border-sky-200 bg-white/80 px-1.5 py-0.5">Level {currentLevel}</span>
        </div>

        <details className="group rounded-md border border-sky-200 bg-white/75 px-1.5 py-0.5 text-[9px]">
          <summary className="cursor-pointer list-none font-bold uppercase tracking-[0.03em] text-cyan-800">
            Show Internals
          </summary>
          <ul className="mt-1 grid max-h-[110px] gap-1 overflow-auto pr-0.5 text-[9px] text-cyan-900">
            {explanation.details.map((detail) => (
              <li key={detail} className="rounded border border-sky-200 bg-white/90 px-1.5 py-0.5">
                &gt; {detail}
              </li>
            ))}
          </ul>
        </details>
      </div>
    </section>
  );
}




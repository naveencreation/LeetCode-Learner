import type { ExecutionStep } from "../types";
import { BOTTOMVIEW_LINE_GUIDE, BOTTOMVIEW_LINE_LABELS } from "../constants";

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
  const lineGuide = BOTTOMVIEW_LINE_GUIDE[currentCodeLine];
  const lineLabel = BOTTOMVIEW_LINE_LABELS[currentCodeLine] ?? "Traversal Context";
  const resultSnapshot = result.length > 0 ? `[${result.join(", ")}]` : "[]";
  const queueBeforeText = queueBefore.length > 0 ? `[${queueBefore.join(", ")}]` : "[]";
  const queueAfterText = queueAfter.length > 0 ? `[${queueAfter.join(", ")}]` : "[]";

  if (!step && currentStep === 0) {
    return {
      title: "Ready to Start",
      reason: 'Click "Next Step". We will scan level by level and keep the latest node for each horizontal distance.',
      details: [
        "Think of viewing the tree from below.",
        "Each horizontal distance keeps getting overwritten by later nodes.",
        `Current result: ${resultSnapshot}`,
      ],
    };
  }

  if (currentStep >= totalSteps) {
    return {
      title: "Traversal Complete",
      reason: `Done. Final bottom view is ${resultSnapshot}.`,
      details: [
        `Total steps played: ${totalSteps}`,
        "Use Previous to replay slowly and verify each level.",
      ],
    };
  }

  if (lineGuide) {
    return {
      title: `Now: ${lineLabel}`,
      reason: lineGuide.meaning,
      details: [
        `Why it matters: ${lineGuide.why}`,
        `Next: ${lineGuide.next}`,
        `Queue: ${queueBeforeText} -> ${queueAfterText}`,
        `Level ${currentLevel}, position ${indexInLevel}`,
        `Result so far: ${resultSnapshot}`,
      ],
    };
  }

  switch (step?.type) {
    case "start_level":
      return {
        title: `Start Level ${currentLevel}`,
        reason: "We are entering a new level.",
        details: [
          `Nodes waiting in queue: ${queueAfterText}`,
          "Next, we process nodes from left to right in this level.",
        ],
      };
    case "dequeue":
      return {
        title: `Process Node ${dequeuedNode ?? step.value}`,
        reason: "We removed the front node to handle it now.",
        details: [
          `Queue before: ${queueBeforeText}`,
          `Queue after: ${queueAfterText}`,
        ],
      };
    case "enqueue_left":
      return {
        title: `Queue Left Child of ${step.value}`,
        reason: "Left child is saved for the next level.",
        details: [
          `Added node(s): ${enqueuedNodes.length > 0 ? `[${enqueuedNodes.join(", ")}]` : "[]"}`,
          `Queue now: ${queueAfterText}`,
        ],
      };
    case "capture_bottom_view":
      return {
        title: `Set ${capturedNode ?? step.value} as Bottom Candidate`,
        reason:
          "This node updates its horizontal-distance bucket. Later deeper nodes may overwrite again.",
        details: [
          `Level ${currentLevel}, position ${indexInLevel}`,
          `Horizontal distance: ${step.hd ?? 0}`,
          `Result becomes: ${resultSnapshot}`,
        ],
      };
    case "enqueue_right":
      return {
        title: `Queue Right Child of ${step.value}`,
        reason: "Right child is also saved for the next level.",
        details: [
          `Added node(s): ${enqueuedNodes.length > 0 ? `[${enqueuedNodes.join(", ")}]` : "[]"}`,
          `Queue now: ${queueAfterText}`,
        ],
      };
    case "end_level":
      return {
        title: `Complete Level ${currentLevel}`,
        reason: "This level is finished. We move to the next level in the queue.",
        details: [
          `Queue for next level: ${queueAfterText}`,
          `Result so far: ${resultSnapshot}`,
        ],
      };
    case "finish":
      return {
        title: "Traversal Complete",
        reason: `Final bottom view is ${resultSnapshot}.`,
        details: ["Queue is empty, so the traversal is complete."],
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
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_1fr] gap-2 p-2.5">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">
          Step Explanation
        </h2>
      </div>

      <div className="min-h-0 space-y-2 rounded-[10px] border border-sky-200 bg-gradient-to-b from-cyan-50 to-sky-50 p-2">
        <h3 className="text-[13px] font-extrabold text-cyan-900">{explanation.title}</h3>
        <p className="text-[11px] leading-[1.45] text-cyan-800">{explanation.reason}</p>

        <div className="grid grid-cols-2 gap-1.5 text-[10px] font-semibold text-cyan-900">
          <span className="truncate rounded-md border border-sky-200 bg-white/80 px-2 py-1">Line {currentCodeLine + 1}</span>
          <span className="truncate rounded-md border border-sky-200 bg-white/80 px-2 py-1">Level {currentLevel}</span>
        </div>

        <details className="group rounded-lg border border-sky-200 bg-white/75 px-2 py-1 text-[10px]">
          <summary className="cursor-pointer list-none font-bold uppercase tracking-[0.03em] text-cyan-800">
            Show More Detail
          </summary>
          <ul className="mt-1 grid max-h-[180px] gap-1 overflow-auto pr-0.5 text-[10px] text-cyan-900">
            {explanation.details.map((detail) => (
              <li key={detail} className="rounded-lg border border-sky-200 bg-white/90 px-2 py-1">
                &gt; {detail}
              </li>
            ))}
          </ul>
        </details>
      </div>
    </section>
  );
}





import { CheckCircle2, Circle, Info, type LucideIcon } from "lucide-react";
import type { ExecutionStep } from "../types";

interface ExplanationPanelProps {
  currentStep: number;
  totalSteps: number;
  activeStep: ExecutionStep | undefined;
  currentCodeLine: number;
}

interface ExplanationContent {
  title: string;
  description: string;
  details: string[];
  badge: string;
}

const EXPLANATION_BADGE_VARIANTS = {
  neutral: { className: "border-slate-200 bg-slate-50 text-slate-700", icon: Circle },
  info: { className: "border-sky-200 bg-sky-50 text-sky-700", icon: Info },
  success: { className: "border-emerald-200 bg-emerald-50 text-emerald-700", icon: CheckCircle2 },
} satisfies Record<string, { className: string; icon: LucideIcon }>;

function getExplanationBadgeConfig(step: ExecutionStep | undefined) {
  if (!step) return EXPLANATION_BADGE_VARIANTS.neutral;
  if (step.type === "complete") return EXPLANATION_BADGE_VARIANTS.success;
  return EXPLANATION_BADGE_VARIANTS.info;
}

function getExplanation(
  step: ExecutionStep | undefined,
  currentStep: number,
  totalSteps: number,
  currentCodeLine: number,
): ExplanationContent {
  if (!step && currentStep === 0) {
    return {
      title: "Ready to Remove Nth Node",
      description:
        'Press "Start" to begin. We will use the dummy node + two-pointer technique to remove the nth node from the end.',
      details: [
        "Create dummy node pointing to head",
        "fast starts at head, slow starts at dummy",
        "fast moves n steps ahead, then both move together",
        "when fast reaches end, slow is before target",
      ],
      badge: "Ready",
    };
  }

  if (currentStep >= totalSteps) {
    return {
      title: "Node Removed!",
      description: "The target node has been successfully removed from the linked list.",
      details: [
        `Total execution steps: ${totalSteps}`,
        "Algorithm runs in O(n) time with O(1) space",
        "Dummy node elegantly handles all edge cases including head removal",
        "Use Previous to replay the pointer movements",
      ],
      badge: "Complete",
    };
  }

  switch (step?.type) {
    case "init":
      return {
        title: "Initialize Pointers",
        description: "Create dummy node (0) pointing to head. Fast starts at head, slow at dummy.",
        details: [
          "Phase: Setup",
          "dummy = ListNode(0, head)",
          `n = ${step.pointers.n}: remove ${step.pointers.n}${step.pointers.n === 1 ? "st" : step.pointers.n === 2 ? "nd" : step.pointers.n === 3 ? "rd" : "th"} node from end`,
          "Dummy node ensures we can remove head without special case",
        ],
        badge: "Setup",
      };
    case "advance_fast_n":
      return {
        title: "Advance Fast Pointer",
        description: "Move the fast pointer n steps ahead to create an n-node gap.",
        details: [
          "Phase: Advance Fast",
          `Line ${currentCodeLine}: for _ in range(n)`,
          "Slow stays at dummy while fast moves ahead",
          "After this, fast is n nodes ahead of slow",
        ],
        badge: "Fast +n",
      };
    case "advance_together":
      return {
        title: "Move Together",
        description: "Move both fast and slow pointers one step forward until fast reaches end.",
        details: [
          "Phase: Movement",
          `Line ${currentCodeLine}: while fast:`,
          "slow = slow.next, fast = fast.next",
          "Maintains the n-node gap between pointers",
          "When loop ends, slow is before target node",
        ],
        badge: "Both +1",
      };
    case "remove_node":
      return {
        title: "Remove Target Node",
        description: "Skip the target node by setting slow.next to slow.next.next.",
        details: [
          "Phase: Remove",
          `Line ${currentCodeLine}: slow.next = slow.next.next`,
          `Target: ${step.pointers.target}`,
          "This effectively removes the nth node from end",
          "Works for all cases: head, middle, or tail",
        ],
        badge: "Remove",
      };
    case "complete":
      return {
        title: "Removal Complete!",
        description: "Return dummy.next as the new head of the modified list.",
        details: [
          "Phase: Complete",
          `Line ${currentCodeLine}: return dummy.next`,
          "Complexity: O(n) time, O(1) space",
          "Dummy node pattern elegantly solved edge cases",
        ],
        badge: "Done ✓",
      };
    default:
      return {
        title: "Step Insight",
        description: "Traversal state updated.",
        details: [],
        badge: "Step",
      };
  }
}

export function ExplanationPanel({
  currentStep,
  totalSteps,
  activeStep,
  currentCodeLine,
}: ExplanationPanelProps) {
  const explanation = getExplanation(activeStep, currentStep, totalSteps, currentCodeLine);
  const {
    className: explanationBadgeClass,
    icon: ExplanationBadgeIcon,
  } = getExplanationBadgeConfig(activeStep);
  const isExplanationActive = Boolean(activeStep);

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_1fr_auto] gap-2 p-2.5">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">Step Explanation</h2>
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${explanationBadgeClass}`}>
          <ExplanationBadgeIcon
            className={`h-3 w-3 ${isExplanationActive ? "motion-safe:animate-pulse" : ""}`}
            strokeWidth={2.3}
            aria-hidden="true"
          />
          <span>{explanation.badge}</span>
        </span>
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

      {/* Legend */}
      <div className="grid grid-cols-2 gap-1.5 rounded-[10px] border border-slate-200 bg-slate-50 p-2 text-[10px] text-slate-700">
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#e5e7eb" }} /> Unvisited
          </span>
        </div>
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#fbbf24" }} /> Current (Slow)
          </span>
        </div>
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#86efac" }} /> Done
          </span>
        </div>
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#93c5fd" }} /> Fast Pointer
          </span>
        </div>
      </div>
    </section>
  );
}

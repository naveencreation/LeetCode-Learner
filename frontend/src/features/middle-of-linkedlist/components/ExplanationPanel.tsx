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
  if (step.type === "found_middle") return EXPLANATION_BADGE_VARIANTS.success;
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
      title: "Ready to Find Middle",
      description:
        'Press "Start" to begin. We will use the Tortoise and Hare algorithm to find the middle node.',
      details: [
        "slow moves 1 step at a time",
        "fast moves 2 steps at a time",
        "When fast reaches the end, slow is at the middle",
      ],
      badge: "Ready",
    };
  }

  if (currentStep >= totalSteps) {
    return {
      title: "Middle Found!",
      description: "The slow pointer is now at the middle node of the linked list.",
      details: [
        `Total execution steps: ${totalSteps}`,
        "Algorithm runs in O(n) time with O(1) space",
        "Use Previous to replay the pointer movements",
      ],
      badge: "Complete",
    };
  }

  switch (step?.type) {
    case "init":
      return {
        title: "Initialize Pointers",
        description: "Set both slow and fast pointers to the head of the list.",
        details: [
          "Phase: Setup",
          "Both pointers start at the same position",
          "This is the starting point of the algorithm",
        ],
        badge: "Setup",
      };
    case "check_loop":
      return {
        title: "Check Loop Condition",
        description: "Verify that fast pointer can advance (fast and fast.next exist).",
        details: [
          "Phase: Loop",
          "Line 6: while fast and fast.next",
          "If condition fails, we've reached the end",
        ],
        badge: "Check",
      };
    case "advance_slow":
      return {
        title: "Advance Slow Pointer",
        description: "Move the slow pointer one step forward.",
        details: [
          "Phase: Movement",
          "slow = slow.next",
          `Line ${currentCodeLine}`,
          "Tortoise moves steadily forward",
        ],
        badge: "Slow +1",
      };
    case "advance_fast":
      return {
        title: "Advance Fast Pointer",
        description: "Move the fast pointer two steps forward.",
        details: [
          "Phase: Movement",
          "fast = fast.next.next",
          `Line ${currentCodeLine}`,
          "Hare moves twice as fast",
        ],
        badge: "Fast +2",
      };
    case "found_middle":
      return {
        title: "Middle Node Found!",
        description: "The fast pointer reached the end. Slow is at the middle.",
        details: [
          "Phase: Complete",
          `Line ${currentCodeLine}: return slow`,
          "Complexity: O(n) time, O(1) space",
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

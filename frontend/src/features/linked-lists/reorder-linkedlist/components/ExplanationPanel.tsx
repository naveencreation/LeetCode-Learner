import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Info,
  type LucideIcon,
} from "lucide-react";
import type { ExecutionStep, ReorderSeverity } from "../types";

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
  neutral: {
    className: "border-slate-200 bg-slate-50 text-slate-700",
    icon: Circle,
  },
  info: {
    className: "border-sky-200 bg-sky-50 text-sky-700",
    icon: Info,
  },
  warning: {
    className: "border-amber-200 bg-amber-50 text-amber-700",
    icon: AlertTriangle,
  },
  critical: {
    className: "border-rose-200 bg-rose-50 text-rose-700",
    icon: AlertCircle,
  },
  success: {
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
} satisfies Record<ReorderSeverity, { className: string; icon: LucideIcon }>;

function getExplanationBadgeConfig(step: ExecutionStep | undefined): {
  className: string;
  icon: LucideIcon;
} {
  const severity = step?.metadata?.severity ?? "neutral";
  return EXPLANATION_BADGE_VARIANTS[severity];
}

function getSeverityPulseDuration(severity: ReorderSeverity): string {
  switch (severity) {
    case "critical": return "0.8s";
    case "warning":  return "1.05s";
    case "success":  return "1.35s";
    case "info":     return "1.8s";
    default:         return "2.1s";
  }
}

function getExplanation(
  step: ExecutionStep | undefined,
  currentStep: number,
  totalSteps: number,
  currentCodeLine: number,
): ExplanationContent {
  if (!step && currentStep === 0) {
    return {
      title: "Ready to Reorder",
      description:
        'Press "Next" to begin. The algorithm runs in three phases: Find Middle → Reverse Second Half → Merge.',
      details: [
        "Phase 1: slow/fast pointers find the midpoint in O(n/2)",
        "Phase 2: standard in-place reversal of the back half",
        "Phase 3: interleave the two halves with O(n/2) rewires",
        "Overall: O(n) time, O(1) space",
      ],
      badge: "Ready",
    };
  }

  if (currentStep >= totalSteps) {
    return {
      title: "Reorder Complete!",
      description:
        "All nodes have been placed. The list is now reordered in-place with alternating front/back nodes.",
      details: [
        `Total execution steps: ${totalSteps}`,
        "No extra memory was used.",
        "Use Previous to replay every pointer move.",
      ],
      badge: "Done ✓",
    };
  }

  if (!step) {
    return {
      title: "Step Insight",
      description: "Traversal state updated.",
      details: [],
      badge: "Step",
    };
  }

  const { title, description, badge, tip, phase } = step.metadata;
  const phaseNote = `Phase: ${phase}`;

  switch (step.type) {
    case "init":
      return {
        title,
        description,
        details: [phaseNote, "slow and fast both start at head.", ...(tip ? [tip] : [])],
        badge,
      };
    case "find_middle_check":
      return {
        title,
        description,
        details: [phaseNote, `Line ${currentCodeLine}: while fast.next and fast.next.next`, ...(tip ? [tip] : [])],
        badge,
      };
    case "find_middle_move":
      return {
        title,
        description,
        details: [phaseNote, "slow += 1 step, fast += 2 steps", `Line ${currentCodeLine}: slow = slow.next; fast = fast.next.next`],
        badge,
      };
    case "find_middle_done":
      return {
        title,
        description,
        details: [phaseNote, "Loop condition is now false.", "slow is positioned at the midpoint.", ...(tip ? [tip] : [])],
        badge,
      };
    case "split_halves":
      return {
        title,
        description,
        details: [phaseNote, `Line ${currentCodeLine}: slow.next = None`, "Two independent sub-lists are now ready.", ...(tip ? [tip] : [])],
        badge,
      };
    case "reverse_init":
      return {
        title,
        description,
        details: [phaseNote, "prev = None, curr = head of second half.", `Line ${currentCodeLine}: prev, curr = None, slow.next`],
        badge,
      };
    case "reverse_loop_check":
      return {
        title,
        description,
        details: [phaseNote, `Line ${currentCodeLine}: while curr`, "curr is not None — continue reversing."],
        badge,
      };
    case "reverse_save_next":
      return {
        title,
        description,
        details: [phaseNote, "Must save before overwriting curr.next!", `Line ${currentCodeLine}: tmp = curr.next`, ...(tip ? [tip] : [])],
        badge,
      };
    case "reverse_link":
      return {
        title,
        description,
        details: [phaseNote, "One arrow flips per iteration.", `Line ${currentCodeLine}: curr.next = prev`, ...(tip ? [tip] : [])],
        badge,
      };
    case "reverse_advance":
      return {
        title,
        description,
        details: [phaseNote, `Line ${currentCodeLine}: prev = curr; curr = tmp`],
        badge,
      };
    case "reverse_done":
      return {
        title,
        description,
        details: [phaseNote, "prev = head of the reversed second half.", "Ready to merge!", ...(tip ? [tip] : [])],
        badge,
      };
    case "merge_init":
      return {
        title,
        description,
        details: [phaseNote, `Line ${currentCodeLine}: p1, p2 = head, prev`, ...(tip ? [tip] : [])],
        badge,
      };
    case "merge_loop_check":
      return {
        title,
        description,
        details: [phaseNote, `Line ${currentCodeLine}: while p2`, "p2 is not None — interleave another pair."],
        badge,
      };
    case "merge_save":
      return {
        title,
        description,
        details: [phaseNote, `Line ${currentCodeLine}: p1_next, p2_next = p1.next, p2.next`, ...(tip ? [tip] : [])],
        badge,
      };
    case "merge_link_p1":
      return {
        title,
        description,
        details: [phaseNote, `Line ${currentCodeLine}: p1.next = p2`],
        badge,
      };
    case "merge_link_p2":
      return {
        title,
        description,
        details: [phaseNote, `Line ${currentCodeLine}: p2.next = p1_next`],
        badge,
      };
    case "merge_advance":
      return {
        title,
        description,
        details: [phaseNote, `Line ${currentCodeLine}: p1 = p1_next; p2 = p2_next`],
        badge,
      };
    case "complete":
      return {
        title,
        description,
        details: [phaseNote, "O(n) time, O(1) space.", ...(tip ? [tip] : [])],
        badge,
      };
    default:
      return { title: "Step Insight", description: "State updated.", details: [], badge: "Step" };
  }
}

export function ExplanationPanel({
  currentStep,
  totalSteps,
  activeStep,
  currentCodeLine,
}: ExplanationPanelProps) {
  const explanation = getExplanation(activeStep, currentStep, totalSteps, currentCodeLine);
  const { className: explanationBadgeClass, icon: ExplanationBadgeIcon } =
    getExplanationBadgeConfig(activeStep);
  const explanationSeverity = activeStep?.metadata?.severity ?? "neutral";
  const isExplanationActive = Boolean(activeStep);

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_1fr_auto] gap-2 p-2.5">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">Step Explanation</h2>
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${explanationBadgeClass}`}
        >
          <ExplanationBadgeIcon
            className={`h-3 w-3 ${isExplanationActive ? "motion-safe:animate-pulse" : ""}`}
            strokeWidth={2.3}
            aria-hidden="true"
            style={
              isExplanationActive
                ? { animationDuration: getSeverityPulseDuration(explanationSeverity) }
                : undefined
            }
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

      {/* Node state legend */}
      <div className="grid grid-cols-2 gap-1.5 rounded-[10px] border border-slate-200 bg-slate-50 p-2 text-[10px] text-slate-700">
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#e5e7eb" }} />
            Unvisited
          </span>
        </div>
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#fbbf24" }} />
            Current (slow/p1)
          </span>
        </div>
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#fda4af" }} />
            Prev
          </span>
        </div>
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#93c5fd" }} />
            Fast / p2 / tmp
          </span>
        </div>
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#c4b5fd" }} />
            Reversed
          </span>
        </div>
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#86efac" }} />
            Done / Merged
          </span>
        </div>
      </div>
    </section>
  );
}

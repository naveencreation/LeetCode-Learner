import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Info,
  type LucideIcon,
} from "lucide-react";
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
} satisfies Record<string, { className: string; icon: LucideIcon }>;

function getSeverityPulseDuration(severity: string): string {
  switch (severity) {
    case "critical":
      return "0.8s";
    case "warning":
      return "1.05s";
    case "success":
      return "1.35s";
    case "info":
      return "1.8s";
    default:
      return "2.1s";
  }
}

function getExplanationBadgeConfig(step: ExecutionStep | undefined): {
  className: string;
  icon: LucideIcon;
} {
  const severity = step?.metadata?.severity ?? "neutral";
  return EXPLANATION_BADGE_VARIANTS[severity];
}

function getExplanation(
  step: ExecutionStep | undefined,
  currentStep: number,
  totalSteps: number,
  currentCodeLine: number,
): ExplanationContent {
  if (!step && currentStep === 0) {
    return {
      title: "Ready to Detect Cycle",
      description:
        'Press "Start" to begin. We will use Floyd\'s algorithm to detect if a cycle exists.',
      details: [
        "slow moves 1 step at a time",
        "fast moves 2 steps at a time",
        "If they meet, there's a cycle",
        "If fast reaches end, no cycle",
      ],
      badge: "Ready",
    };
  }

  if (currentStep >= totalSteps) {
    return {
      title: "Detection Complete!",
      description: "The cycle detection algorithm has finished execution.",
      details: [
        `Total execution steps: ${totalSteps}`,
        "Algorithm runs in O(n) time with O(1) space",
        "Use Previous to replay the pointer movements",
      ],
      badge: "Complete",
    };
  }

  const metadataTitle = step?.metadata?.title;
  const metadataDescription = step?.metadata?.description;
  const metadataPhase = step?.metadata?.phase;
  const metadataTip = step?.metadata?.tip;
  const metadataBadge = step?.metadata?.badge;

  switch (step?.type) {
    case "init":
      return {
        title: metadataTitle ?? "Initialize Pointers",
        description: metadataDescription ?? "Set both slow and fast pointers to the head of the list.",
        details: [
          metadataPhase ? `Phase: ${metadataPhase}` : "Phase: Setup",
          "Both pointers start at the same position",
          "This is the starting point of the algorithm",
          ...(metadataTip ? [metadataTip] : []),
        ],
        badge: metadataBadge ?? "Setup",
      };
    case "check_loop":
      return {
        title: metadataTitle ?? "Check Loop Condition",
        description: metadataDescription ?? "Verify that fast pointer can advance (fast and fast.next exist).",
        details: [
          metadataPhase ? `Phase: ${metadataPhase}` : "Phase: Check",
          "Line 7: while fast and fast.next",
          "If condition fails, we've reached the end (no cycle)",
        ],
        badge: metadataBadge ?? "Check",
      };
    case "advance_slow":
      return {
        title: metadataTitle ?? "Advance Slow Pointer",
        description: metadataDescription ?? "Move the slow pointer one step forward.",
        details: [
          metadataPhase ? `Phase: ${metadataPhase}` : "Phase: Movement",
          "slow = slow.next",
          `Line ${currentCodeLine}`,
          "Tortoise moves steadily forward",
        ],
        badge: metadataBadge ?? "Slow +1",
      };
    case "advance_fast":
      return {
        title: metadataTitle ?? "Advance Fast Pointer",
        description: metadataDescription ?? "Move the fast pointer two steps forward.",
        details: [
          metadataPhase ? `Phase: ${metadataPhase}` : "Phase: Movement",
          "fast = fast.next.next",
          `Line ${currentCodeLine}`,
          "Hare moves twice as fast",
        ],
        badge: metadataBadge ?? "Fast +2",
      };
    case "cycle_detected":
      return {
        title: metadataTitle ?? "Cycle Detected!",
        description: metadataDescription ?? "The slow and fast pointers met, confirming a cycle exists.",
        details: [
          metadataPhase ? `Phase: ${metadataPhase}` : "Phase: Result",
          `Line ${currentCodeLine}: if slow == fast`,
          "Complexity: O(n) time, O(1) space",
          ...(metadataTip ? [metadataTip] : []),
        ],
        badge: metadataBadge ?? "Cycle ✓",
      };
    case "no_cycle":
      return {
        title: metadataTitle ?? "No Cycle Found",
        description: metadataDescription ?? "The fast pointer reached the end without meeting slow pointer.",
        details: [
          metadataPhase ? `Phase: ${metadataPhase}` : "Phase: Result",
          `Line ${currentCodeLine}: return False`,
          "Complexity: O(n) time, O(1) space",
          ...(metadataTip ? [metadataTip] : []),
        ],
        badge: metadataBadge ?? "No Cycle",
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
  const explanationSeverity = activeStep?.metadata?.severity ?? "neutral";
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
            style={
              isExplanationActive
                ? {
                    animationDuration: getSeverityPulseDuration(explanationSeverity),
                  }
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

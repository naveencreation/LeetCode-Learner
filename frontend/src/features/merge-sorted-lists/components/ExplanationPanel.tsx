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
};

function getExplanationBadgeConfig(step: ExecutionStep | undefined): {
  className: string;
  icon: LucideIcon;
} {
  const severity = step?.metadata?.severity ?? "neutral";
  return EXPLANATION_BADGE_VARIANTS[severity as keyof typeof EXPLANATION_BADGE_VARIANTS] ?? EXPLANATION_BADGE_VARIANTS.neutral;
}

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

function getExplanation(
  step: ExecutionStep | undefined,
  currentStep: number,
  totalSteps: number,
  currentCodeLine: number,
): ExplanationContent {
  if (!step && currentStep === 0) {
    return {
      title: "Ready to Merge",
      description:
        'Press "Next" to begin. We will merge two sorted lists by comparing nodes and attaching the smaller one.',
      details: [
        "list1 = first sorted list",
        "list2 = second sorted list",
        "current = builds the merged result",
      ],
      badge: "Ready",
    };
  }

  if (currentStep >= totalSteps) {
    return {
      title: "Merge Complete",
      description: "Both lists are exhausted. The merged list is returned.",
      details: [
        `Total execution steps: ${totalSteps}`,
        "Use Previous to replay every merge step.",
      ],
      badge: "Complete",
    };
  }

  const metadataTitle = step?.metadata?.title;
  const metadataDescription = step?.metadata?.description;
  const metadataPhase = step?.metadata?.phase;
  const metadataBadge = step?.metadata?.badge;

  switch (step?.type) {
    case "init":
      return {
        title: metadataTitle ?? "Initialize Pointers",
        description: metadataDescription ?? "Set up dummy node and current pointer.",
        details: [
          metadataPhase ? `Phase: ${metadataPhase}` : "Phase: Setup",
          "Dummy node simplifies edge cases.",
          "current will build the merged result.",
        ],
        badge: metadataBadge ?? "Setup",
      };
    case "compare":
      return {
        title: metadataTitle ?? "Compare Nodes",
        description: metadataDescription ?? "Compare current nodes from both lists.",
        details: [
          metadataPhase ? `Phase: ${metadataPhase}` : "Phase: Compare",
          "The smaller value gets attached next.",
          `Line ${currentCodeLine}: while list1 and list2`,
        ],
        badge: metadataBadge ?? "Compare",
      };
    case "attach_list1":
      return {
        title: metadataTitle ?? "Attach from List1",
        description: metadataDescription ?? "List1 node is smaller or equal.",
        details: [
          metadataPhase ? `Phase: ${metadataPhase}` : "Phase: Attach",
          "Attach list1's current node to merged result.",
          "Advance list1 pointer.",
        ],
        badge: metadataBadge ?? "List1",
      };
    case "attach_list2":
      return {
        title: metadataTitle ?? "Attach from List2",
        description: metadataDescription ?? "List2 node is smaller.",
        details: [
          metadataPhase ? `Phase: ${metadataPhase}` : "Phase: Attach",
          "Attach list2's current node to merged result.",
          "Advance list2 pointer.",
        ],
        badge: metadataBadge ?? "List2",
      };
    case "advance_current":
      return {
        title: metadataTitle ?? "Advance Current",
        description: metadataDescription ?? "Move current pointer to newly attached node.",
        details: [
          metadataPhase ? `Phase: ${metadataPhase}` : "Phase: Advance",
          "current moves forward in merged list.",
        ],
        badge: metadataBadge ?? "Advance",
      };
    case "append_remaining_list1":
      return {
        title: metadataTitle ?? "Append Remaining List1",
        description: metadataDescription ?? "List1 still has nodes.",
        details: [
          metadataPhase ? `Phase: ${metadataPhase}` : "Phase: Append",
          "Attach all remaining nodes from list1.",
        ],
        badge: metadataBadge ?? "Append",
      };
    case "append_remaining_list2":
      return {
        title: metadataTitle ?? "Append Remaining List2",
        description: metadataDescription ?? "List2 still has nodes.",
        details: [
          metadataPhase ? `Phase: ${metadataPhase}` : "Phase: Append",
          "Attach all remaining nodes from list2.",
        ],
        badge: metadataBadge ?? "Append",
      };
    case "complete":
      return {
        title: metadataTitle ?? "Return Merged Head",
        description: metadataDescription ?? "Return dummy.next as head of merged list.",
        details: [
          metadataPhase ? `Phase: ${metadataPhase}` : "Phase: Return",
          `Line ${currentCodeLine}: return dummy.next`,
          "Time: O(n+m), Space: O(1)",
        ],
        badge: metadataBadge ?? "Done ✓",
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
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#fbbf24" }} /> Current
          </span>
        </div>
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#c4b5fd" }} /> List1
          </span>
        </div>
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#86efac" }} /> List2
          </span>
        </div>
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#93c5fd" }} /> Merged
          </span>
        </div>
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#fda4af" }} /> Done
          </span>
        </div>
      </div>
    </section>
  );
}

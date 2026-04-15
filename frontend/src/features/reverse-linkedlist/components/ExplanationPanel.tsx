import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Info,
  type LucideIcon,
} from "lucide-react";
import type { ExecutionStep, ReverseSeverity } from "../types";

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
} satisfies Record<ReverseSeverity, { className: string; icon: LucideIcon }>;

function getExplanationBadgeConfig(step: ExecutionStep | undefined): {
  className: string;
  icon: LucideIcon;
} {
  const severity = step?.metadata?.severity ?? "neutral";
  return EXPLANATION_BADGE_VARIANTS[severity];
}

function getSeverityPulseDuration(severity: ReverseSeverity): string {
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
      title: "Ready to Reverse",
      description:
        'Press "Next" to begin. We will run prev, curr, and next_node in a tight in-place loop.',
      details: [
        "prev = head of reversed-so-far",
        "curr = node in hand",
        "next_node = safety copy of curr.next",
      ],
      badge: "Ready",
    };
  }

  if (currentStep >= totalSteps) {
    return {
      title: "Reversal Complete",
      description: "All nodes are done. prev is the new head of the reversed list.",
      details: [
        `Total execution steps: ${totalSteps}`,
        "Use Previous to replay every pointer move.",
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
        description: metadataDescription ?? "Set prev = None and curr = head.",
        details: [
          metadataPhase ? `Phase: ${metadataPhase}` : "Phase: Setup",
          "Nothing is reversed yet.",
          "curr starts on the first node.",
          ...(metadataTip ? [metadataTip] : []),
        ],
        badge: metadataBadge ?? "Setup",
      };
    case "loop_check":
      return {
        title: metadataTitle ?? "Check while condition",
        description:
          metadataDescription ?? "Verify whether curr is available before processing another node.",
        details: [
          metadataPhase ? `Phase: ${metadataPhase}` : "Phase: Loop",
          "Line 6: while curr",
          "If curr is None, we stop and return prev.",
        ],
        badge: metadataBadge ?? "Loop Check",
      };
    case "save_next":
      return {
        title: metadataTitle ?? "Store next_node",
        description: metadataDescription ?? "Save curr.next before changing the link.",
        details: [
          metadataPhase ? `Phase: ${metadataPhase}` : "Phase: Loop",
          "This keeps the remaining chain alive.",
          `Line ${currentCodeLine}: next_node = curr.next`,
          ...(metadataTip ? [metadataTip] : []),
        ],
        badge: metadataBadge ?? "nxt saved",
      };
    case "reverse_link":
      return {
        title: metadataTitle ?? "Reverse curr.next",
        description: metadataDescription ?? "Point curr.next to prev to reverse one link.",
        details: [
          metadataPhase ? `Phase: ${metadataPhase}` : "Phase: Loop",
          "Current node now points backward.",
          "Exactly one link flips in this step.",
          `Line ${currentCodeLine}: curr.next = prev`,
          ...(metadataTip ? [metadataTip] : []),
        ],
        badge: metadataBadge ?? "Flipped!",
      };
    case "move_prev":
      return {
        title: metadataTitle ?? "Move prev to curr",
        description: metadataDescription ?? "Set prev = curr.",
        details: [
          metadataPhase ? `Phase: ${metadataPhase}` : "Phase: Loop",
          "prev becomes the front of reversed-so-far.",
          `Line ${currentCodeLine}: prev = curr`,
        ],
        badge: metadataBadge ?? "prev -> curr",
      };
    case "move_curr":
      return {
        title: metadataTitle ?? "Move curr Forward",
        description: metadataDescription ?? "Set curr = next_node and continue.",
        details: [
          metadataPhase ? `Phase: ${metadataPhase}` : "Phase: Loop",
          "Move to the next unreversed node.",
          `Line ${currentCodeLine}: curr = next_node`,
        ],
        badge: metadataBadge ?? "curr -> nxt",
      };
    case "loop_exit":
      return {
        title: metadataTitle ?? "Loop exits",
        description: metadataDescription ?? "curr is None, so the while-loop terminates.",
        details: [
          metadataPhase ? `Phase: ${metadataPhase}` : "Phase: Exit",
          "Line 6 condition is now false.",
          "All links are reversed.",
        ],
        badge: metadataBadge ?? "Done!",
      };
    case "complete":
      return {
        title: metadataTitle ?? "Return Reversed Head",
        description:
          metadataDescription ?? "curr is None, traversal is done. prev is now the reversed head.",
        details: [
          metadataPhase ? `Phase: ${metadataPhase}` : "Phase: Return",
          `Line ${currentCodeLine}: return prev`,
          "Complexity: O(n) time, O(1) space.",
          ...(metadataTip ? [metadataTip] : []),
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
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#fda4af" }} /> Prev
          </span>
        </div>
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#93c5fd" }} /> Next Saved
          </span>
        </div>
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#c4b5fd" }} /> Reversing
          </span>
        </div>
        <div className="rounded-lg px-1 py-0.5">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#86efac" }} /> Done
          </span>
        </div>
      </div>
    </section>
  );
}

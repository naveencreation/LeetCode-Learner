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
  activeStep: ExecutionStep | undefined;
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

export function ExplanationPanel({ activeStep }: ExplanationPanelProps) {
  const { className, icon: BadgeIcon } = getExplanationBadgeConfig(activeStep);
  const metadata = activeStep?.metadata;
  const severity = metadata?.severity ?? "neutral";
  const pulseDuration = getSeverityPulseDuration(severity);

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_1fr_auto] gap-2 p-2.5">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">Explanation</h2>
        {metadata && (
          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.03em] ${className} ${
              severity !== "neutral" ? `animate-pulse` : ""
            }`}
            style={
              severity !== "neutral"
                ? { animationDuration: pulseDuration }
                : undefined
            }
          >
            <BadgeIcon size={11} strokeWidth={2.5} aria-hidden="true" />
            <span>{metadata.badge}</span>
          </div>
        )}
      </div>

      <div className="ui-scrollbar min-h-0 overflow-y-auto pr-1">
        {metadata ? (
          <div className="space-y-3">
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <h3 className="text-[13px] font-bold text-slate-900">
                {metadata.title}
              </h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-slate-600">
                {metadata.description}
              </p>
            </div>

            {metadata.tip && (
              <div className="rounded-lg border border-violet-200 bg-violet-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-violet-700">
                  Tip
                </p>
                <p className="mt-1 text-[12px] text-violet-900">
                  {metadata.tip}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-[12px] text-slate-400">
              Click Next to start reversing nodes in groups.
            </p>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
          Phase
        </p>
        <p className="text-[11px] font-semibold text-slate-700">
          {metadata?.phase ?? "Not started"}
        </p>
      </div>
    </section>
  );
}

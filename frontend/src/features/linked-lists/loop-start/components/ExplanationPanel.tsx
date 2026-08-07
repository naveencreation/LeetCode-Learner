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

export function ExplanationPanel({
  activeStep,
}: ExplanationPanelProps) {
  if (!activeStep) {
    return (
      <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_1fr] gap-2 p-2.5">
        <div className="traversal-panel-header">
          <h2 className="traversal-panel-title">Explanation</h2>
        </div>
        <div className="flex items-center justify-center rounded-[10px] border border-slate-200 bg-white p-6 text-center">
          <div>
            <p className="text-sm font-semibold text-slate-800 mb-1">Ready to Start</p>
            <p className="text-xs text-slate-600">Press play or next step to begin</p>
          </div>
        </div>
      </section>
    );
  }

  const { title, description, badge, severity, tip } = activeStep.metadata;
  const variant = EXPLANATION_BADGE_VARIANTS[severity];
  const Icon = variant.icon;

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_1fr] gap-2 p-2.5">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">Explanation</h2>
      </div>

      <div className="flex flex-col gap-3 overflow-auto">
        <div className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 ${variant.className}`}>
          <Icon size={14} />
          <span className="text-[10px] font-extrabold uppercase tracking-wide">{badge}</span>
        </div>

        <div className="rounded-[10px] border border-slate-200 bg-white p-3">
          <h3 className="text-sm font-bold text-slate-800 mb-2">{title}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
        </div>

        {tip && (
          <div className="rounded-[10px] border border-sky-200 bg-sky-50 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-sky-600 mb-1">
              💡 Tip
            </p>
            <p className="text-xs text-slate-700 leading-relaxed">{tip}</p>
          </div>
        )}
      </div>
    </section>
  );
}

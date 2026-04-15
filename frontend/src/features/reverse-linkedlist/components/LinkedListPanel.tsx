import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Info,
  type LucideIcon,
} from "lucide-react";
import { LinkedListSVG } from "@/features/shared/components/LinkedListSVG";
import type { LinkedListNodeState } from "@/features/shared/linked-list-types";
import type { ExecutionStep, ReverseSeverity } from "../types";

interface LinkedListPanelProps {
  originalValues: number[];
  nodeStates: Record<number, LinkedListNodeState>;
  activeStep: ExecutionStep | undefined;
  currentOperation: string;
  currentStep: number;
  totalSteps: number;
  currentPhase: string;
  reversedCount: number;
  onOpenListSetup: () => void;
}

const OPERATION_BADGE_VARIANTS = {
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

function getOperationBadgeVariant(step: ExecutionStep | undefined): {
  className: string;
  icon: LucideIcon;
} {
  const severity = step?.metadata?.severity ?? "neutral";
  return OPERATION_BADGE_VARIANTS[severity];
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

export function LinkedListPanel({
  originalValues,
  nodeStates,
  activeStep,
  currentOperation,
  currentStep,
  totalSteps,
  currentPhase,
  reversedCount,
  onOpenListSetup,
}: LinkedListPanelProps) {
  const links = activeStep?.links ?? Object.fromEntries(
    originalValues.map((v, i) => [v, originalValues[i + 1] ?? null]),
  );
  const pointers = activeStep?.pointers ?? { prev: null, curr: null, nextSaved: null };
  const {
    className: operationBadgeClass,
    icon: OperationBadgeIcon,
  } = getOperationBadgeVariant(activeStep);
  const operationSeverity = activeStep?.metadata?.severity ?? "neutral";
  const isOperationActive = Boolean(activeStep);

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_auto_1fr] gap-2 p-2.5">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">Linked List Reversal</h2>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-extrabold tracking-wide ${operationBadgeClass}`}>
            <OperationBadgeIcon
              className={`h-3 w-3 ${isOperationActive ? "motion-safe:animate-pulse" : ""}`}
              strokeWidth={2.3}
              aria-hidden="true"
              style={
                isOperationActive
                  ? {
                      animationDuration: getSeverityPulseDuration(operationSeverity),
                    }
                  : undefined
              }
            />
            <span>{currentOperation}</span>
          </span>
          <button
            type="button"
            onClick={onOpenListSetup}
            className="traversal-pill"
          >
            Select List
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5 rounded-[10px] border border-slate-200 bg-white/85 p-1.5">
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-center">
          <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Step</p>
          <p className="text-[11px] font-extrabold text-slate-800">{currentStep} / {totalSteps}</p>
        </div>
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-2 py-1 text-center">
          <p className="text-[9px] font-bold uppercase tracking-wide text-cyan-600">Phase</p>
          <p className="truncate text-[11px] font-extrabold text-cyan-800">{currentPhase}</p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-center">
          <p className="text-[9px] font-bold uppercase tracking-wide text-emerald-600">Reversed</p>
          <p className="text-[11px] font-extrabold text-emerald-800">{reversedCount}</p>
        </div>
      </div>

      <div className="h-full min-h-0 overflow-hidden rounded-[10px] border border-slate-200 bg-gradient-to-b from-[#f8faff] to-[#f0f4fb] p-3">
        <div className="flex h-full min-h-0 items-center justify-center overflow-hidden">
          <LinkedListSVG
            values={originalValues}
            nodeStates={nodeStates}
            links={links}
            pointers={pointers}
          />
        </div>
      </div>
    </section>
  );
}

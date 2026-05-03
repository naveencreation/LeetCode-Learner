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
import type { ExecutionStep } from "../types";

interface LinkedListPanelProps {
  originalValues1: number[];
  originalValues2: number[];
  nodeStates: Record<number, LinkedListNodeState>;
  activeStep: ExecutionStep | undefined;
  currentOperation: string;
  currentStep: number;
  totalSteps: number;
  currentPhase: string;
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
};

function getOperationBadgeVariant(step: ExecutionStep | undefined): {
  className: string;
  icon: LucideIcon;
} {
  const severity = step?.metadata?.severity ?? "neutral";
  return OPERATION_BADGE_VARIANTS[severity as keyof typeof OPERATION_BADGE_VARIANTS] ?? OPERATION_BADGE_VARIANTS.neutral;
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

export function LinkedListPanel({
  originalValues1,
  originalValues2,
  nodeStates,
  activeStep,
  currentOperation,
  currentStep,
  totalSteps,
  currentPhase,
  onOpenListSetup,
}: LinkedListPanelProps) {
  // Combine both lists for visualization
  const allValues = [...originalValues1, ...originalValues2];
  const links = activeStep?.links ?? Object.fromEntries(
    allValues.map((v, i) => [v, allValues[i + 1] ?? null]),
  );

  const pointers = {
    prev: null as number | null,
    curr: null as number | null,
    nextSaved: null as number | null,
    list1: activeStep?.pointers.list1 ?? null,
    list2: activeStep?.pointers.list2 ?? null,
  };

  const {
    className: operationBadgeClass,
    icon: OperationBadgeIcon,
  } = getOperationBadgeVariant(activeStep);
  const operationSeverity = activeStep?.metadata?.severity ?? "neutral";
  const isOperationActive = Boolean(activeStep);

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_auto_1fr] gap-2 p-2.5">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">Two Sorted Lists</h2>
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
            Select Lists
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 rounded-[10px] border border-slate-200 bg-white/85 p-1.5">
        <div className="rounded-lg border border-violet-200 bg-violet-50 px-2 py-1 text-center">
          <p className="text-[9px] font-bold uppercase tracking-wide text-violet-600">List 1</p>
          <p className="text-[11px] font-extrabold text-violet-800">[{originalValues1.join(", ")}]</p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-center">
          <p className="text-[9px] font-bold uppercase tracking-wide text-emerald-600">List 2</p>
          <p className="text-[11px] font-extrabold text-emerald-800">[{originalValues2.join(", ")}]</p>
        </div>
      </div>

      <div className="h-full min-h-0 overflow-hidden rounded-[10px] border border-slate-200 bg-gradient-to-b from-[#f8faff] to-[#f0f4fb] p-3">
        <div className="flex h-full min-h-0 items-center justify-center overflow-hidden">
          <LinkedListSVG
            values={allValues}
            nodeStates={nodeStates}
            links={links}
            pointers={pointers}
          />
        </div>
      </div>
    </section>
  );
}

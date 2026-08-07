import type { ReverseKGroupOperationType } from "./types";
import { OPERATION_TO_LINE_MAP, PHASE_LABELS } from "./constants";
import type { ExecutionStep } from "./types";

export function getCodeLineForStep(step: ExecutionStep | undefined): number {
  if (!step) return 1;
  return OPERATION_TO_LINE_MAP[step.type];
}

export function getOperationBadge(step: ExecutionStep | undefined): string {
  if (!step) return "Step";
  switch (step.type) {
    case "init":
      return "Setup";
    case "check_group":
      return "Check";
    case "reverse_group":
      return "Reverse";
    case "connect_groups":
      return "Connect";
    case "incomplete":
      return "Skip";
    case "complete":
      return "Done";
    default:
      return "Step";
  }
}

export function getPhaseLabel(step: ExecutionStep | undefined): string {
  if (!step) return "Unknown";
  return PHASE_LABELS[step.type] ?? "Unknown";
}

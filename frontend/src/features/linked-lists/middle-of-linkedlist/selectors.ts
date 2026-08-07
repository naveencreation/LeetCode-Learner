import type { ExecutionStep, MiddleOperationType } from "./types";
import { OPERATION_TO_LINE_MAP, PHASE_LABELS } from "./constants";

export function getPhaseLabel(step: ExecutionStep | undefined): string {
  if (!step) return "Ready";
  return PHASE_LABELS[step.type] ?? "Processing";
}

export function getCodeLineForStep(step: ExecutionStep | undefined): number {
  if (!step) return 1;
  return OPERATION_TO_LINE_MAP[step.type] ?? 1;
}

export function getOperationBadge(step: ExecutionStep | undefined): string {
  if (!step) return "READY";
  return step.type.toUpperCase().replace(/_/g, " ");
}

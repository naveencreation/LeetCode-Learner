import type { MergeOperationType } from "./types";
import { OPERATION_TO_LINE_MAP, PHASE_LABELS } from "./constants";

export function getCodeLineForStep(
  step: { type: MergeOperationType } | undefined,
): number {
  if (!step) return 0;
  return OPERATION_TO_LINE_MAP[step.type] ?? 0;
}

export function getOperationBadge(
  step: { type: MergeOperationType } | undefined,
): string {
  if (!step) return "Waiting...";
  return PHASE_LABELS[step.type] ?? step.type;
}

export function getPhaseLabel(
  step: { type: MergeOperationType } | undefined,
): string {
  if (!step) return "Ready";
  return PHASE_LABELS[step.type] ?? "Processing";
}

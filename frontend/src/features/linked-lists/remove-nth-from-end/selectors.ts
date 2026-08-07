import type { ExecutionStep, RemoveNthOperationType } from "./types";
import { OPERATION_TO_LINE_MAP, PHASE_LABELS, OPERATION_BADGES } from "./constants";

const PHASE_LABELS_LOCAL: Record<RemoveNthOperationType, string> = {
  init: "Initialize",
  advance_fast_n: "Advance Fast",
  advance_together: "Move Together",
  remove_node: "Remove Node",
  complete: "Complete",
};

const OPERATION_BADGES_LOCAL: Record<RemoveNthOperationType, string> = {
  init: "INITIALIZE",
  advance_fast_n: "ADVANCE FAST",
  advance_together: "MOVE TOGETHER",
  remove_node: "REMOVE",
  complete: "DONE",
};

const OPERATION_TO_LINE_MAP_LOCAL: Record<RemoveNthOperationType, number> = {
  init: 7,
  advance_fast_n: 11,
  advance_together: 15,
  remove_node: 19,
  complete: 21,
};

export function getPhaseLabel(step: ExecutionStep | undefined): string {
  if (!step) return "Ready";
  return PHASE_LABELS_LOCAL[step.type] ?? "Processing";
}

export function getCodeLineForStep(step: ExecutionStep | undefined): number {
  if (!step) return 1;
  return OPERATION_TO_LINE_MAP_LOCAL[step.type] ?? 1;
}

export function getOperationBadge(step: ExecutionStep | undefined): string {
  if (!step) return "READY";
  return OPERATION_BADGES_LOCAL[step.type] ?? "READY";
}

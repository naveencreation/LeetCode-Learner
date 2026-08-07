import type { ExecutionStep } from "./types";
import { OPERATION_TO_LINE_MAP, PHASE_LABELS } from "./constants";

export function getCodeLineForStep(step: ExecutionStep | undefined): number {
  if (!step) return 0;
  return OPERATION_TO_LINE_MAP[step.type];
}

export function getOperationBadge(step: ExecutionStep | undefined): string {
  if (!step) return "Ready";
  switch (step.type) {
    case "init":
      return "Setup";
    case "check_loop":
      return "Check";
    case "advance_slow":
      return "Slow +1";
    case "advance_fast":
      return "Fast +2";
    case "cycle_detected":
      return "Found";
    case "no_cycle":
      return "Done";
    default:
      return "Step";
  }
}

export function getPhaseLabel(step: ExecutionStep | undefined): string {
  if (!step) return "Ready";
  return PHASE_LABELS[step.type] ?? "Unknown";
}

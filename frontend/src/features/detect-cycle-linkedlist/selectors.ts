import type { DetectCycleOperationType } from "./types";
import { OPERATION_TO_LINE_MAP, PHASE_LABELS } from "./constants";

export function getCodeLineForStep(step: { type: DetectCycleOperationType }): number {
  return OPERATION_TO_LINE_MAP[step.type];
}

export function getOperationBadge(type: DetectCycleOperationType): string {
  switch (type) {
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

export function getPhaseLabel(type: DetectCycleOperationType): string {
  return PHASE_LABELS[type] ?? "Unknown";
}

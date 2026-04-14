import { OPERATION_TO_LINE_MAP } from "./constants";
import type { ExecutionStep } from "./types";

export function getPhaseLabel(step: ExecutionStep | undefined): string {
  if (!step) return "Ready";

  switch (step.type) {
    case "init":
      return "Initialize";
    case "save_next":
      return "Save Next";
    case "reverse_link":
      return "Reverse Link";
    case "move_prev":
      return "Move Prev";
    case "move_curr":
      return "Move Curr";
    case "complete":
      return "Complete";
    default:
      return "Ready";
  }
}

export function getCodeLineForStep(step: ExecutionStep | undefined): number {
  if (!step) return 0;
  return OPERATION_TO_LINE_MAP[step.type];
}

export function getOperationBadge(step: ExecutionStep | undefined): string {
  if (!step) return "READY";
  return step.type.toUpperCase().replace("_", " ");
}

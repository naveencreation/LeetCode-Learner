import { OPERATION_TO_LINE_MAP } from "./constants";
import type { ExecutionStep } from "./types";

export function getPhaseLabel(step: ExecutionStep | undefined): string {
  if (!step) {
    return "Enter Function";
  }

  switch (step.type) {
    case "traverse_left":
      return "Traverse Left";
    case "traverse_right":
      return "Traverse Right";
    case "set_head":
      return "Set Head";
    case "link_prev_curr":
      return "Link Prev <-> Curr";
    case "visit":
      return "Process Node";
    case "close_cycle":
      return "Close Cycle";
    case "enter_function":
      return "Enter Function";
    case "exit_function":
      return "Exit Function";
    default:
      return "Complete";
  }
}

export function getCodeLineForStep(step: ExecutionStep | undefined): number {
  if (!step) {
    return 0;
  }

  return OPERATION_TO_LINE_MAP[step.type];
}

export function getOperationBadge(step: ExecutionStep | undefined): string {
  if (!step) {
    return "READY";
  }

  return step.operation.split(" ")[0].toUpperCase();
}


import { OPERATION_TO_LINE_MAP } from "./constants";
import type { ExecutionStep } from "./types";

export function getPhaseLabel(step: ExecutionStep | undefined): string {
  if (!step) {
    return "Enter Function";
  }

  switch (step.type) {
    case "compute_left":
      return "Compute Left";
    case "compute_right":
      return "Compute Right";
    case "update_diameter":
      return "Update Diameter";
    case "enter_function":
      return "Enter Function";
    case "return_height":
      return "Return Height";
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

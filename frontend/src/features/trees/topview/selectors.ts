import { OPERATION_TO_LINE_MAP } from "./constants";
import type { ExecutionStep } from "./types";

export function getPhaseLabel(step: ExecutionStep | undefined): string {
  if (!step) {
    return "Initialize";
  }

  switch (step.type) {
    case "traverse_left":
      return "Queue Left";
    case "traverse_right":
      return "Queue Right";
    case "visit":
      return "Capture Top View";
    case "enter_function":
      return "Pop Queue";
    case "exit_function":
      return "Done Node";
    case "finish":
      return "Complete";
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

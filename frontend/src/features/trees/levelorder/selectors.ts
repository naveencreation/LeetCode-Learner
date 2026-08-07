import { OPERATION_TO_LINE_MAP } from "./constants";
import type { ExecutionStep } from "./types";

export function getPhaseLabel(step: ExecutionStep | undefined): string {
  if (!step) {
    return "Initialize";
  }

  switch (step.type) {
    case "level_start":
      return "Start Level";
    case "traverse_left":
      return "Queue Left";
    case "traverse_right":
      return "Queue Right";
    case "visit":
      return "Visit Node";
    case "enter_function":
      return "Pop Queue";
    case "exit_function":
      return "Done Node";
    case "level_end":
      return "End Level";
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

  if (step.type === "level_start") return "LEVEL";
  if (step.type === "visit") return "VISIT";
  if (step.type === "traverse_left" || step.type === "traverse_right") return "QUEUE";
  if (step.type === "level_end") return "APPEND";
  if (step.type === "finish") return "DONE";
  return "STEP";
}

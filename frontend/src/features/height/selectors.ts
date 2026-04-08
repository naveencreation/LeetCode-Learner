import { OPERATION_TO_LINE_MAP } from "./constants";
import type { ExecutionStep } from "./types";

export function getPhaseLabel(step: ExecutionStep | undefined): string {
  if (!step) {
    return "Initialize";
  }

  switch (step.type) {
    case "enter_function":
      return "Enter";
    case "traverse_left":
      return "Go Left";
    case "traverse_right":
      return "Go Right";
    case "compute_height":
      return "Compute";
    case "exit_function":
      return "Return";
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

  if (step.type === "enter_function") return "CALL";
  if (step.type === "traverse_left" || step.type === "traverse_right") return "DFS";
  if (step.type === "compute_height") return "HEIGHT";
  if (step.type === "exit_function") return "RETURN";
  if (step.type === "finish") return "DONE";
  return "STEP";
}

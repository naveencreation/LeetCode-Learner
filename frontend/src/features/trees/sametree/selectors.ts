import { OPERATION_TO_LINE_MAP } from "./constants";
import type { ExecutionStep } from "./types";

export function getPhaseLabel(step: ExecutionStep | undefined): string {
  if (!step) {
    return "Enter Function";
  }

  switch (step.type) {
    case "enter_function":
      return "Compare Nodes";
    case "check_null":
      return "Null Check";
    case "match_found":
      return "Match Found";
    case "mismatch_found":
      return "Mismatch Found";
    case "compare_values":
      return "Compare Values";
    case "recurse_left":
      return "Compare Left";
    case "recurse_right":
      return "Compare Right";
    case "exit_function":
      return "Return Result";
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

  if (step.isMatch === true) {
    return "MATCH";
  }
  if (step.isMatch === false) {
    return "DIFFER";
  }

  return step.operation.split(":")[0].toUpperCase();
}

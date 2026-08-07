import { OPERATION_TO_LINE_MAP } from "./constants";
import type { ExecutionStep } from "./types";

export function getPhaseLabel(step: ExecutionStep | undefined): string {
  if (!step) {
    return "Ready";
  }

  switch (step.type) {
    case "traverse_left":
      // If the left child is null, this step IS the base case check
      return step.node?.left ? "Traverse Left" : "Base Case → None";
    case "traverse_right":
      return step.node?.right ? "Traverse Right" : "Base Case → None";
    case "visit":
      return "Process Node";
    case "enter_function":
      return "Enter Function";
    case "base_case":
      return "Base Case → None";
    case "exit_function":
      return "Exit Function";
    default:
      return "Complete";
  }
}

export function getCodeLineForStep(step: ExecutionStep | undefined): number {
  if (!step) {
    // Return -1 as sentinel: no step active, CodePanel will highlight nothing
    // (isActive = currentCodeLine === index is false for all non-negative indices)
    return -1;
  }

  // When traversing to a null child, the code jumps straight to the
  // base-case check ("if root is None:") rather than the call line.
  // This gives learners a visual change on the code panel without a
  // separate redundant base_case step.
  if (step.type === "traverse_left" && !step.node?.left) return 12;
  if (step.type === "traverse_right" && !step.node?.right) return 12;

  return OPERATION_TO_LINE_MAP[step.type];
}

export function getOperationBadge(step: ExecutionStep | undefined): string {
  if (!step) {
    return "READY";
  }

  return step.operation.split(" ")[0].toUpperCase().replace(":", "");
}

import { OPERATION_TO_LINE_MAP } from "./constants";
import type { ExecutionStep } from "./types";

export function getPhaseLabel(step: ExecutionStep | undefined): string {
  if (!step) {
    return "Enter Function";
  }

  switch (step.type) {
    case "enter_function":
      return "Start Boundary";
    case "add_root":
      return "Add Root";
    case "collect_left_boundary":
      return "Left Boundary";
    case "collect_leaves":
      return "Collect Leaves";
    case "collect_right_boundary":
      return "Right Boundary";
    case "visit_left_node":
      return "Visit Left Node";
    case "visit_leaf":
      return "Visit Leaf";
    case "visit_right_node":
      return "Stack Right Node";
    case "reverse_right":
      return "Reverse Order";
    case "complete":
      return "Complete";
    default:
      return "Processing";
  }
}

export function getCodeLineForStep(step: ExecutionStep | undefined): number {
  if (!step) {
    return 0;
  }

  return OPERATION_TO_LINE_MAP[step.type] ?? 0;
}

export function getOperationBadge(step: ExecutionStep | undefined): string {
  if (!step) {
    return "READY";
  }

  if (step.phase === "left") {
    return "LEFT";
  }
  if (step.phase === "leaves") {
    return "LEAF";
  }
  if (step.phase === "right") {
    return "RIGHT";
  }
  if (step.phase === "complete") {
    return "DONE";
  }

  return step.operation.split(":")[0].toUpperCase();
}

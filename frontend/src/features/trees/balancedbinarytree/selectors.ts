import type { ExecutionStep } from "./types";
import { BALANCED_BINARY_TREE_LINE_LABELS, OPERATION_TO_LINE_MAP } from "./constants";

export function getCodeLineForStep(step: ExecutionStep | undefined): number {
  if (!step) return -1;

  const lineNumber = OPERATION_TO_LINE_MAP[step.type];
  return lineNumber ?? -1;
}

export function getOperationBadge(step: ExecutionStep | undefined): string {
  if (!step) return "";

  const badges: Record<string, string> = {
    enter_function: "Entering",
    check_left: "Check Left",
    check_right: "Check Right",
    check_balance: "Validate",
    return_height: "Height",
    return_unbalanced: "Unbalanced",
    exit_function: "Done",
  };

  return badges[step.type] || "";
}

export function getPhaseLabel(step: ExecutionStep | undefined): string {
  if (!step) return "";

  const labels: Record<string, string> = {
    enter_function: "Recursive Call",
    check_left: "Left Subtree",
    check_right: "Right Subtree",
    check_balance: "Balance Check",
    return_height: "Valid Height",
    return_unbalanced: "Unbalanced Found",
    exit_function: "Result",
  };

  return labels[step.type] || "";
}

export function getLineLabel(lineNumber: number): string {
  return BALANCED_BINARY_TREE_LINE_LABELS[lineNumber] ?? "Code";
}

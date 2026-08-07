import type { ExecutionStep } from "./types";
import { LCA_BINARY_TREE_LINE_LABELS, OPERATION_TO_LINE_MAP } from "./constants";

export function getCodeLineForStep(step: ExecutionStep | undefined): number {
  if (!step) return -1;

  const lineNumber = OPERATION_TO_LINE_MAP[step.type];
  return lineNumber ?? -1;
}

export function getOperationBadge(step: ExecutionStep | undefined): string {
  if (!step) return "";

  const badges: Record<string, string> = {
    enter_function: "Enter",
    found_target: "Target",
    recurse_left: "Left",
    recurse_right: "Right",
    check_split: "Split",
    return_lca: "LCA",
    propagate: "Propagate",
    exit_function: "Done",
  };

  return badges[step.type] || "";
}

export function getPhaseLabel(step: ExecutionStep | undefined): string {
  if (!step) return "";

  const labels: Record<string, string> = {
    enter_function: "Recursive Call",
    found_target: "Base Hit",
    recurse_left: "Left Subtree",
    recurse_right: "Right Subtree",
    check_split: "Split Check",
    return_lca: "LCA Found",
    propagate: "Return Up",
    exit_function: "Result",
  };

  return labels[step.type] || "";
}

export function getLineLabel(lineNumber: number): string {
  return LCA_BINARY_TREE_LINE_LABELS[lineNumber] ?? "Code";
}

import type { BalancedTreeExecutionStep, BalancedTreeOperationType } from "./types";
import { OPERATION_TO_LINE_MAP } from "./constants";

export function getPhaseLabel(step: BalancedTreeExecutionStep | undefined): string {
  if (!step) return "Ready";
  const labels: Record<BalancedTreeOperationType, string> = {
    enter_function: "Enter",
    check_null: "Null Check",
    recurse_left: "Recurse Left",
    check_left_sentinel: "Check Left",
    recurse_right: "Recurse Right",
    check_right_sentinel: "Check Right",
    compare_heights: "Compare",
    unbalanced: "Unbalanced!",
    calculate_height: "Calculate",
    exit_function: "Return",
    complete: "Done",
  };
  return labels[step.type] ?? "Processing";
}

export function getCodeLine(step: BalancedTreeExecutionStep | undefined): number {
  if (!step) return 1;
  return OPERATION_TO_LINE_MAP[step.type] ?? 1;
}

export function getOperationBadge(step: BalancedTreeExecutionStep | undefined): string {
  if (!step) return "Ready";

  const badgeMap: Record<BalancedTreeOperationType, string> = {
    enter_function: "ENTER",
    check_null: "NULL",
    recurse_left: "LEFT",
    check_left_sentinel: "CHECK",
    recurse_right: "RIGHT",
    check_right_sentinel: "CHECK",
    compare_heights: "COMPARE",
    unbalanced: "UNBALANCED",
    calculate_height: "HEIGHT",
    exit_function: "RETURN",
    complete: "DONE",
  };

  return badgeMap[step.type] ?? "PROCESS";
}

import type { GenericExecutionStep } from "./tree-types";

export function getPhaseLabel<TStep extends GenericExecutionStep>(
  step: TStep | undefined,
): string {
  if (!step) {
    return "Enter Function";
  }

  switch (step.type) {
    case "traverse_left":
      return "Traverse Left";
    case "traverse_right":
      return "Traverse Right";
    case "visit":
      return "Process Node";
    case "enter_function":
      return "Enter Function";
    case "exit_function":
      return "Exit Function";
    default:
      return "Complete";
  }
}

export function getCodeLineForStep<TStep extends GenericExecutionStep>(
  step: TStep | undefined,
  operationToLineMap: Record<string, number>,
): number {
  if (!step) {
    return 0;
  }

  return operationToLineMap[step.type] ?? 0;
}

export function getOperationBadge<TStep extends GenericExecutionStep>(
  step: TStep | undefined,
): string {
  if (!step) {
    return "READY";
  }

  return step.operation.split(" ")[0].toUpperCase();
}

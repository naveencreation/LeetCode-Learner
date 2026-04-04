import { OPERATION_TO_LINE_MAP } from "./constants";
import type { ExecutionStep } from "./types";

export function getPhaseLabel(step: ExecutionStep | undefined): string {
  if (!step) {
    return "Start Level";
  }

  switch (step.type) {
    case "enqueue_left":
      return "Queue Left";
    case "enqueue_right":
      return "Queue Right";
    case "capture_bottom_view":
      return "Update Bottom View";
    case "dequeue":
      return "Dequeue";
    case "start_level":
      return "Start Level";
    case "end_level":
      return "Complete Level";
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

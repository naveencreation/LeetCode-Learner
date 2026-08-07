import type { ExecutionStep } from "./types";
import { OPERATION_TO_LINE_MAP } from "./constants";

export function getCodeLineForStep(step: ExecutionStep | undefined): number {
  if (!step) {
    return 17;
  }

  const lineNumber = OPERATION_TO_LINE_MAP[step.type];
  return lineNumber ?? 17;
}

export function getOperationBadge(step: ExecutionStep | undefined): string {
  if (!step) {
    return "Init";
  }

  switch (step.type) {
    case "enqueue":
      return "Enqueue";
    case "dequeue":
      return "Dequeue";
    case "process_level":
      return "Process";
    case "flip_direction":
      return "Flip";
    case "complete":
      return "Complete";
    default:
      return "Unknown";
  }
}

export function getPhaseLabel(step: ExecutionStep | undefined): string {
  if (!step) {
    return "Start";
  }

  switch (step.type) {
    case "enqueue":
      return "Queue Management";
    case "dequeue":
      return "Queue Management";
    case "process_level":
      return "Level Processing";
    case "flip_direction":
      return "Direction Flip";
    case "complete":
      return "Complete";
    default:
      return "Unknown";
  }
}

export function getOperationColor(step: ExecutionStep | undefined): string {
  if (!step) {
    return "bg-gray-100 text-gray-800";
  }

  switch (step.type) {
    case "enqueue":
      return "bg-blue-100 text-blue-800";
    case "dequeue":
      return "bg-purple-100 text-purple-800";
    case "process_level":
      return "bg-green-100 text-green-800";
    case "flip_direction":
      return "bg-orange-100 text-orange-800";
    case "complete":
      return "bg-emerald-100 text-emerald-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

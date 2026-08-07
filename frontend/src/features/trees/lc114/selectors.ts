import type { ExecutionStep } from "./types";

export function getCodeLineForStep(step: ExecutionStep | undefined): number {
  if (!step) {
    return 2;
  }

  switch (step.type) {
    case "base_case":
      return 4;
    case "pick_root":
      return 5;
    case "build_left":
      return 10;
    case "build_right":
      return 9;
    case "complete_node":
      return 12;
    default:
      return 2;
  }
}

export function getOperationBadge(step: ExecutionStep | undefined): string {
  if (!step) {
    return "Ready to Flatten";
  }

  switch (step.type) {
    case "base_case":
      return "Skip Left";
    case "pick_root":
      return "Visit Node";
    case "build_left":
      return "Move Left->Right";
    case "build_right":
      return "Attach Right Chain";
    case "complete_node":
      return "Chain Extended";
    default:
      return "Progressing";
  }
}

export function getPhaseLabel(step: ExecutionStep | undefined): string {
  if (!step) {
    return "Initialize";
  }

  switch (step.type) {
    case "base_case":
      return "No Left Rewire";
    case "pick_root":
      return "Current Pointer";
    case "build_left":
      return "Rewire Left";
    case "build_right":
      return "Preserve Right";
    case "complete_node":
      return "Advance Right";
    default:
      return "Progressing";
  }
}

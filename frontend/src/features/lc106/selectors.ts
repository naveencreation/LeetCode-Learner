import type { ExecutionStep } from "./types";

export function getCodeLineForStep(step: ExecutionStep | undefined): number {
  if (!step) {
    return 19;
  }

  switch (step.type) {
    case "base_case":
      return 7;
    case "pick_root":
      return 10;
    case "build_right":
      return 15;
    case "build_left":
      return 16;
    case "complete_node":
      return 17;
    default:
      return 19;
  }
}

export function getOperationBadge(step: ExecutionStep | undefined): string {
  if (!step) {
    return "Ready to Build";
  }

  switch (step.type) {
    case "base_case":
      return "Base Case";
    case "pick_root":
      return "Pick Root";
    case "build_right":
      return "Build Right";
    case "build_left":
      return "Build Left";
    case "complete_node":
      return "Complete Node";
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
      return "Boundary Reached";
    case "pick_root":
      return "Consume Postorder";
    case "build_right":
      return "Recursing Right";
    case "build_left":
      return "Recursing Left";
    case "complete_node":
      return "Returning Subtree";
    default:
      return "Progressing";
  }
}

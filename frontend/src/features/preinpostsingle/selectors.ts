import { OPERATION_TO_LINE_MAP } from "./constants";
import type { ExecutionStep } from "./types";

export function getPhaseLabel(step: ExecutionStep | undefined): string {
  if (!step) {
    return "Preorder";
  }

  switch (step.type) {
    case "pre_visit":
      return "Preorder";
    case "in_visit":
      return "Inorder";
    case "post_visit":
      return "Postorder";
    case "schedule_in":
      return "Schedule Inorder";
    case "schedule_post":
      return "Schedule Postorder";
    case "traverse_left":
      return "Push Left";
    case "traverse_right":
      return "Push Right";
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

  if (step.type === "pre_visit") {
    return "PRE";
  }

  if (step.type === "in_visit") {
    return "IN";
  }

  if (step.type === "post_visit") {
    return "POST";
  }

  return "STACK";
}

import { OPERATION_TO_LINE_MAP } from "./constants";
import type { ExecutionStep } from "./types";

const PHASE_LABELS: Record<ExecutionStep["type"], string> = {
  init: "Initialization",
  save_next: "Store next_node",
  reverse_link: "Reverse curr.next",
  move_prev: "Move prev",
  move_curr: "Move curr",
  complete: "Return new head",
};

const OPERATION_BADGES: Record<ExecutionStep["type"], string> = {
  init: "Initialize Pointers",
  save_next: "Store next_node",
  reverse_link: "Reverse curr.next",
  move_prev: "Move prev",
  move_curr: "Move curr",
  complete: "Return Reversed Head",
};

export function getPhaseLabel(step: ExecutionStep | undefined): string {
  if (!step) return "Ready to Reverse";
  return PHASE_LABELS[step.type] ?? "Ready to Reverse";
}

export function getCodeLineForStep(step: ExecutionStep | undefined): number {
  if (!step) return 0;
  return OPERATION_TO_LINE_MAP[step.type];
}

export function getOperationBadge(step: ExecutionStep | undefined): string {
  if (!step) return "Ready to Reverse";
  return OPERATION_BADGES[step.type] ?? "Ready to Reverse";
}

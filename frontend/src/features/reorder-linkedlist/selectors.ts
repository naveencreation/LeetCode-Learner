import { OPERATION_TO_LINE_MAP } from "./constants";
import type { ExecutionStep, ReorderPhase } from "./types";

const PHASE_LABELS: Record<ExecutionStep["type"], string> = {
  init:              "Initialization",
  find_middle_check: "Find Middle — Check",
  find_middle_move:  "Find Middle — Advance",
  find_middle_done:  "Find Middle — Done",
  split_halves:      "Split Halves",
  reverse_init:      "Reverse — Initialize",
  reverse_loop_check:"Reverse — Loop Check",
  reverse_save_next: "Reverse — Save tmp",
  reverse_link:      "Reverse — Flip Arrow",
  reverse_advance:   "Reverse — Advance",
  reverse_done:      "Reverse — Complete",
  merge_init:        "Merge — Initialize",
  merge_loop_check:  "Merge — Loop Check",
  merge_save:        "Merge — Save Nexts",
  merge_link_p1:     "Merge — p1.next = p2",
  merge_link_p2:     "Merge — p2.next = p1_next",
  merge_advance:     "Merge — Advance",
  complete:          "Complete",
};

const OPERATION_BADGES: Record<ExecutionStep["type"], string> = {
  init:              "Start",
  find_middle_check: "Check",
  find_middle_move:  "Advance",
  find_middle_done:  "Mid Found",
  split_halves:      "Split!",
  reverse_init:      "Rev Init",
  reverse_loop_check:"Rev Loop",
  reverse_save_next: "Save tmp",
  reverse_link:      "Flip!",
  reverse_advance:   "Advance",
  reverse_done:      "Rev Done",
  merge_init:        "Merge Init",
  merge_loop_check:  "Merge",
  merge_save:        "Save Nxt",
  merge_link_p1:     "p1→p2",
  merge_link_p2:     "p2→nxt",
  merge_advance:     "Advance",
  complete:          "Done ✓",
};

export function getPhaseLabel(step: ExecutionStep | undefined): string {
  if (!step) return "Ready to Reorder";
  if (step.metadata?.phase) return step.metadata.phase as ReorderPhase;
  return PHASE_LABELS[step.type] ?? "Ready to Reorder";
}

export function getCodeLineForStep(step: ExecutionStep | undefined): number {
  if (!step) return 0;
  return OPERATION_TO_LINE_MAP[step.type] ?? 0;
}

export function getOperationBadge(step: ExecutionStep | undefined): string {
  if (!step) return "Ready to Reorder";
  if (step.metadata?.badge) return step.metadata.badge;
  return OPERATION_BADGES[step.type] ?? "Ready to Reorder";
}

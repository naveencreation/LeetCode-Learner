import type { ZigzagTreeExecutionStep, ZigzagTreeOperationType } from "./types";
import { OPERATION_TO_LINE_MAP } from "./constants";

export function getPhaseLabel(step: ZigzagTreeExecutionStep | undefined): string {
  if (!step) return "Ready";
  const labels: Record<ZigzagTreeOperationType, string> = {
    enter_function: "Enter",
    check_null: "Null Check",
    init_queue: "Init Queue",
    start_level: "Start Level",
    get_level_size: "Level Size",
    process_node: "Process",
    add_left_child: "Add Left",
    add_right_child: "Add Right",
    reverse_level: "Reverse",
    add_level_result: "Store Level",
    toggle_direction: "Toggle Dir",
    exit_function: "Return",
    complete: "Done",
  };
  return labels[step.type] ?? "Processing";
}

export function getCodeLine(step: ZigzagTreeExecutionStep | undefined): number {
  if (!step) return 1;
  return OPERATION_TO_LINE_MAP[step.type] ?? 1;
}

export function getOperationBadge(step: ZigzagTreeExecutionStep | undefined): string {
  if (!step) return "Ready";

  const badgeMap: Record<ZigzagTreeOperationType, string> = {
    enter_function: "ENTER",
    check_null: "NULL",
    init_queue: "QUEUE",
    start_level: "LEVEL",
    get_level_size: "SIZE",
    process_node: "NODE",
    add_left_child: "LEFT",
    add_right_child: "RIGHT",
    reverse_level: "FLIP",
    add_level_result: "SAVE",
    toggle_direction: "TOGGLE",
    exit_function: "RETURN",
    complete: "DONE",
  };

  return badgeMap[step.type] ?? "PROCESS";
}

import type { LoopStartOperationType } from "./types";

export const PYTHON_CODE = `def detectCycle(head):
    if not head or not head.next:
        return None

    # Phase 1: Detect if cycle exists
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    else:
        return None  # No cycle

    # Phase 2: Find starting point
    ptr1 = head
    ptr2 = slow
    while ptr1 != ptr2:
        ptr1 = ptr1.next
        ptr2 = ptr2.next

    return ptr1`;

export const PYTHON_CODE_LINES = PYTHON_CODE.split("\n");

export const OPERATION_TO_LINE_MAP: Record<LoopStartOperationType, number> = {
  init: 1,
  detect_cycle: 7,
  move_to_head: 15,
  find_start: 18,
  found_start: 20,
  no_cycle: 13,
};

export const PHASE_LABELS: Record<LoopStartOperationType, string> = {
  init: "Initialize",
  detect_cycle: "Detect Cycle",
  move_to_head: "Move to Head",
  find_start: "Find Start",
  found_start: "Found!",
  no_cycle: "No Cycle",
};

export const LINE_LABELS: Record<number, string> = {
  1: "Function definition",
  2: "Edge case check",
  3: "Empty line",
  4: "Phase 1 comment",
  5: "Initialize pointers",
  6: "While condition",
  7: "Advance slow",
  8: "Advance fast",
  9: "If slow == fast",
  10: "Break loop",
  11: "Else block",
  12: "Return None",
  13: "Empty line",
  14: "Phase 2 comment",
  15: "Set ptr1 to head",
  16: "Set ptr2 to meeting point",
  17: "While ptr1 != ptr2",
  18: "Advance ptr1",
  19: "Advance ptr2",
  20: "Return ptr1",
};

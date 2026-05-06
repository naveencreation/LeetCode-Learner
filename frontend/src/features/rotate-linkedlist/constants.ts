import type { RotateOperationType } from "./types";

export const PYTHON_CODE = `def rotateRight(head, k):
    if not head or not head.next or k == 0:
        return head

    # Find length and tail
    length = 1
    tail = head
    while tail.next:
        length += 1
        tail = tail.next

    # Compute effective rotations
    k = k % length
    if k == 0:
        return head

    # Find new tail (length - k - 1 steps)
    new_tail = head
    for _ in range(length - k - 1):
        new_tail = new_tail.next

    new_head = new_tail.next
    new_tail.next = None
    tail.next = head
    return new_head`;

export const PYTHON_CODE_LINES = PYTHON_CODE.split("\n");

export const OPERATION_TO_LINE_MAP: Record<RotateOperationType, number> = {
  init: 1,
  count_length: 6,
  find_tail: 7,
  compute_k: 12,
  find_new_tail: 16,
  break_and_relink: 20,
  done: 23,
};

export const PHASE_LABELS: Record<RotateOperationType, string> = {
  init: "Initialize",
  count_length: "Count Length",
  find_tail: "Find Tail",
  compute_k: "Compute K",
  find_new_tail: "Find New Tail",
  break_and_relink: "Break & Relink",
  done: "Done",
};

export const LINE_LABELS: Record<number, string> = {
  1: "Function definition",
  2: "Edge cases",
  3: "Empty line",
  4: "Count length comment",
  5: "Initialize length",
  6: "Initialize tail",
  7: "While tail.next",
  8: "Increment length",
  9: "Advance tail",
  10: "Empty line",
  11: "Compute k comment",
  12: "k = k % length",
  13: "If k == 0",
  14: "Return head",
  15: "Empty line",
  16: "Find new tail comment",
  17: "Initialize new_tail",
  18: "For loop",
  19: "Advance new_tail",
  20: "Set new_head",
  21: "Break link",
  22: "Relink tail",
  23: "Return new_head",
};

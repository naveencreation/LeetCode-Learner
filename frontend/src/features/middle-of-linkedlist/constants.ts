import type { MiddleOperationType } from "./types";

export const PYTHON_CODE = `def find_middle(head):
    # Initialize both pointers at head
    slow = head
    fast = head
    
    # Move until fast reaches end
    while fast and fast.next:
        slow = slow.next      # Move 1 step
        fast = fast.next.next # Move 2 steps
    
    # slow is now at middle
    return slow`;

export const PYTHON_CODE_LINES = PYTHON_CODE.split("\n");

export const OPERATION_TO_LINE_MAP: Record<MiddleOperationType, number> = {
  init: 3,           // slow = head
  check_loop: 6,     // while fast and fast.next
  advance_slow: 7,   // slow = slow.next
  advance_fast: 8,   // fast = fast.next.next
  found_middle: 11,  // return slow
};

export const PHASE_LABELS: Record<MiddleOperationType, string> = {
  init: "Initialize",
  check_loop: "Check Loop",
  advance_slow: "Advance Slow",
  advance_fast: "Advance Fast",
  found_middle: "Found Middle",
};

// Line labels for code panel footer
export const LINE_LABELS: Record<number, string> = {
  1: "Function definition",
  2: "Initialize comment",
  3: "Set slow pointer",
  4: "Set fast pointer",
  5: "Empty line",
  6: "Loop comment",
  7: "While condition",
  8: "Advance slow",
  9: "Advance fast",
  10: "Empty line",
  11: "Result comment",
  12: "Return middle",
};

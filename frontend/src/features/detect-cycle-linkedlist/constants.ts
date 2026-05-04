import type { DetectCycleOperationType } from "./types";

export const PYTHON_CODE = `def has_cycle(head):
    # Initialize both pointers at head
    slow = head
    fast = head
    
    # Move until fast reaches end
    while fast and fast.next:
        slow = slow.next      # Move 1 step
        fast = fast.next.next # Move 2 steps
        
        # If they meet, there's a cycle
        if slow == fast:
            return True
    
    # No cycle found
    return False`;

export const PYTHON_CODE_LINES = PYTHON_CODE.split("\n");

export const OPERATION_TO_LINE_MAP: Record<DetectCycleOperationType, number> = {
  init: 3,           // slow = head
  check_loop: 6,     // while fast and fast.next
  advance_slow: 7,   // slow = slow.next
  advance_fast: 8,   // fast = fast.next.next
  cycle_detected: 10, // if slow == fast
  no_cycle: 13,      // return False
};

export const PHASE_LABELS: Record<DetectCycleOperationType, string> = {
  init: "Initialize",
  check_loop: "Check Loop",
  advance_slow: "Advance Slow",
  advance_fast: "Advance Fast",
  cycle_detected: "Cycle Found",
  no_cycle: "No Cycle",
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
  10: "Check if pointers meet",
  11: "Return True",
  12: "Empty line",
  13: "No cycle comment",
  14: "Return False",
};

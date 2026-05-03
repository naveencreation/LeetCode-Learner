import type { RemoveNthOperationType } from "./types";

export const PYTHON_CODE = `class Solution:
    def removeNthFromEnd(self, head, n):
        # Create dummy node pointing to head
        dummy = ListNode(0, head)
        fast = head
        slow = dummy
        
        # Move fast n steps ahead
        for _ in range(n):
            fast = fast.next
        
        # Move both until fast reaches end
        while fast:
            slow = slow.next
            fast = fast.next
        
        # Remove the nth node from end
        slow.next = slow.next.next
        
        return dummy.next`;

export const PYTHON_CODE_LINES = PYTHON_CODE.split("\n");

export const OPERATION_TO_LINE_MAP: Record<RemoveNthOperationType, number> = {
  init: 7,              // fast = head, slow = dummy
  advance_fast_n: 11,   // for _ in range(n): fast = fast.next
  advance_together: 15, // while fast: slow = slow.next, fast = fast.next
  remove_node: 19,      // slow.next = slow.next.next
  complete: 21,         // return dummy.next
};

export const PHASE_LABELS: Record<RemoveNthOperationType, string> = {
  init: "Initialize",
  advance_fast_n: "Advance Fast",
  advance_together: "Move Together",
  remove_node: "Remove Node",
  complete: "Complete",
};

export const OPERATION_BADGES: Record<RemoveNthOperationType, string> = {
  init: "INITIALIZE",
  advance_fast_n: "ADVANCE FAST",
  advance_together: "MOVE TOGETHER",
  remove_node: "REMOVE",
  complete: "DONE",
};

// Line labels for code panel footer
export const LINE_LABELS: Record<number, string> = {
  1: "Class definition",
  2: "Method signature",
  3: "Initialize comment",
  4: "Create dummy node",
  5: "Set fast pointer",
  6: "Set slow pointer",
  7: "Empty line",
  8: "Advance comment",
  9: "For loop",
  10: "Move fast",
  11: "Empty line",
  12: "Loop comment",
  13: "While condition",
  14: "Move slow",
  15: "Move fast",
  16: "Empty line",
  17: "Remove comment",
  18: "Skip target node",
  19: "Empty line",
  20: "Return result",
};

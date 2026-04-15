import type { ReverseOperationType } from "./types";

export const PYTHON_CODE = `class Solution:
    def reverseList(self, head):
        prev = None
        curr = head

        while curr:
            next_node = curr.next
            curr.next = prev
            prev = curr
            curr = next_node

        return prev`;

export const PYTHON_CODE_LINES = PYTHON_CODE.split("\n");

export const OPERATION_TO_LINE_MAP: Record<ReverseOperationType, number> = {
  init: 3,          // prev = None
  save_next: 7,     // next_node = curr.next
  reverse_link: 8,  // curr.next = prev
  move_prev: 9,     // prev = curr
  move_curr: 10,    // curr = next_node
  complete: 12,     // return prev
};

export const REVERSE_LINE_LABELS: Record<number, string> = {
  1: "Class Definition",
  2: "Method Signature",
  3: "Initialize prev",
  4: "Initialize curr",
  6: "Loop Condition",
  7: "Store next_node",
  8: "Reverse curr.next",
  9: "Move prev",
  10: "Move curr",
  12: "Return New Head",
};

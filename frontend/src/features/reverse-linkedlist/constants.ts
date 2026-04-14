import type { ReverseOperationType } from "./types";

export const PYTHON_CODE = `def reverseList(self, head):
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
  init: 2,          // prev = None
  save_next: 7,     // next_node = curr.next
  reverse_link: 8,  // curr.next = prev
  move_prev: 9,     // prev = curr
  move_curr: 10,    // curr = next_node
  complete: 12,     // return prev
};

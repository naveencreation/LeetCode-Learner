import type { ReorderOperationType } from "./types";

export const PYTHON_CODE = `class Solution:
    def reorderList(self, head):
        if not head or not head.next:
            return

        # Phase 1: Find the middle
        slow, fast = head, head
        while fast.next and fast.next.next:
            slow = slow.next
            fast = fast.next.next

        # Phase 2: Reverse second half
        prev, curr = None, slow.next
        slow.next = None
        while curr:
            tmp = curr.next
            curr.next = prev
            prev = curr
            curr = tmp

        # Phase 3: Merge two halves
        p1, p2 = head, prev
        while p2:
            p1_next, p2_next = p1.next, p2.next
            p1.next = p2
            p2.next = p1_next
            p1 = p1_next
            p2 = p2_next`;

export const PYTHON_CODE_LINES = PYTHON_CODE.split("\n");

export const OPERATION_TO_LINE_MAP: Record<ReorderOperationType, number> = {
  init:              2,  // def reorderList
  find_middle_check: 9,  // while fast.next and fast.next.next:
  find_middle_move:  10, // slow = slow.next / fast = fast.next.next
  find_middle_done:  9,  // loop exits
  split_halves:      14, // prev, curr = None, slow.next / slow.next = None
  reverse_init:      14, // prev, curr = None, slow.next
  reverse_loop_check:15, // while curr:
  reverse_save_next: 16, // tmp = curr.next
  reverse_link:      17, // curr.next = prev
  reverse_advance:   18, // prev = curr / curr = tmp
  reverse_done:      15, // while curr: exits
  merge_init:        22, // p1, p2 = head, prev
  merge_loop_check:  23, // while p2:
  merge_save:        24, // p1_next, p2_next = p1.next, p2.next
  merge_link_p1:     25, // p1.next = p2
  merge_link_p2:     26, // p2.next = p1_next
  merge_advance:     27, // p1 = p1_next / p2 = p2_next
  complete:          28, // implicit end / return
};

export const REORDER_LINE_LABELS: Record<number, string> = {
  1:  "Class Definition",
  2:  "Method Signature",
  3:  "Edge case check",
  4:  "Return early",
  6:  "Phase 1 comment",
  7:  "Initialize slow/fast",
  8:  "Find middle comment",
  9:  "Loop while fast valid",
  10: "Advance slow and fast",
  12: "Phase 2 comment",
  13: "Phase 2 comment",
  14: "Init prev, curr; split",
  15: "While curr (reverse loop)",
  16: "Save tmp = curr.next",
  17: "Flip: curr.next = prev",
  18: "Advance prev, curr",
  20: "Phase 3 comment",
  21: "Phase 3 comment",
  22: "Init p1 = head, p2 = prev",
  23: "While p2 (merge loop)",
  24: "Save p1_next and p2_next",
  25: "Link: p1.next = p2",
  26: "Link: p2.next = p1_next",
  27: "Advance p1 and p2",
  28: "Complete",
};

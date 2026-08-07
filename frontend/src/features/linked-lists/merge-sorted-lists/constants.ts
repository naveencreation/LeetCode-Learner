import type { MergeOperationType } from "./types";

export const PYTHON_CODE = `class Solution:
    def mergeTwoLists(self, list1, list2):
        # Create dummy node to simplify edge cases
        dummy = ListNode(-1)
        current = dummy
        
        # Merge while both lists have nodes
        while list1 and list2:
            if list1.val <= list2.val:
                current.next = list1
                list1 = list1.next
            else:
                current.next = list2
                list2 = list2.next
            current = current.next
        
        # Attach remaining nodes
        if list1:
            current.next = list1
        elif list2:
            current.next = list2
        
        return dummy.next`;

export const PYTHON_CODE_LINES = PYTHON_CODE.split("\n");

export const OPERATION_TO_LINE_MAP: Record<MergeOperationType, number> = {
  init: 3,
  compare: 6,
  attach_list1: 7,
  attach_list2: 10,
  advance_current: 11,
  append_remaining_list1: 14,
  append_remaining_list2: 16,
  complete: 18,
};

export const PHASE_LABELS: Record<MergeOperationType, string> = {
  init: "Initialize",
  compare: "Compare",
  attach_list1: "Attach List1",
  attach_list2: "Attach List2",
  advance_current: "Advance",
  append_remaining_list1: "Append List1",
  append_remaining_list2: "Append List2",
  complete: "Complete",
};

export const LINE_LABELS: Record<number, string> = {
  1: "Class Definition",
  2: "Method Signature",
  3: "Create Dummy Node",
  4: "Initialize Current",
  5: "Empty Line",
  6: "Loop Condition",
  7: "Compare Values",
  8: "Attach List1 Node",
  9: "Advance List1",
  10: "Attach List2 Node",
  11: "Advance List2",
  12: "Advance Current",
  13: "Empty Line",
  14: "Check List1 Remaining",
  15: "Attach Remaining List1",
  16: "Check List2 Remaining",
  17: "Attach Remaining List2",
  18: "Return Result",
};

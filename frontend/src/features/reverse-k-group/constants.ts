import type { ReverseKGroupOperationType } from "./types";

export const PYTHON_CODE = `def reverseKGroup(head, k):
    # Dummy node to simplify edge cases
    dummy = ListNode(0)
    dummy.next = head
    prev_group_end = dummy
    
    while True:
        # Check if we have k nodes left
        group_start = prev_group_end.next
        current = group_start
        count = 0
        
        while current and count < k:
            current = current.next
            count += 1
        
        # If less than k nodes, stop
        if count < k:
            break
        
        # Reverse the group of k nodes
        current = group_start
        prev = None
        for _ in range(k):
            next_node = current.next
            current.next = prev
            prev = current
            current = next_node
        
        # Connect reversed group to previous
        prev_group_end.next = prev
        group_start.next = current
        prev_group_end = group_start
    
    return dummy.next`;

export const PYTHON_CODE_LINES = PYTHON_CODE.split("\n");

export const OPERATION_TO_LINE_MAP: Record<ReverseKGroupOperationType, number> = {
  init: 2,
  check_group: 6,
  reverse_group: 15,
  connect_groups: 21,
  incomplete: 10,
  complete: 25,
};

export const PHASE_LABELS: Record<ReverseKGroupOperationType, string> = {
  init: "Initialize",
  check_group: "Check Group",
  reverse_group: "Reverse Group",
  connect_groups: "Connect",
  incomplete: "Incomplete",
  complete: "Complete",
};

export const LINE_LABELS: Record<number, string> = {
  1: "Function definition",
  2: "Dummy node creation",
  3: "Dummy points to head",
  4: "Track previous group end",
  5: "Empty line",
  6: "Start main loop",
  7: "Get group start",
  8: "Initialize current",
  9: "Initialize count",
  10: "Empty line",
  11: "Count nodes in group",
  12: "Increment count",
  13: "Empty line",
  14: "Check if we have k nodes",
  15: "Empty line",
  16: "Reset current",
  17: "Reset prev",
  18: "Reverse k nodes",
  19: "Save next node",
  20: "Reverse link",
  21: "Move prev",
  22: "Move current",
  23: "Empty line",
  24: "Connect reversed group",
  25: "Connect tail to next",
  26: "Update prev_group_end",
  27: "Empty line",
  28: "Return new head",
};

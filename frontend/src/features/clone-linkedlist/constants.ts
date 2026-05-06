import type { CloneOperationType } from "./types";

export const PYTHON_CODE = `class Node:
    def __init__(self, val, next=None, random=None):
        self.val = val
        self.next = next
        self.random = random

def copyRandomList(head):
    if not head:
        return None

    # Step 1: Create copy nodes and weave them in
    curr = head
    while curr:
        copy = Node(curr.val)
        copy.next = curr.next
        curr.next = copy
        curr = copy.next

    # Step 2: Set random pointers for copies
    curr = head
    while curr:
        if curr.random:
            curr.next.random = curr.random.next
        curr = curr.next.next

    # Step 3: Separate the two lists
    curr = head
    copy_head = head.next
    while curr:
        copy = curr.next
        curr.next = copy.next
        curr = copy.next
        if curr:
            copy.next = curr.next

    return copy_head`;

export const PYTHON_CODE_LINES = PYTHON_CODE.split("\n");

export const OPERATION_TO_LINE_MAP: Record<CloneOperationType, number> = {
  init: 7,
  create_copy_nodes: 11,
  set_copy_randoms: 18,
  separate_lists: 24,
  done: 32,
};

export const PHASE_LABELS: Record<CloneOperationType, string> = {
  init: "Initialize",
  create_copy_nodes: "Weave Copies",
  set_copy_randoms: "Set Randoms",
  separate_lists: "Separate Lists",
  done: "Done",
};

export const LINE_LABELS: Record<number, string> = {
  1: "Node class definition",
  2: "__init__",
  3: "self.val",
  4: "self.next",
  5: "self.random",
  6: "Function definition",
  7: "Edge case",
  8: "Return None",
  9: "Step 1 comment",
  10: "Initialize curr",
  11: "While curr",
  12: "Create copy node",
  13: "Copy next",
  14: "Insert copy",
  15: "Advance curr",
  16: "Empty line",
  17: "Step 2 comment",
  18: "Reset curr",
  19: "While curr",
  20: "If random exists",
  21: "Set copy random",
  22: "Advance by 2",
  23: "Empty line",
  24: "Step 3 comment",
  25: "Reset curr",
  26: "Copy head",
  27: "While curr",
  28: "Get copy",
  29: "Restore original next",
  30: "Advance curr",
  31: "Link copy next",
  32: "Return copy_head",
};

import type { PalindromeOperationType } from "./types";

export const PYTHON_CODE = `def isPalindrome(head):
    if not head or not head.next:
        return True

    # Find middle using slow/fast pointers
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

    # Reverse second half
    prev = None
    curr = slow
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node

    # Compare both halves
    left = head
    right = prev
    while right:
        if left.val != right.val:
            return False
        left = left.next
        right = right.next

    return True`;

export const PYTHON_CODE_LINES = PYTHON_CODE.split("\n");

export const OPERATION_TO_LINE_MAP: Record<PalindromeOperationType, number> = {
  init: 1,
  find_middle: 6,
  reverse_second_half: 12,
  compare_halves: 20,
  mismatch_found: 22,
  palindrome_confirmed: 24,
};

export const PHASE_LABELS: Record<PalindromeOperationType, string> = {
  init: "Initialize",
  find_middle: "Find Middle",
  reverse_second_half: "Reverse Second Half",
  compare_halves: "Compare Halves",
  mismatch_found: "Mismatch Found",
  palindrome_confirmed: "Palindrome!",
};

export const LINE_LABELS: Record<number, string> = {
  1: "Function definition",
  2: "Edge case check",
  3: "Empty line",
  4: "Find middle comment",
  5: "Initialize slow/fast",
  6: "While condition",
  7: "Advance slow",
  8: "Advance fast by 2",
  9: "Empty line",
  10: "Reverse comment",
  11: "Initialize prev/curr",
  12: "While curr exists",
  13: "Save next node",
  14: "Reverse pointer",
  15: "Move prev forward",
  16: "Move curr forward",
  17: "Empty line",
  18: "Compare comment",
  19: "Initialize left/right",
  20: "While right exists",
  21: "Compare values",
  22: "Return False",
  23: "Advance both",
  24: "Return True",
};

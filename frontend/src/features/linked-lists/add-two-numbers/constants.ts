import type { AddTwoNumbersOperationType } from "./types";

export const PYTHON_CODE = `def addTwoNumbers(l1, l2):
    dummy = ListNode(0)
    current = dummy
    carry = 0
    
    while l1 is not None or l2 is not None:
        val1 = l1.val if l1 is not None else 0
        val2 = l2.val if l2 is not None else 0
        
        total = val1 + val2 + carry
        carry = total // 10
        digit = total % 10
        
        current.next = ListNode(digit)
        current = current.next
        
        if l1 is not None:
            l1 = l1.next
        if l2 is not None:
            l2 = l2.next
    
    if carry > 0:
        current.next = ListNode(carry)
    
    return dummy.next`;

export const PYTHON_CODE_LINES = PYTHON_CODE.split("\n");

export const OPERATION_TO_LINE_MAP: Record<AddTwoNumbersOperationType, number> = {
  init_l1: 2,
  init_l2: 2,
  init_result: 2,
  check_both: 5,
  extract_digits: 6,
  calculate_sum: 9,
  create_node: 12,
  advance_pointers: 14,
  update_carry: 10,
  check_carry: 17,
  add_carry_node: 18,
};

export const PHASE_LABELS: Record<AddTwoNumbersOperationType, string> = {
  init_l1: "Initialize L1",
  init_l2: "Initialize L2",
  init_result: "Initialize Result",
  check_both: "Check Lists",
  extract_digits: "Extract Digits",
  calculate_sum: "Calculate Sum",
  create_node: "Create Node",
  advance_pointers: "Advance Pointers",
  update_carry: "Update Carry",
  check_carry: "Check Carry",
  add_carry_node: "Add Carry Node",
};

export const LINE_LABELS: Record<number, string> = {
  1: "Function definition",
  2: "Create dummy head",
  3: "Set current pointer",
  4: "Initialize carry",
  5: "While condition",
  6: "Get l1 value",
  7: "Get l2 value",
  8: "Empty line",
  9: "Calculate total",
  10: "Compute carry",
  11: "Compute digit",
  12: "Create and link node",
  13: "Advance current",
  14: "Advance l1",
  15: "Advance l2",
  16: "Empty line",
  17: "If carry exists",
  18: "Add carry node",
  19: "Empty line",
  20: "Return result",
};

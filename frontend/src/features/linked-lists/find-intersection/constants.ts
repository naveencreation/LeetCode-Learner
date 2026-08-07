import type { FindIntersectionOperationType } from "./types";

export const PYTHON_CODE = `def getIntersectionNode(headA, headB):
    # Calculate lengths of both lists
    lenA, lenB = 0, 0
    currA, currB = headA, headB
    
    while currA:
        lenA += 1
        currA = currA.next
    
    while currB:
        lenB += 1
        currB = currB.next
    
    # Reset pointers to heads
    currA, currB = headA, headB
    
    # Move the longer list's pointer ahead
    if lenA > lenB:
        for _ in range(lenA - lenB):
            currA = currA.next
    elif lenB > lenA:
        for _ in range(lenB - lenA):
            currB = currB.next
    
    # Move both pointers together
    while currA and currB:
        if currA == currB:
            return currA
        currA = currA.next
        currB = currB.next
    
    return None`;

export const PYTHON_CODE_LINES = PYTHON_CODE.split("\n");

export const OPERATION_TO_LINE_MAP: Record<FindIntersectionOperationType, number> = {
  init_lists: 1,
  calculate_lengths: 5,
  align_pointers: 15,
  advance_both: 20,
  check_intersection: 21,
  found_intersection: 21,
};

export const PHASE_LABELS: Record<FindIntersectionOperationType, string> = {
  init_lists: "Initialize",
  calculate_lengths: "Calculate Lengths",
  align_pointers: "Align Pointers",
  advance_both: "Advance Both",
  check_intersection: "Check Intersection",
  found_intersection: "Found Intersection",
};

export const LINE_LABELS: Record<number, string> = {
  1: "Function definition",
  2: "Length comment",
  3: "Initialize lengths",
  4: "Initialize pointers",
  5: "Count lenA",
  6: "Count lenA loop",
  7: "Count lenB",
  8: "Count lenB loop",
  9: "Empty line",
  10: "Reset comment",
  11: "Reset pointers",
  12: "Empty line",
  13: "Align comment",
  14: "If A longer",
  15: "Move A ahead",
  16: "If B longer",
  17: "Move B ahead",
  18: "Empty line",
  19: "Move comment",
  20: "While condition",
  21: "Check equality",
  22: "Return intersection",
  23: "Advance A",
  24: "Advance B",
  25: "Empty line",
  26: "Return None",
};

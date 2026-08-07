import type { DeleteNodeOperationType } from "./types";

export const PYTHON_CODE = `def deleteNode(node):
    # Copy the next node's value to current node
    node.val = node.next.val
    
    # Skip over the next node
    node.next = node.next.next`;

export const PYTHON_CODE_LINES = PYTHON_CODE.split("\n");

export const OPERATION_TO_LINE_MAP: Record<DeleteNodeOperationType, number> = {
  init: 1,
  check_next: 2,
  copy_value: 3,
  skip_next: 5,
  complete: 5,
};

export const PHASE_LABELS: Record<DeleteNodeOperationType, string> = {
  init: "Initialize",
  check_next: "Check Next",
  copy_value: "Copy Value",
  skip_next: "Skip Next",
  complete: "Complete",
};

export const LINE_LABELS: Record<number, string> = {
  1: "Function definition",
  2: "Copy comment",
  3: "Copy next value",
  4: "Empty line",
  5: "Skip comment",
  6: "Skip next node",
};

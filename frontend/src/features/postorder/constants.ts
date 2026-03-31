import type { TreeNode } from "./types";

export const POSTORDER_CODE_LINES = [
  "def recursivePostorder(root, arr):",
  "    if root is None:",
  "        return",
  "    recursivePostorder(root.left, arr)",
  "    recursivePostorder(root.right, arr)",
  "    arr.append(root.data)",
] as const;

export const OPERATION_TO_LINE_MAP = {
  enter_function: 0,
  traverse_left: 3,
  traverse_right: 4,
  visit: 5,
  exit_function: 2,
} as const;

export function createSampleTree(): TreeNode {
  return {
    val: 1,
    left: {
      val: 2,
      left: {
        val: 4,
        left: null,
        right: null,
      },
      right: {
        val: 5,
        left: null,
        right: null,
      },
    },
    right: {
      val: 3,
      left: null,
      right: {
        val: 6,
        left: null,
        right: null,
      },
    },
  };
}

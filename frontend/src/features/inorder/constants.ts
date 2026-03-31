import type { TreeNode } from "./types";

export const INORDER_CODE_LINES = [
  "def recursiveInorder(root, arr):",
  "    if root is None:",
  "        return",
  "    recursiveInorder(root.left, arr)",
  "    arr.append(root.data)",
  "    recursiveInorder(root.right, arr)",
] as const;

export const OPERATION_TO_LINE_MAP = {
  enter_function: 0,
  traverse_left: 3,
  visit: 4,
  traverse_right: 5,
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

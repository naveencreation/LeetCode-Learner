import type { TreeNode } from "./types";

export const TOP_VIEW_CODE_LINES = [
  "from collections import deque",
  "def topView(root):",
  "    if root is None:",
  "        return []",
  "    queue = deque([(root, 0)])",
  "    first = {}",
  "    while queue:",
  "        node, hd = queue.popleft()",
  "        if hd not in first:",
  "            first[hd] = node.data",
  "        if node.left:",
  "            queue.append((node.left, hd - 1))",
  "        if node.right:",
  "            queue.append((node.right, hd + 1))",
  "    return [first[key] for key in sorted(first)]",
] as const;

export const OPERATION_TO_LINE_MAP = {
  enter_function: 7,
  traverse_left: 11,
  visit: 8,
  traverse_right: 13,
  exit_function: 6,
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

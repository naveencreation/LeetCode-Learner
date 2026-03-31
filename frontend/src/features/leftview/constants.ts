import type { TreeNode } from "./types";

export const LEFT_VIEW_CODE_LINES = [
  "from collections import deque",
  "def leftView(root):",
  "    if root is None:",
  "        return []",
  "    ans = []",
  "    queue = deque([root])",
  "    while queue:",
  "        level_size = len(queue)",
  "        for i in range(level_size):",
  "            node = queue.popleft()",
  "            if i == 0: ans.append(node.data)",
  "            if node.left: queue.append(node.left)",
  "            if node.right: queue.append(node.right)",
  "    return ans",
] as const;

export const OPERATION_TO_LINE_MAP = {
  enter_function: 6,
  traverse_left: 11,
  visit: 10,
  traverse_right: 12,
  exit_function: 8,
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

import type { TreeNode, TreePresetKey } from "./types";

export const MAX_WIDTH_CODE_LINES = [
  "from collections import deque",
  "def widthOfBinaryTree(root):",
  "    if root is None:",
  "        return 0",
  "    queue = deque([(root, 0)])",
  "    ans = 0",
  "    while queue:",
  "        level_size = len(queue)",
  "        _, first = queue[0]; _, last = queue[-1]",
  "        ans = max(ans, last - first + 1)",
  "        for _ in range(level_size):",
  "            node, idx = queue.popleft()",
  "            idx -= first",
  "            if node.left:",
  "                queue.append((node.left, 2 * idx + 1))",
  "            if node.right:",
  "                queue.append((node.right, 2 * idx + 2))",
  "    return ans",
] as const;

export const OPERATION_TO_LINE_MAP = {
  level_start: 7,
  enter_function: 11,
  visit: 9,
  traverse_left: 13,
  traverse_right: 15,
  exit_function: 12,
  level_end: 9,
  finish: 17,
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

function createCompleteTree(): TreeNode {
  return createSampleTree();
}

function createLeftSkewedTree(): TreeNode {
  return {
    val: 1,
    left: {
      val: 2,
      left: {
        val: 3,
        left: {
          val: 4,
          left: null,
          right: null,
        },
        right: null,
      },
      right: null,
    },
    right: null,
  };
}

function createRightSkewedTree(): TreeNode {
  return {
    val: 1,
    left: null,
    right: {
      val: 2,
      left: null,
      right: {
        val: 3,
        left: null,
        right: {
          val: 4,
          left: null,
          right: null,
        },
      },
    },
  };
}

function createSparseRandomTree(): TreeNode {
  const values = [12, 7, 20, 3, 9, 16, 24, 5, 14];

  return {
    val: values[0],
    left: {
      val: values[1],
      left: Math.random() > 0.5 ? { val: values[3], left: null, right: null } : null,
      right: { val: values[4], left: null, right: null },
    },
    right: {
      val: values[2],
      left: Math.random() > 0.35 ? { val: values[5], left: null, right: null } : null,
      right:
        Math.random() > 0.45
          ? {
              val: values[6],
              left: Math.random() > 0.6 ? { val: values[7], left: null, right: null } : null,
              right: Math.random() > 0.6 ? { val: values[8], left: null, right: null } : null,
            }
          : null,
    },
  };
}

function createCustomEmptyTree(): TreeNode {
  return {
    val: 1,
    left: null,
    right: null,
  };
}

export const MAX_WIDTH_TREE_PRESETS: Record<
  TreePresetKey,
  { label: string; create: () => TreeNode | null }
> = {
  complete: { label: "Complete Tree", create: createCompleteTree },
  left_skewed: { label: "Skewed Left", create: createLeftSkewedTree },
  right_skewed: { label: "Skewed Right", create: createRightSkewedTree },
  sparse_random: { label: "Sparse Random", create: createSparseRandomTree },
  custom_empty: { label: "Custom Empty Start", create: createCustomEmptyTree },
};

export function cloneTree(node: TreeNode | null): TreeNode | null {
  if (node === null) {
    return null;
  }

  return {
    val: node.val,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
  };
}

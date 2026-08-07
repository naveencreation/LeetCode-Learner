import type { TreeNode, TreePresetKey } from "./types";

export const TOP_VIEW_CODE_LINES = [
  "from collections import defaultdict, deque",
  "def verticalTraversal(root):",
  "    if root is None:",
  "        return []",
  "    cols = defaultdict(list)",
  "    queue = deque([(root, 0, 0)])  # node, row, col",
  "    while queue:",
  "        node, row, col = queue.popleft()",
  "        cols[col].append((row, node.data))",
  "        if node.left:",
  "            queue.append((node.left, row + 1, col - 1))",
  "        if node.right:",
  "            queue.append((node.right, row + 1, col + 1))",
  "    ans = []",
  "    for col in sorted(cols):",
  "        bucket = sorted(cols[col], key=lambda item: (item[0], item[1]))",
  "        ans.append([val for _, val in bucket])",
  "    return ans",
] as const;

export const OPERATION_TO_LINE_MAP = {
  enter_function: 7,
  traverse_left: 10,
  visit: 8,
  traverse_right: 12,
  exit_function: 6,
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

function createCustomEmptyTree(): TreeNode | null {
  return null;
}

export const TOPVIEW_TREE_PRESETS: Record<
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

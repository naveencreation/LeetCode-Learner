import type { TreeNode, TreePresetKey } from "./types";

export const ZIGZAG_CODE_LINES = [
  "from collections import deque",
  "",
  "class TreeNode:",
  "    def __init__(self, val=0, left=None, right=None):",
  "        self.val = val",
  "        self.left = left",
  "        self.right = right",
  "",
  "class Solution:",
  "    def zigzagLevelOrder(self, root):",
  "        if not root:",
  "            return []",
  "",
  "        result = []",
  "        queue = deque([root])",
  "        left_to_right = True",
  "",
  "        while queue:",
  "            level_size = len(queue)",
  "            level = []",
  "",
  "            for _ in range(level_size):",
  "                node = queue.popleft()",
  "                level.append(node.val)",
  "",
  "                if node.left:",
  "                    queue.append(node.left)",
  "                if node.right:",
  "                    queue.append(node.right)",
  "",
  "            if not left_to_right:",
  "                level.reverse()",
  "",
  "            result.append(level)",
  "            left_to_right = not left_to_right",
  "",
  "        return result",
] as const;

export const OPERATION_TO_LINE_MAP = {
  enqueue: 26,
  dequeue: 22,
  process_level: 23,
  flip_direction: 30,
  complete: 34,
} as const;

// Tree preset generators
function createCompleteTree(): TreeNode {
  const nodes: TreeNode[] = Array.from({ length: 7 }, (_, i) => ({
    val: i + 1,
    left: null,
    right: null,
  }));

  for (let i = 0; i < 7; i++) {
    const leftIdx = 2 * i + 1;
    const rightIdx = 2 * i + 2;
    if (leftIdx < 7) nodes[i].left = nodes[leftIdx];
    if (rightIdx < 7) nodes[i].right = nodes[rightIdx];
  }

  return nodes[0];
}

function createLeftSkewedTree(): TreeNode {
  const node1: TreeNode = { val: 1, left: null, right: null };
  const node2: TreeNode = { val: 2, left: null, right: null };
  const node3: TreeNode = { val: 3, left: null, right: null };
  const node4: TreeNode = { val: 4, left: null, right: null };

  node1.left = node2;
  node2.left = node3;
  node3.left = node4;

  return node1;
}

function createRightSkewedTree(): TreeNode {
  const node1: TreeNode = { val: 1, left: null, right: null };
  const node2: TreeNode = { val: 2, left: null, right: null };
  const node3: TreeNode = { val: 3, left: null, right: null };
  const node4: TreeNode = { val: 4, left: null, right: null };

  node1.right = node2;
  node2.right = node3;
  node3.right = node4;

  return node1;
}

function createSparseRandomTree(): TreeNode {
  const node1: TreeNode = { val: 1, left: null, right: null };
  const node2: TreeNode = { val: 2, left: null, right: null };
  const node3: TreeNode = { val: 3, left: null, right: null };
  const node4: TreeNode = { val: 4, left: null, right: null };
  const node5: TreeNode = { val: 5, left: null, right: null };

  node1.left = node2;
  node1.right = node3;
  node2.right = node4;
  node3.left = node5;

  return node1;
}

export const ZIGZAG_TREE_PRESETS: Record<
  TreePresetKey,
  { label: string; create: () => TreeNode }
> = {
  complete: {
    label: "Complete Binary Tree",
    create: createCompleteTree,
  },
  left_skewed: {
    label: "Left Skewed Tree",
    create: createLeftSkewedTree,
  },
  right_skewed: {
    label: "Right Skewed Tree",
    create: createRightSkewedTree,
  },
  sparse_random: {
    label: "Sparse Random Tree",
    create: createSparseRandomTree,
  },
  custom_empty: {
    label: "Custom Tree",
    create: () => ({ val: 1, left: null, right: null }),
  },
};

export function cloneTree(node: TreeNode | null): TreeNode | null {
  if (node === null) return null;
  return {
    val: node.val,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
  };
}

export function createSampleTree(): TreeNode {
  return ZIGZAG_TREE_PRESETS.complete.create();
}

export const PROBLEM_DETAILS = {
  algorithmCode: ZIGZAG_CODE_LINES.join("\n"),
  description:
    "Traverse a binary tree in zigzag level order (left-to-right for even levels, right-to-left for odd levels). Uses a queue-based BFS approach with direction toggling.",
  complexity: {
    time: "O(n)",
    space: "O(w) where w is max width",
  },
  keyPoints: [
    "BFS with level-by-level processing",
    "Alternate direction for each level",
    "Use queue for node management",
    "Reverse level array for odd-indexed levels",
  ],
} as const;

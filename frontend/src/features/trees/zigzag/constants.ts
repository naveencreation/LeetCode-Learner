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

export const ZIGZAG_LINE_LABELS: Record<number, string> = {
  10: "Method Entry",
  11: "Empty Tree Check",
  14: "Queue Initialization",
  15: "Direction Flag Initialization",
  17: "Loop While Queue Has Nodes",
  18: "Capture Level Size",
  22: "Dequeue Node",
  23: "Append Node To Level",
  26: "Enqueue Left Child",
  27: "Enqueue Right Child",
  30: "Reverse For Right-To-Left",
  32: "Append Level To Result",
  33: "Flip Direction Flag",
  34: "Return Result",
};

export const ZIGZAG_LINE_GUIDE: Record<
  number,
  { meaning: string; why: string; next: string }
> = {
  10: {
    meaning: "Enter zigzagLevelOrder and begin traversal setup.",
    why: "All zigzag state is initialized inside this method.",
    next: "Check whether the root exists before processing.",
  },
  11: {
    meaning: "Handle the empty tree edge case.",
    why: "Without a root, traversal has no work and should return immediately.",
    next: "If root exists, initialize result and queue.",
  },
  14: {
    meaning: "Initialize queue with root so BFS can start.",
    why: "Level-order traversal depends on queue-based processing.",
    next: "Initialize direction flag for zigzag alternation.",
  },
  15: {
    meaning: "Set initial direction to left-to-right.",
    why: "Zigzag alternates this flag after each level.",
    next: "Process levels while queue is not empty.",
  },
  17: {
    meaning: "Start one full level-processing iteration.",
    why: "Each loop cycle consumes exactly one depth level.",
    next: "Capture current queue size as the level boundary.",
  },
  18: {
    meaning: "Compute number of nodes in current level.",
    why: "Prevents mixing next-level children into current-level processing.",
    next: "Dequeue and process each node in this level.",
  },
  22: {
    meaning: "Pop next node from queue front.",
    why: "BFS requires FIFO order to respect level boundaries.",
    next: "Append node value into current level container.",
  },
  23: {
    meaning: "Add current node value to this level list.",
    why: "Level data is built before optional reversing.",
    next: "Queue left/right children for next level.",
  },
  26: {
    meaning: "Enqueue left child when present.",
    why: "Children are collected for subsequent level processing.",
    next: "Check and enqueue right child as well.",
  },
  27: {
    meaning: "Enqueue right child when present.",
    why: "Keeps next-level nodes complete and ordered.",
    next: "After all nodes, decide whether to reverse this level.",
  },
  30: {
    meaning: "Reverse level list for right-to-left output.",
    why: "This creates the zigzag alternation across levels.",
    next: "Append finalized level to result.",
  },
  32: {
    meaning: "Store finalized level in overall result.",
    why: "Each processed level contributes one nested list.",
    next: "Toggle direction for next loop iteration.",
  },
  33: {
    meaning: "Flip direction flag for the next level.",
    why: "Alternation drives left-to-right and right-to-left pattern.",
    next: "Continue loop if queue still has nodes.",
  },
  34: {
    meaning: "Return full zigzag level-order result.",
    why: "All levels are now processed and accumulated.",
    next: "Traversal is complete.",
  },
};

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

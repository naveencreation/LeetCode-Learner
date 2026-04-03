import type { TreeNode, TreePresetKey } from "./types";

export const LEFTVIEW_CODE_LINES = [
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
  start_level: 6,
  dequeue: 9,
  capture_left_view: 10,
  enqueue_left: 11,
  enqueue_right: 12,
  end_level: 8,
  finish: 13,
} as const;

export const LEFTVIEW_LINE_LABELS: Record<number, string> = {
  6: "Start Level",
  8: "Iterate Current Level",
  10: "Capture Left View Node",
  11: "Queue Left Child",
  12: "Queue Right Child",
};

export const LEFTVIEW_LINE_GUIDE: Record<
  number,
  { meaning: string; why: string; next: string }
> = {
  10: {
    meaning: "The first node at this level is captured for the left view.",
    why: "Only index 0 in each level contributes to left view output.",
    next: "Continue processing the rest of the current level.",
  },
  11: {
    meaning: "Queue the left child for the next level.",
    why: "BFS needs children queued level by level.",
    next: "Queue right child if available, then continue loop.",
  },
  12: {
    meaning: "Queue the right child for the next level.",
    why: "Both children must be queued to preserve BFS layering.",
    next: "Move to next node in current level or next level.",
  },
  6: {
    meaning: "Start processing a new level while queue is not empty.",
    why: "Each while-loop cycle handles exactly one tree level.",
    next: "Compute level size and iterate nodes in this level.",
  },
  8: {
    meaning: "Iterate nodes in the current level.",
    why: "The index decides which node contributes to left view.",
    next: "Pop each node and queue children for next level.",
  },
};

function createCompleteTree(): TreeNode {
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
      left: {
        val: 6,
        left: null,
        right: null,
      },
      right: {
        val: 7,
        left: null,
        right: null,
      },
    },
  };
}

export function createSampleTree(): TreeNode {
  return createCompleteTree();
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

export const LEFTVIEW_TREE_PRESETS: Record<
  TreePresetKey,
  { label: string; create: () => TreeNode }
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




import type { TreeNode, TreePresetKey } from "./types";

export const BOTTOMVIEW_CODE_LINES = [
  "from collections import deque",
  "def bottomView(root):",
  "    if root is None:",
  "        return []",
  "    hd_to_val = {}",
  "    queue = deque([(root, 0)])",
  "    while queue:",
  "        node, hd = queue.popleft()",
  "        hd_to_val[hd] = node.data",
  "        if node.left: queue.append((node.left, hd - 1))",
  "        if node.right: queue.append((node.right, hd + 1))",
  "    return [hd_to_val[k] for k in sorted(hd_to_val)]",
] as const;

export const OPERATION_TO_LINE_MAP = {
  start_level: 6,
  dequeue: 7,
  capture_bottom_view: 10,
  enqueue_left: 11,
  enqueue_right: 12,
  end_level: 7,
  finish: 13,
} as const;

export const BOTTOMVIEW_LINE_LABELS: Record<number, string> = {
  6: "Start Level",
  7: "Dequeue Node With HD",
  10: "Update Bottom View Candidate",
  11: "Queue Left Child",
  12: "Queue Right Child",
};

export const BOTTOMVIEW_LINE_GUIDE: Record<
  number,
  { meaning: string; why: string; next: string }
> = {
  10: {
    meaning: "Update the value for this horizontal distance with current node.",
    why: "For bottom view, later (deeper or rightmost-on-same-depth) nodes should overwrite earlier ones.",
    next: "Queue children with hd-1 and hd+1 and keep processing.",
  },
  11: {
    meaning: "Queue the left child with horizontal distance -1.",
    why: "Moving left shifts the horizontal distance one step left.",
    next: "Queue right child if available, then continue loop.",
  },
  12: {
    meaning: "Queue the right child with horizontal distance +1.",
    why: "Moving right shifts the horizontal distance one step right.",
    next: "Move to next node in current level or next level.",
  },
  6: {
    meaning: "Start processing while queue is not empty.",
    why: "Breadth-first traversal ensures deeper candidates appear later and can overwrite.",
    next: "Pop one node with its horizontal distance.",
  },
  7: {
    meaning: "Dequeue a node and read its horizontal distance.",
    why: "Each dequeued node can become the current bottom-view candidate for that distance.",
    next: "Write candidate value, then enqueue children.",
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

function createCustomEmptyTree(): TreeNode | null {
  return null;
}

export const BOTTOMVIEW_TREE_PRESETS: Record<
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




import type { TreeNode } from "../shared/types";
import type { Lc114PresetKey } from "./types";

export const LC114_CODE_LINES = [
  "class Solution:",
  "    def flatten(self, root):",
  "        curr = root",
  "",
  "        while curr:",
  "            if curr.left:",
  "                pred = curr.left",
  "                while pred.right:",
  "                    pred = pred.right",
  "                pred.right = curr.right",
  "                curr.right = curr.left",
  "                curr.left = None",
  "            curr = curr.right",
] as const;

export const LC114_LINE_LABELS: Record<number, string> = {
  2: "Initialize traversal pointer",
  4: "Iterate while node exists",
  5: "Check left subtree",
  6: "Start predecessor lookup",
  7: "Walk to rightmost predecessor",
  9: "Attach original right subtree",
  10: "Move left subtree to right",
  11: "Nullify left pointer",
  12: "Advance to next node",
};

export const LC114_LINE_GUIDE: Record<number, { meaning: string; why: string; next: string }> = {
  2: {
    meaning: "Start flattening from the root.",
    why: "We rewire in place while walking along right pointers.",
    next: "Loop until pointer becomes null.",
  },
  5: {
    meaning: "Only nodes with left child need rewiring.",
    why: "If left is absent, structure already respects linked-list form locally.",
    next: "Find predecessor in left subtree.",
  },
  7: {
    meaning: "Move to rightmost node of left subtree.",
    why: "That node becomes bridge to original right subtree.",
    next: "Attach current.right there.",
  },
  9: {
    meaning: "Preserve original right subtree by connecting it to predecessor.",
    why: "Without this, right subtree nodes would be lost.",
    next: "Shift left subtree to right.",
  },
  10: {
    meaning: "Promote left subtree as immediate right chain.",
    why: "Preorder order is Root -> Left -> Right.",
    next: "Set left to null.",
  },
  11: {
    meaning: "Clear left pointer to satisfy linked-list requirement.",
    why: "Final structure must have all left pointers null.",
    next: "Advance to next right node.",
  },
  12: {
    meaning: "Move forward along newly formed right chain.",
    why: "Eventually all nodes are processed once.",
    next: "Loop continues.",
  },
};

function createCompleteTree(): TreeNode {
  return {
    val: 1,
    left: {
      val: 2,
      left: { val: 3, left: null, right: null },
      right: { val: 4, left: null, right: null },
    },
    right: {
      val: 5,
      left: null,
      right: { val: 6, left: null, right: null },
    },
  };
}

function createLeftSkewedTree(): TreeNode {
  return {
    val: 4,
    left: {
      val: 3,
      left: {
        val: 2,
        left: { val: 1, left: null, right: null },
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
        right: { val: 4, left: null, right: null },
      },
    },
  };
}

function createSparseRandomTree(): TreeNode {
  const values = [30, 18, 44, 9, 23, 37, 52, 15, 40];

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

export const LC114_TREE_PRESETS: Record<Lc114PresetKey, { label: string; create: () => TreeNode | null }> = {
  complete: { label: "Classic Example", create: createCompleteTree },
  left_skewed: { label: "Skewed Left", create: createLeftSkewedTree },
  right_skewed: { label: "Skewed Right", create: createRightSkewedTree },
  sparse_random: { label: "Sparse Random", create: createSparseRandomTree },
  custom_empty: { label: "Custom Empty Start", create: createCustomEmptyTree },
};

export function createSampleTree(): TreeNode {
  return createCompleteTree();
}

export function cloneTree(node: TreeNode | null): TreeNode | null {
  if (!node) {
    return null;
  }

  return {
    val: node.val,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
  };
}

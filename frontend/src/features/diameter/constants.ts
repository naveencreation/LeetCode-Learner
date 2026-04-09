import type { TreeNode, TreePresetKey } from "./types";

export const DIAMETER_CODE_LINES = [
  "class TreeNode:",
  "    def __init__(self, val=0, left=None, right=None):",
  "        self.data = val",
  "        self.left = left",
  "        self.right = right",
  "",
  "class Solution:",
  "    def __init__(self):",
  "        self.maxd = 0",
  "",
  "    def diameterOfBinaryTree(self, root):",
  "        def heights(node):",
  "            if node is None:",
  "                return 0",
  "            L = heights(node.left)",
  "            R = heights(node.right)",
  "            self.maxd = max(self.maxd, L + R)",
  "            return max(L, R) + 1",
  "        heights(root)",
  "        return self.maxd",
] as const;

export const OPERATION_TO_LINE_MAP = {
  enter_function: 10,
  compute_left: 11,
  compute_right: 12,
  update_diameter: 13,
  return_height: 14,
} as const;

export const DIAMETER_LINE_LABELS: Record<number, string> = {
  10: "Function Entry",
  11: "Compute Left Height",
  12: "Compute Right Height",
  13: "Update Diameter",
  14: "Return Height",
};

export const DIAMETER_LINE_GUIDE: Record<
  number,
  { meaning: string; why: string; next: string }
> = {
  10: {
    meaning: "We start diameter computation from the root.",
    why: "The recursive helper computes height while updating best diameter.",
    next: "Enter heights(node) for current subtree.",
  },
  11: {
    meaning: "Compute height of the left subtree.",
    why: "Diameter through current node needs left height.",
    next: "Then compute right subtree height.",
  },
  12: {
    meaning: "Compute height of the right subtree.",
    why: "Diameter candidate is leftHeight + rightHeight.",
    next: "Evaluate and update global maximum diameter.",
  },
  13: {
    meaning: "Evaluate diameter candidate at this node.",
    why: "Every node can be the highest turning point of a longest path.",
    next: "Return subtree height to parent recursion frame.",
  },
  14: {
    meaning: "Return 1 + max(leftHeight, rightHeight).",
    why: "Parent needs this subtree height for its own candidate.",
    next: "Parent frame continues recursively.",
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

export const DIAMETER_TREE_PRESETS: Record<
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

import type { TreeNode } from "../shared/types";
import type { Lc105PresetKey } from "./types";

export const LC105_CODE_LINES = [
  "class Solution:",
  "    def buildTree(self, preorder, inorder):",
  "        idx = {value: i for i, value in enumerate(inorder)}",
  "        pre_ptr = 0",
  "",
  "        def build(left, right):",
  "            nonlocal pre_ptr",
  "            if left > right:",
  "                return None",
  "",
  "            root_val = preorder[pre_ptr]",
  "            pre_ptr += 1",
  "            root = TreeNode(root_val)",
  "            mid = idx[root_val]",
  "",
  "            root.left = build(left, mid - 1)",
  "            root.right = build(mid + 1, right)",
  "            return root",
  "",
  "        return build(0, len(inorder) - 1)",
] as const;

export const LC105_LINE_LABELS: Record<number, string> = {
  2: "Build inorder index map",
  3: "Initialize preorder pointer",
  5: "Recursive helper entry",
  7: "Base-case boundary check",
  10: "Pick root from preorder",
  11: "Advance preorder pointer",
  12: "Create root node",
  13: "Find root pivot in inorder",
  15: "Build left subtree",
  16: "Build right subtree",
  17: "Return completed subtree",
  19: "Return full tree",
};

export const LC105_LINE_GUIDE: Record<number, { meaning: string; why: string; next: string }> = {
  2: {
    meaning: "We cache each inorder value index for O(1) splits.",
    why: "Without this map, every recursion would do a linear search.",
    next: "Initialize preorder pointer and start recursion.",
  },
  7: {
    meaning: "Invalid inorder window means no node exists here.",
    why: "This is the stopping condition for recursion.",
    next: "Return None to parent call.",
  },
  10: {
    meaning: "Current preorder pointer always gives the subtree root.",
    why: "Preorder order is Root, Left, Right.",
    next: "Advance pointer and create this node.",
  },
  13: {
    meaning: "Pivot splits inorder into left and right subtree ranges.",
    why: "Inorder order is Left, Root, Right.",
    next: "Recurse left first, then right.",
  },
  15: {
    meaning: "Build entire left subtree from left-side inorder range.",
    why: "Preorder must consume left subtree nodes immediately after root.",
    next: "Then recurse into right range.",
  },
  16: {
    meaning: "Build right subtree from right-side inorder range.",
    why: "After left subtree is consumed, preorder moves to right subtree.",
    next: "Return the completed root.",
  },
  17: {
    meaning: "Current recursive call has fully constructed one subtree.",
    why: "Parent call attaches this root to left or right pointer.",
    next: "Unwind to parent or finish tree.",
  },
  19: {
    meaning: "Top-level returns the reconstructed binary tree.",
    why: "All nodes from preorder were placed using inorder boundaries.",
    next: "Traversal simulation is complete.",
  },
};

function createCompleteTree(): TreeNode {
  return {
    val: 3,
    left: { val: 9, left: null, right: null },
    right: {
      val: 20,
      left: { val: 15, left: null, right: null },
      right: { val: 7, left: null, right: null },
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

export const LC105_TREE_PRESETS: Record<Lc105PresetKey, { label: string; create: () => TreeNode | null }> = {
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

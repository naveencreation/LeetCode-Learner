import type { TreeNode } from "../shared/types";
import type { Lc106PresetKey } from "./types";

export const LC106_CODE_LINES = [
  "class Solution:",
  "    def buildTree(self, inorder, postorder):",
  "        idx = {value: i for i, value in enumerate(inorder)}",
  "        post_ptr = len(postorder) - 1",
  "",
  "        def build(left, right):",
  "            nonlocal post_ptr",
  "            if left > right:",
  "                return None",
  "",
  "            root_val = postorder[post_ptr]",
  "            post_ptr -= 1",
  "            root = TreeNode(root_val)",
  "            mid = idx[root_val]",
  "",
  "            root.right = build(mid + 1, right)",
  "            root.left = build(left, mid - 1)",
  "            return root",
  "",
  "        return build(0, len(inorder) - 1)",
] as const;

export const LC106_LINE_LABELS: Record<number, string> = {
  2: "Build inorder index map",
  3: "Initialize postorder pointer",
  5: "Recursive helper entry",
  7: "Base-case boundary check",
  10: "Pick root from postorder",
  11: "Move pointer left",
  12: "Create root node",
  13: "Find root pivot in inorder",
  15: "Build right subtree first",
  16: "Build left subtree second",
  17: "Return completed subtree",
  19: "Return full tree",
};

export const LC106_LINE_GUIDE: Record<number, { meaning: string; why: string; next: string }> = {
  2: {
    meaning: "We map inorder value to index for constant-time pivot lookup.",
    why: "Repeated linear scans would raise complexity to O(n^2).",
    next: "Start from the end of postorder.",
  },
  7: {
    meaning: "Invalid inorder boundaries mean this subtree is empty.",
    why: "This is the recursion stop condition.",
    next: "Return None to parent call.",
  },
  10: {
    meaning: "Current postorder pointer gives the root value.",
    why: "Postorder ends with Root, so scanning backward yields root first.",
    next: "Create root and split inorder range.",
  },
  13: {
    meaning: "Pivot divides inorder into left and right partitions.",
    why: "Inorder always places left subtree before root and right subtree after root.",
    next: "Build right subtree before left.",
  },
  15: {
    meaning: "Right subtree is built first.",
    why: "Backward postorder visits root, right, then left.",
    next: "Then build left subtree with remaining values.",
  },
  16: {
    meaning: "Now construct the left subtree.",
    why: "Right-side nodes are already consumed from postorder.",
    next: "Return finished root to parent.",
  },
  17: {
    meaning: "Current recursive frame is complete.",
    why: "Both children have been attached and the subtree is valid.",
    next: "Unwind recursion.",
  },
  19: {
    meaning: "Top-level returns the reconstructed tree.",
    why: "All nodes from postorder are consumed in valid partition order.",
    next: "Construction simulation is complete.",
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

export const LC106_TREE_PRESETS: Record<Lc106PresetKey, { label: string; create: () => TreeNode | null }> = {
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

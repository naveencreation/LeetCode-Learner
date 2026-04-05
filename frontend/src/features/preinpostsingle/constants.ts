import type { TreeNode, TreePresetKey } from "./types";

export const PRE_IN_POST_CODE_LINES = [
  "class Node:",
  "    def __init__(self, val):",
  "        self.data = val",
  "        self.left = None",
  "        self.right = None",
  "",
  "class Solution:",
  "    def preInPostTraversal(self, root):",
  "        pre, ino, post = [], [], []",
  "        if root is None:",
  "            return []",
  "",
  "        st = [(root, 1)]",
  "",
  "        while st:",
  "            node, state = st.pop()",
  "",
  "            if state == 1:",
  "                pre.append(node.data)",
  "                st.append((node, 2))",
  "                if node.left:",
  "                    st.append((node.left, 1))",
  "            elif state == 2:",
  "                ino.append(node.data)",
  "                st.append((node, 3))",
  "                if node.right:",
  "                    st.append((node.right, 1))",
  "            else:",
  "                post.append(node.data)",
  "",
  "        return [pre, ino, post]",
] as const;

export const OPERATION_TO_LINE_MAP = {
  pre_visit: 18,
  schedule_in: 19,
  traverse_left: 21,
  in_visit: 23,
  schedule_post: 24,
  traverse_right: 26,
  post_visit: 28,
} as const;

export const PRE_IN_POST_LINE_LABELS: Record<number, string> = {
  8: "Initialize Results",
  12: "Initialize Stack",
  15: "Pop Node-State",
  18: "Preorder Append",
  19: "Schedule Inorder",
  21: "Push Left Child",
  23: "Inorder Append",
  24: "Schedule Postorder",
  26: "Push Right Child",
  28: "Postorder Append",
  30: "Return All Traversals",
};

export const PRE_IN_POST_LINE_GUIDE: Record<
  number,
  { meaning: string; why: string; next: string }
> = {
  12: {
    meaning: "We start with (root, 1), meaning preorder stage for root.",
    why: "State value encodes traversal phase for each node.",
    next: "Loop pops a node and decides which traversal bucket to update.",
  },
  15: {
    meaning: "Top stack entry gives both node and its current stage.",
    why: "This one pop drives preorder/inorder/postorder in one pass.",
    next: "Branch on state == 1, 2, or 3 behavior.",
  },
  18: {
    meaning: "State 1 means preorder moment for this node.",
    why: "Preorder processes node before children.",
    next: "Schedule state 2 for this node, then go left.",
  },
  23: {
    meaning: "State 2 means inorder moment for this node.",
    why: "Inorder processes node between left and right.",
    next: "Schedule state 3 for this node, then go right.",
  },
  28: {
    meaning: "State 3 means postorder moment for this node.",
    why: "Postorder processes node after both subtrees.",
    next: "Node is complete; continue with remaining stack entries.",
  },
  30: {
    meaning: "All three traversals are now available from one traversal loop.",
    why: "Each node contributed exactly three staged events.",
    next: "Use the arrays to compare traversal orders side-by-side.",
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

export const PRE_IN_POST_TREE_PRESETS: Record<
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

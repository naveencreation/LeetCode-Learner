import type { TreeNode, TreePresetKey } from "./types";

export const BOUNDARY_CODE_LINES = [
  "class TreeNode:",
  "    def __init__(self, val=0, left=None, right=None):",
  "        self.val = val",
  "        self.left = left",
  "        self.right = right",
  "",
  "class Solution:",
  "    def boundaryOfBinaryTree(self, root):",
  "        if not root:",
  "            return []",
  "        result = []",
  "        # Add root if not leaf",
  "        if not self.isLeaf(root):",
  "            result.append(root.val)",
  "        # Collect left boundary (top-down, no leaves)",
  "        self.addLeftBoundary(root.left, result)",
  "        # Collect all leaves (left-to-right)",
  "        self.addLeaves(root, result)",
  "        # Collect right boundary (bottom-up, no leaves)",
  "        self.addRightBoundary(root.right, result)",
  "        return result",
  "",
  "    def isLeaf(self, node):",
  "        return not node.left and not node.right",
  "",
  "    def addLeftBoundary(self, node, result):",
  "        while node:",
  "            if not self.isLeaf(node):",
  "                result.append(node.val)",
  "            node = node.left if node.left else node.right",
  "",
  "    def addLeaves(self, node, result):",
  "        if not node:",
  "            return",
  "        if self.isLeaf(node):",
  "            result.append(node.val)",
  "            return",
  "        self.addLeaves(node.left, result)",
  "        self.addLeaves(node.right, result)",
  "",
  "    def addRightBoundary(self, node, result):",
  "        stack = []",
  "        while node:",
  "            if not self.isLeaf(node):",
  "                stack.append(node.val)",
  "            node = node.right if node.right else node.left",
  "        # Add in reverse (bottom-up)",
  "        while stack:",
  "            result.append(stack.pop())",
] as const;

export const OPERATION_TO_LINE_MAP = {
  enter_function: 7,
  add_root: 11,
  collect_left_boundary: 14,
  collect_leaves: 16,
  collect_right_boundary: 18,
  visit_left_node: 27,
  visit_leaf: 35,
  visit_right_node: 43,
  reverse_right: 47,
  exit_function: 7,
  complete: 20,
} as const;

export const BOUNDARY_LINE_LABELS: Record<number, string> = {
  7: "Function Entry",
  11: "Add Root",
  14: "Collect Left Boundary",
  16: "Collect Leaves",
  18: "Collect Right Boundary",
  27: "Visit Left Node",
  35: "Visit Leaf",
  43: "Visit Right Node",
  47: "Reverse Right Boundary",
  20: "Return Result",
};

export const BOUNDARY_LINE_GUIDE: Record<
  number,
  { meaning: string; why: string; next: string }
> = {
  7: {
    meaning: "Starting boundary traversal.",
    why: "Boundary consists of root, left edge, leaves, and right edge (reversed).",
    next: "Check if root is leaf; if not, add it to result.",
  },
  11: {
    meaning: "Adding root to boundary if it's not a leaf.",
    why: "Root is only part of boundary if it has children.",
    next: "Start collecting left boundary (excluding leaves).",
  },
  14: {
    meaning: "Traversing left boundary from root's left child.",
    why: "Left boundary goes top-down, includes non-leaf nodes on left edge.",
    next: "Keep going left; if no left, go right temporarily.",
  },
  16: {
    meaning: "Collecting all leaf nodes.",
    why: "Leaves form the bottom part of the boundary.",
    next: "DFS to find all leaves, left-to-right order.",
  },
  18: {
    meaning: "Traversing right boundary from root's right child.",
    why: "Right boundary collected bottom-up (will reverse at end).",
    next: "Go right; if no right, go left temporarily.",
  },
  27: {
    meaning: "Adding non-leaf node on left boundary.",
    why: "Left boundary excludes leaf nodes.",
    next: "Continue to next left node.",
  },
  35: {
    meaning: "Found a leaf node - adding to boundary.",
    why: "Leaves are always part of the boundary.",
    next: "Return to collect more leaves.",
  },
  43: {
    meaning: "Adding non-leaf node on right boundary to stack.",
    why: "Right boundary collected in stack for later reversal.",
    next: "Continue to next right node.",
  },
  47: {
    meaning: "Popping from stack to reverse right boundary order.",
    why: "Right boundary should be bottom-up (anti-clockwise).",
    next: "Pop all elements from stack.",
  },
  20: {
    meaning: "Returning complete boundary traversal.",
    why: "Result now contains: root → left boundary → leaves → right boundary (reversed).",
    next: "Boundary traversal complete.",
  },
};

function createStandardTree(): TreeNode {
  return {
    val: 1,
    left: {
      val: 2,
      left: { val: 4, left: null, right: null },
      right: {
        val: 5,
        left: { val: 7, left: null, right: null },
        right: { val: 8, left: null, right: null },
      },
    },
    right: {
      val: 3,
      left: { val: 6, left: { val: 9, left: null, right: null }, right: { val: 10, left: null, right: null } },
      right: { val: 11, left: null, right: null },
    },
  };
}

function createCompleteTree(): TreeNode {
  return {
    val: 1,
    left: {
      val: 2,
      left: { val: 4, left: null, right: null },
      right: { val: 5, left: null, right: null },
    },
    right: {
      val: 3,
      left: { val: 6, left: null, right: null },
      right: { val: 7, left: null, right: null },
    },
  };
}

function createLeftSkewedTree(): TreeNode {
  return {
    val: 1,
    left: {
      val: 2,
      left: { val: 3, left: { val: 4, left: null, right: null }, right: null },
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
      right: { val: 3, left: null, right: { val: 4, left: null, right: null } },
    },
  };
}

function createSingleNodeTree(): TreeNode {
  return { val: 1, left: null, right: null };
}

function createTwoNodesTree(): TreeNode {
  return {
    val: 1,
    left: { val: 2, left: null, right: null },
    right: null,
  };
}

function createCustomTree(): TreeNode {
  return createStandardTree();
}

export function createSampleTree(): TreeNode {
  return createStandardTree();
}

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

export const BOUNDARY_TREE_PRESETS: Record<
  TreePresetKey,
  { label: string; create: () => TreeNode | null }
> = {
  standard: { label: "Standard Tree", create: createStandardTree },
  complete_tree: { label: "Complete Tree", create: createCompleteTree },
  left_skewed: { label: "Left Skewed", create: createLeftSkewedTree },
  right_skewed: { label: "Right Skewed", create: createRightSkewedTree },
  single_node: { label: "Single Node", create: createSingleNodeTree },
  two_nodes: { label: "Two Nodes", create: createTwoNodesTree },
  custom: { label: "Custom", create: createCustomTree },
};

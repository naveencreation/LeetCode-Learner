import type { TreeNode, TreePresetKey } from "./types";

export const SYMMETRIC_CODE_LINES = [
  "class TreeNode:",
  "    def __init__(self, val=0, left=None, right=None):",
  "        self.val = val",
  "        self.left = left",
  "        self.right = right",
  "",
  "class Solution:",
  "    def isSymmetric(self, root) -> bool:",
  "        if not root:",
  "            return True",
  "        return self.isMirror(root.left, root.right)",
  "",
  "    def isMirror(self, left, right) -> bool:",
  "        # Both null - symmetric at this position",
  "        if not left and not right:",
  "            return True",
  "        # One null, other not - asymmetric",
  "        if not left or not right:",
  "            return False",
  "        # Values must match",
  "        if left.val != right.val:",
  "            return False",
  "        # Check outer pair and inner pair",
  "        outer = self.isMirror(left.left, right.right)",
  "        if not outer:",
  "            return False",
  "        inner = self.isMirror(left.right, right.left)",
  "        return outer and inner",
  "",
  "if __name__ == '__main__':",
  "    # Build symmetric tree: [1,2,2,3,4,4,3]",
  "    root = TreeNode(1)",
  "    root.left = TreeNode(2)",
  "    root.right = TreeNode(2)",
  "    root.left.left = TreeNode(3)",
  "    root.left.right = TreeNode(4)",
  "    root.right.left = TreeNode(4)",
  "    root.right.right = TreeNode(3)",
  "",
  "    sol = Solution()",
  "    result = sol.isSymmetric(root)",
  "    print(f'Tree is symmetric: {result}')",
] as const;

export const OPERATION_TO_LINE_MAP = {
  enter_function: 7,
  check_mirror: 12,
  check_null: 14,
  match_found: 15,
  mismatch_found: 17,
  compare_values: 20,
  recurse_outer: 23,
  recurse_inner: 26,
  exit_function: 27,
} as const;

export const SYMMETRIC_LINE_LABELS: Record<number, string> = {
  7: "Function Entry",
  8: "Root Empty Check",
  10: "Start Mirror Check",
  12: "Mirror Helper Entry",
  14: "Null Pair Check",
  15: "Both Null - Match",
  17: "One Null - Mismatch",
  20: "Value Comparison",
  23: "Check Outer Pair",
  26: "Check Inner Pair",
  27: "Return Result",
};

export const SYMMETRIC_LINE_GUIDE: Record<
  number,
  { meaning: string; why: string; next: string }
> = {
  7: {
    meaning: "We entered isSymmetric to check if tree mirrors itself.",
    why: "An empty tree is symmetric by definition.",
    next: "If root exists, call isMirror on left and right subtrees.",
  },
  8: {
    meaning: "Check if the root is empty.",
    why: "A null tree is symmetric by definition.",
    next: "Return True for empty tree, otherwise compare left/right subtrees.",
  },
  10: {
    meaning: "Kick off mirror comparison from root.left and root.right.",
    why: "Symmetry is defined by mirrored subtree equality.",
    next: "Inside helper, compare node pairs recursively.",
  },
  12: {
    meaning: "Entered isMirror(left, right) helper for a node pair.",
    why: "Each recursive frame validates one mirrored pair.",
    next: "Handle null cases before value checks.",
  },
  14: {
    meaning: "Checking if both nodes are null.",
    why: "Two null nodes are symmetric at that position.",
    next: "If both null, return True; else check if one is null.",
  },
  15: {
    meaning: "Both nodes are null - they match here.",
    why: "Null nodes at symmetric positions are valid.",
    next: "Return True and unwind.",
  },
  17: {
    meaning: "One node is null, the other is not.",
    why: "Structural asymmetry detected.",
    next: "Return False immediately.",
  },
  20: {
    meaning: "Comparing values of mirrored nodes.",
    why: "For symmetry, left.val must equal right.val.",
    next: "If values differ, return False; else check children.",
  },
  23: {
    meaning: "Checking outer pair: left.left vs right.right.",
    why: "Mirrored nodes have their outer children compared.",
    next: "If outer check fails, short-circuit; else check inner.",
  },
  26: {
    meaning: "Checking inner pair: left.right vs right.left.",
    why: "Mirrored nodes have their inner children compared.",
    next: "Return combined result of outer and inner checks.",
  },
  27: {
    meaning: "Returning final symmetry result.",
    why: "All checks passed at this level.",
    next: "Parent call receives True and propagates up.",
  },
};

function createSymmetricCompleteTree(): TreeNode {
  return {
    val: 1,
    left: {
      val: 2,
      left: { val: 3, left: null, right: null },
      right: { val: 4, left: null, right: null },
    },
    right: {
      val: 2,
      left: { val: 4, left: null, right: null },
      right: { val: 3, left: null, right: null },
    },
  };
}

function createSymmetricSingleNode(): TreeNode {
  return { val: 1, left: null, right: null };
}

function createAsymmetricStructure(): TreeNode {
  return {
    val: 1,
    left: {
      val: 2,
      left: { val: 3, left: null, right: null },
      right: null,
    },
    right: {
      val: 2,
      left: null,
      right: { val: 3, left: null, right: null },
    },
  };
}

function createAsymmetricValues(): TreeNode {
  return {
    val: 1,
    left: {
      val: 2,
      left: { val: 3, left: null, right: null },
      right: { val: 4, left: null, right: null },
    },
    right: {
      val: 2,
      left: { val: 4, left: null, right: null },
      right: { val: 5, left: null, right: null }, // Different value
    },
  };
}

function createEmptyTree(): TreeNode | null {
  return null;
}

function createTwoNodes(): TreeNode {
  return {
    val: 1,
    left: { val: 2, left: null, right: null },
    right: { val: 2, left: null, right: null },
  };
}

function createCustomTree(): TreeNode {
  return createSymmetricCompleteTree();
}

export function createSampleTree(): TreeNode {
  return createSymmetricCompleteTree();
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

export const SYMMETRIC_TREE_PRESETS: Record<
  TreePresetKey,
  { label: string; create: () => TreeNode | null }
> = {
  symmetric_complete: { label: "Symmetric Complete", create: createSymmetricCompleteTree },
  symmetric_single: { label: "Single Node", create: createSymmetricSingleNode },
  asymmetric_structure: { label: "Asymmetric Structure", create: createAsymmetricStructure },
  asymmetric_values: { label: "Asymmetric Values", create: createAsymmetricValues },
  empty_tree: { label: "Empty Tree", create: createEmptyTree },
  two_nodes: { label: "Two Same Nodes", create: createTwoNodes },
  custom: { label: "Custom", create: createCustomTree },
};

import type { TreeNode, TreePresetKey } from "./types";

function createNode(
  val: number,
  left: TreeNode | null = null,
  right: TreeNode | null = null,
): TreeNode {
  return { val, left, right };
}

export const LCA_BINARY_TREE_CODE_LINES = [
  "class TreeNode:",
  "    def __init__(self, val=0, left=None, right=None):",
  "        self.val = val",
  "        self.left = left",
  "        self.right = right",
  "",
  "class Solution:",
  "    def lowestCommonAncestor(self, root, p, q):",
  "        # Return deepest node that is ancestor of both p and q",
  "",
  "        if not root or root is p or root is q:",
  "            return root",
  "",
  "        left = self.lowestCommonAncestor(root.left, p, q)",
  "        right = self.lowestCommonAncestor(root.right, p, q)",
  "",
  "        if left and right:",
  "            return root",
  "",
  "        return left if left else right",
  "",
  "if __name__ == \"__main__\":",
  "    root = TreeNode(3)",
  "    root.left = TreeNode(5)",
  "    root.right = TreeNode(1)",
  "    root.left.left = TreeNode(6)",
  "    root.left.right = TreeNode(2)",
  "    root.right.left = TreeNode(0)",
  "    root.right.right = TreeNode(8)",
  "    root.left.right.left = TreeNode(7)",
  "    root.left.right.right = TreeNode(4)",
  "",
  "    sol = Solution()",
  "    result = sol.lowestCommonAncestor(root, root.left, root.right)",
  "    print(f\"LCA: {result.val}\")",
] as const;

export const OPERATION_TO_LINE_MAP = {
  enter_function: 11,
  found_target: 11,
  recurse_left: 14,
  recurse_right: 15,
  check_split: 17,
  return_lca: 18,
  propagate: 20,
  exit_function: 20,
} as const;

export const LCA_BINARY_TREE_LINE_LABELS: Record<number, string> = {
  11: "Base Case",
  14: "Recurse Left",
  15: "Recurse Right",
  17: "Check Split",
  18: "Return Current as LCA",
  20: "Propagate Upward",
};

export const LCA_BINARY_TREE_LINE_GUIDE: Record<
  number,
  { meaning: string; why: string; next: string }
> = {
  11: {
    meaning: "Stop if root is null or equals p or q.",
    why: "Null means nothing found; p/q means target found in this branch.",
    next: "If not stopped, recurse into left and right subtrees.",
  },
  14: {
    meaning: "Search for targets in left subtree.",
    why: "LCA can be in left branch or split at current node.",
    next: "Search right subtree similarly.",
  },
  15: {
    meaning: "Search for targets in right subtree.",
    why: "Need both results to decide if current node is split point.",
    next: "If both sides are non-null, current node is LCA.",
  },
  17: {
    meaning: "Check if both left and right returned non-null.",
    why: "That means one target is on each side.",
    next: "Return root as LCA when split is found.",
  },
  18: {
    meaning: "Return current node as LCA.",
    why: "Current node is lowest split point for p and q.",
    next: "Bubble this answer to top call.",
  },
  20: {
    meaning: "Return non-null child result upward.",
    why: "Targets are in same subtree or only one branch has them.",
    next: "Ancestor continues decision using this signal.",
  },
};

export function createLcaExampleTree(): TreeNode {
  const root = createNode(3);
  root.left = createNode(5);
  root.right = createNode(1);
  root.left.left = createNode(6);
  root.left.right = createNode(2);
  root.right.left = createNode(0);
  root.right.right = createNode(8);
  root.left.right.left = createNode(7);
  root.left.right.right = createNode(4);
  return root;
}

export function createBalancedCompleteTree(): TreeNode {
  const root = createNode(1);
  root.left = createNode(2);
  root.right = createNode(3);
  root.left.left = createNode(4);
  root.left.right = createNode(5);
  root.right.left = createNode(6);
  root.right.right = createNode(7);
  return root;
}

export function createBalancedLeftSkewedTree(): TreeNode {
  const root = createNode(9);
  root.left = createNode(7);
  root.left.left = createNode(5);
  root.left.left.left = createNode(3);
  root.left.left.left.left = createNode(1);
  root.right = createNode(11);
  return root;
}

export function createUnbalancedTree(): TreeNode {
  const root = createNode(10);
  root.left = createNode(6);
  root.right = createNode(14);
  root.left.left = createNode(4);
  root.left.right = createNode(8);
  root.right.left = createNode(12);
  root.right.right = createNode(16);
  root.left.right.left = createNode(7);
  return root;
}

export function createSimpleBalancedTree(): TreeNode {
  return createLcaExampleTree();
}

export const LCA_BINARY_TREE_PRESETS: Record<
  TreePresetKey,
  { label: string; create: () => TreeNode | null }
> = {
  complete: {
    label: "LCA Classic (p=5, q=1)",
    create: createLcaExampleTree,
  },
  left_skewed: {
    label: "Ancestor Case (p ancestor of q)",
    create: createBalancedLeftSkewedTree,
  },
  right_skewed: {
    label: "Balanced Complete",
    create: createBalancedCompleteTree,
  },
  sparse_random: {
    label: "Sparse Random",
    create: createUnbalancedTree,
  },
  custom_empty: {
    label: "Empty Tree",
    create: () => null,
  },
};

export function cloneTree(node: TreeNode | null): TreeNode | null {
  if (node === null) {
    return null;
  }

  const cloned = createNode(node.val);
  cloned.left = cloneTree(node.left);
  cloned.right = cloneTree(node.right);
  return cloned;
}

export function createSampleTree(): TreeNode {
  return createLcaExampleTree();
}

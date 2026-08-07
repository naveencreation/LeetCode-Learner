import type { TreeNode, TreePresetKey } from "./types";

function createNode(
  val: number,
  left: TreeNode | null = null,
  right: TreeNode | null = null,
): TreeNode {
  return { val, left, right };
}

export const BALANCED_BINARY_TREE_CODE_LINES = [
  "class TreeNode:",
  "    def __init__(self, val=0, left=None, right=None):",
  "        self.val = val",
  "        self.left = left",
  "        self.right = right",
  "",
  "class Solution:",
  "    def isBalanced(self, root):",
  "        # Check if tree is height-balanced",
  "        # -1 sentinel: unbalanced, >=0: height",
  "",
  "        def check(node):",
  "            if not node:",
  "                return 0",
  "",
  "            left = check(node.left)",
  "            if left == -1:",
  "                return -1",
  "",
  "            right = check(node.right)",
  "            if right == -1:",
  "                return -1",
  "",
  "            # Check balance at this node",
  "            if abs(left - right) > 1:",
  "                return -1",
  "",
  "            # Return height if balanced",
  "            return 1 + max(left, right)",
  "",
  "        return check(root) != -1",
  "",
  "if __name__ == \"__main__\":",
  "    root = TreeNode(3)",
  "    root.left = TreeNode(9)",
  "    root.right = TreeNode(20)",
  "    root.right.left = TreeNode(15)",
  "    root.right.right = TreeNode(7)",
  "",
  "    sol = Solution()",
  "    result = sol.isBalanced(root)",
  "    print(f\"Is Balanced: {result}\")",
] as const;

export const OPERATION_TO_LINE_MAP = {
  enter_function: 11,
  check_left: 15,
  check_right: 19,
  check_balance: 24,
  return_height: 28,
  return_unbalanced: 25,
  exit_function: 11,
} as const;

export const BALANCED_BINARY_TREE_LINE_LABELS: Record<number, string> = {
  11: "Function Entry",
  12: "Base Case Check",
  15: "Traverse Left Subtree",
  16: "Check Left Height",
  19: "Traverse Right Subtree",
  20: "Check Right Height",
  24: "Compare Heights",
  25: "Return Unbalanced (-1)",
  28: "Return Height",
  29: "Return Result",
};

export const BALANCED_BINARY_TREE_LINE_GUIDE: Record<
  number,
  { meaning: string; why: string; next: string }
> = {
  11: {
    meaning: "We entered the check function for the current node.",
    why: "Every recursive call starts from the function definition.",
    next: "First check if node is null (base case).",
  },
  12: {
    meaning: "This checks if we reached a null (empty) child.",
    why: "The base case handles the leaf boundary — null has height 0.",
    next: "If null, return 0; otherwise, process the node.",
  },
  15: {
    meaning: "Recursively check the left subtree.",
    why: "We need the height of the left subtree before checking balance.",
    next: "The left subtree returns its height (or -1 if unbalanced).",
  },
  16: {
    meaning: "Check if the left subtree is already unbalanced.",
    why: "If left is -1, the entire tree is unbalanced — early exit.",
    next: "If balanced, proceed to the right subtree.",
  },
  19: {
    meaning: "Recursively check the right subtree.",
    why: "We need the height of the right subtree to compare with left.",
    next: "The right subtree returns its height (or -1 if unbalanced).",
  },
  20: {
    meaning: "Check if the right subtree is already unbalanced.",
    why: "If right is -1, the entire tree is unbalanced — early exit.",
    next: "If balanced, compare left and right heights.",
  },
  24: {
    meaning: "Check if the height difference is valid.",
    why: "A node is balanced only if |left − right| ≤ 1.",
    next: "If difference > 1, return -1 (unbalanced).",
  },
  25: {
    meaning: "Return -1 (sentinel) to signal unbalance.",
    why: "Returning -1 immediately propagates failure up the tree.",
    next: "Parent receives -1 and returns early without more work.",
  },
  28: {
    meaning: "Return the actual height of this node.",
    why: "A balanced node returns height = 1 + max(left, right).",
    next: "Parent receives this height and continues.",
  },
  29: {
    meaning: "Final result: check() returned a value ≠ -1.",
    why: "If the result is ≥ 0, the entire tree is balanced.",
    next: "Return true if result ≥ 0; false if result == -1.",
  },
};

// Tree presets for balanced binary tree problem
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
  const root = createNode(1);
  root.left = createNode(2);
  root.left.left = createNode(3);
  root.left.left.left = createNode(4);
  root.right = createNode(5);
  root.right.left = createNode(6);
  return root;
}

export function createUnbalancedTree(): TreeNode {
  const root = createNode(1);
  root.left = createNode(2);
  root.right = createNode(2);
  root.left.left = createNode(3);
  root.left.left.left = createNode(4);
  return root;
}

export function createSimpleBalancedTree(): TreeNode {
  const root = createNode(3);
  root.left = createNode(9);
  root.right = createNode(20);
  root.right.left = createNode(15);
  root.right.right = createNode(7);
  return root;
}

export const BALANCED_BINARY_TREE_PRESETS: Record<
  TreePresetKey,
  { label: string; create: () => TreeNode | null }
> = {
  complete: {
    label: "Balanced (Complete)",
    create: createBalancedCompleteTree,
  },
  left_skewed: {
    label: "Left Skewed (Unbalanced)",
    create: createBalancedLeftSkewedTree,
  },
  right_skewed: {
    label: "Simple Balanced",
    create: createSimpleBalancedTree,
  },
  sparse_random: {
    label: "Unbalanced Tree",
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
  return createSimpleBalancedTree();
}

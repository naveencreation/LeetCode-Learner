import type { TreeNode, BalancedTreePresetKey } from "./types";

export const BALANCED_CODE_LINES = [
  "class TreeNode:",
  "    def __init__(self, val=0, left=None, right=None):",
  "        self.val = val",
  "        self.left = left",
  "        self.right = right",
  "",
  "class Solution:",
  "    def isBalanced(self, root) -> bool:",
  "        def check(node):",
  "            if not node:          # null leaf has height 0",
  "                return 0",
  "",
  "            left = check(node.left)",
  "            if left == -1:        # early exit - left unbalanced",
  "                return -1",
  "",
  "            right = check(node.right)",
  "            if right == -1:       # early exit - right unbalanced",
  "                return -1",
  "",
  "            if abs(left - right) > 1:  # unbalanced here",
  "                return -1",
  "",
  "            return 1 + max(left, right)  # balanced - return height",
  "",
  "        return check(root) != -1",
  "",
  "if __name__ == '__main__':",
  "    # Example 1: Balanced tree [3,9,20,null,null,15,7]",
  "    root = TreeNode(3)",
  "    root.left = TreeNode(9)",
  "    root.right = TreeNode(20)",
  "    root.right.left = TreeNode(15)",
  "    root.right.right = TreeNode(7)",
  "",
  "    sol = Solution()",
  "    result = sol.isBalanced(root)",
  "    print(f'Tree is balanced: {result}')",
] as const;

export const OPERATION_TO_LINE_MAP = {
  enter_function: 7,
  check_null: 9,
  recurse_left: 12,
  check_left_sentinel: 13,
  recurse_right: 16,
  check_right_sentinel: 17,
  compare_heights: 19,
  unbalanced: 20,
  calculate_height: 22,
  exit_function: 24,
  complete: 25,
} as const;

export const BALANCED_LINE_LABELS: Record<number, string> = {
  7: "Function Entry",
  9: "Null Check",
  12: "Recurse Left",
  13: "Check Left Sentinel",
  16: "Recurse Right",
  17: "Check Right Sentinel",
  19: "Compare Heights",
  20: "Unbalanced Detected",
  22: "Calculate Height",
  24: "Return Result",
};

export const BALANCED_LINE_GUIDE: Record<
  number,
  { meaning: string; why: string; next: string }
> = {
  7: {
    meaning: "We entered the check function for this node.",
    why: "Every recursive call checks balance and computes height.",
    next: "Check if the node is null (base case).",
  },
  9: {
    meaning: "Checking if node is null.",
    why: "Null nodes have height 0 and are balanced.",
    next: "If null, return 0; else recurse on left subtree.",
  },
  12: {
    meaning: "Recursively checking left subtree.",
    why: "We need the left subtree's height to check balance.",
    next: "After recursion, check if left returned -1 (unbalanced).",
  },
  13: {
    meaning: "Checking if left subtree is unbalanced.",
    why: "If left is unbalanced (-1), propagate early exit.",
    next: "If -1, return -1 immediately; else recurse on right.",
  },
  16: {
    meaning: "Recursively checking right subtree.",
    why: "We need the right subtree's height to check balance.",
    next: "After recursion, check if right returned -1 (unbalanced).",
  },
  17: {
    meaning: "Checking if right subtree is unbalanced.",
    why: "If right is unbalanced (-1), propagate early exit.",
    next: "If -1, return -1 immediately; else compare heights.",
  },
  19: {
    meaning: "Comparing left and right heights.",
    why: "Balance requires |left - right| ≤ 1 at every node.",
    next: "If difference > 1, return -1; else return height.",
  },
  20: {
    meaning: "Tree is unbalanced at this node!",
    why: "Height difference exceeds 1, so tree is not balanced.",
    next: "Return -1 to propagate unbalance upward.",
  },
  22: {
    meaning: "Tree is balanced here.",
    why: "Height difference ≤ 1, so return actual height.",
    next: "Return 1 + max(left, right) to parent.",
  },
  24: {
    meaning: "Final result computed.",
    why: "If root check returned -1, tree is unbalanced.",
    next: "Return True if balanced, False otherwise.",
  },
};

export const BALANCED_PRESETS: Record<
  BalancedTreePresetKey,
  { label: string; create: () => TreeNode | null }
> = {
  balanced: {
    label: "Balanced Tree [3,9,20,15,7]",
    create: () => {
      const root: TreeNode = { val: 3, left: null, right: null };
      root.left = { val: 9, left: null, right: null };
      root.right = { val: 20, left: null, right: null };
      root.right.left = { val: 15, left: null, right: null };
      root.right.right = { val: 7, left: null, right: null };
      return root;
    },
  },
  unbalanced: {
    label: "Unbalanced Tree [1,2,2,3,3,null,null,4,4]",
    create: () => {
      const root: TreeNode = { val: 1, left: null, right: null };
      root.left = { val: 2, left: null, right: null };
      root.right = { val: 2, left: null, right: null };
      root.left.left = { val: 3, left: null, right: null };
      root.left.right = { val: 3, left: null, right: null };
      root.left.left.left = { val: 4, left: null, right: null };
      root.left.left.right = { val: 4, left: null, right: null };
      return root;
    },
  },
  single_node: {
    label: "Single Node [1]",
    create: () => ({ val: 1, left: null, right: null }),
  },
  two_nodes: {
    label: "Two Nodes [1,2]",
    create: () => {
      const root: TreeNode = { val: 1, left: null, right: null };
      root.left = { val: 2, left: null, right: null };
      return root;
    },
  },
  custom_empty: {
    label: "Empty Tree",
    create: () => null,
  },
};

export function cloneTree(node: TreeNode | null): TreeNode | null {
  if (!node) return null;
  return {
    val: node.val,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
  };
}

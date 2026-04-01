import type { TreeNode } from "./types";

export const INORDER_CODE_LINES = [
  "class TreeNode:",
  "    def __init__(self, val=0, left=None, right=None):",
  "        self.data = val",
  "        self.left = left",
  "        self.right = right",
  "",
  "class Solution:",
  "    def __init__(self):",
  "        pass",
  "",
  "    def recursiveInorder(self, root, arr):",
  "        # Base case: no node to process",
  "        if root is None:",
  "            return",
  "        self.recursiveInorder(root.left, arr)",
  "        arr.append(root.data)",
  "        self.recursiveInorder(root.right, arr)",
  "",
  "    def inorder(self, root):",
  "        arr = []",
  "        self.recursiveInorder(root, arr)",
  "        return arr",
  "",
  "if __name__ == \"__main__\":",
  "    root = TreeNode(1)",
  "    root.left = TreeNode(2)",
  "    root.right = TreeNode(3)",
  "    root.left.left = TreeNode(4)",
  "    root.left.right = TreeNode(5)",
  "    root.right.right = TreeNode(6)",
  "",
  "    sol = Solution()",
  "    result = sol.inorder(root)",
  "    print(\"Inorder Traversal: \", end=\"\")",
  "    for val in result:",
  "        print(val, end=\" \")",
  "    print()",
] as const;

export const OPERATION_TO_LINE_MAP = {
  enter_function: 10,
  traverse_left: 14,
  visit: 15,
  traverse_right: 16,
  exit_function: 13,
} as const;

export const INORDER_LINE_LABELS: Record<number, string> = {
  10: "Function Entry",
  12: "Base Case Check",
  13: "Return To Caller",
  14: "Traverse Left Subtree",
  15: "Process Current Node",
  16: "Traverse Right Subtree",
  20: "Start Traversal",
};

export const INORDER_LINE_GUIDE: Record<
  number,
  { meaning: string; why: string; next: string }
> = {
  10: {
    meaning: "We entered recursiveInorder for the current node.",
    why: "Every recursive call starts from this function definition.",
    next: "Check whether root is None before continuing.",
  },
  12: {
    meaning: "This checks if we reached an empty child.",
    why: "The base case prevents infinite recursion.",
    next: "If root is None we return; otherwise continue left.",
  },
  13: {
    meaning: "Return control to the previous recursive call.",
    why: "Once a subtree is done, recursion unwinds to parent.",
    next: "Parent call continues with process/root or right subtree.",
  },
  14: {
    meaning: "Move recursively to the left child first.",
    why: "Inorder order begins with Left.",
    next: "After left subtree completes, current node is processed.",
  },
  15: {
    meaning: "Append current node value into result array.",
    why: "This is the Root step in Left -> Root -> Right.",
    next: "Then recurse into right subtree.",
  },
  16: {
    meaning: "Move recursively to the right child.",
    why: "Inorder finishes each node by exploring Right.",
    next: "When right subtree ends, return to parent call.",
  },
  20: {
    meaning: "Start traversal by calling the recursive helper.",
    why: "This initializes recursion from the root.",
    next: "Result array gets built through recursive calls.",
  },
};

export function createSampleTree(): TreeNode {
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
      left: null,
      right: {
        val: 6,
        left: null,
        right: null,
      },
    },
  };
}

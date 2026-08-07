import type { TreeNode, TreePresetKey } from "./types";

export const INORDER_CODE_LINES = [
  "class TreeNode:",
  "    def __init__(self, val=0, left=None, right=None):",
  "        self.val = val",
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
  "        arr.append(root.val)",
  "        self.recursiveInorder(root.right, arr)",
  "        # All done: left visited, root recorded, right visited → implicit return.",
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
  "    root.right.left = TreeNode(6)",
  "    root.right.right = TreeNode(7)",
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
  base_case: 12,
  exit_function: 17,
  traverse_left: 14,
  visit: 15,
  traverse_right: 16,
} as const;

export const INORDER_LINE_LABELS: Record<number, string> = {
  10: "Function Entry",
  12: "Base Case Check",
  13: "Base Case Return",
  14: "Traverse Left Subtree",
  15: "Process Current Node",
  16: "Traverse Right Subtree",
  17: "Function Returns",
  25: "Start Traversal",
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

// Fixed deterministic sparse tree (no Math.random — reproducible on every reset)
function createSparseRandomTree(): TreeNode {
  return {
    val: 12,
    left: {
      val: 7,
      left: { val: 3, left: null, right: null },
      right: { val: 9, left: null, right: null },
    },
    right: {
      val: 20,
      left: { val: 16, left: null, right: null },
      right: {
        val: 24,
        left: { val: 21, left: null, right: null },
        right: null,
      },
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

export const INORDER_TREE_PRESETS: Record<
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

import type { TreeNode, TreePresetKey } from "./types";

export const POSTORDER_CODE_LINES = [
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
  "    def recursivePostorder(self, root, arr):",
  "        # Base case: no node to process",
  "        if root is None:",
  "            return",
  "        self.recursivePostorder(root.left, arr)",
  "        self.recursivePostorder(root.right, arr)",
  "        arr.append(root.data)",
  "",
  "    def postorder(self, root):",
  "        arr = []",
  "        self.recursivePostorder(root, arr)",
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
  "    result = sol.postorder(root)",
  "    print(\"Postorder Traversal: \", end=\"\")",
  "    for val in result:",
  "        print(val, end=\" \")",
  "    print()",
] as const;

export const OPERATION_TO_LINE_MAP = {
  enter_function: 10,
  traverse_left: 14,
  traverse_right: 15,
  visit: 16,
  exit_function: 13,
} as const;

export const POSTORDER_LINE_LABELS: Record<number, string> = {
  10: "Function Entry",
  12: "Base Case Check",
  13: "Return To Caller",
  14: "Traverse Left Subtree",
  15: "Traverse Right Subtree",
  16: "Process Current Node",
  20: "Start Traversal",
};

export const POSTORDER_LINE_GUIDE: Record<
  number,
  { meaning: string; why: string; next: string }
> = {
  10: {
    meaning: "We entered recursivePostorder for the current node.",
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
    why: "Postorder always starts with Left subtree.",
    next: "After left subtree completes, recurse into right subtree.",
  },
  15: {
    meaning: "Move recursively to the right child.",
    why: "After Left, postorder explores Right subtree.",
    next: "Once both children are done, process current node.",
  },
  16: {
    meaning: "Append current node value into result array.",
    why: "Postorder processes Root after Left and Right.",
    next: "Return to parent recursive call.",
  },
  20: {
    meaning: "Start traversal by calling the recursive helper.",
    why: "This initializes recursion from the root.",
    next: "Result array gets built through recursive calls.",
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

export const POSTORDER_TREE_PRESETS: Record<
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



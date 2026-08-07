import type { TreeNode, TreePresetKey } from "./types";

export const ROOT_TO_NODE_CODE_LINES = [
  "def rootToNodePath(root, target):",
  "    path = []",
  "",
  "    def dfs(node):",
  "        if node is None:",
  "            return False",
  "",
  "        path.append(node.data)",
  "",
  "        if node.data == target:",
  "            return True",
  "",
  "        if dfs(node.left):",
  "            return True",
  "",
  "        if dfs(node.right):",
  "            return True",
  "",
  "        path.pop()",
  "        return False",
  "",
  "    found = dfs(root)",
  "    return path if found else []",
] as const;

export const OPERATION_TO_LINE_MAP = {
  enter_function: 3,
  visit: 7,
  found_target: 9,
  traverse_left: 12,
  traverse_right: 15,
  backtrack: 18,
  exit_function: 5,
  finish: 21,
} as const;

export const ROOT_TO_NODE_LINE_LABELS: Record<number, string> = {
  3: "DFS Function Entry",
  4: "Base Case Check",
  7: "Add Node To Path",
  9: "Check Target",
  12: "Try Left Subtree",
  15: "Try Right Subtree",
  18: "Backtrack Path",
  21: "Return Final Path",
};

export const ROOT_TO_NODE_LINE_GUIDE: Record<
  number,
  { meaning: string; why: string; next: string }
> = {
  3: {
    meaning: "A new DFS call starts for the current node.",
    why: "Root-to-node path uses recursion with backtracking.",
    next: "Check if node is None (base case).",
  },
  4: {
    meaning: "Stop recursion when node is missing.",
    why: "Avoids invalid traversal and unwinds safely.",
    next: "Return False to signal target not found here.",
  },
  7: {
    meaning: "Push current node into the path array.",
    why: "Current DFS route is always stored in path.",
    next: "Compare node value with target.",
  },
  9: {
    meaning: "Check if target is found at current node.",
    why: "If matched, current path is the answer.",
    next: "Otherwise search left subtree first.",
  },
  12: {
    meaning: "Explore left subtree recursively.",
    why: "Standard DFS order for this problem.",
    next: "If not found, continue to right subtree.",
  },
  15: {
    meaning: "Explore right subtree recursively.",
    why: "Right branch is searched only after left fails.",
    next: "If right also fails, perform backtrack.",
  },
  18: {
    meaning: "Pop current node from path when both subtrees fail.",
    why: "Backtracking removes dead-end nodes.",
    next: "Return False to parent DFS frame.",
  },
  21: {
    meaning: "Return final path when found else empty list.",
    why: "Problem asks for root-to-target path only.",
    next: "Visualization finishes with success/failure state.",
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

export const ROOT_TO_NODE_TREE_PRESETS: Record<
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


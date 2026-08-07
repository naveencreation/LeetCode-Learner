import type { TreeNode, TreePresetKey } from "./types";

export const BSTDLL_CODE_LINES = [
  "class TreeNode:",
  "    def __init__(self, val=0, left=None, right=None):",
  "        self.data = val",
  "        self.left = left",
  "        self.right = right",
  "",
  "class Solution:",
  "    def treeToDoublyList(self, root):",
  "        if root is None:",
  "            return",
  "",
  "        head = prev = None",
  "",
  "        def inorder(node):",
  "            nonlocal head, prev",
  "            if node is None:",
  "                return",
  "            inorder(node.left)",
  "            if prev is None:",
  "                head = node",
  "            else:",
  "                prev.right = node",
  "                node.left = prev",
  "            prev = node",
  "            inorder(node.right)",
  "",
  "        inorder(root)",
  "        head.left = prev",
  "        prev.right = head",
  "        return head",
] as const;

export const OPERATION_TO_LINE_MAP = {
  enter_function: 16,
  traverse_left: 15,
  set_head: 17,
  link_prev_curr: 19,
  visit: 21,
  traverse_right: 22,
  close_cycle: 25,
  exit_function: 14,
} as const;

export const BSTDLL_LINE_LABELS: Record<number, string> = {
  11: "Empty Tree Guard",
  16: "Inorder Function Entry",
  17: "Set Head",
  19: "Link Previous and Current",
  21: "Advance Previous Pointer",
  22: "Traverse Right Subtree",
  25: "Close Circular Link",
  26: "Return Head",
};

export const BSTDLL_LINE_GUIDE: Record<
  number,
  { meaning: string; why: string; next: string }
> = {
  11: {
    meaning: "Handle empty tree immediately.",
    why: "No list can be formed when root is null.",
    next: "Initialize head and prev for traversal.",
  },
  16: {
    meaning: "Recursive inorder call starts for this node.",
    why: "Inorder gives sorted order for BST values.",
    next: "Go left first before linking current node.",
  },
  17: {
    meaning: "First visited node becomes head.",
    why: "Leftmost BST node is the smallest, so it starts the DLL.",
    next: "For later nodes, link prev <-> current.",
  },
  19: {
    meaning: "Connect previous node with current node in-place.",
    why: "right acts as next, left acts as prev in DLL.",
    next: "Advance prev to current and continue.",
  },
  21: {
    meaning: "prev now points to current node.",
    why: "Next visited node should link back to this one.",
    next: "Traverse right subtree.",
  },
  22: {
    meaning: "Visit the right subtree in inorder order.",
    why: "This keeps list values sorted ascending.",
    next: "After recursion ends, close circular links.",
  },
  25: {
    meaning: "Connect head and tail to make the list circular.",
    why: "Problem requires circular doubly linked list.",
    next: "Return head pointer.",
  },
  26: {
    meaning: "Return the head of the circular doubly linked list.",
    why: "Caller needs entry point to traverse the list.",
    next: "Done.",
  },
};

function createCompleteTree(): TreeNode {
  return {
    val: 4,
    left: {
      val: 2,
      left: {
        val: 1,
        left: null,
        right: null,
      },
      right: {
        val: 3,
        left: null,
        right: null,
      },
    },
    right: {
      val: 6,
      left: {
        val: 5,
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
    val: 4,
    left: {
      val: 3,
      left: {
        val: 2,
        left: {
          val: 1,
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
  const values = [15, 8, 22, 4, 11, 19, 27, 2, 13];

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
    val: 10,
    left: null,
    right: null,
  };
}

export const BSTDLL_TREE_PRESETS: Record<
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


import type { TreeNode, TreePresetKey } from "./types";

export const SAMETREE_CODE_LINES = [
  "class TreeNode:",
  "    def __init__(self, val=0, left=None, right=None):",
  "        self.val = val",
  "        self.left = left",
  "        self.right = right",
  "",
  "class Solution:",
  "    def isSameTree(self, p, q) -> bool:",
  "        # Base case: both nodes are null",
  "        if not p and not q:",
  "            return True",
  "",
  "        # One is null, other is not",
  "        if not p or not q:",
  "            return False",
  "",
  "        # Values differ",
  "        if p.val != q.val:",
  "            return False",
  "",
  "        # Recursively check left and right subtrees",
  "        left_same = self.isSameTree(p.left, q.left)",
  "        if not left_same:",
  "            return False",
  "",
  "        right_same = self.isSameTree(p.right, q.right)",
  "        return left_same and right_same",
  "",
  "if __name__ == '__main__':",
  "    # Build tree p: [1,2,3]",
  "    p = TreeNode(1)",
  "    p.left = TreeNode(2)",
  "    p.right = TreeNode(3)",
  "",
  "    # Build tree q: [1,2,3]",
  "    q = TreeNode(1)",
  "    q.left = TreeNode(2)",
  "    q.right = TreeNode(3)",
  "",
  "    sol = Solution()",
  "    result = sol.isSameTree(p, q)",
  "    print(f'Trees are same: {result}')",
] as const;

export const OPERATION_TO_LINE_MAP = {
  enter_function: 5,
  check_null: 7,
  match_found: 8,
  mismatch_found: 11,
  compare_values: 15,
  recurse_left: 18,
  recurse_right: 22,
  exit_function: 23,
  compare_nodes: 5,
} as const;

export const SAMETREE_LINE_LABELS: Record<number, string> = {
  5: "Function Entry",
  7: "Null Check",
  8: "Both Null - Match",
  11: "One Null - Mismatch",
  15: "Value Comparison",
  18: "Recurse Left",
  22: "Recurse Right",
  23: "Return Result",
};

export const SAMETREE_LINE_GUIDE: Record<
  number,
  { meaning: string; why: string; next: string }
> = {
  5: {
    meaning: "We entered isSameTree to compare two nodes.",
    why: "Every recursive call compares a pair of nodes from both trees.",
    next: "Check if both nodes are null first.",
  },
  7: {
    meaning: "Checking if both nodes are null.",
    why: "Two null nodes are considered identical at that position.",
    next: "If both null, return True; else check if one is null.",
  },
  8: {
    meaning: "Both nodes are null - they match here.",
    why: "Null nodes at same position means structures align.",
    next: "Return True and unwind to parent comparison.",
  },
  11: {
    meaning: "One node is null, the other is not.",
    why: "Structural difference detected - trees cannot be same.",
    next: "Return False immediately - mismatch found.",
  },
  15: {
    meaning: "Comparing values of both nodes.",
    why: "Even with same structure, different values mean different trees.",
    next: "If values differ, return False; else recurse on children.",
  },
  18: {
    meaning: "Recursively comparing left subtrees.",
    why: "Left children must also be identical for trees to match.",
    next: "If left comparison fails, short-circuit; else check right.",
  },
  22: {
    meaning: "Recursively comparing right subtrees.",
    why: "Right children must also match for complete equality.",
    next: "Return combined result of left and right comparisons.",
  },
  23: {
    meaning: "Returning final comparison result.",
    why: "Both structure and values matched at this node pair.",
    next: "Parent call receives the result and propagates it up.",
  },
};

// Helper to create a tree from array representation
function createTreeFromArray(values: (number | null)[]): TreeNode | null {
  if (values.length === 0 || values[0] === null) return null;
  
  const root: TreeNode = { val: values[0]!, left: null, right: null };
  const queue: TreeNode[] = [root];
  let i = 1;
  
  while (queue.length > 0 && i < values.length) {
    const node = queue.shift()!;
    
    // Left child
    if (i < values.length && values[i] !== null) {
      node.left = { val: values[i]!, left: null, right: null };
      queue.push(node.left);
    }
    i++;
    
    // Right child
    if (i < values.length && values[i] !== null) {
      node.right = { val: values[i]!, left: null, right: null };
      queue.push(node.right);
    }
    i++;
  }
  
  return root;
}

function createSameTrees(): { p: TreeNode; q: TreeNode } {
  const p: TreeNode = {
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
  
  // Clone for q
  const q = cloneTree(p)!;
  return { p, q };
}

function createDifferentStructure(): { p: TreeNode; q: TreeNode } {
  const p: TreeNode = {
    val: 1,
    left: {
      val: 2,
      left: { val: 4, left: null, right: null },
      right: null,
    },
    right: {
      val: 3,
      left: null,
      right: null,
    },
  };
  
  const q: TreeNode = {
    val: 1,
    left: {
      val: 2,
      left: null,
      right: { val: 4, left: null, right: null },
    },
    right: {
      val: 3,
      left: null,
      right: null,
    },
  };
  
  return { p, q };
}

function createDifferentValues(): { p: TreeNode; q: TreeNode } {
  const p: TreeNode = {
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
  
  const q: TreeNode = {
    val: 1,
    left: {
      val: 2,
      left: { val: 4, left: null, right: null },
      right: { val: 8, left: null, right: null }, // Different value
    },
    right: {
      val: 3,
      left: { val: 6, left: null, right: null },
      right: { val: 7, left: null, right: null },
    },
  };
  
  return { p, q };
}

function createEmptyTrees(): { p: null; q: null } {
  return { p: null, q: null };
}

function createSingleNodeSame(): { p: TreeNode; q: TreeNode } {
  return {
    p: { val: 1, left: null, right: null },
    q: { val: 1, left: null, right: null },
  };
}

function createSingleNodeDiff(): { p: TreeNode; q: TreeNode } {
  return {
    p: { val: 1, left: null, right: null },
    q: { val: 2, left: null, right: null },
  };
}

function createCustomEmptyTree(): TreeNode {
  return { val: 1, left: null, right: null };
}

export function createSampleTrees(): { p: TreeNode; q: TreeNode } {
  return createSameTrees();
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

export const SAMETREE_TREE_PRESETS: Record<
  TreePresetKey,
  { label: string; create: () => { p: TreeNode | null; q: TreeNode | null } }
> = {
  same_trees: { label: "Identical Trees", create: createSameTrees },
  different_structure: { label: "Different Structure", create: createDifferentStructure },
  different_values: { label: "Different Values", create: createDifferentValues },
  empty_trees: { label: "Both Empty", create: createEmptyTrees },
  single_node_same: { label: "Single Node Same", create: createSingleNodeSame },
  single_node_diff: { label: "Single Node Different", create: createSingleNodeDiff },
  custom_empty: { 
    label: "Custom Empty Start", 
    create: () => ({ p: createCustomEmptyTree(), q: cloneTree(createCustomEmptyTree())! }) 
  },
};

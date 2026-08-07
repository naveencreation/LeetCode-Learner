import type { TreeNode, ZigzagTreePresetKey } from "./types";

export const ZIGZAG_CODE_LINES = [
  "from collections import deque",
  "",
  "def zigzagLevelOrder(root):",
  "    if not root: return []",
  "",
  "    result = []",
  "    queue = deque([root])       # BFS queue",
  "    left_to_right = True        # direction flag",
  "",
  "    while queue:",
  "        level_size = len(queue) # freeze level count",
  "        level = []",
  "",
  "        for _ in range(level_size):",
  "            node = queue.popleft()",
  "            level.append(node.val)",
  "",
  "            if node.left: queue.append(node.left)",
  "            if node.right: queue.append(node.right)",
  "",
  "        # Reverse if going right to left",
  "        if not left_to_right:",
  "            level.reverse()",
  "",
  "        result.append(level)",
  "        left_to_right = not left_to_right  # toggle",
  "",
  "    return result",
  "",
  "if __name__ == '__main__':",
  "    # Example: [3,9,20,15,7]",
  "    root = TreeNode(3)",
  "    root.left = TreeNode(9)",
  "    root.right = TreeNode(20)",
  "    root.right.left = TreeNode(15)",
  "    root.right.right = TreeNode(7)",
  "",
  "    print(zigzagLevelOrder(root))",
  "    # Output: [[3], [20,9], [15,7]]",
] as const;

export const OPERATION_TO_LINE_MAP = {
  enter_function: 2,
  check_null: 3,
  init_queue: 6,
  start_level: 9,
  get_level_size: 10,
  process_node: 14,
  add_left_child: 17,
  add_right_child: 18,
  reverse_level: 21,
  add_level_result: 24,
  toggle_direction: 25,
  exit_function: 27,
  complete: 28,
} as const;

export const ZIGZAG_LINE_LABELS: Record<number, string> = {
  2: "Function Entry",
  3: "Null Check",
  6: "Init Queue",
  9: "Start Level",
  10: "Get Level Size",
  14: "Process Node",
  17: "Add Left Child",
  18: "Add Right Child",
  21: "Reverse Level",
  24: "Add to Result",
  25: "Toggle Direction",
  27: "Return Result",
};

export const ZIGZAG_LINE_GUIDE: Record<
  number,
  { meaning: string; why: string; next: string }
> = {
  2: {
    meaning: "Starting zigzag level order traversal.",
    why: "BFS will process nodes level by level.",
    next: "Check if root is null.",
  },
  3: {
    meaning: "Checking if tree is empty.",
    why: "Empty tree returns empty result.",
    next: "Initialize queue with root if not null.",
  },
  6: {
    meaning: "Initializing BFS queue.",
    why: "Queue enables level-by-level processing.",
    next: "Start processing levels while queue not empty.",
  },
  9: {
    meaning: "Beginning a new level.",
    why: "Each iteration processes one complete level.",
    next: "Record the number of nodes at this level.",
  },
  10: {
    meaning: "Capturing level size.",
    why: "We must process exactly level_size nodes.",
    next: "Process each node in the current level.",
  },
  14: {
    meaning: "Processing current node.",
    why: "Recording value and will enqueue children.",
    next: "Enqueue left and right children if exist.",
  },
  21: {
    meaning: "Reversing level order.",
    why: "Zigzag requires alternating directions.",
    next: "Add (possibly reversed) level to result.",
  },
  25: {
    meaning: "Toggling direction flag.",
    why: "Next level will go opposite direction.",
    next: "Continue with next level or finish.",
  },
  27: {
    meaning: "Returning final zigzag result.",
    why: "All levels processed in zigzag pattern.",
    next: "Algorithm complete.",
  },
};

export const ZIGZAG_PRESETS: Record<
  ZigzagTreePresetKey,
  { label: string; create: () => TreeNode | null }
> = {
  standard: {
    label: "Standard Tree [3,9,20,15,7]",
    create: () => {
      const root: TreeNode = { val: 3, left: null, right: null };
      root.left = { val: 9, left: null, right: null };
      root.right = { val: 20, left: null, right: null };
      root.right.left = { val: 15, left: null, right: null };
      root.right.right = { val: 7, left: null, right: null };
      return root;
    },
  },
  simple: {
    label: "Simple Tree [1,2,3,4,5]",
    create: () => {
      const root: TreeNode = { val: 1, left: null, right: null };
      root.left = { val: 2, left: null, right: null };
      root.right = { val: 3, left: null, right: null };
      root.left.left = { val: 4, left: null, right: null };
      root.left.right = { val: 5, left: null, right: null };
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

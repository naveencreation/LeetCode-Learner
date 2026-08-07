export interface ProblemSection {
  name: string;
  solved: number;
  problems: string[];
}

export const sections: ProblemSection[] = [
  {
    name: "Arrays",
    solved: 0,
    problems: [
      "Set Matrix Zeros",
      "Pascal's Triangle",
      "Next Permutation",
      "Kadane's Algorithm",
      "Sort an array of 0's, 1's, and 2's",
      "Stock Buy and Sell",
    ],
  },
  {
    name: "Arrays Part-II",
    solved: 0,
    problems: [
      "Rotate Matrix",
      "Merge Overlapping Subintervals",
      "Merge two sorted Arrays without extra space",
      "Find the duplicate in an array of N+1 integers",
      "Repeat and Missing Number",
      "Inversion of Array",
    ],
  },
  {
    name: "Arrays Part-III",
    solved: 0,
    problems: [
      "Search in a 2D Matrix",
      "Pow(x, n)",
      "Majority Element (>N/2 times)",
      "Majority Element (>N/3 times)",
      "Grid Unique Paths",
      "Reverse Pairs",
    ],
  },
  {
    name: "Arrays Part-IV",
    solved: 0,
    problems: [
      "2-Sum Problem",
      "4-Sum Problem",
      "Longest Consecutive Sequence",
      "Largest Subarray with 0 sum",
      "Count number of subarrays with given XOR",
      "Longest Substring without repeat",
    ],
  },
  {
    name: "Linked List",
    solved: 0,
    problems: [
      "Reverse a LinkedList",
      "Find the middle of LinkedList",
      "Merge two sorted Linked Lists",
      "Remove N-th node from back of LinkedList",
      "Add two numbers as LinkedList",
      "Delete a given Node when a node is given",
    ],
  },
  {
    name: "Linked List Part-II",
    solved: 0,
    problems: [
      "Reorder List",
      "Find intersection point of Y LinkedList",
      "Detect a cycle in Linked List",
      "Reverse a LinkedList in groups of size k",
      "Check if a LinkedList is palindrome or not",
      "Find the starting point of the Loop of LinkedList",
      "Flattening of a LinkedList",
    ],
  },
  {
    name: "Linked List and Arrays",
    solved: 0,
    problems: [
      "Rotate a LinkedList",
      "Clone a Linked List with random and next pointer",
      "3-Sum",
      "Trapping Rain Water",
      "Remove Duplicate from Sorted array",
      "Max consecutive ones",
    ],
  },
  {
    name: "Greedy Algorithm",
    solved: 0,
    problems: [
      "N meetings in one room",
      "Minimum number of platforms required for a railway",
      "Job sequencing Problem",
      "Fractional Knapsack Problem",
      "Greedy algorithm to find minimum number of coins",
      "Activity Selection",
    ],
  },
  {
    name: "Recursion",
    solved: 0,
    problems: [
      "Subset Sums",
      "Subset-II",
      "Combination sum-1",
      "Combination sum-2",
      "Palindrome Partitioning",
      "K-th permutation Sequence",
    ],
  },
  {
    name: "Recursion and Backtracking",
    solved: 0,
    problems: [
      "Print all permutations of a string/array",
      "N queens Problem",
      "Sudoku Solver",
      "M coloring Problem",
      "Rat in a Maze",
      "Word Break (print all ways)",
    ],
  },
  {
    name: "Binary Search",
    solved: 0,
    problems: [
      "The N-th root of an integer",
      "Matrix Median",
      "Find the element that appears once in a sorted array, and the rest element appears twice",
      "Search element in a sorted and rotated array",
      "Median of 2 sorted arrays",
      "K-th element of two sorted arrays",
      "Allocate Minimum Number of Pages",
      "Aggressive Cows",
    ],
  },
  {
    name: "Heaps",
    solved: 0,
    problems: [
      "Max heap, Min Heap Implementation",
      "Kth Largest Element",
      "Maximum Sum Combination",
      "Find Median from Data Stream",
      "Find median in a stream of running integers",
      "K-th largest element in a stream",
      "K-th largest element in an unsorted array",
      "Merge K sorted arrays",
      "K most frequent elements",
    ],
  },
  {
    name: "Sliding Window",
    solved: 0,
    problems: [
      "Distinct numbers in Window",
    ],
  },
  {
    name: "Stack and Queue",
    solved: 0,
    problems: [
      "Implement Stack Using Arrays",
      "Implement Queue Using Arrays",
      "Implement Stack using Queue (using single queue)",
      "Implement Queue using Stack (0(1) amortized method)",
      "Check for balanced parentheses",
      "Next Greater Element",
      "Sort a Stack",
    ],
  },
  {
    name: "Stack and Queue Part-II",
    solved: 0,
    problems: [
      "Next Smaller Element",
      "LRU cache",
      "LFU Cache",
      "Largest rectangle in a histogram",
      "Sliding Window maximum",
      "Implement Min Stack",
      "Rotten Orange (Using BFS)",
      "Stock Span Problem",
      "Find the maximum of minimums of every window size",
      "The Celebrity Problem",
    ],
  },
  {
    name: "String",
    solved: 0,
    problems: [
      "Reverse Words in a String",
      "Longest Palindrome in a string",
      "Roman Number to Integer and vice versa",
      "Implement ATOI/STRSTR",
      "Longest Common Prefix",
      "Rabin Karp",
    ],
  },
  {
    name: "String Part-II",
    solved: 0,
    problems: [
      "Z-Function",
      "KMP algo / LPS(pi) array",
      "Minimum characters needed to be inserted in the beginning to make it palindromic",
      "Check for Anagrams",
      "Count and Say",
      "Compare version numbers",
    ],
  },
  {
    name: "Binary Tree",
    solved: 0,
    problems: [
      "Binary Tree Inorder Traversal",
      "Binary Tree Preorder Traversal",
      "Binary Tree Postorder Traversal",
      "Left View of Binary Tree",
      "Bottom View of Binary Tree",
      "Top View of Binary Tree",
      "Preorder Inorder Postorder in One Traversal",
      "Vertical Order Traversal of a Binary Tree",
      "Root to Node Path in Binary Tree",
      "Maximum Width of Binary Tree",
    ],
  },
  {
    name: "Binary Tree Part-II",
    solved: 0,
    problems: [
      "Binary Tree Level Order Traversal",
      "Maximum Depth of Binary Tree",
      "Diameter of Binary Tree",
      "Balanced Binary Tree",
      "Lowest Common Ancestor of a Binary Tree",
      "Same Tree",
      "Binary Tree Zigzag Level Order Traversal",
      "Boundary Traversal of Binary Tree",
      "Symmetric Tree",
      "Construct Binary Tree from Preorder and Inorder Traversal",
    ],
  },
  {
    name: "Binary Tree Part-III",
    solved: 0,
    problems: [
      "Construct Binary Tree from Inorder and Postorder Traversal",
      "Flatten Binary Tree to Linked List",
      "Convert Binary Search Tree to Sorted Doubly Linked List",
    ],
  },
];

const toSlug = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const getProblemHref = (sectionName: string, problemName: string): string | null => {
  // ── Binary Tree problems ──
  if (sectionName === "Binary Tree" && problemName === "Binary Tree Inorder Traversal") {
    return "/problems/binary-tree/inorder-traversal";
  }
  if (sectionName === "Binary Tree" && problemName === "Binary Tree Preorder Traversal") {
    return "/problems/binary-tree/preorder-traversal";
  }
  if (sectionName === "Binary Tree" && problemName === "Binary Tree Postorder Traversal") {
    return "/problems/binary-tree/postorder-traversal";
  }
  if (sectionName === "Binary Tree" && problemName === "Left View of Binary Tree") {
    return "/problems/binary-tree/leftview-of-binary-tree";
  }
  if (sectionName === "Binary Tree" && problemName === "Bottom View of Binary Tree") {
    return "/problems/binary-tree/bottom-view-of-binary-tree";
  }
  if (sectionName === "Binary Tree" && problemName === "Top View of Binary Tree") {
    return "/problems/binary-tree/top-view-of-binary-tree";
  }
  if (sectionName === "Binary Tree" && problemName === "Preorder Inorder Postorder in One Traversal") {
    return "/problems/binary-tree/preorder-inorder-postorder-in-a-single-traversal";
  }
  if (sectionName === "Binary Tree" && problemName === "Vertical Order Traversal of a Binary Tree") {
    return "/problems/binary-tree/vertical-order-traversal";
  }
  if (sectionName === "Binary Tree" && problemName === "Root to Node Path in Binary Tree") {
    return "/problems/binary-tree/root-to-node-path-in-a-binary-tree";
  }
  if (sectionName === "Binary Tree" && problemName === "Maximum Width of Binary Tree") {
    return "/problems/binary-tree/max-width-of-a-binary-tree";
  }
  if (sectionName === "Binary Tree Part-II" && problemName === "Binary Tree Level Order Traversal") {
    return "/problems/binary-tree/level-order-traversal";
  }
  if (sectionName === "Binary Tree Part-II" && problemName === "Maximum Depth of Binary Tree") {
    return "/problems/binary-tree/height-of-a-binary-tree";
  }
  if (sectionName === "Binary Tree Part-II" && problemName === "Diameter of Binary Tree") {
    return "/problems/binary-tree/diameter-of-binary-tree";
  }
  if (sectionName === "Binary Tree Part-II" && problemName === "Balanced Binary Tree") {
    return "/problems/binary-tree/balanced-binary-tree";
  }
  if (sectionName === "Binary Tree Part-II" && problemName === "Lowest Common Ancestor of a Binary Tree") {
    return "/problems/binary-tree/lca-in-binary-tree";
  }
  if (sectionName === "Binary Tree Part-II" && problemName === "Binary Tree Zigzag Level Order Traversal") {
    return "/problems/binary-tree/zigzag-level-order-traversal";
  }
  if (sectionName === "Binary Tree Part-II" && problemName === "Same Tree") {
    return "/problems/binary-tree/same-tree";
  }
  if (sectionName === "Binary Tree Part-II" && problemName === "Symmetric Tree") {
    return "/problems/binary-tree/symmetric-tree";
  }
  if (sectionName === "Binary Tree Part-II" && problemName === "Boundary Traversal of Binary Tree") {
    return "/problems/binary-tree/boundary-of-binary-tree";
  }
  if (sectionName === "Binary Tree Part-II" && problemName === "Construct Binary Tree from Preorder and Inorder Traversal") {
    return "/problems/binary-tree/construct-binary-tree-from-inorder-and-preorder";
  }
  if (sectionName === "Binary Tree Part-III" && problemName === "Construct Binary Tree from Inorder and Postorder Traversal") {
    return "/problems/binary-tree/construct-binary-tree-from-inorder-and-postorder";
  }
  if (sectionName === "Binary Tree Part-III" && problemName === "Flatten Binary Tree to Linked List") {
    return "/problems/binary-tree/flatten-binary-tree-to-linkedlist";
  }
  if (sectionName === "Binary Tree Part-III" && problemName === "Convert Binary Search Tree to Sorted Doubly Linked List") {
    return "/problems/binary-tree/convert-bst-to-sorted-doubly-linked-list";
  }
  if (sectionName === "Binary Tree") {
    return `/problems/binary-tree/${toSlug(problemName)}`;
  }

  // ── Linked List problems ──
  if (sectionName === "Linked List" && problemName === "Reverse a LinkedList") {
    return "/problems/linked-list/reverse-a-linkedlist";
  }
  if (sectionName === "Linked List" && problemName === "Find the middle of LinkedList") {
    return "/problems/linked-list/middle-of-linkedlist";
  }
  if (sectionName === "Linked List" && problemName === "Merge two sorted Linked Lists") {
    return "/problems/linked-list/merge-two-sorted-lists";
  }
  if (sectionName === "Linked List" && problemName === "Remove N-th node from back of LinkedList") {
    return "/problems/linked-list/remove-nth-from-end";
  }
  if (sectionName === "Linked List" && problemName === "Delete a given Node when a node is given") {
    return "/problems/linked-list/delete-node";
  }
  if (sectionName === "Linked List" && problemName === "Add two numbers as LinkedList") {
    return "/problems/linked-list/add-two-numbers";
  }
  if (sectionName === "Linked List Part-II" && problemName === "Reorder List") {
    return "/problems/linked-list/reorder-linkedlist";
  }
  if (sectionName === "Linked List Part-II" && problemName === "Find intersection point of Y LinkedList") {
    return "/problems/linked-list/find-intersection";
  }
  if (sectionName === "Linked List Part-II" && problemName === "Detect a cycle in Linked List") {
    return "/problems/linked-list/detect-cycle";
  }
  if (sectionName === "Linked List Part-II" && problemName === "Reverse a LinkedList in groups of size k") {
    return "/problems/linked-list/reverse-k-group";
  }
  if (sectionName === "Linked List Part-II" && problemName === "Check if a LinkedList is palindrome or not") {
    return "/problems/linked-list/palindrome-linkedlist";
  }
  if (sectionName === "Linked List Part-II" && problemName === "Find the starting point of the Loop of LinkedList") {
    return "/problems/linked-list/loop-start";
  }
  if (sectionName === "Linked List and Arrays" && problemName === "Rotate a LinkedList") {
    return "/problems/linked-list/rotate-linkedlist";
  }
  if (sectionName === "Linked List and Arrays" && problemName === "Clone a Linked List with random and next pointer") {
    return "/problems/linked-list/clone-linkedlist";
  }

  return null;
};

const guideMap: Record<string, string> = {
  "Binary Tree Inorder Traversal": "/problems/binary-tree/inorder-guide",
  "Binary Tree Preorder Traversal": "/problems/binary-tree/preorder-guide",
  "Binary Tree Postorder Traversal": "/problems/binary-tree/postorder-guide",
  "Left View of Binary Tree": "/problems/binary-tree/leftview-guide",
  "Bottom View of Binary Tree": "/problems/binary-tree/bottomview-guide",
  "Top View of Binary Tree": "/problems/binary-tree/topview-guide",
  "Preorder Inorder Postorder in One Traversal": "/problems/binary-tree/preorder-inorder-postorder-single-guide",
  "Vertical Order Traversal of a Binary Tree": "/problems/binary-tree/verticalorder-guide",
  "Root to Node Path in Binary Tree": "/problems/binary-tree/roottonode-guide",
  "Maximum Width of Binary Tree": "/problems/binary-tree/maxwidth-guide",
  "Binary Tree Level Order Traversal": "/problems/binary-tree/levelorder-guide",
  "Maximum Depth of Binary Tree": "/problems/binary-tree/height-guide",
  "Diameter of Binary Tree": "/problems/binary-tree/diameter-guide",
  "Balanced Binary Tree": "/problems/binary-tree/balanced-binary-tree-guide",
  "Lowest Common Ancestor of a Binary Tree": "/problems/binary-tree/lca-in-binary-tree-guide",
  "Same Tree": "/problems/binary-tree/same-tree-guide",
  "Binary Tree Zigzag Level Order Traversal": "/problems/binary-tree/zigzag-level-order-traversal-guide",
  "Boundary Traversal of Binary Tree": "/problems/binary-tree/boundary-of-binary-tree-guide",
  "Symmetric Tree": "/problems/binary-tree/symmetric-tree-guide",
  "Construct Binary Tree from Preorder and Inorder Traversal": "/problems/binary-tree/construct-binary-tree-from-inorder-and-preorder-guide",
  "Construct Binary Tree from Inorder and Postorder Traversal": "/problems/binary-tree/construct-binary-tree-from-inorder-and-postorder-guide",
  "Flatten Binary Tree to Linked List": "/problems/binary-tree/flatten-binary-tree-to-linkedlist-guide",
  "Convert Binary Search Tree to Sorted Doubly Linked List": "/problems/binary-tree/bstdll-guide",
};

export const getGuideHref = (problemName: string): string | null =>
  guideMap[problemName] ?? null;

export interface PlatformLink {
  url: string;
  platform: "leetcode" | "gfg";
}

const platformMap: Record<string, PlatformLink> = {
  "Binary Tree Inorder Traversal": { url: "https://leetcode.com/problems/binary-tree-inorder-traversal", platform: "leetcode" },
  "Binary Tree Preorder Traversal": { url: "https://leetcode.com/problems/binary-tree-preorder-traversal", platform: "leetcode" },
  "Binary Tree Postorder Traversal": { url: "https://leetcode.com/problems/binary-tree-postorder-traversal", platform: "leetcode" },
  "Left View of Binary Tree": { url: "https://www.geeksforgeeks.org/problems/left-view-of-binary-tree/1", platform: "gfg" },
  "Bottom View of Binary Tree": { url: "https://www.geeksforgeeks.org/problems/bottom-view-of-binary-tree/1", platform: "gfg" },
  "Top View of Binary Tree": { url: "https://www.geeksforgeeks.org/problems/top-view-of-binary-tree/1", platform: "gfg" },
  "Preorder Inorder Postorder in One Traversal": { url: "https://www.geeksforgeeks.org/dsa/preorder-postorder-and-inorder-traversal-of-a-binary-tree-using-a-single-stack/", platform: "gfg" },
  "Vertical Order Traversal of a Binary Tree": { url: "https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree", platform: "leetcode" },
  "Root to Node Path in Binary Tree": { url: "https://www.geeksforgeeks.org/dsa/print-path-root-given-node-binary-tree/", platform: "gfg" },
  "Maximum Width of Binary Tree": { url: "https://leetcode.com/problems/maximum-width-of-binary-tree", platform: "leetcode" },
  "Binary Tree Level Order Traversal": { url: "https://leetcode.com/problems/binary-tree-level-order-traversal", platform: "leetcode" },
  "Maximum Depth of Binary Tree": { url: "https://leetcode.com/problems/maximum-depth-of-binary-tree", platform: "leetcode" },
  "Diameter of Binary Tree": { url: "https://leetcode.com/problems/diameter-of-binary-tree", platform: "leetcode" },
  "Balanced Binary Tree": { url: "https://leetcode.com/problems/balanced-binary-tree", platform: "leetcode" },
  "Lowest Common Ancestor of a Binary Tree": { url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree", platform: "leetcode" },
  "Same Tree": { url: "https://leetcode.com/problems/same-tree", platform: "leetcode" },
  "Binary Tree Zigzag Level Order Traversal": { url: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal", platform: "leetcode" },
  "Boundary Traversal of Binary Tree": { url: "https://www.geeksforgeeks.org/problems/boundary-traversal-of-binary-tree/1", platform: "gfg" },
  "Symmetric Tree": { url: "https://leetcode.com/problems/symmetric-tree", platform: "leetcode" },
  "Construct Binary Tree from Preorder and Inorder Traversal": { url: "https://leetcode.com/problems/construct-binary-tree-from-inorder-and-preorder-traversal", platform: "leetcode" },
  "Construct Binary Tree from Inorder and Postorder Traversal": { url: "https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal", platform: "leetcode" },
  "Flatten Binary Tree to Linked List": { url: "https://leetcode.com/problems/flatten-binary-tree-to-linked-list", platform: "leetcode" },
  "Convert Binary Search Tree to Sorted Doubly Linked List": { url: "https://leetcode.com/problems/convert-binary-search-tree-to-sorted-doubly-linked-list", platform: "leetcode" },
  "Detect a cycle in Linked List": { url: "https://leetcode.com/problems/linked-list-cycle", platform: "leetcode" },
  "Reverse a LinkedList in groups of size k": { url: "https://leetcode.com/problems/reverse-nodes-in-k-group", platform: "leetcode" },
};

export const getPlatformLink = (problemName: string): PlatformLink | null =>
  platformMap[problemName] ?? null;

export interface Accent {
  bg: string; border: string; text: string; icon: string;
  glow: string; bar: string; hoverBorder: string;
  stripe: string; ring: string;
}

export const topicAccents: Record<string, Accent> = {
  arrays:        { bg: "bg-blue-50",    border: "border-blue-200/80",    text: "text-blue-600",    icon: "text-blue-600",    glow: "from-blue-400/25",    bar: "from-blue-400 to-blue-500",       hoverBorder: "hover:border-blue-300",    stripe: "bg-blue-500",    ring: "ring-blue-500/20" },
  "linked-list": { bg: "bg-violet-50",  border: "border-violet-200/80",  text: "text-violet-600",  icon: "text-violet-600",  glow: "from-violet-400/25",  bar: "from-violet-400 to-violet-500",   hoverBorder: "hover:border-violet-300",  stripe: "bg-violet-500",  ring: "ring-violet-500/20" },
  trees:         { bg: "bg-emerald-50", border: "border-emerald-200/80", text: "text-emerald-600", icon: "text-emerald-600", glow: "from-emerald-400/25", bar: "from-emerald-400 to-emerald-500", hoverBorder: "hover:border-emerald-300", stripe: "bg-emerald-500", ring: "ring-emerald-500/20" },
  bst:           { bg: "bg-teal-50",    border: "border-teal-200/80",    text: "text-teal-600",    icon: "text-teal-600",    glow: "from-teal-400/25",    bar: "from-teal-400 to-teal-500",       hoverBorder: "hover:border-teal-300",    stripe: "bg-teal-500",    ring: "ring-teal-500/20" },
  graph:         { bg: "bg-orange-50",  border: "border-orange-200/80",  text: "text-orange-600",  icon: "text-orange-600",  glow: "from-orange-400/25",  bar: "from-orange-400 to-orange-500",   hoverBorder: "hover:border-orange-300",  stripe: "bg-orange-500",  ring: "ring-orange-500/20" },
  dp:            { bg: "bg-rose-50",    border: "border-rose-200/80",    text: "text-rose-600",    icon: "text-rose-600",    glow: "from-rose-400/25",    bar: "from-rose-400 to-rose-500",       hoverBorder: "hover:border-rose-300",    stripe: "bg-rose-500",    ring: "ring-rose-500/20" },
  recursion:     { bg: "bg-amber-50",   border: "border-amber-200/80",   text: "text-amber-600",   icon: "text-amber-600",   glow: "from-amber-400/25",   bar: "from-amber-400 to-amber-500",     hoverBorder: "hover:border-amber-300",   stripe: "bg-amber-500",   ring: "ring-amber-500/20" },
};

import {
  ArrayIcon,
  LinkedListIcon,
  BinaryTreeIcon,
  BSTIcon,
  GraphIcon,
  DPIcon,
  RecursionIcon,
} from "@/components/dsa-icons";

export const topicConfigurations = [
  {
    key: "arrays",
    title: "Arrays",
    description: "Patterns on arrays, matrix operations, and prefix tricks.",
    icon: ArrayIcon,
    matches: (sectionName: string) => sectionName.startsWith("Arrays"),
  },
  {
    key: "linked-list",
    title: "Linked List",
    description: "Pointer manipulation, reversal, merge, and cycle detection.",
    icon: LinkedListIcon,
    matches: (sectionName: string) =>
      sectionName.startsWith("Linked List") ||
      sectionName === "Linked List and Arrays",
  },
  {
    key: "trees",
    title: "Trees",
    description: "Traversals, views, BSTs, and reconstruction techniques.",
    icon: BinaryTreeIcon,
    matches: (sectionName: string) => sectionName.includes("Binary Tree"),
  },
  {
    key: "bst",
    title: "Binary Search Tree",
    description: "Ordered tree logic, floor/ceil, iterators, and Kth queries.",
    icon: BSTIcon,
    matches: (sectionName: string) => sectionName.includes("Binary Search Tree"),
  },
  {
    key: "graph",
    title: "Graph",
    description: "Traversal, cycle checks, shortest paths, and MST.",
    icon: GraphIcon,
    matches: (sectionName: string) => sectionName.startsWith("Graph"),
  },
  {
    key: "dp",
    title: "Dynamic Programming",
    description: "State transitions, optimization, and memoization patterns.",
    icon: DPIcon,
    matches: (sectionName: string) => sectionName.startsWith("Dynamic Programming"),
  },
  {
    key: "recursion",
    title: "Recursion",
    description: "Subsets, combinations, backtracking, and search trees.",
    icon: RecursionIcon,
    matches: (sectionName: string) =>
      sectionName.startsWith("Recursion") || sectionName === "Trie",
  },
];

export const defaultAccent: Accent = { bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-600", icon: "text-slate-600", glow: "from-slate-500/10", bar: "from-slate-400 to-slate-500", hoverBorder: "hover:border-slate-300", stripe: "bg-slate-400", ring: "ring-slate-500/20" };

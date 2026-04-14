"use client";

import Link from "next/link";
import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  Clock,
  Command,
  Filter,
  Layers,
  ListChecks,
  Play,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ArrayIcon,
  LinkedListIcon,
  BinaryTreeIcon,
  BSTIcon,
  GraphIcon,
  DPIcon,
  RecursionIcon,
  LeetCodeIcon,
  GFGIcon,
} from "@/components/dsa-icons";

export const sections = [
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
      "Binary Tree Level Order Traversal",
      "Maximum Depth of Binary Tree",
    ],
  },
  {
    name: "Binary Tree Part-II",
    solved: 0,
    problems: [
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
  {
    name: "Binary Search Tree",
    solved: 0,
    problems: [
      "Populate Next Right pointers of Tree",
      "Search given Key in BST",
      "Construct BST from given keys",
      "Construct BST from preorder traversal",
      "Check is a BT is BST or not",
      "Find LCA of two nodes in BST",
      "Find the inorder predecessor/successor of a given Key in BST",
    ],
  },
  {
    name: "Binary Search Tree Part-II",
    solved: 0,
    problems: [
      "Floor in a BST",
      "Ceil in a BST",
      "Find K-th smallest element in BST",
      "Find K-th largest element in BST",
      "Find a pair with a given sum in BST",
      "BST iterator",
      "Size of largest BST in a Binary Tree",
      "Serialize and deserialize Binary Tree",
    ],
  },
  {
    name: "Graph",
    solved: 0,
    problems: [
      "Clone a graph",
      "DFS",
      "BFS",
      "Detect A cycle in Undirected Graph using BFS",
      "Detect A cycle in Undirected Graph using DFS",
      "Detect A cycle in a Directed Graph using DFS",
      "Detect A cycle in a Directed Graph using BFS",
      "Topological Sort BFS",
      "Topological Sort DFS",
      "Number of islands (Do in Grid and Graph Both)",
      "Bipartite Check using BFS",
      "Bipartite Check using DFS",
      "Flood-fill Algorithm",
    ],
  },
  {
    name: "Graph Part-II",
    solved: 0,
    problems: [
      "Strongly Connected Component (Kosaraju's Algo)",
      "Dijkstra's Algorithm",
      "Bellman-Ford Algo",
      "Floyd Warshall Algorithm",
      "MST using Prim's Algo",
      "MST using Kruskal's Algo",
    ],
  },
  {
    name: "Dynamic Programming",
    solved: 0,
    problems: [
      "Max Product Subarray",
      "Longest Increasing Subsequence",
      "Longest Common Subsequence",
      "0-1 Knapsack",
      "Edit Distance",
      "Maximum sum increasing subsequence",
      "Matrix Chain Multiplication",
    ],
  },
  {
    name: "Dynamic Programming Part-II",
    solved: 0,
    problems: [
      "Minimum sum path in the matrix (up to down)",
      "Coin change",
      "Subset Sum",
      "Rod Cutting",
      "Egg Dropping",
      "Word Break",
      "Palindrome Partitioning (MCM Variation)",
      "Maximum profit in Job scheduling",
    ],
  },
  {
    name: "Trie",
    solved: 0,
    problems: [
      "Implement Trie (Prefix Tree)",
      "Implement Trie II",
      "Longest String with All Prefixes",
      "Number of Distinct Substrings in a String",
      "Power Set",
      "Maximum XOR of two numbers in an array",
      "Maximum XOR With an Element From Array",
    ],
  },
];

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

type ViewMode = "topics" | "sheet";

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const getProblemHref = (sectionName: string, problemName: string) => {
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

  if (sectionName === "Binary Tree" && problemName === "Binary Tree Level Order Traversal") {
    return "/problems/binary-tree/level-order-traversal";
  }

  if (sectionName === "Binary Tree" && problemName === "Maximum Depth of Binary Tree") {
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

  return null;
};

/* ─── Guide href mapping ─── */
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

/* ─── Platform link mapping ─── */
interface PlatformLink {
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
  "Construct Binary Tree from Preorder and Inorder Traversal": { url: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal", platform: "leetcode" },
  "Construct Binary Tree from Inorder and Postorder Traversal": { url: "https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal", platform: "leetcode" },
  "Flatten Binary Tree to Linked List": { url: "https://leetcode.com/problems/flatten-binary-tree-to-linked-list", platform: "leetcode" },
  "Convert Binary Search Tree to Sorted Doubly Linked List": { url: "https://leetcode.com/problems/convert-binary-search-tree-to-sorted-doubly-linked-list", platform: "leetcode" },
};

export const getPlatformLink = (problemName: string): PlatformLink | null =>
  platformMap[problemName] ?? null;

/* ─── Colour system ─── */
interface Accent {
  bg: string; border: string; text: string; icon: string;
  glow: string; bar: string; hoverBorder: string;
  stripe: string; ring: string;
}
const topicAccents: Record<string, Accent> = {
  arrays:        { bg: "bg-blue-50",    border: "border-blue-200/80",    text: "text-blue-600",    icon: "text-blue-600",    glow: "from-blue-400/25",    bar: "from-blue-400 to-blue-500",       hoverBorder: "hover:border-blue-300",    stripe: "bg-blue-500",    ring: "ring-blue-500/20" },
  "linked-list": { bg: "bg-violet-50",  border: "border-violet-200/80",  text: "text-violet-600",  icon: "text-violet-600",  glow: "from-violet-400/25",  bar: "from-violet-400 to-violet-500",   hoverBorder: "hover:border-violet-300",  stripe: "bg-violet-500",  ring: "ring-violet-500/20" },
  trees:         { bg: "bg-emerald-50", border: "border-emerald-200/80", text: "text-emerald-600", icon: "text-emerald-600", glow: "from-emerald-400/25", bar: "from-emerald-400 to-emerald-500", hoverBorder: "hover:border-emerald-300", stripe: "bg-emerald-500", ring: "ring-emerald-500/20" },
  bst:           { bg: "bg-teal-50",    border: "border-teal-200/80",    text: "text-teal-600",    icon: "text-teal-600",    glow: "from-teal-400/25",    bar: "from-teal-400 to-teal-500",       hoverBorder: "hover:border-teal-300",    stripe: "bg-teal-500",    ring: "ring-teal-500/20" },
  graph:         { bg: "bg-orange-50",  border: "border-orange-200/80",  text: "text-orange-600",  icon: "text-orange-600",  glow: "from-orange-400/25",  bar: "from-orange-400 to-orange-500",   hoverBorder: "hover:border-orange-300",  stripe: "bg-orange-500",  ring: "ring-orange-500/20" },
  dp:            { bg: "bg-rose-50",    border: "border-rose-200/80",    text: "text-rose-600",    icon: "text-rose-600",    glow: "from-rose-400/25",    bar: "from-rose-400 to-rose-500",       hoverBorder: "hover:border-rose-300",    stripe: "bg-rose-500",    ring: "ring-rose-500/20" },
  recursion:     { bg: "bg-amber-50",   border: "border-amber-200/80",   text: "text-amber-600",   icon: "text-amber-600",   glow: "from-amber-400/25",   bar: "from-amber-400 to-amber-500",     hoverBorder: "hover:border-amber-300",   stripe: "bg-amber-500",   ring: "ring-amber-500/20" },
};
const defaultAccent: Accent = { bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-600", icon: "text-slate-600", glow: "from-slate-500/10", bar: "from-slate-400 to-slate-500", hoverBorder: "hover:border-slate-300", stripe: "bg-slate-400", ring: "ring-slate-500/20" };

export default function ProblemsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("topics");
  const [searchQuery, setSearchQuery] = useState("");
  const [openSections, setOpenSections] = useState<string[]>([sections[0].name]);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const totalProblems = useMemo(
    () => sections.reduce((sum, s) => sum + s.problems.length, 0),
    [],
  );
  const totalSolved = useMemo(
    () => sections.reduce((sum, s) => sum + s.solved, 0),
    [],
  );
  const totalLive = useMemo(
    () =>
      sections.reduce(
        (sum, s) =>
          sum + s.problems.filter((p) => getProblemHref(s.name, p) !== null).length,
        0,
      ),
    [],
  );

  const toggleSection = useCallback((name: string) => {
    setOpenSections((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  }, []);

  const topicCollections = useMemo(
    () =>
      topicConfigurations.map((topic) => {
        const sectionItems = sections.filter((s) => topic.matches(s.name));
        const problems = sectionItems.flatMap((s) =>
          s.problems.map((p) => ({
            sectionName: s.name,
            problem: p,
            href: getProblemHref(s.name, p),
          })),
        );
        const liveCount = problems.filter((i) => Boolean(i.href)).length;
        const solved = sectionItems.reduce((sum, s) => sum + s.solved, 0);
        const total = problems.length;
        return {
          ...topic,
          sectionsCount: sectionItems.length,
          solved,
          total,
          liveCount,
          progress: total === 0 ? 0 : Math.round((solved / total) * 100),
          problems,
        };
      }),
    [],
  );

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase();
    return sections
      .map((s) => ({
        ...s,
        problems: s.problems.filter((p) => p.toLowerCase().includes(q)),
      }))
      .filter((s) => s.problems.length > 0);
  }, [searchQuery]);

  const featured = topicCollections.reduce((best, t) =>
    t.liveCount > best.liveCount ? t : best,
  );

  return (
    <div className="space-y-8">
      {/* ═══ HERO ═══ */}
      <header className="relative isolate overflow-hidden rounded-2xl border border-slate-200/50 bg-white">
        {/* Dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "radial-gradient(circle, #94a3b8 0.8px, transparent 0.8px)",
            backgroundSize: "20px 20px",
          }}
        />
        {/* Gradient blobs */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gradient-to-br from-sky-300/25 via-indigo-300/15 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-60 w-60 rounded-full bg-gradient-to-tr from-emerald-300/20 via-teal-200/10 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-96 -translate-x-1/2 bg-gradient-to-b from-violet-200/10 to-transparent blur-2xl" />
        {/* Top accent stripe */}
        <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500 opacity-80" />

        <div className="relative px-6 pb-7 pt-10 sm:px-8 sm:pt-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white shadow-lg shadow-slate-900/20">
                <Zap size={10} strokeWidth={2.5} aria-hidden="true" className="text-amber-400" />
                Interview Prep
              </div>

              <h1 className="text-[clamp(28px,3vw,42px)] font-extrabold leading-[1.08] tracking-[-0.035em] text-slate-900">
                Problem<br />
                <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent">
                  Collection
                </span>
              </h1>

              <p className="text-[15px] leading-relaxed text-slate-500">
                <span className="font-semibold text-slate-700">{totalProblems}</span> problems across{" "}
                <span className="font-semibold text-slate-700">{topicConfigurations.length}</span> topics.
                Dive into interactive visualizers and structured learning paths.
              </p>
            </div>

            {/* Stat blocks */}
            <div className="flex shrink-0 items-stretch gap-3">
              <StatBlock label="Total" value={totalProblems} sub="problems" />
              <StatBlock label="Solved" value={totalSolved} sub={`of ${totalProblems}`} accent="emerald" />
              <StatBlock label="Live" value={totalLive} sub="visualizers" accent="sky" />
            </div>
          </div>

          {/* Search + view toggle */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative block w-full max-w-lg">
              <Search
                size={16}
                strokeWidth={2}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search problems..."
                className="h-11 w-full rounded-xl border border-slate-200/80 bg-white pl-11 pr-20 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 sm:inline-flex">
                <Command size={10} strokeWidth={2} aria-hidden="true" />K
              </kbd>
            </label>

            <div className="inline-flex items-center self-start rounded-xl border border-slate-200/80 bg-white p-1 shadow-sm">
              {(
                [
                  { key: "topics" as const, label: "Topics", icon: Layers },
                  { key: "sheet" as const, label: "All Sections", icon: ListChecks },
                ] as const
              ).map((tab) => {
                const TabIcon = tab.icon;
                const active = viewMode === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setViewMode(tab.key)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all",
                      active
                        ? "bg-slate-900 text-white shadow-lg shadow-slate-900/15"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700",
                    )}
                  >
                    <TabIcon size={13} strokeWidth={2} aria-hidden="true" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* ═══ FEATURED TOPIC ═══ */}
      {viewMode === "topics" && !searchQuery.trim() && (
        <FeaturedTopicCard topic={featured} accent={topicAccents[featured.key] ?? defaultAccent} />
      )}

      {/* ═══ TOPIC CARDS / SECTION VIEW ═══ */}
      {viewMode === "topics" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {topicCollections
            .filter((t) => {
              if (searchQuery.trim()) {
                return t.problems.some((p) =>
                  p.problem.toLowerCase().includes(searchQuery.toLowerCase()),
                );
              }
              return t.key !== featured.key;
            })
            .map((topic) => {
              const Icon = topic.icon;
              const accent = topicAccents[topic.key] ?? defaultAccent;
              return (
                <Link
                  key={topic.key}
                  href={`/problems/topics/${topic.key}`}
                  className={cn(
                    "group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]",
                    accent.hoverBorder,
                  )}
                >
                  {/* Left accent stripe */}
                  <div className={cn("absolute bottom-0 left-0 top-0 w-[3px] rounded-l-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100", accent.stripe)} />
                  {/* Background glow */}
                  <div className={cn("pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100", accent.glow)} />

                  <div className="relative flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={cn(
                          "inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200 group-hover:shadow-lg group-hover:ring-4",
                          accent.bg, accent.border, accent.icon, accent.ring,
                        )}
                      >
                        <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                      </span>
                      <div className="flex items-center gap-2">
                        {topic.liveCount > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                            <Zap size={8} strokeWidth={2.5} aria-hidden="true" />
                            {topic.liveCount}
                          </span>
                        )}
                        <span className="rounded-full border border-slate-200/80 bg-slate-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.05em] text-slate-500">
                          {topic.sectionsCount}s
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h3 className="text-[17px] font-bold tracking-tight text-slate-900">
                        {topic.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-slate-500">
                        {topic.description}
                      </p>
                    </div>

                    <div className="mt-auto pt-5">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                        <span className="tabular-nums">{topic.solved}/{topic.total}</span>
                        <span className="tabular-nums">{topic.progress}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out", accent.bar)}
                          style={{ width: `${Math.max(topic.progress, 2)}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-xs font-semibold text-slate-400 transition-colors group-hover:text-slate-600">
                        Explore topic
                      </span>
                      <span className={cn(
                        "inline-flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200",
                        "bg-slate-100 text-slate-400 group-hover:bg-slate-900 group-hover:text-white group-hover:shadow-lg",
                      )}>
                        <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-400">
              {filteredSections.length} {filteredSections.length === 1 ? "section" : "sections"}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setOpenSections(filteredSections.map((s) => s.name))}
                className="rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                Expand all
              </button>
              <span className="text-slate-300">&middot;</span>
              <button
                type="button"
                onClick={() => setOpenSections([])}
                className="rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                Collapse all
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {filteredSections.map((section, sIdx) => {
              const isOpen = openSections.includes(section.name);
              const panelId = `section-panel-${sIdx}`;
              const progress =
                section.problems.length === 0
                  ? 0
                  : Math.round((section.solved / section.problems.length) * 100);
              const liveCt = section.problems.filter(
                (p) => getProblemHref(section.name, p) !== null,
              ).length;

              return (
                <article
                  key={section.name}
                  className={cn(
                    "overflow-hidden rounded-xl border bg-white transition-shadow",
                    isOpen ? "border-slate-200 shadow-sm" : "border-slate-200/60",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleSection(section.name)}
                    className="group flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-slate-50/60"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                  >
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold tabular-nums text-slate-500 transition group-hover:bg-slate-200/80">
                      {sIdx + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-[15px] font-semibold text-slate-800">
                        {section.name}
                      </h2>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      {liveCt > 0 && (
                        <span className="hidden items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white sm:inline-flex">
                          {liveCt} live
                        </span>
                      )}
                      <div className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-slate-100 sm:block md:w-28">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-slate-300 to-slate-400 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="w-[52px] text-right text-xs font-semibold tabular-nums text-slate-400">
                        {section.solved}/{section.problems.length}
                      </span>
                      <ChevronDown
                        size={14}
                        strokeWidth={2.2}
                        className={cn(
                          "shrink-0 text-slate-400 transition-transform duration-200",
                          isOpen ? "rotate-0" : "-rotate-90",
                        )}
                        aria-hidden="true"
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      id={panelId}
                      className="border-t border-slate-100 bg-slate-50/40 px-5 py-4"
                    >
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {section.problems.map((problem, pIdx) => {
                          const href = getProblemHref(section.name, problem);
                          const isLive = href !== null;
                          const guideHref = getGuideHref(problem);
                          const platform = getPlatformLink(problem);

                          if (isLive) {
                            return (
                              <div
                                key={problem}
                                className="group/card flex items-center gap-2.5 rounded-lg border border-slate-200/80 bg-white px-3 py-2.5 transition-all hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-100/50"
                              >
                                <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 px-1 text-[11px] font-bold tabular-nums text-emerald-600">
                                  {pIdx + 1}
                                </span>
                                <span className="flex-1 truncate text-[13px] font-medium text-slate-700">
                                  {problem}
                                </span>
                                <div className="flex shrink-0 items-center gap-1">
                                  <Link href={href} title="Visualizer" className="inline-flex h-6 w-6 items-center justify-center rounded border border-emerald-200 bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100">
                                    <Play size={11} strokeWidth={2.5} aria-hidden="true" />
                                  </Link>
                                  {guideHref && (
                                    <Link href={guideHref} title="Learn" className="inline-flex h-6 w-6 items-center justify-center rounded border border-sky-200 bg-sky-50 text-sky-600 transition hover:bg-sky-100">
                                      <BookOpen size={11} strokeWidth={2.5} aria-hidden="true" />
                                    </Link>
                                  )}
                                  {platform && (
                                    <a href={platform.url} target="_blank" rel="noopener noreferrer" title={platform.platform === "leetcode" ? "LeetCode" : "GeeksforGeeks"} className="inline-flex h-6 w-6 items-center justify-center rounded border border-slate-200 bg-slate-50 transition hover:bg-slate-100">
                                      {platform.platform === "leetcode" ? <LeetCodeIcon size={12} aria-hidden="true" /> : <GFGIcon size={12} aria-hidden="true" />}
                                    </a>
                                  )}
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div
                              key={problem}
                              className="flex items-center gap-2.5 rounded-lg border border-dashed border-slate-200/80 bg-white/50 px-3 py-2.5"
                            >
                              <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-md border border-slate-200 bg-slate-50 px-1 text-[11px] font-bold tabular-nums text-slate-400">
                                {pIdx + 1}
                              </span>
                              <span className="flex-1 truncate text-[13px] font-medium text-slate-500">
                                {problem}
                              </span>
                              <div className="flex shrink-0 items-center gap-1">
                                {platform && (
                                  <a href={platform.url} target="_blank" rel="noopener noreferrer" title={platform.platform === "leetcode" ? "LeetCode" : "GeeksforGeeks"} className="inline-flex h-6 w-6 items-center justify-center rounded border border-slate-200 bg-slate-50 transition hover:bg-slate-100">
                                    {platform.platform === "leetcode" ? <LeetCodeIcon size={12} aria-hidden="true" /> : <GFGIcon size={12} aria-hidden="true" />}
                                  </a>
                                )}
                                <Clock size={11} strokeWidth={2} className="shrink-0 text-slate-300" aria-hidden="true" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {filteredSections.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Filter size={20} strokeWidth={1.5} className="text-slate-400" aria-hidden="true" />
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-700">No matching sections</p>
              <p className="mt-1 text-xs text-slate-400">
                Try a different search term or clear the filter.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══ FEATURED TOPIC — wide highlighted card ═══ */
function FeaturedTopicCard({ topic, accent }: {
  topic: {
    key: string; title: string; description: string;
    icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
    liveCount: number; solved: number; total: number; progress: number; sectionsCount: number;
    problems: { sectionName: string; problem: string; href: string | null }[];
  };
  accent: Accent;
}) {
  const Icon = topic.icon;
  const topProblems = topic.problems.filter((p) => p.href).slice(0, 5);

  return (
    <Link
      href={`/problems/topics/${topic.key}`}
      className={cn(
        "group relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-6 transition-all duration-200 hover:shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8 lg:flex-row lg:items-center lg:gap-10",
        accent.hoverBorder,
      )}
    >
      <div className={cn("pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br to-transparent blur-3xl", accent.glow)} />
      <div className={cn("pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-tr to-transparent opacity-50 blur-2xl", accent.glow)} />

      <div className="relative flex-1 space-y-4">
        <div className="flex items-center gap-3">
          <span className={cn(
            "inline-flex h-12 w-12 items-center justify-center rounded-2xl border transition-all group-hover:shadow-lg group-hover:ring-4",
            accent.bg, accent.border, accent.icon, accent.ring,
          )}>
            <Icon size={24} strokeWidth={1.6} aria-hidden="true" />
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-amber-900 shadow-sm">
            <Sparkles size={9} strokeWidth={2.5} aria-hidden="true" />
            Featured
          </span>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[28px]">
            {topic.title}
          </h2>
          <p className="mt-2 max-w-md text-[14px] leading-relaxed text-slate-500">
            {topic.description} — {topic.liveCount} interactive visualizers ready to explore.
          </p>
        </div>

        <div className="flex items-center gap-5">
          <div>
            <p className="text-2xl font-extrabold tabular-nums text-slate-900">{topic.total}</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">Problems</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <p className="text-2xl font-extrabold tabular-nums text-emerald-600">{topic.liveCount}</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">Live</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <p className="text-2xl font-extrabold tabular-nums text-slate-900">{topic.sectionsCount}</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">Sections</p>
          </div>
        </div>
      </div>

      {topProblems.length > 0 && (
        <div className="relative w-full shrink-0 lg:w-72">
          <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.06em] text-slate-400">
            Top problems
          </p>
          <div className="space-y-1.5">
            {topProblems.map((p, i) => (
              <div
                key={p.problem}
                className="flex items-center gap-2.5 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2 transition group-hover:border-slate-200 group-hover:bg-white"
              >
                <span className={cn(
                  "inline-flex h-5 min-w-[20px] items-center justify-center rounded text-[10px] font-bold tabular-nums",
                  accent.bg, accent.text,
                )}>
                  {i + 1}
                </span>
                <span className="flex-1 truncate text-[12px] font-medium text-slate-600">
                  {p.problem}
                </span>
                <ArrowUpRight size={11} strokeWidth={2} className="shrink-0 text-slate-400" aria-hidden="true" />
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition group-hover:text-slate-700">
            View all {topic.total} problems
            <ArrowRight size={12} strokeWidth={2} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </div>
        </div>
      )}
    </Link>
  );
}

/* ─── Stat block for hero ─── */
function StatBlock({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: number;
  sub: string;
  accent?: "emerald" | "sky";
}) {
  const valueColor = accent === "emerald"
    ? "text-emerald-600"
    : accent === "sky"
      ? "text-sky-600"
      : "text-slate-900";

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200/60 bg-white/80 px-5 py-3.5 backdrop-blur-sm">
      <p className={cn("text-2xl font-extrabold tabular-nums tracking-tight", valueColor)}>
        {value}
      </p>
      <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
        {label}
      </p>
      <p className="text-[9px] font-medium text-slate-300">
        {sub}
      </p>
    </div>
  );
}

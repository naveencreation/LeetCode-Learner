"use client";

import Link from "next/link";
import { type ReactNode, useMemo, useState } from "react";
import {
  BarChart3,
  ChevronRight,
  Database,
  Gauge,
  GitBranch,
  Link2,
  Network,
  Search,
  Sigma,
  Sparkles,
  Target,
  Trees,
} from "lucide-react";

const stats = {
  totalSolved: 0,
  easySolved: 0,
  easyTotal: 25,
  mediumSolved: 0,
  mediumTotal: 93,
  hardSolved: 0,
  hardTotal: 73,
};

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
      "Inorder Traversal",
      "Preorder Traversal",
      "Postorder Traversal",
      "LeftView Of Binary Tree",
      "Bottom View of Binary Tree",
      "Top View of Binary Tree",
      "Preorder Inorder Postorder in a single traversal",
      "Vertical order traversal",
      "Root to node path in a Binary Tree",
      "Max width of a Binary Tree",
      "Level order Traversal",
      "Height of a Binary Tree",
    ],
  },
  {
    name: "Binary Tree Part-II",
    solved: 0,
    problems: [
      "Diameter of Binary Tree",
      "Balanced Binary Tree",
      "LCA in Binary Tree",
      "Check if two trees are identical or not",
      "Zig Zag Traversal of Binary Tree",
      "Boundary Traversal of Binary Tree",
      "Symmetric Binary Tree",
      "Construct Binary Tree from inorder and preorder",
    ],
  },
  {
    name: "Binary Tree Part-III",
    solved: 0,
    problems: [
      "Construct Binary Tree from Inorder and Postorder",
      "Flatten Binary Tree to LinkedList",
      "Binary Tree to Double Linked List",
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
    icon: Database,
    matches: (sectionName: string) => sectionName.startsWith("Arrays"),
  },
  {
    key: "linked-list",
    title: "Linked List",
    description: "Pointer manipulation, reversal, merge, and cycle detection.",
    icon: Link2,
    matches: (sectionName: string) =>
      sectionName.startsWith("Linked List") ||
      sectionName === "Linked List and Arrays",
  },
  {
    key: "trees",
    title: "Trees",
    description: "Traversals, views, BSTs, and reconstruction techniques.",
    icon: Trees,
    matches: (sectionName: string) => sectionName.includes("Binary Tree"),
  },
  {
    key: "bst",
    title: "Binary Search Tree",
    description: "Ordered tree logic, floor/ceil, iterators, and Kth queries.",
    icon: Search,
    matches: (sectionName: string) => sectionName.includes("Binary Search Tree"),
  },
  {
    key: "graph",
    title: "Graph",
    description: "Traversal, cycle checks, shortest paths, and MST.",
    icon: Network,
    matches: (sectionName: string) => sectionName.startsWith("Graph"),
  },
  {
    key: "dp",
    title: "Dynamic Programming",
    description: "State transitions, optimization, and memoization patterns.",
    icon: Sigma,
    matches: (sectionName: string) => sectionName.startsWith("Dynamic Programming"),
  },
  {
    key: "recursion",
    title: "Recursion",
    description: "Subsets, combinations, backtracking, and search trees.",
    icon: GitBranch,
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
  if (sectionName === "Binary Tree" && problemName === "Inorder Traversal") {
    return "/problems/binary-tree/inorder-traversal";
  }

  if (sectionName === "Binary Tree" && problemName === "Preorder Traversal") {
    return "/problems/binary-tree/preorder-traversal";
  }

  if (sectionName === "Binary Tree" && problemName === "Postorder Traversal") {
    return "/problems/binary-tree/postorder-traversal";
  }

  if (sectionName === "Binary Tree" && problemName === "LeftView Of Binary Tree") {
    return "/problems/binary-tree/leftview-of-binary-tree";
  }

  if (sectionName === "Binary Tree" && problemName === "Bottom View of Binary Tree") {
    return "/problems/binary-tree/bottom-view-of-binary-tree";
  }

  if (sectionName === "Binary Tree" && problemName === "Top View of Binary Tree") {
    return "/problems/binary-tree/top-view-of-binary-tree";
  }

  if (sectionName === "Binary Tree Part-II" && problemName === "Diameter of Binary Tree") {
    return "/problems/binary-tree/diameter-of-binary-tree";
  }

  if (sectionName === "Binary Tree Part-II" && problemName === "Balanced Binary Tree") {
    return "/problems/binary-tree/balanced-binary-tree";
  }

  if (sectionName === "Binary Tree Part-II" && problemName === "LCA in Binary Tree") {
    return "/problems/binary-tree/lca-in-binary-tree";
  }

  if (sectionName === "Binary Tree Part-II" && problemName === "Zig Zag Traversal of Binary Tree") {
    return "/problems/binary-tree/zigzag-level-order-traversal";
  }

  if (sectionName === "Binary Tree Part-II" && problemName === "Check if two trees are identical or not") {
    return "/problems/binary-tree/same-tree";
  }

  if (sectionName === "Binary Tree Part-II" && problemName === "Symmetric Binary Tree") {
    return "/problems/binary-tree/symmetric-tree";
  }

  if (sectionName === "Binary Tree Part-II" && problemName === "Boundary Traversal of Binary Tree") {
    return "/problems/binary-tree/boundary-of-binary-tree";
  }

  if (sectionName === "Binary Tree Part-II" && problemName === "Construct Binary Tree from inorder and preorder") {
    return "/problems/binary-tree/construct-binary-tree-from-inorder-and-preorder";
  }

  if (sectionName === "Binary Tree Part-III" && problemName === "Construct Binary Tree from Inorder and Postorder") {
    return "/problems/binary-tree/construct-binary-tree-from-inorder-and-postorder";
  }

  if (sectionName === "Binary Tree Part-III" && problemName === "Flatten Binary Tree to LinkedList") {
    return "/problems/binary-tree/flatten-binary-tree-to-linkedlist";
  }

  if (sectionName === "Binary Tree Part-III" && problemName === "Binary Tree to Double Linked List") {
    return "/problems/binary-tree/convert-bst-to-sorted-doubly-linked-list";
  }

  if (sectionName === "Binary Tree") {
    return `/problems/binary-tree/${toSlug(problemName)}`;
  }

  return null;
};

export default function ProblemsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("topics");
  const [openSections, setOpenSections] = useState<string[]>([sections[0].name]);

  const totalProblemsFromList = useMemo(
    () => sections.reduce((sum, section) => sum + section.problems.length, 0),
    [],
  );

  const overallProgress =
    totalProblemsFromList === 0
      ? 0
      : Math.round((stats.totalSolved / totalProblemsFromList) * 100);

  const toggleSection = (sectionName: string) => {
    setOpenSections((previous) =>
      previous.includes(sectionName)
        ? previous.filter((name) => name !== sectionName)
        : [...previous, sectionName],
    );
  };

  const expandAll = () => {
    setOpenSections(sections.map((section) => section.name));
  };

  const collapseAll = () => {
    setOpenSections([]);
  };

  const topicCollections = useMemo(
    () =>
      topicConfigurations.map((topic) => {
        const sectionItems = sections.filter((section) => topic.matches(section.name));
        const problems = sectionItems.flatMap((section) =>
          section.problems.map((problem) => ({
            sectionName: section.name,
            problem,
            href: getProblemHref(section.name, problem),
          })),
        );
        const liveCount = problems.filter((item) => Boolean(item.href)).length;
        const solved = sectionItems.reduce((sum, section) => sum + section.solved, 0);
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

  return (
    <section className="space-y-4">
      <header className="traversal-panel space-y-3 p-5">

        <h1 className="max-w-5xl text-[clamp(28px,2.5vw,40px)] font-extrabold leading-[1.06] tracking-[-0.03em] text-slate-900">
          Top Coding Interview Problems
        </h1>

        <p className="max-w-4xl text-sm leading-6 text-slate-600">
          A structured collection of high-signal DSA problems for interview prep.
          Explore by topic, track progress, and jump into interactive
          visualizers where available.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Overall Progress"
          value={`${overallProgress}%`}
          icon={<Gauge size={15} strokeWidth={2.2} aria-hidden="true" />}
          tone="sky"
        />
        <StatCard
          label="All Problems"
          value={`${stats.totalSolved}/${totalProblemsFromList}`}
          icon={<BarChart3 size={15} strokeWidth={2.2} aria-hidden="true" />}
          tone="slate"
        />
        <StatCard
          label="Easy"
          value={`${stats.easySolved}/${stats.easyTotal}`}
          icon={<Target size={15} strokeWidth={2.2} aria-hidden="true" />}
          tone="emerald"
        />
        <StatCard
          label="Medium"
          value={`${stats.mediumSolved}/${stats.mediumTotal}`}
          icon={<Target size={15} strokeWidth={2.2} aria-hidden="true" />}
          tone="amber"
        />
      </div>

      <div className="traversal-panel p-4">
        <div className="traversal-panel-header">
          <h2 className="traversal-panel-title text-rose-700">Hard</h2>
          <button
            type="button"
            className="traversal-pill inline-flex items-center gap-1.5 border-rose-200 bg-rose-50 text-rose-700 transition hover:bg-rose-100"
          >
            <Sparkles size={12} strokeWidth={2} aria-hidden="true" />
            Random Problem
          </button>
        </div>
        <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums">
          {stats.hardSolved}/{stats.hardTotal}
        </p>
      </div>

      <div className="sticky top-4 z-10 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-sm backdrop-blur">
        <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => setViewMode("topics")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-[0.04em] transition ${
              viewMode === "topics"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Topic Cards
          </button>
          <button
            type="button"
            onClick={() => setViewMode("sheet")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-[0.04em] transition ${
              viewMode === "sheet"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Section View
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={expandAll}
            className="traversal-pill transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={viewMode !== "sheet"}
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="traversal-pill transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={viewMode !== "sheet"}
          >
            Collapse All
          </button>
        </div>
      </div>

      {viewMode === "topics" ? (
        <>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {topicCollections.map((topic) => {
              const Icon = topic.icon;

              return (
                <Link
                  key={topic.key}
                  href={`/problems/topics/${topic.key}`}
                  className="traversal-panel group relative overflow-hidden p-4 text-left transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                >
                  <div className="pointer-events-none absolute right-0 top-0 h-20 w-24 bg-gradient-to-bl from-sky-100/80 to-transparent" />
                  <div className="relative">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-sky-200 bg-sky-50 text-sky-700">
                        <Icon size={16} strokeWidth={2.2} aria-hidden="true" />
                      </span>
                      <span className="traversal-pill border-slate-200 bg-slate-50 text-slate-600">
                        {topic.sectionsCount} sections
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold tracking-tight text-slate-900">
                      {topic.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                      {topic.description}
                    </p>

                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                        <span>Progress</span>
                        <span className="tabular-nums">{topic.solved}/{topic.total}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-500"
                          style={{ width: `${topic.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                        <span>{topic.liveCount} live visualizers</span>
                        <span>{topic.progress}% complete</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      ) : (
        <div className="traversal-panel overflow-hidden">
          <div className="divide-y">
            {sections.map((section, index) => {
              const isOpen = openSections.includes(section.name);
              const panelId = `section-${index}-${section.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "")}`;
              const sectionProgress =
                section.problems.length === 0
                  ? 0
                  : (section.solved / section.problems.length) * 100;

              return (
                <article key={section.name} className="overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection(section.name)}
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-slate-50 sm:px-5"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                  >
                    <ChevronRight
                      size={14}
                      strokeWidth={2}
                      className={`text-slate-500 transition-transform ${isOpen ? "rotate-90" : "rotate-0"}`}
                      aria-hidden="true"
                    />

                    <h2 className="text-[1rem] font-semibold leading-tight tracking-normal text-slate-900 sm:text-[1.08rem]">
                      {section.name}
                    </h2>

                    <div className="ml-auto flex items-center gap-3">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-200 sm:w-36 md:w-40">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-500"
                          style={{ width: `${sectionProgress}%` }}
                        />
                      </div>
                      <span className="w-[64px] whitespace-nowrap text-right text-sm font-semibold tabular-nums text-slate-500 sm:w-[72px] sm:text-base">
                        {section.solved} / {section.problems.length}
                      </span>
                    </div>
                  </button>

                  {isOpen ? (
                    <div
                      id={panelId}
                      className="border-t bg-slate-50/70 px-5 py-4 sm:px-6"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          Problem List
                        </p>
                        <p className="text-xs font-semibold text-slate-500">
                          {section.problems.length} total
                        </p>
                      </div>

                      <div className="grid gap-2 lg:grid-cols-2">
                        {section.problems.map((problem, problemIndex) => {
                          const href = getProblemHref(section.name, problem);

                          if (href) {
                            return (
                              <Link
                                key={problem}
                                href={href}
                                className="group flex w-full items-start gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-[0_8px_20px_rgba(15,23,42,0.08)]"
                              >
                                <span className="mt-0.5 inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-slate-200 bg-slate-50 px-1 text-xs font-semibold tabular-nums text-slate-500">
                                  {problemIndex + 1}
                                </span>
                                <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
                                  <span className="line-clamp-2 text-sm font-semibold leading-5 text-slate-800 transition group-hover:text-slate-900">
                                    {problem}
                                  </span>
                                  <span className="traversal-pill border-emerald-200 bg-emerald-50 text-[9px] text-emerald-700">
                                    Live
                                  </span>
                                </div>
                              </Link>
                            );
                          }

                          return (
                            <button
                              key={problem}
                              type="button"
                              className="group flex w-full items-start gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_8px_20px_rgba(15,23,42,0.08)]"
                            >
                              <span className="mt-0.5 inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-slate-200 bg-slate-50 px-1 text-xs font-semibold tabular-nums text-slate-500">
                                {problemIndex + 1}
                              </span>
                              <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
                                <span className="line-clamp-2 text-sm font-semibold leading-5 text-slate-800 transition group-hover:text-slate-900">
                                  {problem}
                                </span>
                                <span className="traversal-pill border-slate-200 bg-slate-100 text-[9px] text-slate-600">
                                  Planned
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  tone: "sky" | "slate" | "emerald" | "amber";
}) {
  const toneClasses = {
    sky: {
      card: "from-sky-50 to-white",
      badge: "border-sky-200 bg-sky-100 text-sky-700",
    },
    slate: {
      card: "from-slate-50 to-white",
      badge: "border-slate-200 bg-slate-100 text-slate-700",
    },
    emerald: {
      card: "from-emerald-50 to-white",
      badge: "border-emerald-200 bg-emerald-100 text-emerald-700",
    },
    amber: {
      card: "from-amber-50 to-white",
      badge: "border-amber-200 bg-amber-100 text-amber-700",
    },
  }[tone];

  return (
    <div
      className={`traversal-panel bg-gradient-to-br px-4 py-3 ${toneClasses.card}`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-600">{label}</p>
        <span
          className={`inline-flex h-7 w-7 items-center justify-center rounded-full border ${toneClasses.badge}`}
        >
          {icon}
        </span>
      </div>
      <p className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 tabular-nums">
        {value}
      </p>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const stats = {
  totalSolved: 0,
  easySolved: 0,
  easyTotal: 25,
  mediumSolved: 0,
  mediumTotal: 93,
  hardSolved: 0,
  hardTotal: 73,
};

const sections = [
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
      "Merge K sorted arrays",
      "K most frequent elements",
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
      "Check if the Binary tree is height-balanced or not",
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
      "Symmetric Binary Tree",
      "Flatten Binary Tree to LinkedList",
      "Check if Binary Tree is the mirror of itself",
      "Check for Children Sum Property",
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
    name: "Binary Trees [Miscellaneous]",
    solved: 0,
    problems: [
      "Binary Tree to Double Linked List",
      "Find median in a stream of running integers",
      "K-th largest element in a stream",
      "Distinct numbers in Window",
      "K-th largest element in an unsorted array",
      "Flood-fill Algorithm",
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

export default function ProblemsPage() {
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

  const toSlug = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const getProblemHref = (sectionName: string, problemName: string) => {
    if (sectionName === "Binary Tree" && problemName === "Inorder Traversal") {
      return "/problems/binary-tree/inorder-traversal";
    }

    if (sectionName === "Binary Tree" && problemName === "Preorder Traversal") {
      return "/problems/binary-tree/preorder-traversal";
    }

    if (sectionName === "Binary Tree" && problemName === "Postorder Traversal") {
      return "/problems/binary-tree/postorder-traversal";
    }

    if (sectionName === "Binary Tree") {
      return `/problems/binary-tree/${toSlug(problemName)}`;
    }

    return null;
  };

  return (
    <section className="space-y-5">
      <header className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">
          Strivers SDE Sheet - Top Coding Interview Problems
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: December 13, 2025
        </p>
        <p className="max-w-4xl text-sm text-muted-foreground">
          SDE Sheet contains handpicked coding interview problems from Data
          Structures and Algorithms. These are commonly asked across companies
          like Google, Amazon, Microsoft, and more.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Overall Progress" value={`${overallProgress}%`} />
        <StatCard
          label="All Problems"
          value={`${stats.totalSolved}/${totalProblemsFromList}`}
        />
        <StatCard
          label="Easy"
          value={`${stats.easySolved}/${stats.easyTotal}`}
        />
        <StatCard
          label="Medium"
          value={`${stats.mediumSolved}/${stats.mediumTotal}`}
        />
      </div>

      <div className="rounded-lg border bg-card px-4 py-3 shadow-sm">
        <p className="mb-2 text-sm font-medium text-muted-foreground">Hard</p>
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">
            {stats.hardSolved}/{stats.hardTotal}
          </p>
          <button
            type="button"
            className="rounded-md border px-3 py-1.5 text-sm font-medium transition hover:bg-muted"
          >
            Random Problem
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={expandAll}
          className="rounded-md border px-3 py-1.5 text-sm font-medium transition hover:bg-muted"
        >
          Expand All
        </button>
        <button
          type="button"
          onClick={collapseAll}
          className="rounded-md border px-3 py-1.5 text-sm font-medium transition hover:bg-muted"
        >
          Collapse All
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
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
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-muted/40 sm:px-5"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <span
                    className={`text-[11px] text-muted-foreground transition-transform sm:text-xs ${
                      isOpen ? "rotate-90" : "rotate-0"
                    }`}
                  >
                    ❯
                  </span>

                  <h2 className="text-[1rem] font-medium leading-tight tracking-normal text-foreground/90 sm:text-[1.08rem]">
                    {section.name}
                  </h2>

                  <div className="ml-auto flex items-center gap-3">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted/70 sm:w-36 md:w-40">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${sectionProgress}%` }}
                      />
                    </div>
                    <span className="w-[64px] whitespace-nowrap text-right text-sm font-medium tabular-nums text-muted-foreground sm:w-[72px] sm:text-base">
                      {section.solved} / {section.problems.length}
                    </span>
                  </div>
                </button>

                {isOpen ? (
                  <div
                    id={panelId}
                    className="border-t bg-muted/20 px-5 py-4 sm:px-6"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Problem List
                      </p>
                      <p className="text-xs font-medium text-muted-foreground">
                        {section.problems.length} total
                      </p>
                    </div>

                    <div className="grid gap-2 lg:grid-cols-2">
                      {section.problems.map((problem, problemIndex) => (
                        (() => {
                          const href = getProblemHref(section.name, problem);

                          if (href) {
                            return (
                              <Link
                                key={problem}
                                href={href}
                                className="group flex w-full items-start gap-3 rounded-lg border bg-card px-3 py-2.5 text-left transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"
                              >
                                <span className="mt-0.5 inline-flex h-6 min-w-6 items-center justify-center rounded-md border bg-muted px-1 text-xs font-semibold tabular-nums text-muted-foreground">
                                  {problemIndex + 1}
                                </span>
                                <span className="line-clamp-2 text-sm font-medium leading-5 text-foreground/90 transition group-hover:text-foreground">
                                  {problem}
                                </span>
                              </Link>
                            );
                          }

                          return (
                            <button
                              key={problem}
                              type="button"
                              className="group flex w-full items-start gap-3 rounded-lg border bg-card px-3 py-2.5 text-left transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"
                            >
                              <span className="mt-0.5 inline-flex h-6 min-w-6 items-center justify-center rounded-md border bg-muted px-1 text-xs font-semibold tabular-nums text-muted-foreground">
                                {problemIndex + 1}
                              </span>
                              <span className="line-clamp-2 text-sm font-medium leading-5 text-foreground/90 transition group-hover:text-foreground">
                                {problem}
                              </span>
                            </button>
                          );
                        })()
                      ))}
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card px-4 py-3 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-xl font-semibold">{value}</p>
    </div>
  );
}

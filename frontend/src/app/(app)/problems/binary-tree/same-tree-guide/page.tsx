"use client";

import Link from "next/link";

export default function SameTreeGuidePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-8 flex flex-wrap items-center gap-3">
        <Link 
          href="/problems/binary-tree/same-tree"
          className="rounded-full bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Open Visualizer
        </Link>
        <Link 
          href="/problems"
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Back to Problems
        </Link>
      </header>

      <section className="mb-10">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
          Binary Tree · Recursion · DFS
        </p>
        <h1 className="mb-4 text-4xl font-semibold text-slate-900">Same Tree</h1>
        <p className="text-lg text-slate-600">
          Given the roots of two binary trees p and q, check if they are structurally identical 
          and every corresponding node has the same value.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">Why This Works</h2>
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="mb-4 text-slate-700">
            The algorithm uses recursive DFS to compare both trees simultaneously:
          </p>
          <ul className="list-inside list-disc space-y-2 text-slate-700">
            <li><strong>Base Case 1:</strong> If both nodes are null, they match</li>
            <li><strong>Base Case 2:</strong> If only one is null, trees differ</li>
            <li><strong>Base Case 3:</strong> If values differ, trees differ</li>
            <li><strong>Recursive Step:</strong> Both left subtrees AND right subtrees must match</li>
          </ul>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">Dry Run</h2>
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="mb-4 text-slate-700">
            Comparing two trees [1,2,3] and [1,2,3]:
          </p>
          <ol className="list-inside list-decimal space-y-2 text-sm text-slate-700">
            <li>Compare root nodes: 1 == 1 ✓</li>
            <li>Recurse left: compare 2 == 2 ✓</li>
            <li>Recurse right: compare 3 == 3 ✓</li>
            <li>All nodes match → return True</li>
          </ol>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">Complexity</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-emerald-700">Time</p>
            <p className="text-3xl font-mono font-medium text-emerald-900">O(n)</p>
            <p className="mt-2 text-sm text-emerald-700">Visit each node once</p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-blue-700">Space</p>
            <p className="text-3xl font-mono font-medium text-blue-900">O(h)</p>
            <p className="mt-2 text-sm text-blue-700">Recursion stack depth</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">Common Mistakes</h2>
        <div className="rounded-xl border border-red-100 bg-red-50 p-6">
          <ul className="space-y-3 text-red-800">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-red-500" />
              <span>Only checking values without checking structure</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-red-500" />
              <span>Using OR instead of AND for left/right comparison</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-red-500" />
              <span>Not handling null cases properly</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">Interview Insights</h2>
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <ul className="space-y-3 text-slate-700">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-teal-500" />
              <span>This is LeetCode #100 - a fundamental tree problem</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-teal-500" />
              <span>Foundation for more complex problems like Subtree of Another Tree</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-teal-500" />
              <span>Can be solved with both recursive and iterative (queue) approaches</span>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}

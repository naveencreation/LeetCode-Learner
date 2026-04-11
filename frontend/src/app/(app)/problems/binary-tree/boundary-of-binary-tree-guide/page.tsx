"use client";

import Link from "next/link";

export default function BoundaryOfBinaryTreeGuidePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-8 flex flex-wrap items-center gap-3">
        <Link 
          href="/problems/binary-tree/boundary-of-binary-tree"
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
          Binary Tree · DFS · BFS
        </p>
        <h1 className="mb-4 text-4xl font-semibold text-slate-900">Boundary of Binary Tree</h1>
        <p className="text-lg text-slate-600">
          Return the boundary nodes of a binary tree in anti-clockwise order: 
          left boundary → leaves → right boundary (reversed).
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">Why This Works</h2>
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="mb-4 text-slate-700">
            The boundary consists of three parts collected separately:
          </p>
          <ul className="list-inside list-disc space-y-2 text-slate-700">
            <li><strong>Left Boundary:</strong> Top-down, excluding leaves</li>
            <li><strong>Leaves:</strong> Left-to-right, all leaf nodes</li>
            <li><strong>Right Boundary:</strong> Bottom-up, excluding leaves</li>
          </ul>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">Complexity</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-emerald-700">Time</p>
            <p className="text-3xl font-mono font-medium text-emerald-900">O(n)</p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-blue-700">Space</p>
            <p className="text-3xl font-mono font-medium text-blue-900">O(h)</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">Interview Insights</h2>
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-slate-700">LeetCode #545 - Medium difficulty. Tests ability to break down complex traversals.</p>
        </div>
      </section>
    </main>
  );
}

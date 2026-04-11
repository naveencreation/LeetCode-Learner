"use client";

import Link from "next/link";
import { useState } from "react";

type Mode = "quick" | "deep";

export default function ConstructTreeInorderPreorderGuidePage() {
  const [mode, setMode] = useState<Mode>("quick");

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 md:py-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link
            href="/problems/binary-tree/construct-binary-tree-from-inorder-and-preorder"
            className="traversal-pill"
          >
            Back to Visualizer
          </Link>
          <Link href="/problems" className="traversal-pill">
            Back to Problems
          </Link>
        </div>
      </div>

      <header className="traversal-panel mb-5 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-600">LC 105 Guide</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
          Construct Binary Tree from Inorder and Preorder
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Build the tree by taking roots from preorder and splitting by inorder positions.
        </p>
      </header>

      <div className="mb-6 flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2">
        <button
          type="button"
          onClick={() => setMode("quick")}
          className={`rounded-lg px-3 py-2 text-sm font-semibold ${
            mode === "quick" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          Quick Recap
        </button>
        <button
          type="button"
          onClick={() => setMode("deep")}
          className={`rounded-lg px-3 py-2 text-sm font-semibold ${
            mode === "deep" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          Deep Explain
        </button>
      </div>

      {mode === "quick" ? (
        <div className="space-y-4">
          <article className="traversal-panel p-5">
            <h2 className="text-lg font-semibold text-slate-900">Core Idea</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              In preorder, the first unused value is always the current root. In inorder, values left of root belong to
              the left subtree and values right of root belong to the right subtree.
            </p>
          </article>

          <article className="traversal-panel p-5">
            <h2 className="text-lg font-semibold text-slate-900">Algorithm</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-6 text-slate-700">
              <li>Create a map from inorder value to index.</li>
              <li>Maintain preorder index pointer for next root.</li>
              <li>Recursively build left part then right part using inorder boundaries.</li>
              <li>Stop when inorder boundary is invalid.</li>
            </ol>
          </article>

          <article className="traversal-panel p-5">
            <h2 className="text-lg font-semibold text-slate-900">Complexity</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">Time: O(n) with hash map lookup. Space: O(n) for map + recursion stack.</p>
          </article>
        </div>
      ) : (
        <div className="space-y-4">
          <article className="traversal-panel p-5">
            <h2 className="text-lg font-semibold text-slate-900">Why This Works</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Preorder gives root ordering. Inorder gives exact subtree boundaries. Combining both identifies each node's
              position uniquely when all values are distinct.
            </p>
          </article>

          <article className="traversal-panel p-5">
            <h2 className="text-lg font-semibold text-slate-900">Dry Run</h2>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
              <li>Root = 3 (preorder[0]). Inorder split: [9] | 3 | [15,20,7].</li>
              <li>Left root = 9 from next preorder value. Left range ends.</li>
              <li>Right root = 20. Then 15 is left of 20, 7 is right of 20.</li>
            </ul>
          </article>

          <article className="traversal-panel p-5">
            <h2 className="text-lg font-semibold text-slate-900">Common Mistakes</h2>
            <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-700">
              <li>Forgetting inorder index map and using O(n) search each recursion.</li>
              <li>Not advancing preorder index exactly once per node creation.</li>
              <li>Building right subtree before left (wrong for preorder-based build).</li>
            </ul>
          </article>
        </div>
      )}
    </section>
  );
}

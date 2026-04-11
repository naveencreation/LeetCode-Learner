"use client";

import Link from "next/link";
import { useState } from "react";

type Mode = "quick" | "deep";

export default function FlattenBinaryTreeGuidePage() {
  const [mode, setMode] = useState<Mode>("quick");

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 md:py-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link href="/problems/binary-tree/flatten-binary-tree-to-linkedlist" className="traversal-pill">
            Back to Visualizer
          </Link>
          <Link href="/problems" className="traversal-pill">
            Back to Problems
          </Link>
        </div>
      </div>

      <header className="traversal-panel mb-5 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-600">LC 114 Guide</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">Flatten Binary Tree to Linked List</h1>
        <p className="mt-2 text-sm text-slate-600">
          Rewire pointers so the tree becomes a preorder right-only chain.
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
            <h2 className="text-lg font-semibold text-slate-900">Goal</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Transform the tree in-place so each node has left = null and right points to the next node in preorder.
            </p>
          </article>

          <article className="traversal-panel p-5">
            <h2 className="text-lg font-semibold text-slate-900">Iterative Strategy (Morris-style)</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-6 text-slate-700">
              <li>At current node, if left exists, find rightmost node of left subtree.</li>
              <li>Connect that rightmost node to current.right.</li>
              <li>Move current.left to current.right and set current.left = null.</li>
              <li>Advance current = current.right.</li>
            </ol>
          </article>

          <article className="traversal-panel p-5">
            <h2 className="text-lg font-semibold text-slate-900">Complexity</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">Time: O(n). Extra Space: O(1) iterative approach.</p>
          </article>
        </div>
      ) : (
        <div className="space-y-4">
          <article className="traversal-panel p-5">
            <h2 className="text-lg font-semibold text-slate-900">Why Rewiring Works</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Preorder order is root, left, right. By placing left subtree between root and original right subtree, we
              preserve preorder while flattening in place.
            </p>
          </article>

          <article className="traversal-panel p-5">
            <h2 className="text-lg font-semibold text-slate-900">Dry Run Snapshot</h2>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
              <li>Start at 1 with left subtree rooted at 2 and right subtree rooted at 5.</li>
              <li>Attach rightmost node of left subtree (4) to 5.</li>
              <li>Move 2 to 1.right, null out 1.left; continue similarly down the chain.</li>
            </ul>
          </article>

          <article className="traversal-panel p-5">
            <h2 className="text-lg font-semibold text-slate-900">Common Mistakes</h2>
            <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-700">
              <li>Overwriting original right subtree without reconnecting it.</li>
              <li>Forgetting to set left pointers to null.</li>
              <li>Using recursion without acknowledging O(h) stack space.</li>
            </ul>
          </article>
        </div>
      )}
    </section>
  );
}

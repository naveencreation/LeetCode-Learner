"use client";

import Link from "next/link";
import { useState } from "react";

type Mode = "quick" | "deep";

export default function ConstructTreeInorderPostorderGuidePage() {
  const [mode, setMode] = useState<Mode>("quick");

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 md:py-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link
            href="/problems/binary-tree/construct-binary-tree-from-inorder-and-postorder"
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
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-600">LC 106 Guide</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
          Construct Binary Tree from Inorder and Postorder
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Build from postorder tail while splitting inorder ranges.
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
              In postorder, the last unused value is the current root. In inorder, root index splits left and right
              subtrees.
            </p>
          </article>

          <article className="traversal-panel p-5">
            <h2 className="text-lg font-semibold text-slate-900">Algorithm</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-6 text-slate-700">
              <li>Create value-to-index map for inorder.</li>
              <li>Keep a postorder pointer starting at the end.</li>
              <li>Create root, then recurse right subtree first, then left subtree.</li>
              <li>Stop when inorder range is invalid.</li>
            </ol>
          </article>

          <article className="traversal-panel p-5">
            <h2 className="text-lg font-semibold text-slate-900">Complexity</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">Time: O(n). Space: O(n) for map and recursion stack.</p>
          </article>
        </div>
      ) : (
        <div className="space-y-4">
          <article className="traversal-panel p-5">
            <h2 className="text-lg font-semibold text-slate-900">Critical Detail</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Because we consume postorder from right to left (root, right, left in reverse), recursion must build the
              right subtree before left.
            </p>
          </article>

          <article className="traversal-panel p-5">
            <h2 className="text-lg font-semibold text-slate-900">Dry Run</h2>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
              <li>Root = 3 from postorder tail.</li>
              <li>Right root = 20, then right child 7, then left child 15.</li>
              <li>Left subtree root = 9 from remaining range.</li>
            </ul>
          </article>

          <article className="traversal-panel p-5">
            <h2 className="text-lg font-semibold text-slate-900">Common Mistakes</h2>
            <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-700">
              <li>Building left before right and getting wrong structure.</li>
              <li>Forgetting to decrement postorder index after node creation.</li>
              <li>Searching inorder index linearly each time.</li>
            </ul>
          </article>
        </div>
      )}
    </section>
  );
}

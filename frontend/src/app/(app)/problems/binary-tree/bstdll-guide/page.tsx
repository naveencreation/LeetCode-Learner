"use client";

import Link from "next/link";
import { useState } from "react";

export default function BstdllGuidePage() {
  const [mode, setMode] = useState<"quick" | "deep">("quick");

  return (
    <section className="relative min-h-0 overflow-hidden bg-gradient-to-br from-slate-50 via-cyan-50/40 to-emerald-50/30">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#e0f2fe_0%,transparent_45%),radial-gradient(ellipse_at_bottom_left,#d1fae5_0%,transparent_50%)]" />

      <div className="relative z-[1] mx-auto max-w-[860px] px-6 py-6">
        <header className="mb-8">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-emerald-500" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
                BST · In-order DFS · LeetCode 426
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/problems/binary-tree/convert-bst-to-sorted-doubly-linked-list"
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
              >
                Visual Editor
              </Link>
              <Link
                href="/problems"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Tree Problems
              </Link>
            </div>
          </div>

          <h1 className="text-[clamp(1.7rem,2.5vw,2.28rem)] font-extrabold leading-tight text-slate-900">
            Convert BST to Sorted Circular Doubly Linked List
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Convert a BST in-place by reusing left as prev and right as next. In-order traversal gives sorted order for free; one final stitch closes the circle.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-700">In-order DFS</span>
            <span className="rounded-full bg-sky-100 px-2.5 py-1 text-sky-700">Pointer Rewiring</span>
            <span className="rounded-full bg-violet-100 px-2.5 py-1 text-violet-700">In-place</span>
            <span className="rounded-full bg-rose-100 px-2.5 py-1 text-rose-700">Circular DLL</span>
          </div>
        </header>

        <div className="mb-5 inline-flex rounded-full border border-slate-200 bg-white p-1">
          <button
            onClick={() => setMode("quick")}
            className={`rounded-full px-3 py-1 text-xs font-bold ${mode === "quick" ? "bg-slate-900 text-white" : "text-slate-600"}`}
          >
            Quick Recap
          </button>
          <button
            onClick={() => setMode("deep")}
            className={`rounded-full px-3 py-1 text-xs font-bold ${mode === "deep" ? "bg-slate-900 text-white" : "text-slate-600"}`}
          >
            Deep Explain
          </button>
        </div>

        <p className="mb-8 text-xs text-slate-500">
          {mode === "quick"
            ? "Key concepts at a glance — for those who already know the basics."
            : "A full beginner-friendly walkthrough with diagrams, trace logic, and interview framing."}
        </p>

        {mode === "quick" ? (
          <div className="space-y-6">
            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Rule</p>
              <p className="rounded-md border-l-4 border-sky-500 bg-sky-50 px-4 py-3 text-[17px] font-semibold leading-7 text-sky-900">
                In-order traversal of a BST visits nodes in ascending order. Link each visited node to the previous one, then connect head and tail.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">How to Think</p>
              <div className="space-y-2.5 text-sm text-slate-700">
                <p><span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">1</span>Run DFS in-order: left, node, right.</p>
                <p><span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">2</span>Use <span className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[12px]">head</span> for the first visited node and <span className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[12px]">prev</span> for the last linked node.</p>
                <p><span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">3</span>At each node: set <span className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[12px]">prev.right = node</span> and <span className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[12px]">node.left = prev</span>.</p>
                <p><span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">4</span>After traversal: <span className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[12px]">head.left = tail</span>, <span className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[12px]">tail.right = head</span>.</p>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Diagram</p>
              <div className="overflow-x-auto">
                <svg viewBox="0 0 500 240" className="mx-auto h-auto w-full min-w-[460px] max-w-[520px]">
                  <line x1="250" y1="64" x2="170" y2="124" stroke="#b6d4f5" strokeWidth="2" />
                  <line x1="250" y1="64" x2="330" y2="124" stroke="#b6d4f5" strokeWidth="2" />
                  <line x1="170" y1="124" x2="120" y2="184" stroke="#b6d4f5" strokeWidth="2" />
                  <line x1="170" y1="124" x2="220" y2="184" stroke="#b6d4f5" strokeWidth="2" />

                  <circle cx="250" cy="50" r="22" fill="#e6f1fb" stroke="#378add" strokeWidth="2" />
                  <text x="250" y="56" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0c447c">4</text>

                  <circle cx="170" cy="110" r="22" fill="#faeeda" stroke="#ef9f27" strokeWidth="2" />
                  <text x="170" y="116" textAnchor="middle" fontSize="14" fontWeight="700" fill="#633806">2</text>

                  <circle cx="330" cy="110" r="22" fill="#faeeda" stroke="#ef9f27" strokeWidth="2" />
                  <text x="330" y="116" textAnchor="middle" fontSize="14" fontWeight="700" fill="#633806">5</text>

                  <circle cx="120" cy="170" r="22" fill="#e1f5ee" stroke="#1d9e75" strokeWidth="2" />
                  <text x="120" y="176" textAnchor="middle" fontSize="14" fontWeight="700" fill="#085041">1</text>

                  <circle cx="220" cy="170" r="22" fill="#e1f5ee" stroke="#1d9e75" strokeWidth="2" />
                  <text x="220" y="176" textAnchor="middle" fontSize="14" fontWeight="700" fill="#085041">3</text>

                  <text x="250" y="212" textAnchor="middle" fontSize="12" fill="#0f6e56" fontWeight="600">In-order: 1 → 2 → 3 → 4 → 5</text>
                </svg>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-1 text-sm font-mono font-semibold">
                <span className="rounded border border-emerald-300 bg-emerald-50 px-3 py-1 text-emerald-800">1</span>
                <span className="text-sky-600">⇄</span>
                <span className="rounded border border-sky-300 bg-sky-50 px-3 py-1 text-sky-800">2</span>
                <span className="text-sky-600">⇄</span>
                <span className="rounded border border-sky-300 bg-sky-50 px-3 py-1 text-sky-800">3</span>
                <span className="text-sky-600">⇄</span>
                <span className="rounded border border-sky-300 bg-sky-50 px-3 py-1 text-sky-800">4</span>
                <span className="text-sky-600">⇄</span>
                <span className="rounded border border-amber-300 bg-amber-50 px-3 py-1 text-amber-800">5</span>
                <span className="ml-2 text-xs text-slate-500">(circular: tail ↔ head)</span>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Complexity</p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl bg-sky-50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-sky-700">Time</p>
                  <p className="font-mono text-[30px] font-semibold text-sky-900">O(n)</p>
                  <p className="text-sm text-sky-800">Each node is visited exactly once.</p>
                </div>
                <div className="rounded-xl bg-violet-50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-violet-700">Space</p>
                  <p className="font-mono text-[30px] font-semibold text-violet-900">O(h)</p>
                  <p className="text-sm text-violet-800">Recursion stack only. Balanced: O(log n), skewed: O(n).</p>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Common Mistakes</p>
              <ul className="list-disc space-y-1.5 pl-5 text-sm leading-7 text-slate-700">
                <li>Missing circular close: <span className="font-mono text-[12px]">head.left = tail</span> and <span className="font-mono text-[12px]">tail.right = head</span>.</li>
                <li>Using pre-order/post-order and expecting sorted order.</li>
                <li>Forgetting that this is in-place pointer rewiring (no new nodes).</li>
              </ul>
            </article>
          </div>
        ) : (
          <div className="space-y-6">
            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Problem Statement</p>
              <h2 className="mb-2 text-lg font-extrabold text-slate-900">Three constraints in one sentence</h2>
              <p className="text-sm leading-7 text-slate-700">
                Convert BST to a sorted circular DLL, in-place. That means no new nodes, sorted ascending order, and both wraparound links (head.left and tail.right) must exist.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Why This Strategy</p>
              <h2 className="mb-2 text-lg font-extrabold text-slate-900">In-order gives sorted order automatically</h2>
              <p className="text-sm leading-7 text-slate-700">
                In BST, left subtree values are smaller and right subtree values are larger. In-order DFS (left, node, right) therefore visits values in ascending order globally.
              </p>
              <div className="mt-3 rounded-md border-l-4 border-sky-500 bg-sky-50 px-4 py-3 text-sm text-sky-900">
                Insight: this is not a list-building problem first; it is a traversal-order problem first. Correct order from traversal simplifies linking logic.
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Intuition</p>
              <h2 className="mb-2 text-lg font-extrabold text-slate-900">Link each node to the one visited just before it</h2>
              <p className="text-sm leading-7 text-slate-700">
                In-order hands nodes in sorted order one by one. If we always connect the previously visited node with the current node, the chain naturally becomes a sorted doubly linked list. The first visited node is head and the last visited node is tail.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Pointer Diagram</p>
              <h2 className="mb-2 text-lg font-extrabold text-slate-900">Reuse left/right as prev/next</h2>
              <div className="overflow-x-auto">
                <svg viewBox="0 0 560 220" className="mx-auto h-auto w-full min-w-[500px] max-w-[560px]">
                  <text x="130" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill="#889">Before (BST node)</text>
                  <text x="430" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill="#889">After (DLL node)</text>

                  <rect x="70" y="34" width="120" height="54" rx="10" fill="#e6f1fb" stroke="#378add" strokeWidth="2" />
                  <text x="130" y="67" textAnchor="middle" fontSize="18" fontWeight="700" fill="#0c447c">node(X)</text>
                  <line x1="95" y1="89" x2="50" y2="133" stroke="#b6d4f5" strokeWidth="2" strokeDasharray="4 3" />
                  <line x1="165" y1="89" x2="210" y2="133" stroke="#b6d4f5" strokeWidth="2" strokeDasharray="4 3" />
                  <text x="50" y="147" textAnchor="middle" fontSize="11" fill="#666">left child</text>
                  <text x="210" y="147" textAnchor="middle" fontSize="11" fill="#666">right child</text>

                  <text x="280" y="68" textAnchor="middle" fontSize="28" fill="#1d9e75">→</text>
                  <text x="280" y="88" textAnchor="middle" fontSize="10" fill="#1d9e75" fontWeight="700">in-order linking</text>

                  <rect x="370" y="34" width="120" height="54" rx="10" fill="#e1f5ee" stroke="#1d9e75" strokeWidth="2" />
                  <text x="430" y="67" textAnchor="middle" fontSize="18" fontWeight="700" fill="#085041">node(X)</text>
                  <line x1="395" y1="89" x2="350" y2="133" stroke="#1d9e75" strokeWidth="2" />
                  <line x1="465" y1="89" x2="510" y2="133" stroke="#1d9e75" strokeWidth="2" />
                  <text x="350" y="147" textAnchor="middle" fontSize="11" fill="#085041" fontWeight="700">prev</text>
                  <text x="510" y="147" textAnchor="middle" fontSize="11" fill="#085041" fontWeight="700">next</text>

                  <path d="M 382 34 Q 430 6 478 34" fill="none" stroke="#8b87e3" strokeWidth="1.5" strokeDasharray="4 3" />
                  <text x="430" y="10" textAnchor="middle" fontSize="10" fill="#534ab7">head.left = tail · tail.right = head</text>
                </svg>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Dry Run</p>
              <h2 className="mb-3 text-lg font-extrabold text-slate-900">Step-by-step linking trace</h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <div className="grid grid-cols-[110px_90px_90px_1fr] bg-slate-100 text-xs font-semibold text-slate-600">
                  <div className="px-3 py-2">Visit</div>
                  <div className="px-3 py-2">curr</div>
                  <div className="px-3 py-2">prev</div>
                  <div className="px-3 py-2">Action</div>
                </div>
                {[
                  ["1st", "1", "None", "Set head = 1. prev = 1."],
                  ["2nd", "2", "1", "1.right = 2 and 2.left = 1. prev = 2."],
                  ["3rd", "3", "2", "2.right = 3 and 3.left = 2. prev = 3."],
                  ["4th", "4", "3", "3.right = 4 and 4.left = 3. prev = 4."],
                  ["5th", "5", "4", "4.right = 5 and 5.left = 4. prev = 5."],
                  ["Close", "-", "5", "head.left = 5 and 5.right = head."],
                ].map((row, idx) => (
                  <div
                    key={`${row[0]}-${row[1]}`}
                    className={`grid grid-cols-[110px_90px_90px_1fr] text-sm ${idx % 2 === 1 ? "bg-slate-50" : "bg-white"}`}
                  >
                    <div className="px-3 py-2 text-slate-700">{row[0]}</div>
                    <div className="px-3 py-2 font-mono text-slate-800">{row[1]}</div>
                    <div className="px-3 py-2 font-mono text-slate-800">{row[2]}</div>
                    <div className="px-3 py-2 text-slate-700">{row[3]}</div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Complexity</p>
              <p className="text-sm leading-7 text-slate-700">Time is O(n) because each node is visited once. Space is O(h) for recursion stack where h is tree height. Linking and circular close are O(1) per node and O(1) final step.</p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Common Mistakes</p>
              <ul className="list-disc space-y-1.5 pl-5 text-sm leading-7 text-slate-700">
                <li>Skipping circular close step and returning a linear DLL.</li>
                <li>Using non in-order traversal and losing sorted order.</li>
                <li>Not explaining why pointer overwrite is safe after subtree recursion returns.</li>
              </ul>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Interview Insights</p>
              <p className="text-sm leading-7 text-slate-700">
                Start by proving order (BST + in-order), then state invariant: prev is last linked node and head is smallest node. Mention iterative-stack alternative for deep trees to avoid recursion depth concerns.
              </p>
            </article>
          </div>
        )}

        <footer className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-700">Step through the visualizer to observe each pointer rewiring action.</p>
            <div className="flex items-center gap-2">
              <Link
                href="/problems/binary-tree/convert-bst-to-sorted-doubly-linked-list"
                className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
              >
                Open Visualizer
              </Link>
              <Link
                href="/problems"
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Back to Problems
              </Link>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-500">If you can explain why in-order yields sorted order and why overwrite is safe, you are interview-ready for LC 426.</p>
        </footer>
      </div>
    </section>
  );
}

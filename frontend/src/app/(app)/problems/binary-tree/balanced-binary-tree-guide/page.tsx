"use client";

import { useState } from "react";
import Link from "next/link";

const DRY_RUN_ROWS = [
  { call: "check(9)", left: "0", right: "0", diff: "0", returns: "1" },
  { call: "check(15)", left: "0", right: "0", diff: "0", returns: "1" },
  { call: "check(7)", left: "0", right: "0", diff: "0", returns: "1" },
  { call: "check(20)", left: "1", right: "1", diff: "0", returns: "2" },
  { call: "check(3)", left: "1", right: "2", diff: "1", returns: "3 (balanced)" },
];

const DEEP_TRACE = [
  {
    phase: "Start",
    phaseClass: "bg-blue-100 text-blue-700",
    title: "Enter check(3)",
    desc: "Start at root node 3. We cannot judge node 3 yet, so we go to its children first.",
  },
  {
    phase: "Left",
    phaseClass: "bg-cyan-100 text-cyan-700",
    title: "check(9) returns 1",
    desc: "Node 9 is a leaf. Both sides are empty (0, 0), so return height 1.",
  },
  {
    phase: "Right",
    phaseClass: "bg-indigo-100 text-indigo-700",
    title: "check(20) explores both children",
    desc: "Node 20 gets 1 from node 15 and 1 from node 7, so it returns 2.",
  },
  {
    phase: "Check",
    phaseClass: "bg-amber-100 text-amber-700",
    title: "Balance check at root",
    desc: "Now node 3 has left=1 and right=2. Difference is 1, so node 3 is balanced.",
  },
  {
    phase: "Done",
    phaseClass: "bg-emerald-100 text-emerald-700",
    title: "Final result = true",
    desc: "No call returned -1, so the whole tree is balanced and answer is true.",
  },
];

const COMMON_MISTAKES = [
  {
    title: "Recomputing height again and again",
    desc: "If you calculate full height at every node, work repeats and can become O(n^2).",
  },
  {
    title: "Not returning -1 immediately",
    desc: "Once a subtree is unbalanced, stop there and return -1 right away.",
  },
  {
    title: "Checking only the root",
    desc: "The rule must be true for every node, not just the top node.",
  },
  {
    title: "Mixing helper output and final answer",
    desc: "Helper returns a height or -1. The main function converts that to true/false.",
  },
];

const INTERVIEW_CONTEXT = [
  {
    title: "Diameter of Binary Tree",
    desc: "Same bottom-up DFS pattern: gather child info first, then compute at parent.",
  },
  {
    title: "AVL Tree insert/delete",
    desc: "AVL balancing also uses left and right subtree height difference.",
  },
  {
    title: "Height of Binary Tree",
    desc: "This problem is height calculation plus one extra balance check.",
  },
  {
    title: "Tree DP style questions",
    desc: "Common pattern: children return small state, parent combines it quickly.",
  },
];

function BalancedVsUnbalancedDiagrams() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-emerald-700">
          Balanced - true
        </p>
        <div className="flex justify-center rounded-xl border border-slate-100 bg-slate-50/40 p-4">
          <svg viewBox="0 0 320 230" xmlns="http://www.w3.org/2000/svg" className="h-auto w-full max-w-[320px]">
            <line x1="160" y1="52" x2="92" y2="112" stroke="#9FE1CB" strokeWidth="1.5" />
            <line x1="160" y1="52" x2="228" y2="112" stroke="#9FE1CB" strokeWidth="1.5" />
            <line x1="228" y1="112" x2="194" y2="174" stroke="#9FE1CB" strokeWidth="1.5" />
            <line x1="228" y1="112" x2="262" y2="174" stroke="#9FE1CB" strokeWidth="1.5" />

            <circle cx="160" cy="48" r="22" fill="#E1F5EE" stroke="#1D9E75" strokeWidth="1.5" />
            <text x="160" y="53" textAnchor="middle" fontSize="14" fontWeight="500" fill="#085041" fontFamily="monospace">3</text>
            <circle cx="92" cy="116" r="22" fill="#E1F5EE" stroke="#1D9E75" strokeWidth="1.5" />
            <text x="92" y="121" textAnchor="middle" fontSize="14" fontWeight="500" fill="#085041" fontFamily="monospace">9</text>
            <circle cx="228" cy="116" r="22" fill="#E1F5EE" stroke="#1D9E75" strokeWidth="1.5" />
            <text x="228" y="121" textAnchor="middle" fontSize="14" fontWeight="500" fill="#085041" fontFamily="monospace">20</text>
            <circle cx="194" cy="178" r="22" fill="#E1F5EE" stroke="#1D9E75" strokeWidth="1.5" />
            <text x="194" y="183" textAnchor="middle" fontSize="14" fontWeight="500" fill="#085041" fontFamily="monospace">15</text>
            <circle cx="262" cy="178" r="22" fill="#E1F5EE" stroke="#1D9E75" strokeWidth="1.5" />
            <text x="262" y="183" textAnchor="middle" fontSize="14" fontWeight="500" fill="#085041" fontFamily="monospace">7</text>
            <text x="160" y="220" textAnchor="middle" fontSize="10" fill="#6c7086" fontFamily="monospace">|1-2|=1 &lt;= 1</text>
          </svg>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-rose-700">
          Not balanced - false
        </p>
        <div className="flex justify-center rounded-xl border border-slate-100 bg-slate-50/40 p-4">
          <svg viewBox="0 0 320 260" xmlns="http://www.w3.org/2000/svg" className="h-auto w-full max-w-[320px]">
            <line x1="160" y1="52" x2="106" y2="112" stroke="#F7C1C1" strokeWidth="1.5" />
            <line x1="160" y1="52" x2="242" y2="112" stroke="#F7C1C1" strokeWidth="1.5" />
            <line x1="106" y1="112" x2="66" y2="172" stroke="#F7C1C1" strokeWidth="1.5" />
            <line x1="106" y1="112" x2="146" y2="172" stroke="#F7C1C1" strokeWidth="1.5" />
            <line x1="66" y1="172" x2="44" y2="224" stroke="#F7C1C1" strokeWidth="1.5" />
            <line x1="66" y1="172" x2="88" y2="224" stroke="#F7C1C1" strokeWidth="1.5" />

            <circle cx="160" cy="48" r="22" fill="#FCEBEB" stroke="#E24B4A" strokeWidth="1.5" />
            <text x="160" y="53" textAnchor="middle" fontSize="14" fontWeight="500" fill="#791F1F" fontFamily="monospace">1</text>
            <circle cx="106" cy="116" r="22" fill="#FCEBEB" stroke="#E24B4A" strokeWidth="1.5" />
            <text x="106" y="121" textAnchor="middle" fontSize="14" fontWeight="500" fill="#791F1F" fontFamily="monospace">2</text>
            <circle cx="242" cy="116" r="22" fill="#FCEBEB" stroke="#E24B4A" strokeWidth="1.5" />
            <text x="242" y="121" textAnchor="middle" fontSize="14" fontWeight="500" fill="#791F1F" fontFamily="monospace">2</text>
            <circle cx="66" cy="176" r="22" fill="#FCEBEB" stroke="#E24B4A" strokeWidth="1.5" />
            <text x="66" y="181" textAnchor="middle" fontSize="14" fontWeight="500" fill="#791F1F" fontFamily="monospace">3</text>
            <circle cx="146" cy="176" r="22" fill="#FCEBEB" stroke="#E24B4A" strokeWidth="1.5" />
            <text x="146" y="181" textAnchor="middle" fontSize="14" fontWeight="500" fill="#791F1F" fontFamily="monospace">3</text>
            <circle cx="44" cy="228" r="18" fill="#FCEBEB" stroke="#E24B4A" strokeWidth="1.5" />
            <text x="44" y="233" textAnchor="middle" fontSize="14" fontWeight="500" fill="#791F1F" fontFamily="monospace">4</text>
            <circle cx="88" cy="228" r="18" fill="#FCEBEB" stroke="#E24B4A" strokeWidth="1.5" />
            <text x="88" y="233" textAnchor="middle" fontSize="14" fontWeight="500" fill="#791F1F" fontFamily="monospace">4</text>
            <text x="160" y="252" textAnchor="middle" fontSize="10" fill="#E24B4A" fontFamily="monospace">|3-1|=2 &gt; 1</text>
          </svg>
        </div>
      </div>
    </div>
  );
}

function QuickMode() {
  return (
    <>
      <div className="mb-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Problem Statement</h3>
              <p className="text-sm text-slate-500">Balanced Binary Tree</p>
            </div>
          </div>

          <p className="text-[15px] leading-relaxed text-slate-700 mb-4">
            Given the <span className="font-medium text-slate-900">root</span> of a binary tree,
            return <span className="font-medium text-slate-900">true</span> if it is height-balanced,
            otherwise return <span className="font-medium text-slate-900">false</span>.
          </p>

          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-semibold text-emerald-900">
              Balance Rule: for every node, |height(left) - height(right)| &lt;= 1
            </p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">01</span>
          <h2 className="text-xl font-semibold text-slate-900">Intuition</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-5">
            <p className="text-sm font-semibold text-sky-800 mb-2">Bottom-up DFS</p>
            <p className="text-[14px] text-sky-900/80 leading-relaxed">Use post-order recursion so each node receives left and right heights from children.</p>
          </div>
          <div className="rounded-2xl border border-violet-200 bg-violet-50/70 p-5">
            <p className="text-sm font-semibold text-violet-800 mb-2">Sentinel -1</p>
            <p className="text-[14px] text-violet-900/80 leading-relaxed">Return -1 when unbalanced. Parents immediately propagate -1 without extra work.</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
            <p className="text-sm font-semibold text-emerald-800 mb-2">One Pass</p>
            <p className="text-[14px] text-emerald-900/80 leading-relaxed">Compute heights and validate balance together in O(n).</p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">02</span>
          <h2 className="text-xl font-semibold text-slate-900">Diagram</h2>
        </div>

        <BalancedVsUnbalancedDiagrams />
      </div>

      <div className="mb-12">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">03</span>
          <h2 className="text-xl font-semibold text-slate-900">Dry Run</h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Call</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Left</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Right</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">|diff|</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Return</th>
              </tr>
            </thead>
            <tbody>
              {DRY_RUN_ROWS.map((row) => (
                <tr key={row.call} className="border-b last:border-none">
                  <td className="px-3 py-2 font-mono text-slate-700">{row.call}</td>
                  <td className="px-3 py-2 text-slate-700">{row.left}</td>
                  <td className="px-3 py-2 text-slate-700">{row.right}</td>
                  <td className="px-3 py-2 text-slate-700">{row.diff}</td>
                  <td className="px-3 py-2 font-medium text-emerald-700">{row.returns}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-10">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">04</span>
          <h2 className="text-xl font-semibold text-slate-900">Complexity</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-4">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 mb-1">Time Complexity</p>
            <p className="text-3xl font-mono font-semibold text-emerald-800 mb-1">O(n)</p>
            <p className="text-sm text-emerald-700 leading-relaxed">Every node is visited once in the recursive pass.</p>
          </div>
          <div className="rounded-2xl border border-violet-200 bg-violet-50/80 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-700 mb-1">Space Complexity</p>
            <p className="text-3xl font-mono font-semibold text-violet-800 mb-1">O(h)</p>
            <p className="text-sm text-violet-700 leading-relaxed">Recursion stack height. O(log n) balanced, O(n) skewed.</p>
          </div>
        </div>

        <div className="rounded-xl bg-amber-50 border-l-[3px] border-amber-400 p-4">
          <p className="text-sm text-amber-800">
            <strong className="font-medium">Interview tip:</strong> Mention naive O(n^2) top-down first,
            then immediately improve to one-pass bottom-up DFS with sentinel -1.
          </p>
        </div>
      </div>
    </>
  );
}

function DeepMode() {
  return (
    <>
      <div className="mb-10">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">04 · Why this strategy</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Simple idea in one minute</h2>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <p className="text-[14px] leading-relaxed text-slate-700 mb-3">
            At each node, do three steps: get left height, get right height, then compare.
            This is why post-order recursion works best for this problem.
          </p>
          <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-900 p-4 text-xs text-slate-200">
      {`class Solution:
        def isBalanced(self, root) -> bool:
          def check(node):
            if not node:
              return 0

            left = check(node.left)
            if left == -1:
              return -1

            right = check(node.right)
            if right == -1:
              return -1

            if abs(left - right) > 1:
              return -1

            return 1 + max(left, right)

          return check(root) != -1`}
          </pre>
        </div>
      </div>

      <div className="mb-10">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">05 · Explanation</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Easy way to remember it</h2>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
          <p className="text-[14px] leading-relaxed text-amber-900/90">
            Think bottom-up: children report first, parent decides later.
            Each call returns either a normal height or -1 (meaning already unbalanced).
            If you see -1, pass it upward immediately.
          </p>
        </div>
        <div className="mt-4 rounded-xl border-l-[3px] border-blue-400 bg-blue-50 p-4">
          <p className="text-sm text-blue-900">
            Why -1 is safe: real heights are 0 or more, so -1 can only mean &quot;unbalanced&quot;.
          </p>
        </div>
      </div>

      <div className="mb-10">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">06 · Deep trace</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Call flow in simple steps</h2>
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          {DEEP_TRACE.map((item) => (
            <div key={item.title} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${item.phaseClass}`}>
                  {item.phase}
                </span>
                <p className="text-sm font-semibold text-slate-800">{item.title}</p>
              </div>
              <p className="text-[13px] text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">07 · Common Mistakes</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Easy mistakes to avoid</h2>
        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          {COMMON_MISTAKES.map((item) => (
            <div key={item.title} className="flex items-start gap-3 rounded-xl p-4 transition-colors hover:bg-slate-50/50">
              <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-rose-500" />
              <div>
                <p className="text-sm font-medium text-slate-800">{item.title}</p>
                <p className="text-[13px] text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">08 · Interview insights</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Related interview problems</h2>
        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          {INTERVIEW_CONTEXT.map((item) => (
            <div key={item.title} className="flex items-start gap-3 rounded-xl p-4 transition-colors hover:bg-slate-50/50">
              <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
              <div>
                <p className="text-sm font-medium text-slate-800">{item.title}</p>
                <p className="text-[13px] text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function BalancedBinaryTreeGuidePage() {
  const [mode, setMode] = useState<"quick" | "deep">("quick");

  return (
    <section className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-slate-50 to-emerald-50/20">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,#e0f2fe_0%,transparent_48%),radial-gradient(ellipse_at_bottom_left,#e2f6ef_0%,transparent_52%)]" />

      <div className="relative z-[1] mx-auto max-w-[860px] px-6 py-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-emerald-500" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-600">Binary Tree · Traversal</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/problems/binary-tree/balanced-binary-tree"
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                Visual Editor
              </Link>
              <Link
                href="/problems/topics/trees"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                Tree Problems
              </Link>
            </div>
          </div>

          <h1 className="text-3xl font-semibold text-slate-900 mb-2">Balanced Binary Tree</h1>
          <p className="text-base text-slate-500 mb-5 max-w-xl">
            Check whether every node has left and right subtree heights differing by at most one.
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              DFS
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 border border-violet-200 px-3 py-1.5 text-xs font-medium text-violet-700">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
              Bottom-up Recursion
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Interview Essential
            </span>
          </div>

          <div className="inline-flex items-center rounded-xl bg-slate-100 p-1 gap-1 border border-slate-200">
            <button
              onClick={() => setMode("quick")}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                mode === "quick"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Quick Recap
            </button>
            <button
              onClick={() => setMode("deep")}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                mode === "deep"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Deep Explain
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-3">
            {mode === "quick"
              ? "Key concepts at a glance — for those who already know the basics."
              : "A full beginner-friendly walkthrough — understand it from scratch."}
          </p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-8" />

        {mode === "quick" ? <QuickMode /> : <DeepMode />}

        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-emerald-50/30 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[15px] font-medium text-slate-800">Ready to see it in action?</p>
              <p className="text-[13px] text-slate-500 mt-0.5">Step through the visualizer to watch the algorithm state update live.</p>
            </div>
            <Link
              href="/problems/binary-tree/balanced-binary-tree"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/25"
            >
              Open Visualizer
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";

const DRY_RUN_ROWS = [
  { call: "lca(5)", left: "-", right: "-", returns: "5" },
  { call: "lca(1)", left: "-", right: "-", returns: "1" },
  { call: "lca(3)", left: "5", right: "1", returns: "3 (LCA)" },
  { call: "lca(4)", left: "-", right: "-", returns: "4" },
  { call: "lca(5,4 case)", left: "6", right: "4", returns: "5 (LCA)" },
];

const DEEP_TRACE = [
  {
    phase: "Start",
    phaseClass: "bg-blue-100 text-blue-700",
    title: "Enter lca(3, 5, 1)",
    desc: "Start at root. We recurse left and right first, then decide at current node.",
  },
  {
    phase: "Left",
    phaseClass: "bg-cyan-100 text-cyan-700",
    title: "Left recursion returns node 5",
    desc: "Node 5 matches target p, so it is returned immediately.",
  },
  {
    phase: "Right",
    phaseClass: "bg-indigo-100 text-indigo-700",
    title: "Right recursion returns node 1",
    desc: "Node 1 matches target q, so it also returns immediately.",
  },
  {
    phase: "Check",
    phaseClass: "bg-amber-100 text-amber-700",
    title: "Both sides are non-null at node 3",
    desc: "Left has one target and right has the other. Node 3 is the split point.",
  },
  {
    phase: "Done",
    phaseClass: "bg-emerald-100 text-emerald-700",
    title: "Final result is node 3",
    desc: "The first split point from bottom is the lowest common ancestor.",
  },
];

const COMMON_MISTAKES = [
  {
    title: "Using BST logic in a normal binary tree",
    desc: "Binary tree has no ordering, so p < root < q shortcuts do not apply.",
  },
  {
    title: "Ignoring ancestor case",
    desc: "If p is ancestor of q, answer is p itself. Base case handles this naturally.",
  },
  {
    title: "Returning root when only one side is non-null",
    desc: "Root is LCA only when both left and right return non-null.",
  },
  {
    title: "Thinking in values instead of nodes",
    desc: "Most interview APIs pass node references, not just integer values.",
  },
];

const INTERVIEW_CONTEXT = [
  {
    title: "LCA in BST",
    desc: "Same objective but optimized by BST ordering rules.",
  },
  {
    title: "Distance between two tree nodes",
    desc: "Find LCA first, then compute two distances from that node.",
  },
  {
    title: "Path between two nodes",
    desc: "LCA acts as the merge point for two root-to-node paths.",
  },
  {
    title: "Kth ancestor questions",
    desc: "Ancestor-oriented reasoning appears again with parent lifting techniques.",
  },
];

function LcaTwoCasesDiagram() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-emerald-700">
          Split Case - LCA = 3
        </p>
        <div className="flex justify-center rounded-xl border border-slate-100 bg-slate-50/40 p-4">
          <svg viewBox="0 0 330 235" xmlns="http://www.w3.org/2000/svg" className="h-auto w-full max-w-[330px]">
            <line x1="165" y1="48" x2="95" y2="108" stroke="#9FE1CB" strokeWidth="1.5" />
            <line x1="165" y1="48" x2="235" y2="108" stroke="#9FE1CB" strokeWidth="1.5" />
            <line x1="95" y1="108" x2="65" y2="166" stroke="#d8deea" strokeWidth="1.5" />
            <line x1="95" y1="108" x2="125" y2="166" stroke="#d8deea" strokeWidth="1.5" />
            <line x1="235" y1="108" x2="205" y2="166" stroke="#d8deea" strokeWidth="1.5" />
            <line x1="235" y1="108" x2="265" y2="166" stroke="#d8deea" strokeWidth="1.5" />

            <circle cx="165" cy="45" r="22" fill="#E1F5EE" stroke="#1D9E75" strokeWidth="1.8" />
            <text x="165" y="50" textAnchor="middle" fontSize="14" fontWeight="600" fill="#085041" fontFamily="monospace">3</text>

            <circle cx="95" cy="112" r="21" fill="#E6F1FB" stroke="#378ADD" strokeWidth="1.8" />
            <text x="95" y="117" textAnchor="middle" fontSize="13" fontWeight="600" fill="#0C447C" fontFamily="monospace">5</text>

            <circle cx="235" cy="112" r="21" fill="#EEEDFE" stroke="#6e61da" strokeWidth="1.8" />
            <text x="235" y="117" textAnchor="middle" fontSize="13" fontWeight="600" fill="#3C3489" fontFamily="monospace">1</text>

            <circle cx="65" cy="170" r="17" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.4" />
            <text x="65" y="175" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="monospace">6</text>
            <circle cx="125" cy="170" r="17" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.4" />
            <text x="125" y="175" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="monospace">2</text>
            <circle cx="205" cy="170" r="17" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.4" />
            <text x="205" y="175" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="monospace">0</text>
            <circle cx="265" cy="170" r="17" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.4" />
            <text x="265" y="175" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="monospace">8</text>

            <text x="165" y="223" textAnchor="middle" fontSize="10" fill="#6c7086" fontFamily="monospace">left=5 and right=1 -&gt; return 3</text>
          </svg>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-violet-700">
          Ancestor Case - LCA = 5
        </p>
        <div className="flex justify-center rounded-xl border border-slate-100 bg-slate-50/40 p-4">
          <svg viewBox="0 0 330 235" xmlns="http://www.w3.org/2000/svg" className="h-auto w-full max-w-[330px]">
            <line x1="165" y1="48" x2="95" y2="108" stroke="#F7C1C1" strokeWidth="1.5" />
            <line x1="95" y1="108" x2="65" y2="166" stroke="#F7C1C1" strokeWidth="1.5" />
            <line x1="95" y1="108" x2="125" y2="166" stroke="#F7C1C1" strokeWidth="1.5" />
            <line x1="125" y1="166" x2="109" y2="214" stroke="#F7C1C1" strokeWidth="1.5" />
            <line x1="125" y1="166" x2="141" y2="214" stroke="#F7C1C1" strokeWidth="1.5" />

            <circle cx="165" cy="45" r="19" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.4" />
            <text x="165" y="50" textAnchor="middle" fontSize="12" fill="#64748b" fontFamily="monospace">3</text>

            <circle cx="95" cy="112" r="22" fill="#E1F5EE" stroke="#1D9E75" strokeWidth="1.8" />
            <text x="95" y="117" textAnchor="middle" fontSize="13" fontWeight="600" fill="#085041" fontFamily="monospace">5</text>

            <circle cx="65" cy="170" r="17" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.4" />
            <text x="65" y="175" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="monospace">6</text>
            <circle cx="125" cy="170" r="17" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.4" />
            <text x="125" y="175" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="monospace">2</text>

            <circle cx="109" cy="214" r="14" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.4" />
            <text x="109" y="218" textAnchor="middle" fontSize="10" fill="#64748b" fontFamily="monospace">7</text>
            <circle cx="141" cy="214" r="16" fill="#EEEDFE" stroke="#6e61da" strokeWidth="1.8" />
            <text x="141" y="219" textAnchor="middle" fontSize="11" fontWeight="700" fill="#3C3489" fontFamily="monospace">4</text>

            <text x="165" y="228" textAnchor="middle" fontSize="10" fill="#6c7086" fontFamily="monospace">p is ancestor of q -&gt; return p (5)</text>
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9 12h6" /><path d="M12 9v6" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Problem Statement</h3>
              <p className="text-sm text-slate-500">Lowest Common Ancestor of a Binary Tree</p>
            </div>
          </div>

          <p className="text-[15px] leading-relaxed text-slate-700 mb-4">
            Return the lowest node in the tree that has both p and q as descendants.
            A node can be a descendant of itself, so ancestor cases are valid answers.
          </p>

          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-semibold text-emerald-900">
              Core Rule: both sides non-null -&gt; current node is LCA.
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
            <p className="text-sm font-semibold text-sky-800 mb-2">Base hit</p>
            <p className="text-[14px] text-sky-900/80 leading-relaxed">If node is null, p, or q, return immediately as recursion signal.</p>
          </div>
          <div className="rounded-2xl border border-violet-200 bg-violet-50/70 p-5">
            <p className="text-sm font-semibold text-violet-800 mb-2">Signal merge</p>
            <p className="text-[14px] text-violet-900/80 leading-relaxed">Collect left and right return values, then combine at parent.</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
            <p className="text-sm font-semibold text-emerald-800 mb-2">Split point</p>
            <p className="text-[14px] text-emerald-900/80 leading-relaxed">The first node getting both signals is the lowest common ancestor.</p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">02</span>
          <h2 className="text-xl font-semibold text-slate-900">Diagram</h2>
        </div>

        <LcaTwoCasesDiagram />
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
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Return</th>
              </tr>
            </thead>
            <tbody>
              {DRY_RUN_ROWS.map((row) => (
                <tr key={row.call} className="border-b last:border-none">
                  <td className="px-3 py-2 font-mono text-slate-700">{row.call}</td>
                  <td className="px-3 py-2 text-slate-700">{row.left}</td>
                  <td className="px-3 py-2 text-slate-700">{row.right}</td>
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
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-700">Time Complexity</p>
            <p className="mb-1 font-mono text-3xl font-semibold text-emerald-800">O(n)</p>
            <p className="text-sm leading-relaxed text-emerald-700">Each node is visited once.</p>
          </div>
          <div className="rounded-2xl border border-violet-200 bg-violet-50/80 p-5">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-violet-700">Space Complexity</p>
            <p className="mb-1 font-mono text-3xl font-semibold text-violet-800">O(h)</p>
            <p className="text-sm leading-relaxed text-violet-700">Recursion stack depth, where h is tree height.</p>
          </div>
        </div>

        <div className="rounded-xl bg-amber-50 border-l-[3px] border-amber-400 p-4">
          <p className="text-sm text-amber-800">
            <strong className="font-medium">Interview tip:</strong> Explain split case and ancestor case before coding.
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
            This is a post-order style merge pattern. Children return information, parent decides.
            You only declare LCA when both branches report non-null.
          </p>
          <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-900 p-4 text-xs text-slate-200">
{`class Solution:
    def lowestCommonAncestor(self, root, p, q):
        if not root or root is p or root is q:
            return root

        left = self.lowestCommonAncestor(root.left, p, q)
        right = self.lowestCommonAncestor(root.right, p, q)

        if left and right:
            return root

        return left if left else right`}
          </pre>
        </div>
      </div>

      <div className="mb-10">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">05 · Explanation</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">How to remember it</h2>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
          <p className="text-[14px] leading-relaxed text-amber-900/90">
            Think of each recursion call as returning one message: nothing found, found p/q, or found final LCA.
            Parent merges two messages and either confirms split or forwards one message upward.
          </p>
        </div>
        <div className="mt-4 rounded-xl border-l-[3px] border-blue-400 bg-blue-50 p-4">
          <p className="text-sm text-blue-900">
            Why ancestor case works: when root is p, base case returns p immediately, so p can become LCA.
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

export default function LcaInBinaryTreeGuidePage() {
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
                href="/problems/binary-tree/lca-in-binary-tree"
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                Visual Editor
              </Link>
              <Link
                href="/problems/topics/trees"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                Tree Problems
              </Link>
            </div>
          </div>

          <h1 className="text-3xl font-semibold text-slate-900 mb-2">Lowest Common Ancestor in Binary Tree</h1>
          <p className="text-base text-slate-500 mb-5 max-w-xl">
            Find the lowest node that is ancestor of both p and q using recursive signal propagation.
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
              href="/problems/binary-tree/lca-in-binary-tree"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/25"
            >
              Open Visualizer
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

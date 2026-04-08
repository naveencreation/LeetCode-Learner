"use client";

import { useState } from "react";
import Link from "next/link";

type TreeNodePoint = {
  id: number;
  x: number;
  y: number;
  level: number;
};

const NODES: TreeNodePoint[] = [
  { id: 1, x: 170, y: 34, level: 0 },
  { id: 2, x: 92, y: 92, level: 1 },
  { id: 3, x: 248, y: 92, level: 1 },
  { id: 4, x: 56, y: 150, level: 2 },
  { id: 5, x: 126, y: 150, level: 2 },
  { id: 6, x: 214, y: 150, level: 2 },
  { id: 7, x: 286, y: 150, level: 2 },
];

const EDGES: Array<[number, number]> = [
  [1, 2],
  [1, 3],
  [2, 4],
  [2, 5],
  [3, 6],
  [3, 7],
];

const QUICK_STEPS = [
  {
    num: 1,
    title: "Initialize queue with root",
    desc: "If root is null return empty list, else start BFS from root.",
  },
  {
    num: 2,
    title: "Freeze level size",
    desc: "At each while-loop iteration, current queue length equals one full level.",
  },
  {
    num: 3,
    title: "Process exactly that many nodes",
    desc: "Pop nodes, collect values into level array, and enqueue children.",
  },
  {
    num: 4,
    title: "Append level to answer",
    desc: "After inner loop, push level array to result and continue.",
  },
];

const TRACE_STEPS = [
  {
    badge: "L0",
    badgeClass: "bg-blue-100 text-blue-700",
    title: "Queue = [1]",
    desc: "Pop 1, level becomes [1], enqueue 2 and 3.",
  },
  {
    badge: "L1",
    badgeClass: "bg-blue-100 text-blue-700",
    title: "Queue = [2, 3]",
    desc: "Pop both, level becomes [2, 3], enqueue 4, 5, 6, 7.",
  },
  {
    badge: "L2",
    badgeClass: "bg-blue-100 text-blue-700",
    title: "Queue = [4, 5, 6, 7]",
    desc: "Pop all four leaves, level becomes [4, 5, 6, 7].",
  },
  {
    badge: "Done",
    badgeClass: "bg-emerald-100 text-emerald-700",
    title: "Queue empty",
    desc: "Final result is [[1], [2, 3], [4, 5, 6, 7]].",
  },
];

const COMMON_MISTAKES = [
  {
    title: "Not freezing level size",
    desc: "If you iterate while queue changes, levels get mixed and output shape breaks.",
  },
  {
    title: "Appending node values directly to final answer",
    desc: "This produces flat traversal, not list of levels.",
  },
  {
    title: "Forgetting null-root guard",
    desc: "Always return empty list quickly when root is missing.",
  },
  {
    title: "Using recursion for level order in interviews",
    desc: "BFS queue version is expected and easier to reason about under time pressure.",
  },
];

const QA_ITEMS = [
  {
    q: "Why use queue length for each level?",
    a: "Queue length at loop start exactly matches nodes of current level, so we can isolate one level cleanly.",
  },
  {
    q: "Is this same as normal BFS?",
    a: "Yes, with one extra rule: group nodes by level-size batches before appending to answer.",
  },
  {
    q: "Time and space complexity?",
    a: "Time O(n) because each node is visited once. Space O(w), where w is maximum width of tree.",
  },
];

const INTERVIEW_CONTEXT = [
  {
    title: "LeetCode 102",
    desc: "Canonical level order traversal question.",
  },
  {
    title: "LeetCode 107",
    desc: "Bottom-up level order is same BFS plus reverse at end.",
  },
  {
    title: "LeetCode 103",
    desc: "Zigzag is level order with alternating insertion direction.",
  },
  {
    title: "Tree analytics pipelines",
    desc: "Level batching is used in hierarchy rendering and layer-wise processing tasks.",
  },
];

function nodeById(id: number): TreeNodePoint {
  const node = NODES.find((item) => item.id === id);
  if (!node) throw new Error(`Missing node ${id}`);
  return node;
}

function TreeDiagram() {
  return (
    <svg viewBox="0 0 340 205" className="h-[235px] w-full rounded-2xl border border-slate-200 bg-white p-3">
      {[0, 1, 2].map((level) => {
        const y = 34 + level * 58;
        return (
          <g key={level}>
            <line x1={26} y1={y} x2={316} y2={y} stroke="#e2e8f0" strokeWidth="1.2" strokeDasharray="5 4" />
            <text x={12} y={y + 4} textAnchor="start" className="fill-slate-500 text-[10px] font-semibold">
              L{level}
            </text>
          </g>
        );
      })}

      {EDGES.map(([from, to]) => {
        const source = nodeById(from);
        const target = nodeById(to);
        return (
          <line
            key={`${from}-${to}`}
            x1={source.x}
            y1={source.y}
            x2={target.x}
            y2={target.y}
            stroke="#cbd5e1"
            strokeWidth="1.8"
          />
        );
      })}

      {NODES.map((node) => (
        <g key={node.id}>
          <circle cx={node.x} cy={node.y} r="17" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
          <text x={node.x} y={node.y + 5} textAnchor="middle" className="fill-[#0c4a6e] text-sm font-semibold">
            {node.id}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function LevelOrderGuidePage() {
  const [mode, setMode] = useState<"quick" | "deep">("quick");

  return (
    <section className="relative min-h-0 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,#ccfbf1_0%,transparent_50%),radial-gradient(ellipse_at_bottom_left,#dbeafe_0%,transparent_50%)]" />

      <div className="relative z-[1] mx-auto max-w-[860px] px-6 py-6">
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-teal-500" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-teal-600">Binary Tree · BFS</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/problems/binary-tree/level-order-traversal"
                className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 transition hover:bg-teal-100"
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

          <h1 className="mb-2 text-3xl font-semibold text-slate-900">Level Order Traversal</h1>
          <p className="mb-5 max-w-xl text-base text-slate-500">
            Process tree nodes level by level with a queue and build a nested result list.
          </p>

          <div className="mb-6 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700"><span className="h-1.5 w-1.5 rounded-full bg-teal-500" />BFS</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700"><span className="h-1.5 w-1.5 rounded-full bg-sky-500" />Queue</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Level Batching</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />Interview Core</span>
          </div>

          <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1">
            <button
              onClick={() => setMode("quick")}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                mode === "quick"
                  ? "border border-slate-200 bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Quick Recap
            </button>
            <button
              onClick={() => setMode("deep")}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                mode === "deep"
                  ? "border border-slate-200 bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Deep Explain
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            {mode === "quick"
              ? "Fast memory refresh with diagram and direct code template."
              : "Detailed beginner walkthrough with trace, mistakes, and interview framing."}
          </p>
        </div>

        <div className="mb-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        {mode === "quick" && (
          <div className="space-y-12">
            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">01 · Core idea</p>
              <div className="rounded-2xl border-l-4 border-teal-500 bg-teal-50 p-5">
                <p className="text-[16px] leading-relaxed text-teal-900">
                  Use queue BFS, and at each outer loop read queue size to isolate one level.
                </p>
              </div>
              <p className="mt-3 text-[14px] text-slate-600">Each outer pass creates exactly one sub-array in the final answer.</p>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">02 · Mental model</p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <p className="mb-1 text-sm font-semibold text-teal-800">Outer while-loop</p>
                  <p className="text-[13px] leading-relaxed text-slate-500">Moves level by level until queue is empty.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <p className="mb-1 text-sm font-semibold text-sky-800">Inner for-loop</p>
                  <p className="text-[13px] leading-relaxed text-slate-500">Consumes fixed number of nodes from current level only.</p>
                </div>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">03 · Steps</p>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="space-y-4">
                  {QUICK_STEPS.map((step) => (
                    <div key={step.num} className="flex gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700">{step.num}</div>
                      <div>
                        <p className="text-[14px] font-medium text-slate-800">{step.title}</p>
                        <p className="text-[13px] text-slate-500">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">04 · Diagram</p>
              <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <TreeDiagram />
              </div>
              <p className="text-[13px] text-slate-500">Output order becomes level buckets: [ [1], [2, 3], [4, 5, 6, 7] ].</p>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">05 · Python template</p>
              <div className="overflow-hidden rounded-2xl bg-[#1e1e2e] shadow-lg shadow-slate-900/20">
                <div className="flex items-center gap-1.5 border-b border-slate-700/60 bg-[#2a2a3e] px-4 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-3 text-[11px] font-medium text-slate-300">level_order.py</span>
                </div>
                <pre className="overflow-x-auto p-5 text-sm leading-relaxed text-slate-100"><code>{`from collections import deque

class Solution:
    def levelOrder(self, root):
        if not root:
            return []

        ans = []
        q = deque([root])

        while q:
            level_size = len(q)
            level = []

            for _ in range(level_size):
                node = q.popleft()
                level.append(node.data)

                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)

            ans.append(level)

        return ans`}</code></pre>
              </div>
            </section>
          </div>
        )}

        {mode === "deep" && (
          <div className="space-y-12">
            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">01 · Problem framing</p>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <p className="mb-3 text-[14px] leading-relaxed text-slate-600">
                  Given a binary tree, return node values grouped by levels from top to bottom.
                </p>
                <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
                  <p className="text-sm font-semibold text-teal-800">Output format matters:</p>
                  <p className="mt-1 text-[13px] text-teal-700">Not a flat traversal. You must return nested list where each inner list is one depth level.</p>
                </div>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">02 · Step-by-step dry run</p>
              <div className="space-y-3">
                {TRACE_STEPS.map((step, index) => (
                  <div key={`${step.title}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${step.badgeClass}`}>
                        {step.badge}
                      </span>
                      <p className="text-sm font-semibold text-slate-800">{step.title}</p>
                    </div>
                    <p className="text-[13px] leading-relaxed text-slate-500">{step.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">03 · Common mistakes</p>
              <div className="grid gap-3 md:grid-cols-2">
                {COMMON_MISTAKES.map((mistake) => (
                  <div key={mistake.title} className="rounded-2xl border border-rose-100 bg-rose-50/60 p-5">
                    <p className="mb-1 text-sm font-semibold text-rose-800">{mistake.title}</p>
                    <p className="text-[13px] leading-relaxed text-rose-700">{mistake.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">04 · Complexity</p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                  <p className="mb-1 text-sm font-semibold text-emerald-800">Time Complexity</p>
                  <p className="text-[13px] text-emerald-700">O(n), each node is pushed and popped once.</p>
                </div>
                <div className="rounded-2xl border border-sky-100 bg-sky-50 p-5">
                  <p className="mb-1 text-sm font-semibold text-sky-800">Space Complexity</p>
                  <p className="text-[13px] text-sky-700">O(w), queue can hold one widest level.</p>
                </div>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">05 · Interview Q and A</p>
              <div className="space-y-3">
                {QA_ITEMS.map((item) => (
                  <div key={item.q} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                    <p className="mb-1.5 text-sm font-semibold text-slate-800">Q: {item.q}</p>
                    <p className="text-[13px] leading-relaxed text-slate-500">A: {item.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">06 · Where this appears</p>
              <div className="grid gap-3 md:grid-cols-2">
                {INTERVIEW_CONTEXT.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-violet-100 bg-violet-50/60 p-5">
                    <p className="mb-1 text-sm font-semibold text-violet-800">{item.title}</p>
                    <p className="text-[13px] leading-relaxed text-violet-700">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </section>
  );
}

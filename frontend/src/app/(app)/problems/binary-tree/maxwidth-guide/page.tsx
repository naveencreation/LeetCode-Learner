"use client";

import { useState } from "react";
import Link from "next/link";

type TreeNodePoint = {
  id: number;
  x: number;
  y: number;
  idx: number;
};

const NODES: TreeNodePoint[] = [
  { id: 1, x: 170, y: 34, idx: 0 },
  { id: 3, x: 92, y: 92, idx: 1 },
  { id: 2, x: 250, y: 92, idx: 2 },
  { id: 5, x: 58, y: 150, idx: 1 },
  { id: 3, x: 126, y: 150, idx: 2 },
  { id: 9, x: 214, y: 150, idx: 3 },
  { id: 7, x: 286, y: 150, idx: 4 },
];

const EDGES: Array<[number, number]> = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
  [2, 5],
  [2, 6],
];

const QUICK_STEPS = [
  {
    num: 1,
    title: "Run BFS level by level",
    desc: "Store (node, index) in queue where index behaves like heap position.",
  },
  {
    num: 2,
    title: "Read first and last index per level",
    desc: "width = lastIndex - firstIndex + 1 before processing level nodes.",
  },
  {
    num: 3,
    title: "Normalize indices for safety",
    desc: "Subtract first index from all nodes in that level to avoid overflow growth.",
  },
  {
    num: 4,
    title: "Push children using virtual rules",
    desc: "left -> 2*i+1, right -> 2*i+2, then continue to next level.",
  },
];

const TRACE_STEPS = [
  {
    badge: "L0",
    badgeClass: "bg-blue-100 text-blue-700",
    title: "Queue starts with (1,0)",
    desc: "first=0, last=0, width=1. ans=1.",
  },
  {
    badge: "Push",
    badgeClass: "bg-violet-100 text-violet-700",
    title: "From node 1 enqueue (3,1), (2,2)",
    desc: "Next level queue has indices 1 and 2.",
  },
  {
    badge: "L1",
    badgeClass: "bg-blue-100 text-blue-700",
    title: "Level 1 first=1, last=2",
    desc: "width=2, ans=2. Normalize by subtracting first index.",
  },
  {
    badge: "Push",
    badgeClass: "bg-violet-100 text-violet-700",
    title: "Children become (5,1), (3,2), (9,3), (7,4)",
    desc: "Virtual gaps are preserved even if real nodes are missing.",
  },
  {
    badge: "L2",
    badgeClass: "bg-blue-100 text-blue-700",
    title: "Level 2 first=1, last=4",
    desc: "width=4, ans=4. This is the maximum width.",
  },
  {
    badge: "Done",
    badgeClass: "bg-emerald-100 text-emerald-700",
    title: "Traversal complete",
    desc: "Final answer = 4.",
  },
];

const COMMON_MISTAKES = [
  {
    title: "Counting node count instead of index span",
    desc: "Width is not number of present nodes only; include virtual gap positions.",
  },
  {
    title: "Forgetting normalization",
    desc: "Deep trees can cause huge indices if you keep growing absolute values.",
  },
  {
    title: "Computing width after processing level",
    desc: "Read first/last from current queue snapshot before popping that level.",
  },
  {
    title: "Using DFS for width directly",
    desc: "BFS level framing makes first/last index extraction much clearer.",
  },
];

const QA_ITEMS = [
  {
    q: "Why use virtual indices if nodes already have levels?",
    a: "Levels alone lose gap information. Index span captures holes between far-left and far-right nodes, which defines width.",
  },
  {
    q: "Why subtract first index each level?",
    a: "It keeps numbers small while preserving relative distances, so width calculations stay correct.",
  },
  {
    q: "Can index overflow happen in Python?",
    a: "Python ints are unbounded, but normalization is still best practice and required in fixed-width languages.",
  },
];

const INTERVIEW_CONTEXT = [
  {
    title: "LeetCode 662",
    desc: "Exact same max-width formulation with virtual indexing.",
  },
  {
    title: "Sparse tree layout systems",
    desc: "Index span logic mirrors UI/grid spacing for sparse hierarchies.",
  },
  {
    title: "Heap-index modeling",
    desc: "Demonstrates confidence in binary heap-style parent/child indexing.",
  },
  {
    title: "Level-order with metadata",
    desc: "Shows you can augment BFS state for richer interview constraints.",
  },
];

function nodeByIndex(index: number): TreeNodePoint {
  const node = NODES[index];
  if (!node) throw new Error(`Missing node index ${index}`);
  return node;
}

function TreeDiagram() {
  return (
    <svg viewBox="0 0 340 200" className="h-[230px] w-full rounded-2xl border border-slate-200 bg-white p-3">
      {[0, 1, 2, 3, 4].map((virtualIndex, i) => {
        const x = 46 + i * 62;
        return (
          <g key={virtualIndex}>
            <line x1={x} y1={18} x2={x} y2={182} stroke="#cbd5e1" strokeWidth="1.2" strokeDasharray="5 4" />
            <text x={x} y={12} textAnchor="middle" className="fill-slate-500 text-[10px] font-semibold">
              i={virtualIndex}
            </text>
          </g>
        );
      })}

      {EDGES.map(([from, to]) => {
        const source = nodeByIndex(from);
        const target = nodeByIndex(to);
        return <line key={`${from}-${to}`} x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke="#cbd5e1" strokeWidth="1.8" />;
      })}

      {NODES.map((node, i) => {
        const isLastLevel = node.y >= 145;
        return (
          <g key={i}>
            <circle cx={node.x} cy={node.y} r="17" fill={isLastLevel ? "#dbeafe" : "#e0f2fe"} stroke="#0284c7" strokeWidth="2" />
            <text x={node.x} y={node.y + 5} textAnchor="middle" className="fill-[#0c4a6e] text-sm font-semibold">
              {node.id}
            </text>
            <text x={node.x} y={node.y + 28} textAnchor="middle" className="fill-slate-400 text-[9px]">
              idx={node.idx}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function MaxWidthGuidePage() {
  const [mode, setMode] = useState<"quick" | "deep">("quick");

  return (
    <section className="relative min-h-0 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50/30">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,#dbeafe_0%,transparent_50%),radial-gradient(ellipse_at_bottom_left,#fef3c7_0%,transparent_50%)]" />

      <div className="relative z-[1] mx-auto max-w-[860px] px-6 py-6">
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-sky-500" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-600">Binary Tree · BFS + Virtual Index</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/problems/binary-tree/max-width-of-a-binary-tree"
                className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 transition hover:bg-sky-100"
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

          <h1 className="text-3xl font-semibold text-slate-900 mb-2">Max Width of a Binary Tree</h1>
          <p className="text-base text-slate-500 mb-5 max-w-xl">
            Measure each level using virtual heap indices and track the maximum index span.
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200 px-3 py-1.5 text-xs font-medium text-sky-700"><span className="h-1.5 w-1.5 rounded-full bg-sky-500" />BFS</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 border border-violet-200 px-3 py-1.5 text-xs font-medium text-violet-700"><span className="h-1.5 w-1.5 rounded-full bg-violet-500" />Virtual Index</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Level Order</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-700"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />Interview Classic</span>
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

        {mode === "quick" && (
          <div className="space-y-12">
            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">01 · The rule</p>
              <div className="rounded-2xl border-l-4 border-sky-500 bg-sky-50 p-5">
                <p className="text-[16px] leading-relaxed text-sky-900">
                  Width at each level is lastVirtualIndex - firstVirtualIndex + 1, not just node count.
                </p>
              </div>
              <p className="mt-3 text-[14px] text-slate-600">Virtual indices keep gap positions that are hidden in sparse trees.</p>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">02 · Why virtual indexing</p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <p className="mb-1 text-sm font-semibold text-sky-800">Without index span</p>
                  <p className="text-[13px] leading-relaxed text-slate-500">You undercount width when missing nodes create large gaps.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <p className="mb-1 text-sm font-semibold text-violet-800">With index span</p>
                  <p className="text-[13px] leading-relaxed text-slate-500">You capture true conceptual width including null positions.</p>
                </div>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">03 · How to think</p>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="space-y-4">
                  {QUICK_STEPS.map((step) => (
                    <div key={step.num} className="flex gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-700">{step.num}</div>
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
              <p className="text-[13px] text-slate-500">Level 2 has first=1, last=4, so width is <span className="font-mono text-slate-700">4</span>.</p>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">05 · Code</p>
              <div className="overflow-hidden rounded-2xl bg-[#1e1e2e] shadow-lg shadow-slate-900/20">
                <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-7 text-[#cdd6f4]">
{`from collections import deque

def widthOfBinaryTree(root):
    if not root:
        return 0

    q = deque([(root, 0)])
    ans = 0

    while q:
        first = q[0][1]
        last = q[-1][1]
        ans = max(ans, last - first + 1)

        for _ in range(len(q)):
            node, idx = q.popleft()
            idx -= first
            if node.left:
                q.append((node.left, 2 * idx + 1))
            if node.right:
                q.append((node.right, 2 * idx + 2))

    return ans`}
                </pre>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">06 · Complexity</p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-sky-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-sky-700">Time</p>
                  <p className="mt-1 font-mono text-3xl font-semibold text-sky-900">O(n)</p>
                  <p className="mt-2 text-[13px] text-sky-700">Each node is processed exactly once.</p>
                </div>
                <div className="rounded-2xl bg-violet-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">Space</p>
                  <p className="mt-1 font-mono text-3xl font-semibold text-violet-900">O(w)</p>
                  <p className="mt-2 text-[13px] text-violet-700">Queue stores one level at a time, where w is max level width.</p>
                </div>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">07 · Interview uses</p>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="space-y-3">
                  {INTERVIEW_CONTEXT.map((item) => (
                    <div key={item.title} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                      <p className="text-[14px] leading-relaxed text-slate-700"><span className="font-medium text-slate-800">{item.title}:</span> {item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {mode === "deep" && (
          <div className="space-y-12">
            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">01 · What is max width here?</p>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">Index span, not just visible node count</h2>
              <p className="mb-4 text-[15px] leading-relaxed text-slate-700">
                Max width is measured between leftmost and rightmost non-null nodes at a level, counting the conceptual null gaps between them.
              </p>
              <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <TreeDiagram />
              </div>
              <div className="rounded-2xl border-l-4 border-sky-500 bg-sky-50 p-4">
                <p className="text-[14px] leading-relaxed text-sky-900">Virtual indexing captures hidden null spaces, which plain node counting misses.</p>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">02 · Why this problem is tricky</p>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">Three common confusion points</h2>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="grid grid-cols-[34px_1fr] bg-slate-50">
                  <div className="border-r border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-500">#</div>
                  <div className="px-4 py-2 text-[11px] font-semibold text-slate-500">Pitfall</div>
                </div>
                <div className="grid grid-cols-[34px_1fr] border-t border-slate-100">
                  <div className="border-r border-slate-100 px-3 py-2 text-[13px] text-slate-500">1</div>
                  <div className="px-4 py-2 text-[14px] text-slate-700">Width is not the number of nodes currently in queue level.</div>
                </div>
                <div className="grid grid-cols-[34px_1fr] border-t border-slate-100 bg-slate-50/60">
                  <div className="border-r border-slate-100 px-3 py-2 text-[13px] text-slate-500">2</div>
                  <div className="px-4 py-2 text-[14px] text-slate-700">Indices can explode on deep trees if you skip normalization.</div>
                </div>
                <div className="grid grid-cols-[34px_1fr] border-t border-slate-100">
                  <div className="border-r border-slate-100 px-3 py-2 text-[13px] text-slate-500">3</div>
                  <div className="px-4 py-2 text-[14px] text-slate-700">Width must be captured before processing nodes of the current level.</div>
                </div>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">03 · Why BFS with index metadata</p>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">Level boundaries make width direct</h2>
              <p className="mb-4 text-[15px] leading-relaxed text-slate-700">BFS naturally provides a per-level queue snapshot, so first and last indices are trivial to read.</p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border-2 border-sky-300 bg-sky-50 p-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-sky-700">BFS</p>
                  <p className="text-[13px] leading-relaxed text-sky-900">Direct per-level width extraction with queue front/back indices.</p>
                </div>
                <div className="rounded-2xl bg-violet-50 p-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet-700">DFS</p>
                  <p className="text-[13px] leading-relaxed text-violet-900">Possible but needs first-index tracking map per depth, less intuitive for beginners.</p>
                </div>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">04 · Real-world analogy</p>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">Seats in a theater row</h2>
              <div className="rounded-2xl bg-amber-50 p-5">
                <p className="text-[15px] leading-relaxed text-amber-900">
                  Imagine rows of theater seats where some seats are empty. Width is measured from first occupied to last occupied seat, including empty seats between.
                </p>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">05 · Code line by line</p>
              <h2 className="mb-4 text-xl font-semibold text-slate-900">Understand each decision</h2>
              <div className="overflow-hidden rounded-2xl bg-[#1e1e2e] shadow-lg shadow-slate-900/20">
                <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-7 text-[#cdd6f4]">
{`from collections import deque

def widthOfBinaryTree(root):
    if not root:
        return 0

    q = deque([(root, 0)])
    ans = 0

    while q:
        first = q[0][1]
        last = q[-1][1]
        ans = max(ans, last - first + 1)

        for _ in range(len(q)):
            node, idx = q.popleft()
            idx -= first
            if node.left:
                q.append((node.left, 2 * idx + 1))
            if node.right:
                q.append((node.right, 2 * idx + 2))

    return ans`}
                </pre>
              </div>
              <div className="mt-4 space-y-3">
                {QA_ITEMS.map((item) => (
                  <div key={item.q} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <p className="bg-slate-50 px-4 py-3 text-[14px] font-medium text-slate-800">{item.q}</p>
                    <p className="border-t border-slate-200 px-4 py-3 text-[14px] leading-relaxed text-slate-700">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">06 · Full trace</p>
              <h2 className="mb-4 text-xl font-semibold text-slate-900">Every BFS width update step</h2>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="space-y-4">
                  {TRACE_STEPS.map((step) => (
                    <div key={step.title} className="flex items-start gap-4">
                      <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${step.badgeClass}`}>{step.badge}</span>
                      <div>
                        <p className="mb-0.5 text-sm font-medium text-slate-800">{step.title}</p>
                        <p className="text-[13px] leading-relaxed text-slate-500">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">07 · Common beginner mistakes</p>
              <h2 className="mb-4 text-xl font-semibold text-slate-900">What breaks correctness</h2>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="space-y-3">
                  {COMMON_MISTAKES.map((mistake) => (
                    <div key={mistake.title} className="flex gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-[11px] font-semibold text-rose-700">x</div>
                      <div>
                        <p className="text-[14px] font-medium text-slate-800">{mistake.title}</p>
                        <p className="text-[13px] leading-relaxed text-slate-500">{mistake.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">08 · Complexity full explanation</p>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">Why O(n) time and O(w) space</h2>
              <div className="mb-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-sky-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-sky-700">Time</p>
                  <p className="mt-1 font-mono text-3xl font-semibold text-sky-900">O(n)</p>
                  <p className="mt-2 text-[13px] text-sky-700">Every node enters and leaves the queue once.</p>
                </div>
                <div className="rounded-2xl bg-violet-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">Space</p>
                  <p className="mt-1 font-mono text-3xl font-semibold text-violet-900">O(w)</p>
                  <p className="mt-2 text-[13px] text-violet-700">Queue stores at most one level with width w.</p>
                </div>
              </div>
              <div className="rounded-2xl border-l-4 border-amber-500 bg-amber-50 p-4">
                <p className="text-[14px] leading-relaxed text-amber-900">Normalization does not change complexity; it prevents index blow-up and keeps arithmetic safe.</p>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">09 · Interview context</p>
              <h2 className="mb-4 text-xl font-semibold text-slate-900">Where this pattern appears</h2>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="space-y-3">
                  {INTERVIEW_CONTEXT.map((item) => (
                    <div key={item.title} className="flex gap-2 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                      <div>
                        <p className="text-[14px] font-medium text-slate-800">{item.title}</p>
                        <p className="text-[13px] leading-relaxed text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-sky-50/30 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[15px] font-medium text-slate-800">Ready to see it in action?</p>
              <p className="text-[13px] text-slate-500 mt-0.5">Step through the visualizer to watch index normalization and width updates live.</p>
            </div>
            <Link
              href="/problems/binary-tree/max-width-of-a-binary-tree"
              className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-sky-600/20 transition hover:bg-sky-700 hover:shadow-lg hover:shadow-sky-600/25"
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

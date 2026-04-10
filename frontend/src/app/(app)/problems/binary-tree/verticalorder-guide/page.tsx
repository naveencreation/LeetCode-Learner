"use client";

import Link from "next/link";
import { useState } from "react";

type TreeNodePoint = {
  id: number;
  x: number;
  y: number;
  col: number;
  row: number;
};

const NODES: TreeNodePoint[] = [
  { id: 1, x: 170, y: 36, col: 0, row: 0 },
  { id: 2, x: 90, y: 92, col: -1, row: 1 },
  { id: 3, x: 250, y: 92, col: 1, row: 1 },
  { id: 4, x: 56, y: 148, col: -2, row: 2 },
  { id: 5, x: 122, y: 148, col: 0, row: 2 },
  { id: 6, x: 220, y: 148, col: 0, row: 2 },
  { id: 7, x: 284, y: 148, col: 2, row: 2 },
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
    title: "BFS with (node, col, row)",
    desc: "Root is (0,0). Left child is (col-1,row+1), right child is (col+1,row+1).",
  },
  {
    num: 2,
    title: "Build colMap",
    desc: "Append (row,val) into each column bucket. Never overwrite existing values.",
  },
  {
    num: 3,
    title: "Sort each bucket",
    desc: "Sort by (row,val) so ties on same row are resolved by value.",
  },
  {
    num: 4,
    title: "Read columns left to right",
    desc: "Sort column keys and output values for each column.",
  },
];

const TRACE_STEPS = [
  {
    badge: "Init",
    badgeClass: "bg-blue-100 text-blue-700",
    title: "Queue = [(1, col=0, row=0)]",
    desc: "Start BFS at root; colMap = {}.",
  },
  {
    badge: "Record",
    badgeClass: "bg-emerald-100 text-emerald-700",
    title: "Dequeue (1,0,0) -> colMap[0] = [(0,1)]",
    desc: "Enqueue 2(-1,1) and 3(+1,1).",
  },
  {
    badge: "Record",
    badgeClass: "bg-emerald-100 text-emerald-700",
    title: "Dequeue (2,-1,1) -> colMap[-1] = [(1,2)]",
    desc: "Enqueue 4(-2,2) and 5(0,2).",
  },
  {
    badge: "Record",
    badgeClass: "bg-emerald-100 text-emerald-700",
    title: "Dequeue (3,+1,1) -> colMap[+1] = [(1,3)]",
    desc: "Enqueue 6(0,2) and 7(+2,2).",
  },
  {
    badge: "Record",
    badgeClass: "bg-emerald-100 text-emerald-700",
    title: "Dequeue (4,-2,2) -> colMap[-2] = [(2,4)]",
    desc: "Leaf node, no enqueue.",
  },
  {
    badge: "Record",
    badgeClass: "bg-emerald-100 text-emerald-700",
    title: "Dequeue (5,0,2) -> colMap[0] = [(0,1),(2,5)]",
    desc: "Same column as root, different row.",
  },
  {
    badge: "Record",
    badgeClass: "bg-emerald-100 text-emerald-700",
    title: "Dequeue (6,0,2) -> colMap[0] = [(0,1),(2,5),(2,6)]",
    desc: "Same (col,row) as node 5; value tie-break needed.",
  },
  {
    badge: "Record",
    badgeClass: "bg-emerald-100 text-emerald-700",
    title: "Dequeue (7,+2,2) -> colMap[+2] = [(2,7)]",
    desc: "Queue empty; BFS collection complete.",
  },
  {
    badge: "Sort",
    badgeClass: "bg-violet-100 text-violet-700",
    title: "Sort each column by (row,val)",
    desc: "col 0 stays [(0,1),(2,5),(2,6)] and outputs [1,5,6].",
  },
  {
    badge: "Done",
    badgeClass: "bg-amber-100 text-amber-700",
    title: "Final result",
    desc: "[[4], [2], [1,5,6], [3], [7]]",
  },
];

const COMMON_MISTAKES = [
  {
    title: "Overwriting instead of appending",
    desc: "Vertical order keeps all nodes in each column. Assignment loses data.",
  },
  {
    title: "Not storing row with value",
    desc: "Without row metadata, correct top-to-bottom ordering is impossible.",
  },
  {
    title: "Skipping value tie-break",
    desc: "If two nodes share same (col,row), smaller value must come first.",
  },
  {
    title: "Not sorting columns",
    desc: "Output must be left-to-right by column key, not insertion order.",
  },
  {
    title: "Confusing with bottom view",
    desc: "Bottom view keeps one node per column; vertical order keeps all nodes.",
  },
];

const QA_ITEMS = [
  {
    q: "Why store (row,val) instead of just val?",
    a: "Because each column output must be sorted by row first and value second. Storing only value loses row information.",
  },
  {
    q: "Does sorted() on tuples handle row then value?",
    a: "Yes. Python tuple sorting is lexicographic: first element, then second when tied.",
  },
  {
    q: "Why defaultdict(list)?",
    a: "It creates bucket lists automatically so colMap[col].append(...) works without key-existence checks.",
  },
];

const INTERVIEW_CONTEXT = [
  {
    title: "LeetCode 987",
    desc: "Exact same ordering contract. Tie-handling on same (col,row) is the key differentiator.",
  },
  {
    title: "Top/Bottom view relation",
    desc: "Both are reduced forms of this coordinate model with one-node-per-column selection.",
  },
  {
    title: "Column-wise tree output",
    desc: "Any vertical grouping output relies on the same col,row representation.",
  },
  {
    title: "BFS + metadata confidence",
    desc: "Demonstrates queue-state modeling and deterministic post-processing.",
  },
];

function nodeById(id: number): TreeNodePoint {
  const node = NODES.find((item) => item.id === id);
  if (!node) {
    throw new Error(`Missing node ${id}`);
  }
  return node;
}

function TreeDiagram() {
  return (
    <svg viewBox="0 0 340 190" className="h-[230px] w-full rounded-2xl border border-slate-200 bg-white p-3">
      {[-2, -1, 0, 1, 2].map((col, index) => {
        const x = 46 + index * 62;
        return (
          <g key={`col-${col}`}>
            <line x1={x} y1={18} x2={x} y2={174} stroke="#cbd5e1" strokeWidth="1.2" strokeDasharray="5 4" />
            <text x={x} y={12} textAnchor="middle" className="fill-slate-500 text-[10px] font-semibold">
              {col}
            </text>
          </g>
        );
      })}

      {EDGES.map(([from, to]) => {
        const source = nodeById(from);
        const target = nodeById(to);
        return <line key={`${from}-${to}`} x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke="#cbd5e1" strokeWidth="1.7" />;
      })}

      {NODES.map((node) => (
        <g key={node.id}>
          <circle cx={node.x} cy={node.y} r="17" fill="#e6f1fb" stroke="#378add" strokeWidth="1.8" />
          <text x={node.x} y={node.y + 5} textAnchor="middle" className="fill-[#0c447c] text-sm font-semibold">
            {node.id}
          </text>
          <text x={node.x} y={node.y + 30} textAnchor="middle" className="fill-slate-400 text-[9px]">
            ({node.col},{node.row})
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function VerticalOrderGuidePage() {
  const [mode, setMode] = useState<"quick" | "deep">("quick");

  return (
    <section className="relative min-h-0 overflow-hidden bg-gradient-to-br from-slate-50 via-slate-50 to-emerald-50/20">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,#e0f2fe_0%,transparent_48%),radial-gradient(ellipse_at_bottom_left,#e2f6ef_0%,transparent_52%)]" />

      <div className="relative z-[1] mx-auto max-w-[860px] px-6 py-6">
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-px w-8 bg-sky-500" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-600">Binary Tree · BFS + Sorting</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/problems/binary-tree/vertical-order-traversal"
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

        <h1 className="text-3xl font-semibold text-slate-900 mb-2">Vertical Order Traversal</h1>
        <p className="text-base text-slate-500 mb-5 max-w-xl">
          Group all nodes by column, then by row, then by value; return columns from left to right.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />BFS</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-200 px-3 py-1.5 text-xs font-medium text-purple-700"><span className="h-1.5 w-1.5 rounded-full bg-purple-500" />Sorting</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-700"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />HashMap</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200 px-3 py-1.5 text-xs font-medium text-sky-700"><span className="h-1.5 w-1.5 rounded-full bg-sky-500" />LeetCode 987</span>
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
            <div className="rounded-xl border-l-4 border-blue-500 bg-blue-50 p-4">
              <p className="text-[16px] leading-relaxed text-blue-900">
                Assign each node a (col,row), group by col, sort each group by (row,val), then return columns left to right.
              </p>
            </div>
            <p className="mt-3 text-[14px] text-slate-600">Root: (0,0). Left child: col-1. Right child: col+1. Every level adds row+1.</p>
          </section>

          <section>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">02 · The key difference</p>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="mb-1 text-sm font-semibold text-blue-800">Top/Bottom view</p>
                <p className="text-[13px] text-slate-600">Keeps one node per column.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="mb-1 text-sm font-semibold text-emerald-800">Vertical order</p>
                <p className="text-[13px] text-slate-600">Keeps all nodes per column and sorts deterministically.</p>
              </div>
            </div>
          </section>

          <section>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">03 · How to think</p>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="space-y-4">
                {QUICK_STEPS.map((step) => (
                  <div key={step.num} className="flex gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">{step.num}</div>
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
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="grid grid-cols-[80px_1fr_140px] bg-slate-50">
                <div className="border-r border-slate-200 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Column</div>
                <div className="border-r border-slate-200 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Nodes (row,val)</div>
                <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Output</div>
              </div>
              <div className="grid grid-cols-[80px_1fr_140px] border-t border-slate-100 text-[13px] text-slate-700">
                <div className="border-r border-slate-100 px-4 py-2 font-mono">-2</div>
                <div className="border-r border-slate-100 px-4 py-2">(2,4)</div>
                <div className="px-4 py-2">[4]</div>
              </div>
              <div className="grid grid-cols-[80px_1fr_140px] border-t border-slate-100 bg-slate-50/60 text-[13px] text-slate-700">
                <div className="border-r border-slate-100 px-4 py-2 font-mono">-1</div>
                <div className="border-r border-slate-100 px-4 py-2">(1,2)</div>
                <div className="px-4 py-2">[2]</div>
              </div>
              <div className="grid grid-cols-[80px_1fr_140px] border-t border-slate-100 text-[13px] text-slate-700">
                <div className="border-r border-slate-100 px-4 py-2 font-mono">0</div>
                <div className="border-r border-slate-100 px-4 py-2">(0,1), (2,5), (2,6)</div>
                <div className="px-4 py-2 font-medium text-slate-900">[1,5,6]</div>
              </div>
              <div className="grid grid-cols-[80px_1fr_140px] border-t border-slate-100 bg-slate-50/60 text-[13px] text-slate-700">
                <div className="border-r border-slate-100 px-4 py-2 font-mono">+1</div>
                <div className="border-r border-slate-100 px-4 py-2">(1,3)</div>
                <div className="px-4 py-2">[3]</div>
              </div>
              <div className="grid grid-cols-[80px_1fr_140px] border-t border-slate-100 text-[13px] text-slate-700">
                <div className="border-r border-slate-100 px-4 py-2 font-mono">+2</div>
                <div className="border-r border-slate-100 px-4 py-2">(2,7)</div>
                <div className="px-4 py-2">[7]</div>
              </div>
            </div>
            <p className="mt-2 text-[13px] text-slate-500">Final answer: <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-700">[[4], [2], [1,5,6], [3], [7]]</span></p>
          </section>

          <section>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">05 · Code</p>
            <div className="overflow-hidden rounded-2xl bg-[#1e1e2e] shadow-lg shadow-slate-900/20">
              <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-7 text-[#cdd6f4]">
{`from collections import defaultdict, deque

def verticalOrder(root):
    if not root:
        return []
    col_map = defaultdict(list)
    queue = deque([(root, 0, 0)])

    while queue:
        node, col, row = queue.popleft()
        col_map[col].append((row, node.val))
        if node.left:
            queue.append((node.left, col-1, row+1))
        if node.right:
            queue.append((node.right, col+1, row+1))

    result = []
    for col in sorted(col_map):
        sorted_nodes = sorted(col_map[col])
        result.append([v for _, v in sorted_nodes])
    return result`}
              </pre>
            </div>
          </section>

          <section>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">06 · Complexity</p>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl bg-blue-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Time</p>
                <p className="mt-1 font-mono text-3xl font-semibold text-blue-900">O(n log n)</p>
                <p className="mt-2 text-[13px] text-blue-700">BFS O(n) + sorting O(n log n).</p>
              </div>
              <div className="rounded-xl bg-violet-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">Space</p>
                <p className="mt-1 font-mono text-3xl font-semibold text-violet-900">O(n)</p>
                <p className="mt-2 text-[13px] text-violet-700">Queue and col_map together hold all nodes.</p>
              </div>
            </div>
          </section>

          <section>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">07 · Interview uses</p>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="space-y-3">
                {INTERVIEW_CONTEXT.map((item) => (
                  <div key={item.title} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
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
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">01 · What does vertical order actually mean?</p>
            <h2 className="mb-3 text-xl font-semibold text-slate-900">Imagining the tree as a grid</h2>
            <p className="mb-4 text-[15px] leading-relaxed text-slate-700">
              Draw the tree on graph paper: each node has a column and row. Root is (0,0). Left shifts column left, right shifts column right, depth increases row.
            </p>
            <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <TreeDiagram />
            </div>
            <div className="rounded-xl border-l-4 border-blue-500 bg-blue-50 p-4">
              <p className="text-[14px] leading-relaxed text-blue-900">
                Vertical order keeps all nodes in a column. Nodes 5 and 6 share (0,2), so both appear and are sorted by value.
              </p>
            </div>
          </section>

          <section>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">02 · Why this is harder than top/bottom view</p>
            <h2 className="mb-3 text-xl font-semibold text-slate-900">Three things that make it tricky</h2>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="grid grid-cols-[34px_1fr] bg-slate-50">
                <div className="border-r border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-500">#</div>
                <div className="px-4 py-2 text-[11px] font-semibold text-slate-500">Challenge</div>
              </div>
              <div className="grid grid-cols-[34px_1fr] border-t border-slate-100">
                <div className="border-r border-slate-100 px-3 py-2 text-[13px] text-slate-500">1</div>
                <div className="px-4 py-2 text-[14px] text-slate-700">Multiple nodes can land in the same column.</div>
              </div>
              <div className="grid grid-cols-[34px_1fr] border-t border-slate-100 bg-slate-50/60">
                <div className="border-r border-slate-100 px-3 py-2 text-[13px] text-slate-500">2</div>
                <div className="px-4 py-2 text-[14px] text-slate-700">Some nodes share exact same (col,row), so value tie-break is required.</div>
              </div>
              <div className="grid grid-cols-[34px_1fr] border-t border-slate-100">
                <div className="border-r border-slate-100 px-3 py-2 text-[13px] text-slate-500">3</div>
                <div className="px-4 py-2 text-[14px] text-slate-700">You must sort after collection; BFS order alone is not enough.</div>
              </div>
            </div>
            <div className="mt-4 rounded-xl border-l-4 border-amber-500 bg-amber-50 p-4">
              <p className="text-[14px] leading-relaxed text-amber-900">Most common mistake: not sorting by value when (col,row) are equal.</p>
            </div>
          </section>

          <section>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">03 · Why BFS with (col,row)</p>
            <h2 className="mb-3 text-xl font-semibold text-slate-900">Why not DFS?</h2>
            <p className="mb-4 text-[15px] leading-relaxed text-slate-700">Both BFS and DFS are valid. BFS is usually easier to explain and reason about for row tracking.</p>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border-2 border-blue-300 bg-blue-50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-700">BFS - recommended</p>
                <p className="text-[13px] leading-relaxed text-blue-900">Natural level order flow, straightforward queue state, cleaner explanation.</p>
              </div>
              <div className="rounded-xl bg-violet-50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet-700">DFS - also valid</p>
                <p className="text-[13px] leading-relaxed text-violet-900">Carry col,row recursively, then do the same sorting step at the end.</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border-l-4 border-emerald-500 bg-emerald-50 p-4">
              <p className="text-[14px] leading-relaxed text-emerald-900">Both end up O(n log n) because sorting dominates.</p>
            </div>
          </section>

          <section>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">04 · Real-world analogy</p>
            <h2 className="mb-3 text-xl font-semibold text-slate-900">Think of a city skyline</h2>
            <div className="rounded-xl bg-amber-50 p-4">
              <p className="text-[15px] leading-relaxed text-amber-900">
                Columns are street positions; rows are building floors. Vertical order reads buildings left to right and floors top to bottom.
              </p>
            </div>
            <div className="mt-4 rounded-xl border-l-4 border-blue-500 bg-blue-50 p-4">
              <p className="text-[14px] leading-relaxed text-blue-900">Top/bottom view keeps one floor per building. Vertical order lists every floor.</p>
            </div>
          </section>

          <section>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">05 · Code line by line</p>
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Understanding each decision</h2>
            <div className="overflow-hidden rounded-2xl bg-[#1e1e2e] shadow-lg shadow-slate-900/20">
              <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-7 text-[#cdd6f4]">
{`from collections import defaultdict, deque

def verticalOrder(root):
    if not root:
        return []

    col_map = defaultdict(list)
    queue = deque([(root, 0, 0)])

    while queue:
        node, col, row = queue.popleft()
        col_map[col].append((row, node.val))

        if node.left:
            queue.append((node.left, col - 1, row + 1))
        if node.right:
            queue.append((node.right, col + 1, row + 1))

    result = []
    for col in sorted(col_map):
        sorted_nodes = sorted(col_map[col])
        result.append([v for _, v in sorted_nodes])

    return result`}
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
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Every BFS step on the sample tree</h2>
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
            <h2 className="mb-4 text-xl font-semibold text-slate-900">What trips people up</h2>
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
            <h2 className="mb-3 text-xl font-semibold text-slate-900">Why O(n log n) time and O(n) space</h2>
            <div className="mb-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl bg-blue-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Time</p>
                <p className="mt-1 font-mono text-3xl font-semibold text-blue-900">O(n log n)</p>
                <p className="mt-2 text-[13px] text-blue-700">BFS is linear; sorting buckets/keys determines final complexity.</p>
              </div>
              <div className="rounded-xl bg-violet-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">Space</p>
                <p className="mt-1 font-mono text-3xl font-semibold text-violet-900">O(n)</p>
                <p className="mt-2 text-[13px] text-violet-700">Queue and col_map can store all nodes in worst case.</p>
              </div>
            </div>
            <div className="rounded-xl border-l-4 border-amber-500 bg-amber-50 p-4">
              <p className="text-[14px] leading-relaxed text-amber-900">Interview tip: general-case O(n) is not possible because ordering requires sorting.</p>
            </div>
          </section>

          <section>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">09 · Interview context</p>
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Where this shows up in interviews</h2>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="space-y-3">
                {INTERVIEW_CONTEXT.map((item) => (
                  <div key={item.title} className="flex gap-2 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
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
          <p className="text-[13px] text-slate-500 mt-0.5">Step through the visualizer to watch col_map fill column by column.</p>
        </div>
        <Link
          href="/problems/binary-tree/vertical-order-traversal"
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

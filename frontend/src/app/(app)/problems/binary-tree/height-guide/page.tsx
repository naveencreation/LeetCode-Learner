"use client";

import { useState } from "react";
import Link from "next/link";

/* ═══════════════ Types ═══════════════ */

type TreeNodePoint = {
  id: number;
  x: number;
  y: number;
};

/* ═══════════════ Tree SVG Data ═══════════════ */

const NODES: TreeNodePoint[] = [
  { id: 1, x: 160, y: 36 },
  { id: 2, x: 96, y: 90 },
  { id: 3, x: 224, y: 90 },
  { id: 4, x: 60, y: 152 },
  { id: 5, x: 132, y: 152 },
  { id: 6, x: 192, y: 152 },
  { id: 7, x: 260, y: 152 },
];

const EDGES: Array<[number, number]> = [
  [1, 2], [1, 3], [2, 4], [2, 5], [3, 6], [3, 7],
];

function nodeById(id: number): TreeNodePoint {
  const node = NODES.find((item) => item.id === id);
  if (!node) throw new Error(`Missing node ${id}`);
  return node;
}

/* ═══════════════ Shared Tree Diagram ═══════════════ */

function TreeDiagram({ highlightLeaves = false }: { highlightLeaves?: boolean }) {
  return (
    <svg viewBox="0 0 320 200" width="300" height="180" xmlns="http://www.w3.org/2000/svg" className="max-w-[320px]">
      {EDGES.map(([from, to]) => {
        const source = nodeById(from);
        const target = nodeById(to);
        return (
          <line
            key={`${from}-${to}`}
            x1={source.x} y1={source.y}
            x2={target.x} y2={target.y}
            stroke="#79B2EC" strokeWidth="1.5"
          />
        );
      })}
      {NODES.map((node) => {
        const isLeaf = node.id >= 4;
        const fill = highlightLeaves && isLeaf ? "#DBF5EE" : "#E9F3FE";
        const stroke = highlightLeaves && isLeaf ? "#1D9E75" : "#2B83DA";
        const textColor = highlightLeaves && isLeaf ? "#085041" : "#0F4D8A";
        return (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r="22" fill={fill} stroke={stroke} strokeWidth="1.5" />
            <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="13" fontWeight="500" fill={textColor}>{node.id}</text>
            {highlightLeaves && isLeaf ? (
              <text x={node.x} y={node.y + 30} textAnchor="middle" fontSize="10" fill="#1D9E75">leaf</text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

/* ═══════════════ Quick Mode Data ═══════════════ */

const DRY_RUN_STEPS = [
  { num: 1, node: 4, what: "Leaf node returns height 1.", highlight: false },
  { num: 2, node: 5, what: "Leaf node returns height 1.", highlight: false },
  { num: 3, node: 2, what: "height(2) = 1 + max(1, 1) = 2", highlight: true },
  { num: 4, node: 6, what: "Leaf node returns height 1.", highlight: false },
  { num: 5, node: 7, what: "Leaf node returns height 1.", highlight: false },
  { num: 6, node: 3, what: "height(3) = 1 + max(1, 1) = 2", highlight: true },
  { num: 7, node: 1, what: "height(1) = 1 + max(2, 2) = 3", highlight: true },
];

const INTERVIEW_ITEMS = [
  { title: "Balanced Binary Tree", desc: "Compare left and right subtree heights at each node." },
  { title: "Diameter of Binary Tree", desc: "Use heights to compute longest path through each node." },
  { title: "Max Path / Tree DP", desc: "Height is a core subroutine in many tree DP problems." },
  { title: "Platform difference checks", desc: "Some sites ask node depth, others ask edge height." },
];

/* ═══════════════ Deep Mode Data ═══════════════ */

const TRACE_STEPS = [
  { phase: "Enter", phaseClass: "bg-blue-100 text-blue-700", title: "Start at root 1", desc: "Call maxDepth(1). Need left and right subtree heights first." },
  { phase: "Left", phaseClass: "bg-cyan-100 text-cyan-700", title: "Traverse into node 2", desc: "Again recurse left and right before computing node 2 height." },
  { phase: "Base", phaseClass: "bg-amber-100 text-amber-700", title: "Leaves return 1", desc: "Node 4 and node 5 have no children, each returns 1." },
  { phase: "Compute", phaseClass: "bg-indigo-100 text-indigo-700", title: "Compute height of node 2", desc: "height(2)=1+max(1,1)=2." },
  { phase: "Right", phaseClass: "bg-cyan-100 text-cyan-700", title: "Traverse into node 3", desc: "Node 6 and 7 similarly return 1, then node 3 returns 2." },
  { phase: "Finish", phaseClass: "bg-emerald-100 text-emerald-700", title: "Compute root height", desc: "height(1)=1+max(2,2)=3, final maximum depth is 3." },
];

const COMMON_MISTAKES = [
  {
    icon: "✕",
    title: "Returning 1 for null node",
    desc: "Base case for null should return 0 in node-count depth formulation.",
  },
  {
    icon: "✕",
    title: "Mixing edge-height and node-depth",
    desc: "LeetCode style uses nodes. HackerRank style may use edges. Convert carefully.",
  },
  {
    icon: "✕",
    title: "Forgetting +1 for current node",
    desc: "Formula is 1 + max(left, right). Missing +1 undercounts depth.",
  },
  {
    icon: "✕",
    title: "Assuming balanced recursion depth",
    desc: "Skewed trees can make recursion stack O(n) in worst case.",
  },
];

const QA_ITEMS = [
  {
    q: "Why do we compute from leaves upward?",
    a: "Each parent depends on child subtree heights, so recursion naturally resolves bottom-up.",
  },
  {
    q: "Can BFS solve height too?",
    a: "Yes. Count levels in queue BFS. Both DFS and BFS are O(n).",
  },
  {
    q: "How to convert node-depth to edge-height?",
    a: "For non-empty tree: edge height = node depth - 1. For empty tree both are 0 by convention in many platforms.",
  },
];

/* ═══════════════ Quick Mode Section ═══════════════ */

function QuickMode() {
  return (
    <>
      <div className="mb-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Problem Statement</h3>
              <p className="text-sm text-slate-500">Height (Maximum Depth) of Binary Tree</p>
            </div>
          </div>
          <div className="text-[15px] leading-relaxed text-slate-700 mb-5">
            Given the root of a binary tree, return the maximum depth, which is the number of nodes on the longest root-to-leaf path.
          </div>

          <div className="space-y-3">
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Example 1</div>
              <div className="px-4 py-3">
                <p className="text-[13px] font-mono text-slate-600 mb-2">Input: [3,9,20,null,null,15,7]</p>
                <p className="text-[13px] font-mono text-blue-700">Output: 3</p>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Example 2</div>
              <div className="px-4 py-3">
                <p className="text-[13px] font-mono text-slate-600 mb-2">Input: [1,null,2]</p>
                <p className="text-[13px] font-mono text-blue-700">Output: 2</p>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-lg bg-slate-50 p-4 border border-slate-200">
            <p className="text-xs font-semibold text-slate-600 mb-2">Constraints</p>
            <ul className="text-[13px] text-slate-600 space-y-1">
              <li className="flex items-start gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />Nodes range: <span className="font-mono text-slate-800">[0, 10^4]</span></li>
              <li className="flex items-start gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />Node values range: <span className="font-mono text-slate-800">[-100, 100]</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">01</span>
          <h2 className="text-xl font-semibold text-slate-900">The Formula</h2>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white shadow-lg shadow-blue-500/20">
          <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-white/10" />
          <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-6 translate-y-6 rounded-full bg-white/10" />
          <div className="relative">
            <p className="text-2xl font-semibold tracking-wide mb-2">height(node) = 1 + max(left, right)</p>
            <p className="text-blue-100 text-sm leading-relaxed">Null node contributes 0 depth in node-count formulation.</p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">02</span>
          <h2 className="text-xl font-semibold text-slate-900">How to Think</h2>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
          {[
            { n: 1, text: "Go to leaves first", sub: "Leaves are smallest subproblems and return 1." },
            { n: 2, text: "Return subtree height", sub: "Each call returns one integer to parent." },
            { n: 3, text: "Take max of both sides", sub: "Longest branch determines depth at each node." },
          ].map((item) => (
            <div key={item.n} className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">{item.n}</div>
              <div>
                <p className="text-[15px] text-slate-800">{item.text}</p>
                <p className="text-[13px] text-slate-400 mt-0.5">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">03</span>
          <h2 className="text-xl font-semibold text-slate-900">Code</h2>
        </div>
        <div className="overflow-hidden rounded-2xl bg-[#1e1e2e] shadow-lg shadow-slate-900/20">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-2 text-[11px] text-slate-400 font-mono">solution.py</span>
          </div>
          <div className="p-5 font-mono text-[13.5px] leading-8">
            <div><span className="text-[#cba6f7]">def</span> <span className="text-[#89b4fa]">maxDepth</span><span className="text-[#cdd6f4]">(root):</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#cba6f7]">if</span><span className="text-[#cdd6f4]"> root </span><span className="text-[#cba6f7]">is</span><span className="text-[#cdd6f4]"> </span><span className="text-[#cba6f7]">None</span><span className="text-[#cdd6f4]">: </span><span className="text-[#cba6f7]">return</span> <span className="text-[#b5cea8]">0</span></div>
            <div><span className="text-[#cdd6f4]">    left_height = </span><span className="text-[#89b4fa]">maxDepth</span><span className="text-[#cdd6f4]">(root.left)</span></div>
            <div><span className="text-[#cdd6f4]">    right_height = </span><span className="text-[#89b4fa]">maxDepth</span><span className="text-[#cdd6f4]">(root.right)</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#cba6f7]">return</span><span className="text-[#cdd6f4]"> </span><span className="text-[#b5cea8]">1</span><span className="text-[#cdd6f4]"> + </span><span className="text-[#89b4fa]">max</span><span className="text-[#cdd6f4]">(left_height, right_height)</span></div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">04</span>
          <h2 className="text-xl font-semibold text-slate-900">Complexity</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-emerald-50 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 mb-1">Time</p>
            <p className="text-3xl font-mono font-semibold text-emerald-800 mb-1">O(n)</p>
            <p className="text-sm text-emerald-700">Visit each node exactly once.</p>
          </div>
          <div className="rounded-xl bg-blue-50 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 mb-1">Space</p>
            <p className="text-3xl font-mono font-semibold text-blue-800 mb-1">O(h)</p>
            <p className="text-sm text-blue-700">Recursion stack equals tree height.</p>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">05</span>
          <h2 className="text-xl font-semibold text-slate-900">Interview Uses</h2>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          {INTERVIEW_ITEMS.map((item, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl p-4 transition-colors hover:bg-slate-50/50">
              <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
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

/* ═══════════════ Deep Mode Section ═══════════════ */

function DeepMode() {
  return (
    <>
      <hr className="border-t border-slate-200 mb-8" />

      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">01 · Foundation</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Height vs depth terminology</h2>
        <p className="text-[15px] leading-relaxed text-slate-700 mb-4">
          Most platforms like LeetCode 104 define maximum depth by node count along longest root-to-leaf path. Some platforms define height by edge count.
        </p>
        <div className="flex justify-center mb-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <TreeDiagram highlightLeaves />
        </div>
        <div className="rounded-xl bg-blue-50 border-l-[3px] border-blue-400 p-4">
          <p className="text-sm text-blue-800">For non-empty tree: edge-height = node-depth - 1.</p>
        </div>
      </div>

      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">02 · Recursive logic</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Why the formula works</h2>
        <p className="text-[15px] leading-relaxed text-slate-700 mb-4">
          To know height of current node, you must know heights of both children. That naturally forms a post-order style computation.
        </p>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center rounded-lg bg-blue-50 p-3 ring-2 ring-blue-500">
              <p className="text-xs font-medium text-blue-700 mb-1">Base</p>
              <p className="text-sm text-blue-800 font-mono">None → 0</p>
            </div>
            <div className="text-center rounded-lg bg-cyan-50 p-3">
              <p className="text-xs font-medium text-cyan-700 mb-1">Recurse</p>
              <p className="text-sm text-cyan-800 font-mono">left, right</p>
            </div>
            <div className="text-center rounded-lg bg-indigo-50 p-3">
              <p className="text-xs font-medium text-indigo-700 mb-1">Return</p>
              <p className="text-sm text-indigo-800 font-mono">1 + max()</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">03 · Full trace</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Step-by-step computation</h2>
        <div className="space-y-4">
          {TRACE_STEPS.map((step, i) => (
            <div key={i} className="flex gap-4 items-start">
              <span className={`shrink-0 text-[11px] font-semibold px-3 py-1 rounded-full ${step.phaseClass}`}>{step.phase}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800 mb-0.5">{step.title}</p>
                <p className="text-[13px] text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">04 · Mini dry run cards</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Bottom-up return values</h2>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
          {DRY_RUN_STEPS.map((step) => (
            <div key={step.num} className={`rounded-xl border p-3 ${step.highlight ? "border-blue-200 bg-blue-50/60" : "border-slate-200 bg-slate-50/50"}`}>
              <p className="text-sm font-medium text-slate-800">Step {step.num} · Node {step.node}</p>
              <p className="text-[13px] text-slate-500 mt-0.5 leading-relaxed">{step.what}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">05 · Interview Q and A</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Most asked clarifications</h2>
        <div className="space-y-3">
          {QA_ITEMS.map((qa, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800">{qa.q}</div>
              <div className="px-4 py-3 text-sm text-slate-700 leading-relaxed border-t border-slate-100">{qa.a}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">06 · Common mistakes</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Avoid these pitfalls</h2>
        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          {COMMON_MISTAKES.map((item, i) => (
            <div key={i} className={`flex gap-3 p-4 items-start ${i < COMMON_MISTAKES.length - 1 ? "border-b border-slate-100" : ""}`}>
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-semibold text-red-600 mt-0.5">{item.icon}</div>
              <div>
                <p className="text-sm font-medium text-slate-800 mb-0.5">{item.title}</p>
                <p className="text-[13px] text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">07 · Where this appears</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Problems that reuse height</h2>
        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          {INTERVIEW_ITEMS.map((item, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl p-4 transition-colors hover:bg-slate-50/50">
              <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
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

/* ═══════════════ Main Page ═══════════════ */

export default function HeightGuidePage() {
  const [mode, setMode] = useState<"quick" | "deep">("quick");

  return (
    <section className="relative min-h-0 overflow-hidden bg-gradient-to-br from-slate-50 via-slate-50 to-emerald-50/20">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,#e0f2fe_0%,transparent_48%),radial-gradient(ellipse_at_bottom_left,#e2f6ef_0%,transparent_52%)]" />

      <div className="relative z-[1] mx-auto max-w-[860px] px-6 py-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-blue-500" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-600">Binary Tree · Height</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/problems/binary-tree/height-of-a-binary-tree"
                className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
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
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">Height of Binary Tree</h1>
          <p className="text-base text-slate-500 mb-5 max-w-xl">
            Compute maximum depth using recursive DFS and bottom-up subtree heights.
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700"><span className="h-1.5 w-1.5 rounded-full bg-blue-500" />Recursion</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 border border-cyan-200 px-3 py-1.5 text-xs font-medium text-cyan-700"><span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />DFS</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Tree DP Base</span>
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
              : "Detailed walkthrough with cross-platform nuances."}
          </p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-8" />

        {mode === "quick" ? <QuickMode /> : <DeepMode />}

        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/30 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[15px] font-medium text-slate-800">Ready to watch recursion live?</p>
              <p className="text-[13px] text-slate-500 mt-0.5">Open the visualizer and follow how each node returns its subtree height.</p>
            </div>
            <Link
              href="/problems/binary-tree/height-of-a-binary-tree"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25"
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

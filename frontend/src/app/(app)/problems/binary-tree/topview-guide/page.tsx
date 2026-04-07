"use client";

import { useState } from "react";
import Link from "next/link";

/* ═══════════════ Types ═══════════════ */

type TreeNodePoint = {
  id: number;
  x: number;
  y: number;
  hd: number;
};

/* ═══════════════ Tree SVG Data ═══════════════ */

const NODES: TreeNodePoint[] = [
  { id: 1, x: 180, y: 48, hd: 0 },
  { id: 2, x: 104, y: 102, hd: -1 },
  { id: 3, x: 256, y: 102, hd: 1 },
  { id: 4, x: 44, y: 162, hd: -2 },
  { id: 5, x: 180, y: 162, hd: 0 },
  { id: 6, x: 180, y: 162, hd: 0 },
  { id: 7, x: 316, y: 162, hd: 2 },
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

function TreeDiagram({ highlightTopView = false }: { highlightTopView?: boolean }) {
  const topViewIds = new Set([4, 2, 1, 3, 7]);
  return (
    <svg viewBox="0 0 360 230" width="340" height="210" xmlns="http://www.w3.org/2000/svg" className="max-w-[360px]">
      {/* HD labels at top */}
      <text x="44" y="16" textAnchor="middle" fontSize="11" fill="#6c7086" fontFamily="monospace">HD=−2</text>
      <text x="104" y="16" textAnchor="middle" fontSize="11" fill="#6c7086" fontFamily="monospace">HD=−1</text>
      <text x="180" y="16" textAnchor="middle" fontSize="11" fill="#6c7086" fontFamily="monospace">HD=0</text>
      <text x="256" y="16" textAnchor="middle" fontSize="11" fill="#6c7086" fontFamily="monospace">HD=+1</text>
      <text x="316" y="16" textAnchor="middle" fontSize="11" fill="#6c7086" fontFamily="monospace">HD=+2</text>
      {/* Vertical dashed HD grid lines */}
      <line x1="44" y1="22" x2="44" y2="210" stroke="#45475a" strokeWidth="0.8" strokeDasharray="3,4" />
      <line x1="104" y1="22" x2="104" y2="210" stroke="#45475a" strokeWidth="0.8" strokeDasharray="3,4" />
      <line x1="180" y1="22" x2="180" y2="210" stroke="#45475a" strokeWidth="0.8" strokeDasharray="3,4" />
      <line x1="256" y1="22" x2="256" y2="210" stroke="#45475a" strokeWidth="0.8" strokeDasharray="3,4" />
      <line x1="316" y1="22" x2="316" y2="210" stroke="#45475a" strokeWidth="0.8" strokeDasharray="3,4" />
      {/* Edges */}
      {EDGES.map(([from, to]) => {
        const source = nodeById(from);
        const target = nodeById(to);
        return (
          <line
            key={`${from}-${to}`}
            x1={source.x} y1={source.y}
            x2={target.x} y2={target.y}
            stroke="#B5D4F4" strokeWidth="1.5"
          />
        );
      })}
      {NODES.map((node) => {
        const isTopView = topViewIds.has(node.id);
        const isHidden = node.id === 5 || node.id === 6;
        const fill = highlightTopView && isTopView ? "#1a56a4" : isHidden ? "#313244" : "#f1f5f9";
        const stroke = highlightTopView && isTopView ? "#5b8dd9" : isHidden ? "#45475a" : "#cbd5e1";
        const textColor = highlightTopView && isTopView ? "#ffffff" : "#64748b";
        const strokeWidth = highlightTopView && isTopView ? 1.5 : 1.5;
        return (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r="18" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
            <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="14" fontWeight="500" fill={textColor} fontFamily="monospace">
              {isHidden ? "5/6" : node.id}
            </text>
            {isHidden && (
              <text x={node.x} y={node.y + 25} textAnchor="middle" fontSize="10" fill="#534AB7" fontFamily="monospace">hidden</text>
            )}
          </g>
        );
      })}
      {highlightTopView && (
        <rect x="14" y="200" width="336" height="22" rx="4" fill="#0e2a4a" opacity="0.85" />
      )}
      {highlightTopView && (
        <text x="180" y="215" textAnchor="middle" fontSize="11" fill="#89b4fa" fontFamily="monospace" fontWeight="500">Top View = [4, 2, 1, 3, 7]</text>
      )}
    </svg>
  );
}

/* ═══════════════ Quick Mode Data ═══════════════ */

const DRY_RUN_STEPS = [
  { step: "Init", node: "1", hd: "0", action: "Write", actionColor: "text-emerald-700", mapState: "{0:1}" },
  { step: "L2-left", node: "2", hd: "−1", action: "Write", actionColor: "text-emerald-700", mapState: "{0:1, −1:2}" },
  { step: "L2-right", node: "3", hd: "+1", action: "Write", actionColor: "text-emerald-700", mapState: "{…, +1:3}" },
  { step: "L3-LL", node: "4", hd: "−2", action: "Write", actionColor: "text-emerald-700", mapState: "{…, −2:4}" },
  { step: "L3-LR", node: "5", hd: "0", action: "Skip", actionColor: "text-violet-700", mapState: "HD=0 exists (node 1)" },
  { step: "L3-RL", node: "6", hd: "0", action: "Skip", actionColor: "text-violet-700", mapState: "HD=0 exists (node 1)" },
  { step: "L3-RR", node: "7", hd: "+2", action: "Write", actionColor: "text-emerald-700", mapState: "{…, +2:7}" },
];

const INTERVIEW_ITEMS = [
  { title: "Bottom View of Binary Tree", desc: "Identical BFS + HD setup — but remove the if hd not in hd_map guard and always overwrite. Last node per HD (deepest) is the bottom view." },
  { title: "Vertical Order Traversal", desc: "Same HD tracking but collect all nodes per column, then sort by (row, value). Top view is the vertical-order minimum row per column." },
  { title: "Left/Right View of Binary Tree", desc: "Related concept but uses depth (level) rather than HD. Left view = first node at each level; Right view = last node at each level." },
  { title: "Width of Binary Tree at each level", desc: "The HD range (max HD − min HD + 1) gives the width of a level. Reuse the same BFS + HD framework." },
];

/* ═══════════════ Deep Mode Data ═══════════════ */

const TRACE_STEPS = [
  { phase: "Start", phaseClass: "bg-blue-100 text-blue-700", title: "Queue = [(1, 0)]", desc: "Root enters the queue with HD = 0." },
  { phase: "Write", phaseClass: "bg-emerald-100 text-emerald-700", title: "Dequeue (1, HD=0) → hd_map = {0: 1}", desc: "HD=0 is new — record node 1. Enqueue children: (2, −1) and (3, +1)." },
  { phase: "Write", phaseClass: "bg-emerald-100 text-emerald-700", title: "Dequeue (2, HD=−1) → hd_map = {0:1, −1:2}", desc: "HD=−1 is new — record node 2. Enqueue (4, −2) and (5, 0)." },
  { phase: "Write", phaseClass: "bg-emerald-100 text-emerald-700", title: "Dequeue (3, HD=+1) → hd_map = {…, +1:3}", desc: "HD=+1 is new — record node 3. Enqueue (6, 0) and (7, +2)." },
  { phase: "Write", phaseClass: "bg-emerald-100 text-emerald-700", title: "Dequeue (4, HD=−2) → hd_map = {…, −2:4}", desc: "HD=−2 is new — record node 4. Leaf — nothing enqueued." },
  { phase: "Skip", phaseClass: "bg-violet-100 text-violet-700", title: "Dequeue (5, HD=0) → hd_map unchanged", desc: "HD=0 already has node 1. Node 5 is deeper — it's invisible from the top. Leaf — nothing enqueued." },
  { phase: "Skip", phaseClass: "bg-violet-100 text-violet-700", title: "Dequeue (6, HD=0) → hd_map unchanged", desc: "HD=0 still has node 1. Node 6 is also depth 2 — also invisible from the top. Leaf — nothing enqueued." },
  { phase: "Write", phaseClass: "bg-emerald-100 text-emerald-700", title: "Dequeue (7, HD=+2) → hd_map = {−2:4, −1:2, 0:1, +1:3, +2:7}", desc: "Queue empty. Sort keys → Top View = [4, 2, 1, 3, 7] ✓" },
];

const COMMON_MISTAKES = [
  {
    icon: "✕",
    title: "Overwriting unconditionally — writing the bottom view instead of top",
    desc: "The single most common mistake. Omitting the if hd not in hd_map guard means you always overwrite with a deeper node — that's bottom view behaviour. The guard is the entire difference between the two problems.",
  },
  {
    icon: "✕",
    title: "Using DFS without a depth check",
    desc: "In DFS, traversal order is not depth-ordered. You must track depth explicitly and only record when new_depth < stored_depth. If you use DFS and just check if hd not in hd_map, you'll record whichever DFS path arrives first — not necessarily the shallowest node.",
  },
  {
    icon: "✕",
    title: "Confusing top view with root-to-leaf path or level-order",
    desc: "Top view is per-column (per HD), not per-level. A skewed tree where every node veers right will have a top view that looks like just the leftmost spine — one node per HD column, not one per level.",
  },
  {
    icon: "✕",
    title: "Forgetting to sort the map keys before returning",
    desc: "Insertion order in the map depends on BFS traversal, not HD order. Without sorted(hd_map), the result may be scrambled. Always sort by HD to produce a left-to-right answer.",
  },
];

const QA_ITEMS = [
  {
    q: "Why do we check if hd not in hd_map instead of just writing every time?",
    a: "Because BFS is level-by-level, the very first node we encounter at any HD is guaranteed to be the shallowest (topmost) in that column. If we kept overwriting, we'd end up with the deepest node (bottom view). The condition locks in the first — and only the first — entry per HD column.",
  },
  {
    q: "What if two nodes share the same HD and the same depth?",
    a: "For the top view, this doesn't change anything — the first node at that HD is already locked in, regardless of ties at lower levels. The check if hd not in hd_map fires exactly once per column, at the shallowest depth, and subsequent nodes (even at the same depth in a different branch) are simply skipped.",
  },
  {
    q: "Why sort the map keys at the end?",
    a: "Python dicts preserve insertion order, but HD keys are inserted in BFS order (not necessarily sorted left-to-right). To return the top view from left to right (min HD to max HD), we must sort the keys. This is the same as in bottom view and adds O(n log n) to time complexity.",
  },
];

/* ═══════════════ Quick Mode Section ═══════════════ */

function QuickMode() {
  return (
    <>
      {/* Problem Question at Top */}
      <div className="mb-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Problem Statement</h3>
              <p className="text-sm text-slate-500">Top View of Binary Tree</p>
            </div>
          </div>
          <div className="text-[15px] leading-relaxed text-slate-700 mb-5">
            Given the <span className="font-medium text-slate-900">root</span> of a binary tree, return <span className="font-medium text-slate-900">the top view of the tree</span> — the first node visible at each horizontal distance when seen from above.
          </div>

          {/* Examples */}
          <div className="space-y-3">
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Example 1</div>
              <div className="px-4 py-3">
                <p className="text-[13px] font-mono text-slate-600 mb-2">Input: root = [1, 2, 3, 4, 5, 6, 7]</p>
                <p className="text-[13px] font-mono text-blue-700">Output: [4, 2, 1, 3, 7]</p>
                <p className="text-[12px] text-slate-400 mt-1.5">HD columns: −2→4, −1→2, 0→1, +1→3, +2→7</p>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Example 2</div>
              <div className="px-4 py-3">
                <p className="text-[13px] font-mono text-slate-600 mb-2">Input: root = [1, null, 2, null, 3]</p>
                <p className="text-[13px] font-mono text-blue-700">Output: [1, 2, 3]</p>
                <p className="text-[12px] text-slate-400 mt-1.5">Right-skewed tree — HD columns: 0→1, +1→2, +2→3</p>
              </div>
            </div>
          </div>

          {/* Constraints */}
          <div className="mt-5 rounded-lg bg-slate-50 p-4 border border-slate-200">
            <p className="text-xs font-semibold text-slate-600 mb-2">Constraints</p>
            <ul className="text-[13px] text-slate-600 space-y-1">
              <li className="flex items-start gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />The number of nodes in the tree is in the range <span className="font-mono text-slate-800">[0, 100]</span>.</li>
              <li className="flex items-start gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />Each node's value is in the range <span className="font-mono text-slate-800">[-100, 100]</span>.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 01 - The Rule */}
      <div className="mb-12">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">01</span>
          <h2 className="text-xl font-semibold text-slate-900">The Rule</h2>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white shadow-lg shadow-blue-500/20">
          <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-white/10" />
          <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-6 translate-y-6 rounded-full bg-white/10" />
          <div className="relative">
            <p className="text-2xl font-semibold tracking-wide mb-2">First node seen at each horizontal distance from the root</p>
            <p className="text-blue-100 text-sm leading-relaxed">
              Assign root HD=0. Left child gets HD−1, right child HD+1. For each HD, only the shallowest (topmost) node is visible — if an HD column already has an entry, ignore any deeper node in that column.
            </p>
          </div>
        </div>
      </div>

      {/* 02 - How to think */}
      <div className="mb-12">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">02</span>
          <h2 className="text-xl font-semibold text-slate-900">How to Think</h2>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
          {[
            { n: 1, text: "Do a BFS, tracking each node's horizontal distance (HD)", sub: "Root starts at HD = 0. Left child: HD − 1. Right child: HD + 1." },
            { n: 2, text: "For every HD, record only the first node you encounter — never overwrite", sub: "BFS visits nodes top-to-bottom, so the first node at any HD is the shallowest. That's the top view." },
            { n: 3, text: "Read the map sorted by HD from min to max", sub: "Gives you the top view left-to-right as it would appear looking down at the tree from above." },
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

      {/* 03 - Code */}
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
          <div className="p-5 font-mono text-[13.5px] leading-7">
            <div><span className="text-[#cba6f7]">from</span> <span className="text-[#cdd6f4]">collections </span><span className="text-[#cba6f7]">import</span> <span className="text-[#cdd6f4]">deque</span></div>
            <div>&nbsp;</div>
            <div><span className="text-[#cba6f7]">def</span> <span className="text-[#89b4fa]">top_view</span><span className="text-[#cdd6f4]">(root):</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#cba6f7]">if not</span> <span className="text-[#cdd6f4]">root: </span><span className="text-[#cba6f7]">return</span> <span className="text-[#cdd6f4]">[]</span></div>
            <div><span className="text-[#cdd6f4]">    hd_map = {}</span></div>
            <div><span className="text-[#cdd6f4]">    queue = deque([(root, 0)])</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#cba6f7]">while</span> <span className="text-[#cdd6f4]">queue:</span></div>
            <div><span className="text-[#cdd6f4]">        node, hd = queue.</span><span className="text-[#89b4fa]">popleft</span><span className="text-[#cdd6f4]">()</span></div>
            <div><span className="text-[#cdd6f4]">        </span><span className="text-[#cba6f7]">if</span> <span className="text-[#cdd6f4]">hd </span><span className="text-[#cba6f7]">not in</span> <span className="text-[#cdd6f4]">hd_map:</span></div>
            <div><span className="text-[#cdd6f4]">            hd_map[hd] = node.val</span></div>
            <div><span className="text-[#cdd6f4]">        </span><span className="text-[#cba6f7]">if</span> <span className="text-[#cdd6f4]">node.left: queue.</span><span className="text-[#89b4fa]">append</span><span className="text-[#cdd6f4]">((node.left, hd - 1))</span></div>
            <div><span className="text-[#cdd6f4]">        </span><span className="text-[#cba6f7]">if</span> <span className="text-[#cdd6f4]">node.right: queue.</span><span className="text-[#89b4fa]">append</span><span className="text-[#cdd6f4]">((node.right, hd + 1))</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#cba6f7]">return</span> <span className="text-[#cdd6f4]">[hd_map[k] </span><span className="text-[#cba6f7]">for</span> <span className="text-[#cdd6f4]">k </span><span className="text-[#cba6f7]">in</span> <span className="text-[#89b4fa]">sorted</span><span className="text-[#cdd6f4]">(hd_map)]</span></div>
          </div>
        </div>
      </div>

      {/* 04 - Example */}
      <div className="mb-12">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">04</span>
          <h2 className="text-xl font-semibold text-slate-900">Example</h2>
        </div>
        <div className="flex justify-center mb-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <TreeDiagram highlightTopView />
        </div>
        <p className="text-sm text-slate-500 text-center mb-4">Nodes 5 and 6 share HD=0 but node 1 (root) was seen first — they stay hidden.</p>

        {/* Dry run table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="grid grid-cols-[1fr_0.5fr_0.5fr_1fr_1.5fr] bg-slate-50/80">
            <div className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-r border-slate-200">Step</div>
            <div className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-r border-slate-200">Node</div>
            <div className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-r border-slate-200">HD</div>
            <div className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-r border-slate-200">Action</div>
            <div className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">hd_map state</div>
          </div>
          {DRY_RUN_STEPS.map((step, i) => (
            <div
              key={i}
              className={`grid grid-cols-[1fr_0.5fr_0.5fr_1fr_1.5fr] border-t border-slate-100 ${i % 2 === 1 ? "bg-slate-50/50" : "bg-white"}`}
            >
              <div className="px-4 py-3 text-sm text-slate-700 border-r border-slate-100">{step.step}</div>
              <div className="px-4 py-3 text-sm text-slate-700 border-r border-slate-100 font-mono">{step.node}</div>
              <div className="px-4 py-3 text-sm text-slate-700 border-r border-slate-100 font-mono">{step.hd}</div>
              <div className={`px-4 py-3 text-sm font-mono border-r border-slate-100 ${step.actionColor}`}>{step.action}</div>
              <div className="px-4 py-3 text-sm text-slate-700 font-mono">{step.mapState}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 05 - Top View vs Bottom View */}
      <div className="mb-12">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">05</span>
          <h2 className="text-xl font-semibold text-slate-900">Top View vs Bottom View</h2>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-5 border-r border-slate-200">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-3">Top View</p>
              <div className="overflow-hidden rounded-lg bg-[#1e1e2e] p-3 font-mono text-xs leading-7">
                <div><span className="text-[#cba6f7]">if</span> <span className="text-[#cdd6f4]">hd </span><span className="text-[#cba6f7]">not in</span> <span className="text-[#cdd6f4]">hd_map:</span></div>
                <div><span className="text-[#cdd6f4]">    hd_map[hd] = node.val</span></div>
              </div>
              <p className="text-xs text-slate-500 mt-2">Record only the <strong className="font-medium text-slate-700">first</strong> node per HD — shallowest wins.</p>
            </div>
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-3">Bottom View</p>
              <div className="overflow-hidden rounded-lg bg-[#1e1e2e] p-3 font-mono text-xs leading-7">
                <div><span className="text-[#6c7086] italic"># no condition —</span></div>
                <div><span className="text-[#cdd6f4]">hd_map[hd] = node.val</span></div>
              </div>
              <p className="text-xs text-slate-500 mt-2">Always overwrite — deepest (last) wins.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 06 - Complexity */}
      <div className="mb-12">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">06</span>
          <h2 className="text-xl font-semibold text-slate-900">Complexity</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-blue-50 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 mb-1">Time</p>
            <p className="text-3xl font-mono font-semibold text-blue-800 mb-1">O(n log n)</p>
            <p className="text-sm text-blue-700">BFS visits every node once — O(n). Sorting HD keys adds O(n log n).</p>
          </div>
          <div className="rounded-xl bg-violet-50 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-600 mb-1">Space</p>
            <p className="text-3xl font-mono font-semibold text-violet-800 mb-1">O(n)</p>
            <p className="text-sm text-violet-700">Queue holds at most widest level. HashMap holds at most n entries.</p>
          </div>
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

      {/* 01 - Core idea */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">01 · The core idea</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">What does "top view" actually mean?</h2>
        <p className="text-[15px] leading-relaxed text-slate-700 mb-4">
          Imagine hovering directly above a binary tree and looking straight down. For every vertical column, only the highest node is visible to you — every node below it is completely obscured. That's the top view: for each horizontal column, report the first (shallowest) node you encounter.
        </p>
        <div className="rounded-xl bg-blue-50 border-l-[3px] border-blue-400 p-4">
          <p className="text-sm text-blue-800">
            The key concept is <strong className="font-medium">Horizontal Distance (HD)</strong>. Root is at HD = 0. Going left subtracts 1; going right adds 1. Two nodes that share the same HD fall in the same vertical column — only the one at the smallest depth (encountered first in BFS) is visible from the top.
          </p>
        </div>
      </div>

      {/* 02 - Why BFS? */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">02 · Why BFS, not DFS?</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Two approaches — one is much cleaner</h2>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center rounded-lg bg-blue-50 p-3 ring-2 ring-blue-500">
              <p className="text-xs font-medium text-blue-700 mb-1">BFS ← natural fit</p>
              <p className="text-sm text-blue-800">Processes nodes level by level (top to bottom). The first time a new HD is encountered, it is guaranteed to be the shallowest — no depth check needed. Just write once and never overwrite.</p>
            </div>
            <div className="text-center rounded-lg bg-violet-50 p-3">
              <p className="text-xs font-medium text-violet-700 mb-1">DFS (recursive)</p>
              <p className="text-sm text-violet-800">Must carry depth explicitly and only record when the new depth is strictly less than the stored depth. More error-prone and harder to reason about for tied depths.</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-amber-50 border-l-[3px] border-amber-400 p-4">
          <p className="text-sm text-amber-800">
            <strong className="font-medium">Interview tip:</strong> Always lead with BFS. If pressed for a DFS alternative, say: "I'd track (hd, depth) in the map and only write when the new node's depth is less than the stored depth — never for equal depth, because equal depth means a deeper or same-level duplicate, not a higher one."
          </p>
        </div>
      </div>

      {/* 03 - Analogy */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">03 · The real-world analogy</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Think of it like an aerial photograph</h2>
        <div className="rounded-xl bg-amber-50 p-4 mb-4">
          <p className="text-[15px] leading-relaxed text-amber-900/80 mb-0">
            Hang the tree from the ceiling with the root at the top. Shine a light upward from below. Each node blocks every node directly above it in the same column. The top view is the set of nodes that are not blocked by anything higher up — the ones you'd see in the aerial photo. One node per vertical column, always the highest one.
          </p>
        </div>
        <div className="rounded-xl bg-emerald-50 border-l-[3px] border-emerald-500 p-4">
          <p className="text-sm text-emerald-800">
            <strong className="font-medium">Key insight:</strong> The critical difference from the bottom view is a single <code className="rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-mono text-emerald-700">if hd not in hd_map</code> guard. Without it, you'd always be overwriting with deeper nodes — that gives you the bottom view. The guard locks in the first write, giving you the top view.
          </p>
        </div>
      </div>

      {/* 04 - Understanding the code */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">04 · Understanding the code line by line</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">What the code is actually doing</h2>
        <p className="text-[15px] leading-relaxed text-slate-700 mb-4">
          The key change from bottom view is the conditional write: <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-slate-600">if hd not in hd_map</code>. Because BFS is level-by-level, the very first time we see a new HD column, the current node is the topmost one. We lock it in and refuse to overwrite — that's the entire algorithm.
        </p>
        <div className="overflow-hidden rounded-2xl bg-[#1e1e2e] shadow-lg mb-5">
          <div className="p-5 font-mono text-[13.5px] leading-7">
            <div><span className="text-[#cba6f7]">from</span> <span className="text-[#cdd6f4]">collections </span><span className="text-[#cba6f7]">import</span> <span className="text-[#cdd6f4]">deque</span></div>
            <div>&nbsp;</div>
            <div><span className="text-[#cba6f7]">def</span> <span className="text-[#89b4fa]">top_view</span><span className="text-[#cdd6f4]">(root):</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#cba6f7]">if not</span> <span className="text-[#cdd6f4]">root: </span><span className="text-[#cba6f7]">return</span> <span className="text-[#cdd6f4]">[]</span></div>
            <div><span className="text-[#cdd6f4]">    hd_map = {}</span></div>
            <div><span className="text-[#cdd6f4]">    queue = deque([(root, 0)])</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#cba6f7]">while</span> <span className="text-[#cdd6f4]">queue:</span></div>
            <div><span className="text-[#cdd6f4]">        node, hd = queue.</span><span className="text-[#89b4fa]">popleft</span><span className="text-[#cdd6f4]">()</span></div>
            <div><span className="text-[#cdd6f4]">        </span><span className="text-[#cba6f7]">if</span> <span className="text-[#cdd6f4]">hd </span><span className="text-[#cba6f7]">not in</span> <span className="text-[#cdd6f4]">hd_map:</span></div>
            <div><span className="text-[#cdd6f4]">            hd_map[hd] = node.val</span></div>
            <div><span className="text-[#cdd6f4]">        </span><span className="text-[#cba6f7]">if</span> <span className="text-[#cdd6f4]">node.left: queue.</span><span className="text-[#89b4fa]">append</span><span className="text-[#cdd6f4]">((node.left, hd - 1))</span></div>
            <div><span className="text-[#cdd6f4]">        </span><span className="text-[#cba6f7]">if</span> <span className="text-[#cdd6f4]">node.right: queue.</span><span className="text-[#89b4fa]">append</span><span className="text-[#cdd6f4]">((node.right, hd + 1))</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#cba6f7]">return</span> <span className="text-[#cdd6f4]">[hd_map[k] </span><span className="text-[#cba6f7]">for</span> <span className="text-[#cdd6f4]">k </span><span className="text-[#cba6f7]">in</span> <span className="text-[#89b4fa]">sorted</span><span className="text-[#cdd6f4]">(hd_map)]</span></div>
          </div>
        </div>
        <div className="space-y-3">
          {QA_ITEMS.map((qa, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800">{qa.q}</div>
              <div className="px-4 py-3 text-sm text-slate-700 leading-relaxed border-t border-slate-100">{qa.a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 05 - Full trace */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">05 · Full trace — every step explained</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Walking through the example tree</h2>
        <p className="text-[15px] leading-relaxed text-slate-700 mb-6">
          Tree: root=1 (HD=0). Left=2 (HD=−1) with children 4 (HD=−2) and 5 (HD=0). Right=3 (HD=+1) with children 6 (HD=0) and 7 (HD=+2). Let's trace every BFS action.
        </p>
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

      {/* 06 - Common mistakes */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">06 · Common beginner mistakes</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">What trips people up</h2>
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

      {/* 07 - Complexity deep dive */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">07 · Complexity — the full explanation</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Why O(n log n) time and O(n) space?</h2>
        <div className="grid gap-4 md:grid-cols-2 mb-4">
          <div className="rounded-xl bg-blue-50 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 mb-1">Time</p>
            <p className="text-3xl font-mono font-semibold text-blue-800 mb-1">O(n log n)</p>
            <p className="text-sm text-blue-700 leading-relaxed">BFS is O(n) — each node enqueued and dequeued exactly once. The conditional write is O(1). Sorting HD keys at the end adds O(n log n). If unsorted output is acceptable, the algorithm is O(n).</p>
          </div>
          <div className="rounded-xl bg-violet-50 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-600 mb-1">Space</p>
            <p className="text-3xl font-mono font-semibold text-violet-800 mb-1">O(n)</p>
            <p className="text-sm text-violet-700 leading-relaxed">The queue holds at most O(w) nodes (width of the widest level). The HashMap holds at most n entries. Both are bounded by O(n).</p>
          </div>
        </div>
        <div className="rounded-xl bg-amber-50 border-l-[3px] border-amber-400 p-4">
          <p className="text-sm text-amber-800">
            <strong className="font-medium">Interview tip:</strong> Mention both time components: "O(n) for the BFS plus O(n log n) for sorting HD keys — dominated by the sort. If the interviewer asks for O(n), suggest a TreeMap (Java) or SortedDict (Python's sortedcontainers) for sorted insertion, removing the final sort step entirely."
          </p>
        </div>
      </div>

      {/* 08 - Interview context */}
      <div className="mb-10">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">08 · Interview context</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Where you'll actually use this</h2>
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

export default function TopViewGuidePage() {
  const [mode, setMode] = useState<"quick" | "deep">("quick");

  return (
    <section className="relative min-h-0 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,#dbeafe_0%,transparent_50%),radial-gradient(ellipse_at_bottom_left,#fef3c7_0%,transparent_50%)]" />

      <div className="relative z-[1] mx-auto max-w-[860px] px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-blue-500" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-600">Binary Tree · Views</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/problems/binary-tree/top-view-of-binary-tree"
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
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">Top View of Binary Tree</h1>
          <p className="text-base text-slate-500 mb-5 max-w-xl">
            The first node visible at each horizontal distance when the tree is seen from the top.
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              BFS + HashMap
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 border border-violet-200 px-3 py-1.5 text-xs font-medium text-violet-700">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
              Horizontal Distance
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Interview Essential
            </span>
          </div>

          {/* ═══ Mode Toggle ═══ */}
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

        {/* ═══ Content ═══ */}
        {mode === "quick" ? <QuickMode /> : <DeepMode />}

        {/* CTA */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/30 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[15px] font-medium text-slate-800">Ready to see it in action?</p>
              <p className="text-[13px] text-slate-500 mt-0.5">Step through the visualizer to watch the HD map fill in live at each BFS step.</p>
            </div>
            <Link
              href="/problems/binary-tree/top-view-of-binary-tree"
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
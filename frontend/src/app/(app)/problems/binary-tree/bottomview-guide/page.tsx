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
  { id: 1, x: 180, y: 58, hd: 0 },
  { id: 2, x: 104, y: 112, hd: -1 },
  { id: 3, x: 256, y: 112, hd: 1 },
  { id: 4, x: 44, y: 172, hd: -2 },
  { id: 5, x: 180, y: 172, hd: 0 },
  { id: 6, x: 196, y: 172, hd: 0 },
  { id: 7, x: 316, y: 172, hd: 2 },
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

function TreeDiagram({ highlightBottomView = false }: { highlightBottomView?: boolean }) {
  const bottomViewIds = new Set([4, 2, 6, 3, 7]);
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
        const isBottomView = bottomViewIds.has(node.id);
        const isOverwritten = node.id === 5;
        const fill = highlightBottomView && isBottomView ? "#E6F1FB" : isOverwritten ? "#f1f5f9" : "#f1f5f9";
        const stroke = highlightBottomView && isBottomView ? "#378ADD" : isOverwritten ? "#cbd5e1" : "#cbd5e1";
        const textColor = highlightBottomView && isBottomView ? "#0C447C" : "#64748b";
        const strokeWidth = highlightBottomView && isBottomView ? 2 : 1.5;
        const strokeDasharray = isOverwritten ? "4,3" : undefined;
        return (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r="22" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
            <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="13" fontWeight="500" fill={textColor}>{node.id}</text>
          </g>
        );
      })}
      {highlightBottomView && (
        <text x="180" y="220" textAnchor="middle" fontSize="12" fill="#185FA5" fontWeight="500">Bottom View → [4, 2, 6, 3, 7]</text>
      )}
    </svg>
  );
}

/* ═══════════════ Quick Mode Data ═══════════════ */

const DRY_RUN_STEPS = [
  { node: "1 (root)", hd: "0", mapUpdate: "{0:1}", queueAfter: "(2,−1), (3,+1)" },
  { node: "2", hd: "−1", mapUpdate: "{0:1, −1:2}", queueAfter: "(3,+1),(4,−2),(5,0)" },
  { node: "3", hd: "+1", mapUpdate: "{…, +1:3}", queueAfter: "(4,−2),(5,0),(6,0),(7,+2)" },
  { node: "4", hd: "−2", mapUpdate: "{…, −2:4}", queueAfter: "(5,0),(6,0),(7,+2)" },
  { node: "5", hd: "0", mapUpdate: "{0:5} ← overwrites 1", queueAfter: "(6,0),(7,+2)" },
  { node: "6", hd: "0", mapUpdate: "{0:6} ← overwrites 5", queueAfter: "(7,+2)" },
  { node: "7", hd: "+2", mapUpdate: "{…, +2:7}", queueAfter: "empty — done ✓" },
];

const INTERVIEW_ITEMS = [
  { title: "Top View of Binary Tree", desc: "Identical setup — track HD with BFS — but record only the first node seen at each HD (not the last)." },
  { title: "Vertical Order Traversal", desc: "Same HD tracking but collect all nodes per column, then sort by (row, value)." },
  { title: "Width of Binary Tree at each level", desc: "The HD range (max HD − min HD + 1) at any given level is the width of that level." },
  { title: "Diagonal Traversal of Binary Tree", desc: "Uses a similar column-mapping idea but defines diagonals differently." },
];

/* ═══════════════ Deep Mode Data ═══════════════ */

const TRACE_STEPS = [
  { phase: "Start", phaseClass: "bg-blue-100 text-blue-700", title: "Queue = [(1, 0)]", desc: "Root enters the queue with HD = 0." },
  { phase: "Write", phaseClass: "bg-emerald-100 text-emerald-700", title: "Dequeue (1, HD=0) → hd_map = {0: 1}", desc: "First node at HD=0. Enqueue children: (2, −1) and (3, +1)." },
  { phase: "Write", phaseClass: "bg-emerald-100 text-emerald-700", title: "Dequeue (2, HD=−1) → hd_map = {0:1, −1:2}", desc: "New HD column. Enqueue (4, −2) and (5, 0)." },
  { phase: "Write", phaseClass: "bg-emerald-100 text-emerald-700", title: "Dequeue (3, HD=+1) → hd_map = {…, +1:3}", desc: "New HD column. Enqueue (6, 0) and (7, +2)." },
  { phase: "Write", phaseClass: "bg-emerald-100 text-emerald-700", title: "Dequeue (4, HD=−2) → hd_map = {…, −2:4}", desc: "New HD column. Leaf — nothing enqueued." },
  { phase: "Overwrite", phaseClass: "bg-amber-100 text-amber-700", title: "Dequeue (5, HD=0) → hd_map[0] = 5 (was 1)", desc: "HD=0 already has node 1 (root). Node 5 is deeper, so it overwrites. Leaf — nothing enqueued." },
  { phase: "Overwrite", phaseClass: "bg-amber-100 text-amber-700", title: "Dequeue (6, HD=0) → hd_map[0] = 6 (was 5)", desc: "Same HD=0, same depth as 5 but processed after (BFS right-side bias). 6 wins. Leaf — nothing enqueued." },
  { phase: "Write", phaseClass: "bg-emerald-100 text-emerald-700", title: "Dequeue (7, HD=+2) → hd_map = {−2:4, −1:2, 0:6, +1:3, +2:7}", desc: "Queue empty. Sort keys → Bottom View = [4, 2, 6, 3, 7] ✓" },
];

const COMMON_MISTAKES = [
  {
    icon: "✕",
    title: "Using DFS and forgetting to check depth before overwriting",
    desc: "In DFS, traversal order is not depth-ordered. You must explicitly store the depth alongside the value and only overwrite when new_depth >= stored_depth. Unconditional overwrite in DFS produces wrong answers.",
  },
  {
    icon: "✕",
    title: "Forgetting to sort the map keys before returning",
    desc: "Insertion order in the map depends on BFS traversal, not HD order. Without sorted(hd_map), the result may be scrambled. Always sort by HD to get a left-to-right answer.",
  },
  {
    icon: "✕",
    title: "Confusing Bottom View with Leaf nodes",
    desc: "Bottom view nodes are not necessarily leaves. If a non-leaf node is the deepest at its HD column, it still appears in the bottom view.",
  },
  {
    icon: "✕",
    title: "Using a regular list as queue (pop from front)",
    desc: "list.pop(0) shifts every element — O(n) per dequeue. Always use collections.deque for O(1) popleft().",
  },
];

const QA_ITEMS = [
  {
    q: "Why do we always overwrite hd_map[hd] without checking depth?",
    a: "BFS processes nodes level-by-level, which means any node processed after a previous one at the same HD is necessarily at a greater or equal depth. Unconditional overwrite is correct — you never risk overwriting a deeper node with a shallower one when using BFS.",
  },
  {
    q: "What happens when two nodes share the same HD and same depth?",
    a: "If two nodes are at the same depth and HD (like nodes 5 and 6 both at HD=0, depth=2 in our example), the one encountered last in BFS order wins — which is the right-side node (since we always enqueue left then right). This is the standard convention for the bottom view.",
  },
  {
    q: "Why sort the map keys at the end?",
    a: "A Python dictionary preserves insertion order, but HD values can be inserted in any order during BFS (depending on tree shape). To guarantee left-to-right output (smallest HD first), we must sort the keys explicitly. This adds O(n log n) to the overall time complexity.",
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
              <p className="text-sm text-slate-500">Bottom View of Binary Tree</p>
            </div>
          </div>
          <div className="text-[15px] leading-relaxed text-slate-700 mb-5">
            Given the <span className="font-medium text-slate-900">root</span> of a binary tree, return <span className="font-medium text-slate-900">the bottom view of the tree</span> — the last node visible at each horizontal distance when seen from below.
          </div>

          {/* Examples */}
          <div className="space-y-3">
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Example 1</div>
              <div className="px-4 py-3">
                <p className="text-[13px] font-mono text-slate-600 mb-2">Input: root = [1, 2, 3, 4, 5, 6, 7]</p>
                <p className="text-[13px] font-mono text-blue-700">Output: [4, 2, 6, 3, 7]</p>
                <p className="text-[12px] text-slate-400 mt-1.5">HD columns: −2→4, −1→2, 0→6, +1→3, +2→7</p>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Example 2</div>
              <div className="px-4 py-3">
                <p className="text-[13px] font-mono text-slate-600 mb-2">Input: root = [1, 2, 3, null, 4, null, 5]</p>
                <p className="text-[13px] font-mono text-blue-700">Output: [2, 4, 5, 3]</p>
                <p className="text-[12px] text-slate-400 mt-1.5">HD columns: −1→2, 0→4, +1→5, +2→3</p>
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
            <p className="text-2xl font-semibold tracking-wide mb-2">Last node seen at each horizontal distance from the root</p>
            <p className="text-blue-100 text-sm leading-relaxed">
              Assign root HD=0. Left child gets HD−1, right child HD+1. For each HD, the deepest node wins — if two nodes share the same HD and depth, the one processed later (right-wards in BFS) wins.
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
            { n: 2, text: "For every HD, keep overwriting the map with the current node", sub: "BFS visits nodes top-to-bottom, so later overwrites = deeper nodes. That's the bottom view." },
            { n: 3, text: "Read the map sorted by HD from min to max", sub: "Gives you the bottom view left-to-right as it would appear from underneath the tree." },
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
            <div><span className="text-[#cba6f7]">def</span> <span className="text-[#89b4fa]">bottom_view</span><span className="text-[#cdd6f4]">(root):</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#cba6f7]">if not</span> <span className="text-[#cdd6f4]">root: </span><span className="text-[#cba6f7]">return</span> <span className="text-[#cdd6f4]">[]</span></div>
            <div><span className="text-[#cdd6f4]">    hd_map = {}</span></div>
            <div><span className="text-[#cdd6f4]">    queue = deque([(root, 0)])</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#cba6f7]">while</span> <span className="text-[#cdd6f4]">queue:</span></div>
            <div><span className="text-[#cdd6f4]">        node, hd = queue.</span><span className="text-[#89b4fa]">popleft</span><span className="text-[#cdd6f4]">()</span></div>
            <div><span className="text-[#cdd6f4]">        hd_map[hd] = node.val </span><span className="text-[#6c7086] italic"># always overwrite → last = deepest</span></div>
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
          <TreeDiagram highlightBottomView />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 mb-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-slate-500">Bottom View:</span>
            <span className="font-mono text-sm font-medium text-blue-800 bg-blue-50 px-3 py-1 rounded-md">[ 4, 2, 6, 3, 7 ]</span>
            <span className="text-xs text-slate-400">(sorted by HD: −2, −1, 0, +1, +2)</span>
          </div>
        </div>
        <p className="text-sm text-slate-500 text-center">Node 5 and Node 6 both land on HD=0. In BFS order, 6 is processed after 5, so 6 overwrites 5 in the map and appears in the result.</p>
      </div>

      {/* 05 - Dry run */}
      <div className="mb-12">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">05</span>
          <h2 className="text-xl font-semibold text-slate-900">Dry Run</h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="grid grid-cols-[1.6fr_0.7fr_1.2fr_1.5fr] bg-slate-50/80">
            <div className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-r border-slate-200">Node dequeued</div>
            <div className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-r border-slate-200">HD</div>
            <div className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-r border-slate-200">hd_map update</div>
            <div className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Queue after</div>
          </div>
          {DRY_RUN_STEPS.map((step, i) => (
            <div
              key={i}
              className={`grid grid-cols-[1.6fr_0.7fr_1.2fr_1.5fr] border-t border-slate-100 ${i % 2 === 1 ? "bg-slate-50/50" : "bg-white"}`}
            >
              <div className="px-4 py-3 text-sm text-slate-700 border-r border-slate-100">{step.node}</div>
              <div className="px-4 py-3 text-sm text-slate-700 border-r border-slate-100 font-mono">{step.hd}</div>
              <div className="px-4 py-3 text-sm text-slate-700 border-r border-slate-100 font-mono">{step.mapUpdate}</div>
              <div className="px-4 py-3 text-sm text-slate-700 font-mono">{step.queueAfter}</div>
            </div>
          ))}
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
            <p className="text-sm text-violet-700">Queue holds at most widest level. HashMap stores one entry per unique HD.</p>
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

      {/* 01 - What is bottom view? */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">01 · What does "bottom view" actually mean?</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Seeing the tree from underneath</h2>
        <p className="text-[15px] leading-relaxed text-slate-700 mb-4">
          Imagine you're lying flat on the ground looking up at a binary tree. For every vertical column, you can only see the lowest-hanging node — everything above it is hidden. That's the bottom view: the last (deepest) node at every horizontal position.
        </p>
        <div className="rounded-xl bg-blue-50 border-l-[3px] border-blue-400 p-4">
          <p className="text-sm text-blue-800">
            The key concept is <strong className="font-medium">Horizontal Distance (HD)</strong>. Root is at HD = 0. Going left subtracts 1; going right adds 1. Two nodes that share the same HD fall in the same vertical column — only the one at the greatest depth (or rightmost if tied) is visible from below.
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
              <p className="text-sm text-blue-800">Always overwrites earlier entries. Because BFS is level-by-level, a later write is always deeper. No depth tracking needed.</p>
            </div>
            <div className="text-center rounded-lg bg-violet-50 p-3">
              <p className="text-xs font-medium text-violet-700 mb-1">DFS (recursive)</p>
              <p className="text-sm text-violet-800">Must track depth explicitly and only overwrite when the new depth is ≥ stored depth. More error-prone.</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-amber-50 border-l-[3px] border-amber-400 p-4">
          <p className="text-sm text-amber-800">
            <strong className="font-medium">Interview tip:</strong> Always lead with BFS. If pressed for a DFS alternative, say: "I'd track (hd, depth) in the map and only overwrite when the new node's depth ≥ the stored depth."
          </p>
        </div>
      </div>

      {/* 03 - Analogy */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">03 · The real-world analogy</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Think of it like shadows on the ground</h2>
        <div className="rounded-xl bg-amber-50 p-4 mb-4">
          <p className="text-[15px] leading-relaxed text-amber-900/80 mb-0">
            Hang the tree from the ceiling with the root at top. Shine a light directly downward. Each node casts a shadow on the floor. Where two nodes share the same vertical column, the lower node's shadow completely covers the upper one's. The bottom view is precisely the set of nodes whose shadows reach the floor unobstructed — one per column.
          </p>
        </div>
        <div className="rounded-xl bg-emerald-50 border-l-[3px] border-emerald-500 p-4">
          <p className="text-sm text-emerald-800">
            <strong className="font-medium">Key insight:</strong> The number of nodes in the bottom view equals the number of distinct horizontal distances in the tree. Unlike the left/right view (which is always exactly height+1 nodes), the bottom view size depends on the tree's width and structure.
          </p>
        </div>
      </div>

      {/* 04 - Understanding the code */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">04 · Understanding the code line by line</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">What the code is actually doing</h2>
        <p className="text-[15px] leading-relaxed text-slate-700 mb-4">
          The trick is deceptively simple: store each node's HD alongside it in the queue. As we dequeue nodes, we unconditionally overwrite <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-slate-600">hd_map[hd]</code>. Because BFS processes nodes level by level (top to bottom), a later overwrite is guaranteed to be from a deeper level — which is exactly what the bottom view needs.
        </p>
        <div className="overflow-hidden rounded-2xl bg-[#1e1e2e] shadow-lg mb-5">
          <div className="p-5 font-mono text-[13.5px] leading-7">
            <div><span className="text-[#cba6f7]">from</span> <span className="text-[#cdd6f4]">collections </span><span className="text-[#cba6f7]">import</span> <span className="text-[#cdd6f4]">deque</span></div>
            <div>&nbsp;</div>
            <div><span className="text-[#cba6f7]">def</span> <span className="text-[#89b4fa]">bottom_view</span><span className="text-[#cdd6f4]">(root):</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#cba6f7]">if not</span> <span className="text-[#cdd6f4]">root: </span><span className="text-[#cba6f7]">return</span> <span className="text-[#cdd6f4]">[]</span></div>
            <div><span className="text-[#cdd6f4]">    hd_map = {}</span></div>
            <div><span className="text-[#cdd6f4]">    queue = deque([(root, 0)])</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#cba6f7]">while</span> <span className="text-[#cdd6f4]">queue:</span></div>
            <div><span className="text-[#cdd6f4]">        node, hd = queue.</span><span className="text-[#89b4fa]">popleft</span><span className="text-[#cdd6f4]">()</span></div>
            <div><span className="text-[#cdd6f4]">        hd_map[hd] = node.val </span><span className="text-[#6c7086] italic"># always overwrite — deeper = bottom</span></div>
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
            <p className="text-sm text-blue-700 leading-relaxed">BFS is O(n) — each node enqueued and dequeued once. Sorting HD keys at the end adds O(n log n). If sorted output isn't required, the algorithm is O(n).</p>
          </div>
          <div className="rounded-xl bg-violet-50 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-600 mb-1">Space</p>
            <p className="text-3xl font-mono font-semibold text-violet-800 mb-1">O(n)</p>
            <p className="text-sm text-violet-700 leading-relaxed">The queue holds at most O(w) nodes (widest level). The HashMap has at most n entries (one per node at worst). Both bounded by O(n).</p>
          </div>
        </div>
        <div className="rounded-xl bg-amber-50 border-l-[3px] border-amber-400 p-4">
          <p className="text-sm text-amber-800">
            <strong className="font-medium">Interview tip:</strong> Mention both components of time complexity: "O(n) for the BFS traversal plus O(n log n) for sorting HD keys — dominated by the sort. If the interviewer asks for O(n), you can use a sorted insertion structure like a TreeMap (Java) or SortedDict (Python's sortedcontainers) to avoid the final sort."
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

export default function BottomViewGuidePage() {
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
                href="/problems/binary-tree/bottom-view-of-binary-tree"
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
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">Bottom View of Binary Tree</h1>
          <p className="text-base text-slate-500 mb-5 max-w-xl">
            The last node visible at each horizontal distance when the tree is seen from the bottom.
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
              href="/problems/binary-tree/bottom-view-of-binary-tree"
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
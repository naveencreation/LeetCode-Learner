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
  { id: 1, x: 170, y: 36 },
  { id: 2, x: 100, y: 95 },
  { id: 3, x: 240, y: 95 },
  { id: 4, x: 60, y: 160 },
  { id: 5, x: 140, y: 160 },
  { id: 6, x: 210, y: 160 },
  { id: 7, x: 275, y: 160 },
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

function TreeDiagram({ highlightLeftView = false }: { highlightLeftView?: boolean }) {
  const leftViewIds = new Set([1, 2, 4]);
  return (
    <svg viewBox="0 0 340 220" width="320" height="200" xmlns="http://www.w3.org/2000/svg" className="max-w-[340px]">
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
        const isLeftView = leftViewIds.has(node.id);
        const fill = highlightLeftView && isLeftView ? "#E6F1FB" : "#f1f5f9";
        const stroke = highlightLeftView && isLeftView ? "#378ADD" : "#cbd5e1";
        const textColor = highlightLeftView && isLeftView ? "#0C447C" : "#64748b";
        return (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r="22" fill={fill} stroke={stroke} strokeWidth={highlightLeftView && isLeftView ? 2 : 1.5} />
            <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="13" fontWeight="500" fill={textColor}>{node.id}</text>
            {highlightLeftView && isLeftView && (
              <text x={node.x} y={node.y - 16} textAnchor="middle" fontSize="10" fill="#378ADD">L{[1,2,4].indexOf(node.id)} ✓</text>
            )}
          </g>
        );
      })}
      {highlightLeftView && (
        <text x="170" y="205" textAnchor="middle" fontSize="12" fill="#185FA5" fontWeight="500">Left View → [1, 2, 4]</text>
      )}
    </svg>
  );
}

/* ═══════════════ Quick Mode Data ═══════════════ */

const INTERVIEW_ITEMS = [
  { title: "Right View of Binary Tree", desc: "Same pattern, record the last node per level instead of the first." },
  { title: "Level order traversal", desc: "Foundational BFS pattern that left view builds on." },
  { title: "Maximum width of a tree", desc: "Same BFS loop, just track max queue size per level." },
  { title: "Vertical order traversal", desc: "Another view-based problem sharing similar BFS structure." },
];

/* ═══════════════ Deep Mode Data ═══════════════ */

const TRACE_STEPS = [
  { phase: "L0 Start", phaseClass: "bg-blue-100 text-blue-700", title: "Queue = [1], level_size = 1", desc: "Only the root is in the queue. We're about to process level 0." },
  { phase: "Record", phaseClass: "bg-emerald-100 text-emerald-700", title: "Dequeue 1 (i=0) → result = [1]", desc: "First node at level 0 — record it. Add its children: left=2, right=3. Queue is now [2, 3]." },
  { phase: "L1 Start", phaseClass: "bg-blue-100 text-blue-700", title: "Queue = [2, 3], level_size = 2", desc: "Two nodes at this level. We'll dequeue 2 first (it was added first — left child before right child)." },
  { phase: "Record", phaseClass: "bg-emerald-100 text-emerald-700", title: "Dequeue 2 (i=0) → result = [1, 2]", desc: "First node at level 1 — record it. Add children: 4 and 5. Queue is now [3, 4, 5]." },
  { phase: "Skip", phaseClass: "bg-violet-100 text-violet-700", title: "Dequeue 3 (i=1) → not recorded", desc: "Not the first node at level 1, so we skip recording it. Add its right child 7. Queue is now [4, 5, 7]." },
  { phase: "L2 Start", phaseClass: "bg-blue-100 text-blue-700", title: "Queue = [4, 5, 7], level_size = 3", desc: "Three nodes at this level. Node 4 (leftmost) will be dequeued first." },
  { phase: "Record", phaseClass: "bg-emerald-100 text-emerald-700", title: "Dequeue 4 (i=0) → result = [1, 2, 4]", desc: "First node at level 2 — record it. Node 4 is a leaf, nothing added to queue." },
  { phase: "Skip", phaseClass: "bg-violet-100 text-violet-700", title: "Dequeue 5 (i=1) → not recorded", desc: "Not the first at this level. Leaf node, nothing enqueued." },
  { phase: "Skip", phaseClass: "bg-violet-100 text-violet-700", title: "Dequeue 7 (i=2) → not recorded. Queue empty. Done ✓", desc: "Final left view: [1, 2, 4] — one node per level, always the leftmost visible one." },
];

const COMMON_MISTAKES = [
  {
    icon: "✕",
    title: "Not snapshotting level_size before the loop",
    desc: "If you write for i in range(len(queue)) directly, the queue grows mid-loop as you add children, causing you to mix up levels — the next level's nodes bleed into the current iteration.",
  },
  {
    icon: "✕",
    title: "Adding right child before left child",
    desc: "The order of enqueuing determines which node appears first. Enqueue left before right — otherwise your 'first dequeued' gives you the rightmost node, not the leftmost.",
  },
  {
    icon: "✕",
    title: "Forgetting to handle the empty tree",
    desc: "If root is None, calling deque([None]) and then accessing node.left will crash. Always guard with if not root: return [].",
  },
  {
    icon: "✕",
    title: "Using a regular list instead of deque",
    desc: "list.pop(0) is O(n) because it shifts every element. deque.popleft() is O(1). For large trees this difference matters — always use collections.deque.",
  },
];

const QA_ITEMS = [
  {
    q: "Why do we snapshot level_size = len(queue) before the loop?",
    a: "Because the queue grows as we add children during the loop. If we checked len(queue) dynamically, we'd process nodes from the next level too, mixing levels together. By snapshotting the count before, we know exactly how many nodes belong to the current level.",
  },
  {
    q: "Why add the left child before the right child?",
    a: "Order in the queue determines which node is dequeued first. If we added the right child first, the right child would appear before the left child at the next level — and our 'first dequeued' would give us the right view, not the left view. Left first → left view. Right first → right view.",
  },
  {
    q: "What does the queue look like during execution?",
    a: "Using the example tree (root=1, left=2, right=3, 2's children=4,5, 3's right=7): Start of L0: [1] → dequeue 1, record it. Start of L1: [2, 3] → dequeue 2 first, record it. Start of L2: [4, 5, 7] → dequeue 4 first, record it.",
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
              <p className="text-sm text-slate-500">Left View of Binary Tree</p>
            </div>
          </div>
          <div className="text-[15px] leading-relaxed text-slate-700 mb-5">
            Given the <span className="font-medium text-slate-900">root</span> of a binary tree, return <span className="font-medium text-slate-900">the values of the nodes visible from the left side</span>, ordered from top to bottom.
          </div>

          {/* Examples */}
          <div className="space-y-3">
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Example 1</div>
              <div className="px-4 py-3">
                <p className="text-[13px] font-mono text-slate-600 mb-2">Input: root = [1, 2, 3, null, 5, null, 4]</p>
                <p className="text-[13px] font-mono text-blue-700">Output: [1, 2, 4]</p>
                <p className="text-[12px] text-slate-400 mt-1.5">Tree: 1 → left=2, right=3; 2's right=5; 3's right=4.</p>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Example 2</div>
              <div className="px-4 py-3">
                <p className="text-[13px] font-mono text-slate-600 mb-2">Input: root = [1, 2, 3, 4, 5, 6, 7]</p>
                <p className="text-[13px] font-mono text-blue-700">Output: [1, 2, 4]</p>
                <p className="text-[12px] text-slate-400 mt-1.5">Perfect binary tree — leftmost nodes at each level.</p>
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
            <p className="text-2xl font-semibold tracking-wide mb-2">First node seen at each level from the left</p>
            <p className="text-blue-100 text-sm leading-relaxed">
              Equivalently: the first node you encounter per depth in a level-order (BFS) traversal.
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
            { n: 1, text: "Process the tree level by level (BFS with a queue)", sub: "Each queue iteration handles exactly one full level." },
            { n: 2, text: "Record the very first node dequeued at each level", sub: "That first node is the leftmost visible node at that depth." },
            { n: 3, text: "Add left child first, then right child, to the queue", sub: "Ensures left nodes always precede right nodes in the queue." },
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
            <div><span className="text-[#cba6f7]">def</span> <span className="text-[#89b4fa]">left_view</span><span className="text-[#cdd6f4]">(root):</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#cba6f7]">if not</span> <span className="text-[#cdd6f4]">root: </span><span className="text-[#cba6f7]">return</span> <span className="text-[#cdd6f4]">[]</span></div>
            <div><span className="text-[#cdd6f4]">    result, queue = [], deque([root])</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#cba6f7]">while</span> <span className="text-[#cdd6f4]">queue:</span></div>
            <div><span className="text-[#cdd6f4]">        level_size = </span><span className="text-[#89b4fa]">len</span><span className="text-[#cdd6f4]">(queue)</span></div>
            <div><span className="text-[#cdd6f4]">        </span><span className="text-[#cba6f7]">for</span> <span className="text-[#cdd6f4]">i </span><span className="text-[#cba6f7]">in</span> <span className="text-[#89b4fa]">range</span><span className="text-[#cdd6f4]">(level_size):</span></div>
            <div><span className="text-[#cdd6f4]">            node = queue.</span><span className="text-[#89b4fa]">popleft</span><span className="text-[#cdd6f4]">()</span></div>
            <div><span className="text-[#cdd6f4]">            </span><span className="text-[#cba6f7]">if</span> <span className="text-[#cdd6f4]">i == 0: result.</span><span className="text-[#89b4fa]">append</span><span className="text-[#cdd6f4]">(node.val)</span></div>
            <div><span className="text-[#cdd6f4]">            </span><span className="text-[#cba6f7]">if</span> <span className="text-[#cdd6f4]">node.left: queue.</span><span className="text-[#89b4fa]">append</span><span className="text-[#cdd6f4]">(node.left)</span></div>
            <div><span className="text-[#cdd6f4]">            </span><span className="text-[#cba6f7]">if</span> <span className="text-[#cdd6f4]">node.right: queue.</span><span className="text-[#89b4fa]">append</span><span className="text-[#cdd6f4]">(node.right)</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#cba6f7]">return</span> <span className="text-[#cdd6f4]">result</span></div>
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
          <TreeDiagram highlightLeftView />
        </div>
        <p className="text-sm text-slate-500 text-center">Blue nodes are the left view: <strong className="text-slate-800">[1, 2, 4]</strong></p>
      </div>

      {/* 05 - Complexity */}
      <div className="mb-12">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">05</span>
          <h2 className="text-xl font-semibold text-slate-900">Complexity</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-blue-50 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 mb-1">Time</p>
            <p className="text-3xl font-mono font-semibold text-blue-800 mb-1">O(n)</p>
            <p className="text-sm text-blue-700">Every node is enqueued and dequeued exactly once.</p>
          </div>
          <div className="rounded-xl bg-violet-50 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-600 mb-1">Space</p>
            <p className="text-3xl font-mono font-semibold text-violet-800 mb-1">O(w)</p>
            <p className="text-sm text-violet-700">Queue holds at most the width of the widest level.</p>
          </div>
        </div>
      </div>

      {/* 06 - Interview Uses */}
      <div className="mb-10">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">06</span>
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

      {/* 01 - What is a view? */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">01 · Start here — what is a "view" of a tree?</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Seeing the tree from the side</h2>
        <p className="text-[15px] leading-relaxed text-slate-700 mb-4">
          Imagine standing far to the left of a binary tree and looking directly at it. Some nodes will be hidden behind others. The nodes you can actually <em>see</em> — one per level — are called the <strong className="font-medium text-slate-900">Left View</strong>. Equivalently, the left view is the set of nodes that are first encountered at each depth when you sweep through the tree level by level.
        </p>
        <div className="flex justify-center mb-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <TreeDiagram highlightLeftView />
        </div>
        <div className="rounded-xl bg-blue-50 border-l-[3px] border-blue-400 p-4">
          <p className="text-sm text-blue-800">
            Blue nodes are <strong className="font-medium">visible</strong> from the left. Grey nodes are hidden behind a blue node at the same level — they share the same depth but are further right.
          </p>
        </div>
      </div>

      {/* 02 - Why BFS? */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">02 · Why BFS? Why not DFS?</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">The problem is fundamentally level-based</h2>
        <p className="text-[15px] leading-relaxed text-slate-700 mb-4">
          The left view asks "which node is first at each level?" — that's exactly what BFS (Breadth-First Search) is designed to answer. BFS processes the tree level by level, so finding the first node per level is trivial. DFS can also solve it (using recursion and a max-depth trick), but BFS maps to the problem more naturally.
        </p>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center rounded-lg bg-blue-50 p-3 ring-2 ring-blue-500">
              <p className="text-xs font-medium text-blue-700 mb-1">BFS ← natural fit</p>
              <p className="text-sm text-blue-800">Process level by level. First dequeued node = left view.</p>
            </div>
            <div className="text-center rounded-lg bg-violet-50 p-3">
              <p className="text-xs font-medium text-violet-700 mb-1">DFS (recursive)</p>
              <p className="text-sm text-violet-800">Track max depth seen. Record node only if its depth is new.</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-amber-50 border-l-[3px] border-amber-400 p-4">
          <p className="text-sm text-amber-800">
            <strong className="font-medium">Interview tip:</strong> If the interviewer says "can you do it without a queue?", they want the DFS approach. Be ready to explain both. The DFS approach uses a max-depth variable instead of a queue.
          </p>
        </div>
      </div>

      {/* 03 - Analogy */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">03 · The real-world analogy</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Think of it like a theatre seating chart</h2>
        <div className="rounded-xl bg-amber-50 p-4 mb-4">
          <p className="text-[15px] leading-relaxed text-amber-900/80 mb-0">
            Imagine a theatre where rows of seats fan out from a central aisle. Every row is a level of the tree. You're standing at the far left entrance, looking down the rows. In each row, you see only the leftmost occupied seat — the rest are blocked. The Left View of a tree is exactly those leftmost seats, one per row.
          </p>
        </div>
        <div className="rounded-xl bg-emerald-50 border-l-[3px] border-emerald-500 p-4">
          <p className="text-sm text-emerald-800">
            <strong className="font-medium">Key insight:</strong> The left view has exactly as many nodes as the height of the tree — one node per level. A tree with height <em>h</em> has exactly <em>h+1</em> nodes in its left view.
          </p>
        </div>
      </div>

      {/* 04 - Understanding BFS */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">04 · Understanding the BFS approach line by line</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">What the code is actually doing</h2>
        <p className="text-[15px] leading-relaxed text-slate-700 mb-4">
          The core trick is: at the start of each BFS iteration, we know exactly how many nodes are in the current level — it's <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-slate-600">len(queue)</code>. So we loop that many times, and the very first node dequeued (index 0) is the leftmost node at that level.
        </p>
        <div className="overflow-hidden rounded-2xl bg-[#1e1e2e] shadow-lg mb-5">
          <div className="p-5 font-mono text-[13.5px] leading-7">
            <div><span className="text-[#cba6f7]">from</span> <span className="text-[#cdd6f4]">collections </span><span className="text-[#cba6f7]">import</span> <span className="text-[#cdd6f4]">deque</span></div>
            <div>&nbsp;</div>
            <div><span className="text-[#cba6f7]">def</span> <span className="text-[#89b4fa]">left_view</span><span className="text-[#cdd6f4]">(root):</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#cba6f7]">if not</span> <span className="text-[#cdd6f4]">root: </span><span className="text-[#cba6f7]">return</span> <span className="text-[#cdd6f4]">[]</span></div>
            <div><span className="text-[#cdd6f4]">    result, queue = [], deque([root])</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#cba6f7]">while</span> <span className="text-[#cdd6f4]">queue:</span></div>
            <div><span className="text-[#cdd6f4]">        level_size = </span><span className="text-[#89b4fa]">len</span><span className="text-[#cdd6f4]">(queue)</span></div>
            <div><span className="text-[#cdd6f4]">        </span><span className="text-[#cba6f7]">for</span> <span className="text-[#cdd6f4]">i </span><span className="text-[#cba6f7]">in</span> <span className="text-[#89b4fa]">range</span><span className="text-[#cdd6f4]">(level_size):</span></div>
            <div><span className="text-[#cdd6f4]">            node = queue.</span><span className="text-[#89b4fa]">popleft</span><span className="text-[#cdd6f4]">()</span></div>
            <div><span className="text-[#cdd6f4]">            </span><span className="text-[#cba6f7]">if</span> <span className="text-[#cdd6f4]">i == 0:</span></div>
            <div><span className="text-[#cdd6f4]">                result.</span><span className="text-[#89b4fa]">append</span><span className="text-[#cdd6f4]">(node.val)</span></div>
            <div><span className="text-[#cdd6f4]">            </span><span className="text-[#cba6f7]">if</span> <span className="text-[#cdd6f4]">node.left: queue.</span><span className="text-[#89b4fa]">append</span><span className="text-[#cdd6f4]">(node.left)</span></div>
            <div><span className="text-[#cdd6f4]">            </span><span className="text-[#cba6f7]">if</span> <span className="text-[#cdd6f4]">node.right: queue.</span><span className="text-[#89b4fa]">append</span><span className="text-[#cdd6f4]">(node.right)</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#cba6f7]">return</span> <span className="text-[#cdd6f4]">result</span></div>
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
        {/* Queue visual */}
        <div className="mt-5">
          <p className="text-sm font-medium text-slate-700 mb-2">Queue state during execution:</p>
          <div className="overflow-hidden rounded-xl bg-[#1e1e2e] p-4 font-mono text-sm">
            <div className="rounded bg-[#313244] text-[#cdd6f4] px-3 py-1.5 mb-1 border-l-2 border-[#89b4fa]">Start of L0: [1] → dequeue 1, record it</div>
            <div className="rounded bg-[#1e1e2e] text-[#6c7086] px-3 py-1.5 mb-1 border-l-2 border-[#45475a]">Start of L1: [2, 3] → dequeue 2 first, record it</div>
            <div className="rounded bg-[#1e1e2e] text-[#6c7086] px-3 py-1.5 border-l-2 border-[#45475a]">Start of L2: [4, 5, 7] → dequeue 4 first, record it</div>
          </div>
        </div>
      </div>

      {/* 05 - Full trace */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">05 · Full trace — every step explained</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Walking through the example tree</h2>
        <p className="text-[15px] leading-relaxed text-slate-700 mb-6">
          Tree: root=1, left child=2 (children: 4, 5), right child=3 (right child: 7). Let's trace every BFS action.
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
        <h2 className="text-lg font-medium text-slate-900 mb-4">Why O(n) time and O(w) space?</h2>
        <div className="grid gap-4 md:grid-cols-2 mb-4">
          <div className="rounded-xl bg-blue-50 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 mb-1">Time</p>
            <p className="text-3xl font-mono font-semibold text-blue-800 mb-1">O(n)</p>
            <p className="text-sm text-blue-700 leading-relaxed">Every node is enqueued once and dequeued once. Recording the first node per level is an O(1) check. Total: O(n).</p>
          </div>
          <div className="rounded-xl bg-violet-50 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-600 mb-1">Space</p>
            <p className="text-3xl font-mono font-semibold text-violet-800 mb-1">O(w)</p>
            <p className="text-sm text-violet-700 leading-relaxed">The queue holds at most the nodes of the widest level. w = 1 for a skewed tree, w = n/2 for a perfect binary tree — so worst case O(n).</p>
          </div>
        </div>
        <div className="rounded-xl bg-amber-50 border-l-[3px] border-amber-400 p-4">
          <p className="text-sm text-amber-800">
            <strong className="font-medium">Interview tip:</strong> When asked about space complexity, clarify: "O(w) where w is the maximum width of the tree. In the worst case of a perfect binary tree the last level holds n/2 nodes, so it's O(n). For a skewed tree it degenerates to O(1) queue space."
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

export default function LeftViewGuidePage() {
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
                href="/problems/binary-tree/leftview-of-binary-tree"
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
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">Left View of Binary Tree</h1>
          <p className="text-base text-slate-500 mb-5 max-w-xl">
            The first node visible at each level when the tree is seen from the left side.
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              BFS / DFS
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 border border-violet-200 px-3 py-1.5 text-xs font-medium text-violet-700">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
              Level Order
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
              <p className="text-[13px] text-slate-500 mt-0.5">Step through the visualizer to watch the BFS queue change live at each level.</p>
            </div>
            <Link
              href="/problems/binary-tree/leftview-of-binary-tree"
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
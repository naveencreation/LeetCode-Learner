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
            stroke="#8ED7CA" strokeWidth="1.5"
          />
        );
      })}
      {NODES.map((node) => {
        const isLeaf = node.id >= 4;
        const fill = highlightLeaves && isLeaf ? "#E1F5EE" : "#EAFBF7";
        const stroke = highlightLeaves && isLeaf ? "#1D9E75" : "#14997E";
        const textColor = highlightLeaves && isLeaf ? "#085041" : "#0B5A4B";
        return (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r="22" fill={fill} stroke={stroke} strokeWidth="1.5" />
            <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="13" fontWeight="500" fill={textColor}>{node.id}</text>
            {highlightLeaves && isLeaf && (
              <text x={node.x} y={node.y + 30} textAnchor="middle" fontSize="10" fill="#1D9E75">leaf</text>
            )}
            {node.id === 1 && highlightLeaves && (
              <text x={node.x} y={node.y - 16} textAnchor="middle" fontSize="10" fill="#14997E">root</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ═══════════════ Quick Mode Data ═══════════════ */

const DRY_RUN_STEPS = [
  { num: 1, node: 1, what: "Queue starts with [1]. Pop 1 and collect level [1].", highlight: true },
  { num: 2, node: 1, what: "Push children of 1. Queue becomes [2, 3].", highlight: false },
  { num: 3, node: 2, what: "Freeze level size as 2. Pop 2 then 3 to build [2, 3].", highlight: true },
  { num: 4, node: 3, what: "Push children of 2 and 3. Queue becomes [4, 5, 6, 7].", highlight: false },
  { num: 5, node: 4, what: "Freeze level size as 4. Pop all leaves to build [4, 5, 6, 7].", highlight: true },
  { num: 6, node: 7, what: "Queue is now empty. Result is [[1], [2, 3], [4, 5, 6, 7]].", highlight: false },
];

const INTERVIEW_ITEMS = [
  { title: "Level based metrics", desc: "Count nodes per depth or compute level averages with the same BFS skeleton." },
  { title: "Zigzag traversal", desc: "Use level order and alternate insertion direction on every level." },
  { title: "Bottom up traversal", desc: "Collect level order then reverse once at the end." },
  { title: "Tree views", desc: "Left view and right view are level order with first or last pick per level." },
];

/* ═══════════════ Deep Mode Data ═══════════════ */

const TRACE_STEPS = [
  { phase: "Start", phaseClass: "bg-teal-100 text-teal-700", title: "Initialize queue with root", desc: "If root exists, queue starts as [1]. Result list is empty at this point." },
  { phase: "Level", phaseClass: "bg-blue-100 text-blue-700", title: "Level 0 size is 1", desc: "Process exactly one node from queue. Pop 1 and append to current level list." },
  { phase: "Push", phaseClass: "bg-cyan-100 text-cyan-700", title: "Enqueue children of 1", desc: "Push 2 and 3 to queue. Append level [1] to answer." },
  { phase: "Level", phaseClass: "bg-blue-100 text-blue-700", title: "Level 1 size is 2", desc: "Pop 2 and 3 in order. Current level list becomes [2, 3]." },
  { phase: "Push", phaseClass: "bg-cyan-100 text-cyan-700", title: "Enqueue next layer", desc: "From 2 push 4 and 5. From 3 push 6 and 7. Append [2, 3]." },
  { phase: "Level", phaseClass: "bg-blue-100 text-blue-700", title: "Level 2 size is 4", desc: "Pop 4, 5, 6, 7. All are leaves, so no further enqueues." },
  { phase: "Done", phaseClass: "bg-emerald-100 text-emerald-700", title: "Queue becomes empty", desc: "Append final level [4, 5, 6, 7]. Return [[1], [2, 3], [4, 5, 6, 7]]." },
];

const COMMON_MISTAKES = [
  {
    icon: "✕",
    title: "Not freezing level size",
    desc: "If you loop until queue is empty inside one level, new children get mixed into the same level output.",
  },
  {
    icon: "✕",
    title: "Building a flat list",
    desc: "Level order here requires nested arrays. Appending every value directly gives wrong shape.",
  },
  {
    icon: "✕",
    title: "Missing null root guard",
    desc: "When root is null, return empty list immediately or queue logic fails.",
  },
  {
    icon: "✕",
    title: "Trying DFS first",
    desc: "DFS can simulate levels but queue based BFS is cleaner and expected in interviews.",
  },
];

const QA_ITEMS = [
  {
    q: "Why do we use queue length at each outer loop?",
    a: "Queue length at loop start is exactly one level. That gives a safe boundary so current and next levels do not mix.",
  },
  {
    q: "Is this different from regular BFS?",
    a: "It is regular BFS with one extra grouping step. We collect nodes into a temporary level list before appending.",
  },
  {
    q: "What is the complexity?",
    a: "Time is O(n) since each node is pushed and popped once. Space is O(w), where w is maximum queue width.",
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
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Problem Statement</h3>
              <p className="text-sm text-slate-500">Binary Tree Level Order Traversal</p>
            </div>
          </div>
          <div className="text-[15px] leading-relaxed text-slate-700 mb-5">
            Given the <span className="font-medium text-slate-900">root</span> of a binary tree, return <span className="font-medium text-slate-900">level by level traversal as nested lists</span>.
          </div>

          {/* Examples */}
          <div className="space-y-3">
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Example 1</div>
              <div className="px-4 py-3">
                <p className="text-[13px] font-mono text-slate-600 mb-2">Input: root = [1, null, 2, 3]</p>
                <p className="text-[13px] font-mono text-teal-700">Output: [[1], [2], [3]]</p>
                <p className="text-[12px] text-slate-400 mt-1.5">Each depth becomes one array in result.</p>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Example 2</div>
              <div className="px-4 py-3">
                <p className="text-[13px] font-mono text-slate-600 mb-2">Input: root = [1, 2, 3, 4, 5, 6, 7]</p>
                <p className="text-[13px] font-mono text-teal-700">Output: [[1], [2, 3], [4, 5, 6, 7]]</p>
                <p className="text-[12px] text-slate-400 mt-1.5">Classic BFS output grouped by level.</p>
              </div>
            </div>
          </div>

          {/* Constraints */}
          <div className="mt-5 rounded-lg bg-slate-50 p-4 border border-slate-200">
            <p className="text-xs font-semibold text-slate-600 mb-2">Constraints</p>
            <ul className="text-[13px] text-slate-600 space-y-1">
              <li className="flex items-start gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />The number of nodes is in range <span className="font-mono text-slate-800">[0, 100]</span>.</li>
              <li className="flex items-start gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />Each node value is in range <span className="font-mono text-slate-800">[-100, 100]</span>.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 01 - Rule */}
      <div className="mb-12">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">01</span>
          <h2 className="text-xl font-semibold text-slate-900">The Rule</h2>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 p-6 text-white shadow-lg shadow-teal-500/20">
          <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-white/10" />
          <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-6 translate-y-6 rounded-full bg-white/10" />
          <div className="relative">
            <p className="text-2xl font-semibold tracking-wide mb-2">Level by Level using Queue</p>
            <p className="text-teal-100 text-sm leading-relaxed">
              Freeze current queue size, process exactly that many nodes, then move to the next level.
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
            { n: 1, text: "Push root into queue", sub: "This starts BFS from top of tree." },
            { n: 2, text: "Read level size before popping", sub: "That number defines the boundary of current level." },
            { n: 3, text: "Collect values and enqueue children", sub: "Children naturally become the queue for next level." },
          ].map((item) => (
            <div key={item.n} className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700">{item.n}</div>
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
          <div className="p-5 font-mono text-[13.5px] leading-8">
            <div><span className="text-[#cba6f7]">from</span> <span className="text-[#89b4fa]">collections</span> <span className="text-[#cba6f7]">import</span> <span className="text-[#cdd6f4]">deque</span></div>
            <div><span className="text-[#cba6f7]">def</span> <span className="text-[#89b4fa]">levelOrder</span><span className="text-[#cdd6f4]">(root):</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#cba6f7]">if</span><span className="text-[#cdd6f4]"> </span><span className="text-[#cba6f7]">not</span><span className="text-[#cdd6f4]"> root: </span><span className="text-[#cba6f7]">return</span><span className="text-[#cdd6f4]"> []</span></div>
            <div><span className="text-[#cdd6f4]">    ans = []</span></div>
            <div><span className="text-[#cdd6f4]">    q = deque([root])</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#cba6f7]">while</span><span className="text-[#cdd6f4]"> q:</span></div>
            <div><span className="text-[#cdd6f4]">        level_size = len(q)</span></div>
            <div><span className="text-[#cdd6f4]">        level = []</span></div>
            <div><span className="text-[#cdd6f4]">        </span><span className="text-[#cba6f7]">for</span><span className="text-[#cdd6f4]"> _ in range(level_size):</span></div>
            <div><span className="text-[#cdd6f4]">            node = q.popleft()</span></div>
            <div><span className="text-[#cdd6f4]">            level.append(node.data)</span></div>
            <div><span className="text-[#cdd6f4]">            </span><span className="text-[#cba6f7]">if</span><span className="text-[#cdd6f4]"> node.left: q.append(node.left)</span></div>
            <div><span className="text-[#cdd6f4]">            </span><span className="text-[#cba6f7]">if</span><span className="text-[#cdd6f4]"> node.right: q.append(node.right)</span></div>
            <div><span className="text-[#cdd6f4]">        ans.append(level)</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#cba6f7]">return</span><span className="text-[#cdd6f4]"> ans</span></div>
          </div>
        </div>
      </div>

      {/* 04 - Complexity */}
      <div className="mb-12">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">04</span>
          <h2 className="text-xl font-semibold text-slate-900">Complexity</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-emerald-50 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 mb-1">Time</p>
            <p className="text-3xl font-mono font-semibold text-emerald-800 mb-1">O(n)</p>
            <p className="text-sm text-emerald-700">Each node is processed once.</p>
          </div>
          <div className="rounded-xl bg-cyan-50 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-cyan-600 mb-1">Space</p>
            <p className="text-3xl font-mono font-semibold text-cyan-800 mb-1">O(w)</p>
            <p className="text-sm text-cyan-700">Queue can hold the widest level.</p>
          </div>
        </div>
      </div>

      {/* 05 - Interview Uses */}
      <div className="mb-10">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">05</span>
          <h2 className="text-xl font-semibold text-slate-900">Interview Uses</h2>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          {INTERVIEW_ITEMS.map((item, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl p-4 transition-colors hover:bg-slate-50/50">
              <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-500" />
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

      {/* 01 - Foundation */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">01 · Start here</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">What level order traversal means</h2>
        <p className="text-[15px] leading-relaxed text-slate-700 mb-4">
          Level order traversal visits nodes breadth first, one depth at a time. We use a queue so nodes are processed in first in first out order.
        </p>
        <div className="flex justify-center mb-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <TreeDiagram highlightLeaves />
        </div>
        <div className="rounded-xl bg-blue-50 border-l-[3px] border-blue-400 p-4">
          <p className="text-sm text-blue-800">
            Every outer loop pass forms one level in output. This is why the answer is a nested list.
          </p>
        </div>
      </div>

      {/* 02 - Algorithm View */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">02 · Why queue length matters</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">How we avoid mixing levels</h2>
        <p className="text-[15px] leading-relaxed text-slate-700 mb-4">
          At the start of each while loop, we store <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-slate-600">level_size</code>. Then we pop exactly that many nodes. Any children pushed during this step belong to the next level by definition.
        </p>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center rounded-lg bg-teal-50 p-3 ring-2 ring-teal-500">
              <p className="text-xs font-medium text-teal-700 mb-1">Freeze</p>
              <p className="text-sm text-teal-800 font-mono">level_size</p>
            </div>
            <div className="text-center rounded-lg bg-cyan-50 p-3">
              <p className="text-xs font-medium text-cyan-700 mb-1">Process</p>
              <p className="text-sm text-cyan-800 font-mono">pop N nodes</p>
            </div>
            <div className="text-center rounded-lg bg-emerald-50 p-3">
              <p className="text-xs font-medium text-emerald-700 mb-1">Append</p>
              <p className="text-sm text-emerald-800 font-mono">push level</p>
            </div>
          </div>
        </div>
      </div>

      {/* 03 - Dry Run */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">03 · Full trace</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Step by step queue evolution</h2>
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

      {/* 04 - Quick dry cards */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">04 · Mini dry run cards</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Fast replay of the same example</h2>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
          {DRY_RUN_STEPS.map((step) => (
            <div key={step.num} className={`rounded-xl border p-3 ${step.highlight ? "border-teal-200 bg-teal-50/60" : "border-slate-200 bg-slate-50/50"}`}>
              <p className="text-sm font-medium text-slate-800">Step {step.num} · Node {step.node}</p>
              <p className="text-[13px] text-slate-500 mt-0.5 leading-relaxed">{step.what}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 05 - Q A */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">05 · Interview Q and A</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">High frequency follow up questions</h2>
        <div className="space-y-3">
          {QA_ITEMS.map((qa, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800">{qa.q}</div>
              <div className="px-4 py-3 text-sm text-slate-700 leading-relaxed border-t border-slate-100">{qa.a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 06 - Common mistakes */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">06 · Common beginner mistakes</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">What usually goes wrong</h2>
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

      {/* 07 - Complexity */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">07 · Complexity details</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Why O(n) time and O(w) space</h2>
        <div className="grid gap-4 md:grid-cols-2 mb-4">
          <div className="rounded-xl bg-emerald-50 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 mb-1">Time</p>
            <p className="text-3xl font-mono font-semibold text-emerald-800 mb-1">O(n)</p>
            <p className="text-sm text-emerald-700 leading-relaxed">Each node is enqueued once and dequeued once.</p>
          </div>
          <div className="rounded-xl bg-cyan-50 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-cyan-600 mb-1">Space</p>
            <p className="text-3xl font-mono font-semibold text-cyan-800 mb-1">O(w)</p>
            <p className="text-sm text-cyan-700 leading-relaxed">w is the maximum number of nodes in any level, which is queue peak size.</p>
          </div>
        </div>
        <div className="rounded-xl bg-amber-50 border-l-[3px] border-amber-400 p-4">
          <p className="text-sm text-amber-800">
            <strong className="font-medium">Interview tip:</strong> State both forms when asked about space. O(w) is exact for BFS queue and in worst case O(n).
          </p>
        </div>
      </div>

      {/* 08 - Interview context */}
      <div className="mb-10">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">08 · Interview context</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Where this pattern appears</h2>
        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          {INTERVIEW_ITEMS.map((item, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl p-4 transition-colors hover:bg-slate-50/50">
              <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-500" />
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

export default function LevelOrderGuidePage() {
  const [mode, setMode] = useState<"quick" | "deep">("quick");

  return (
    <section className="relative min-h-0 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,#ccfbf1_0%,transparent_50%),radial-gradient(ellipse_at_bottom_left,#dbeafe_0%,transparent_50%)]" />

      <div className="relative z-[1] mx-auto max-w-[860px] px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-teal-500" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-teal-600">Binary Tree · Traversal</span>
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
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">Level Order Traversal</h1>
          <p className="text-base text-slate-500 mb-5 max-w-xl">
            Visit nodes level by level using BFS. Group each depth into its own result array.
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-200 px-3 py-1.5 text-xs font-medium text-teal-700">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
              Queue
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 border border-cyan-200 px-3 py-1.5 text-xs font-medium text-cyan-700">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
              BFS
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Level Grouping
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
              ? "Key concepts at a glance for fast revision."
              : "Full beginner walkthrough with trace and interview context."}
          </p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-8" />

        {/* ═══ Content ═══ */}
        {mode === "quick" ? <QuickMode /> : <DeepMode />}

        {/* CTA */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-teal-50/30 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[15px] font-medium text-slate-800">Ready to see it in action?</p>
              <p className="text-[13px] text-slate-500 mt-0.5">Step through the visualizer and watch queue state change per level.</p>
            </div>
            <Link
              href="/problems/binary-tree/level-order-traversal"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-teal-600/20 transition hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-600/25"
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

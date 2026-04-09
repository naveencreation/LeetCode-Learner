"use client";

import { useState } from "react";
import Link from "next/link";

type TreeNodePoint = {
  id: number;
  x: number;
  y: number;
};

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

const DIAMETER_NODE_IDS = new Set([4, 2, 1, 3, 7]);
const DIAMETER_EDGE_KEYS = new Set(["2-4", "1-2", "1-3", "3-7"]);

function nodeById(id: number): TreeNodePoint {
  const node = NODES.find((item) => item.id === id);
  if (!node) {
    throw new Error(`Missing node ${id}`);
  }
  return node;
}

function edgeKey(from: number, to: number): string {
  return `${Math.min(from, to)}-${Math.max(from, to)}`;
}

function TreeDiagram({ highlightDiameter = false }: { highlightDiameter?: boolean }) {
  return (
    <svg viewBox="0 0 320 200" width="300" height="180" xmlns="http://www.w3.org/2000/svg" className="max-w-[320px]">
      {EDGES.map(([from, to]) => {
        const source = nodeById(from);
        const target = nodeById(to);
        const isDiameterEdge = highlightDiameter && DIAMETER_EDGE_KEYS.has(edgeKey(from, to));

        return (
          <line
            key={`${from}-${to}`}
            x1={source.x}
            y1={source.y}
            x2={target.x}
            y2={target.y}
            stroke={isDiameterEdge ? "#0f766e" : "#B5D4F4"}
            strokeWidth={isDiameterEdge ? "2.8" : "1.5"}
          />
        );
      })}

      {NODES.map((node) => {
        const isDiameterNode = highlightDiameter && DIAMETER_NODE_IDS.has(node.id);
        const fill = isDiameterNode ? "#ccfbf1" : "#E9F5FF";
        const stroke = isDiameterNode ? "#0f766e" : "#2B83DA";
        const textColor = isDiameterNode ? "#134e4a" : "#0F4D8A";

        return (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r="22" fill={fill} stroke={stroke} strokeWidth="1.6" />
            <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="13" fontWeight="500" fill={textColor}>
              {node.id}
            </text>
          </g>
        );
      })}

      {highlightDiameter ? (
        <text x="160" y="188" textAnchor="middle" fontSize="11" fill="#0f766e" fontWeight="600">
          Longest path example: 4 - 2 - 1 - 3 - 7 (4 edges)
        </text>
      ) : null}
    </svg>
  );
}

const DRY_RUN_STEPS = [
  { num: 1, node: 4, what: "left=0, right=0, candidate=0, height=1, best=0", highlight: false },
  { num: 2, node: 5, what: "left=0, right=0, candidate=0, height=1, best=0", highlight: false },
  { num: 3, node: 2, what: "left=1, right=1, candidate=2, height=2, best=2", highlight: true },
  { num: 4, node: 6, what: "left=0, right=0, candidate=0, height=1, best=2", highlight: false },
  { num: 5, node: 7, what: "left=0, right=0, candidate=0, height=1, best=2", highlight: false },
  { num: 6, node: 3, what: "left=1, right=1, candidate=2, height=2, best=2", highlight: true },
  { num: 7, node: 1, what: "left=2, right=2, candidate=4, height=3, best=4", highlight: true },
];

const INTERVIEW_ITEMS = [
  { title: "Balanced Binary Tree", desc: "You already compute left/right heights at every node, so balance checks are a natural extension." },
  { title: "Height of Binary Tree", desc: "Diameter helper is fundamentally a height DFS with one extra candidate update." },
  { title: "Maximum Path Sum", desc: "Same tree DP pattern: compute child contributions and update a global answer." },
  { title: "N-ary Tree Diameter", desc: "Generalize by keeping top two child heights instead of just left/right." },
];

const TRACE_STEPS = [
  {
    phase: "Enter",
    phaseClass: "bg-blue-100 text-blue-700",
    title: "Start DFS at root 1",
    desc: "We call height(1). This helper returns subtree height and updates best diameter as a side effect.",
  },
  {
    phase: "Leaf",
    phaseClass: "bg-amber-100 text-amber-700",
    title: "Node 4 returns height 1",
    desc: "Both children are null so left=0, right=0, candidate=0. best stays 0. Return 1.",
  },
  {
    phase: "Leaf",
    phaseClass: "bg-amber-100 text-amber-700",
    title: "Node 5 returns height 1",
    desc: "Same story as node 4. candidate=0 and best is still 0.",
  },
  {
    phase: "Update",
    phaseClass: "bg-teal-100 text-teal-700",
    title: "Node 2 updates best to 2",
    desc: "left=1 and right=1 so candidate=2. Update best=max(0,2)=2. Return height=2.",
  },
  {
    phase: "Leaf",
    phaseClass: "bg-amber-100 text-amber-700",
    title: "Nodes 6 and 7 return height 1",
    desc: "Each leaf contributes height 1 and candidate 0.",
  },
  {
    phase: "Update",
    phaseClass: "bg-teal-100 text-teal-700",
    title: "Node 3 keeps best at 2",
    desc: "left=1, right=1, candidate=2. best remains 2. Return height=2.",
  },
  {
    phase: "Finish",
    phaseClass: "bg-emerald-100 text-emerald-700",
    title: "Root 1 updates final best to 4",
    desc: "left=2 and right=2 so candidate=4. best becomes 4 and that is the final diameter in edges.",
  },
];

const COMMON_MISTAKES = [
  {
    icon: "✕",
    title: "Mixing edges and nodes",
    desc: "LeetCode diameter uses edges. If interviewer asks node-count diameter, convert by +1 for non-empty trees.",
  },
  {
    icon: "✕",
    title: "Returning diameter from helper",
    desc: "Helper should return height. Diameter is the global/best value updated at every node.",
  },
  {
    icon: "✕",
    title: "Updating best only at root",
    desc: "Longest path may pass through any internal node, not necessarily the root.",
  },
  {
    icon: "✕",
    title: "Wrong base case for height",
    desc: "Use height(null)=0 in node-depth formulation. Returning 1 for null breaks all candidates.",
  },
];

const QA_ITEMS = [
  {
    q: "Why is candidate = leftHeight + rightHeight?",
    a: "Any longest path that passes through a node goes down to one side and down to the other side. Number of edges contributed is exactly left height plus right height.",
  },
  {
    q: "Why does helper return height, not diameter?",
    a: "Parent only needs child heights to build its own candidate. Diameter is tracked separately as the best candidate seen anywhere.",
  },
  {
    q: "Can this be done without mutable global state?",
    a: "Yes. Helper can return a pair (height, bestInSubtree). Global/nonlocal is just a concise implementation style.",
  },
];

function QuickMode() {
  return (
    <>
      <div className="mb-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Problem Statement</h3>
              <p className="text-sm text-slate-500">Diameter of Binary Tree</p>
            </div>
          </div>

          <div className="text-[15px] leading-relaxed text-slate-700 mb-5">
            Given the root of a binary tree, return the length of the longest path between any two nodes.
            The length is measured in <span className="font-medium text-slate-900">edges</span>.
          </div>

          <div className="space-y-3">
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Example 1</div>
              <div className="px-4 py-3">
                <p className="text-[13px] font-mono text-slate-600 mb-2">Input: [1, 2, 3, 4, 5]</p>
                <p className="text-[13px] font-mono text-teal-700">Output: 3</p>
                <p className="text-[12px] text-slate-400 mt-1.5">Longest path can be 4 - 2 - 1 - 3 (3 edges).</p>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Example 2</div>
              <div className="px-4 py-3">
                <p className="text-[13px] font-mono text-slate-600 mb-2">Input: [1, 2, 3, 4, 5, 6, 7]</p>
                <p className="text-[13px] font-mono text-teal-700">Output: 4</p>
                <p className="text-[12px] text-slate-400 mt-1.5">One longest path: 4 - 2 - 1 - 3 - 7.</p>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-lg bg-slate-50 p-4 border border-slate-200">
            <p className="text-xs font-semibold text-slate-600 mb-2">Constraints</p>
            <ul className="text-[13px] text-slate-600 space-y-1">
              <li className="flex items-start gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />Nodes in the tree are in range <span className="font-mono text-slate-800">[1, 10^4]</span>.</li>
              <li className="flex items-start gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />Node values are not important for this problem.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">01</span>
          <h2 className="text-xl font-semibold text-slate-900">Core Formula</h2>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 p-6 text-white shadow-lg shadow-teal-500/20">
          <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-white/10" />
          <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-6 translate-y-6 rounded-full bg-white/10" />
          <div className="relative">
            <p className="text-2xl font-semibold tracking-wide mb-2">candidate(node) = leftHeight + rightHeight</p>
            <p className="text-teal-100 text-sm leading-relaxed">Run one DFS. At each node update best=max(best, candidate), and return height=1+max(left, right).</p>
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
            { n: 1, text: "Ask each child for height", sub: "Every recursive call returns one integer: subtree height." },
            { n: 2, text: "Compute local candidate", sub: "Path through current node uses one branch from left + one branch from right." },
            { n: 3, text: "Return height upward", sub: "Parent only needs your best downward branch: 1 + max(left, right)." },
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

      <div className="mb-12">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">03</span>
          <h2 className="text-xl font-semibold text-slate-900">Dry Run</h2>
        </div>

        <div className="mb-6 flex justify-center rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <TreeDiagram highlightDiameter />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="grid grid-cols-[48px_100px_1fr] bg-slate-50/80">
            <div className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-r border-slate-200">Step</div>
            <div className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-r border-slate-200">Node</div>
            <div className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">State Update</div>
          </div>
          {DRY_RUN_STEPS.map((step) => (
            <div
              key={step.num}
              className={`grid grid-cols-[48px_100px_1fr] border-t border-slate-100 transition-colors ${step.highlight ? "bg-teal-50/60" : "bg-white"}`}
            >
              <div className="px-4 py-3.5 text-sm text-slate-400 border-r border-slate-100">{step.num}</div>
              <div className="px-4 py-3.5 border-r border-slate-100">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                  {step.node}
                </span>
              </div>
              <div className="px-4 py-3.5 text-[13px] leading-relaxed text-slate-600">{step.what}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">04</span>
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
            <div><span className="text-[#cba6f7]">def</span> <span className="text-[#89b4fa]">diameterOfBinaryTree</span><span className="text-[#cdd6f4]">(root):</span></div>
            <div><span className="text-[#cdd6f4]">    best = </span><span className="text-[#b5cea8]">0</span></div>
            <div><span className="text-[#cdd6f4]">    </span></div>
            <div><span className="text-[#cba6f7]">    def</span> <span className="text-[#89b4fa]">height</span><span className="text-[#cdd6f4]">(node):</span></div>
            <div><span className="text-[#cdd6f4]">        </span><span className="text-[#cba6f7]">nonlocal</span><span className="text-[#cdd6f4]"> best</span></div>
            <div><span className="text-[#cdd6f4]">        </span><span className="text-[#cba6f7]">if</span><span className="text-[#cdd6f4]"> node </span><span className="text-[#cba6f7]">is</span><span className="text-[#cdd6f4]"> </span><span className="text-[#cba6f7]">None</span><span className="text-[#cdd6f4]">: </span><span className="text-[#cba6f7]">return</span> <span className="text-[#b5cea8]">0</span></div>
            <div><span className="text-[#cdd6f4]">        left = </span><span className="text-[#89b4fa]">height</span><span className="text-[#cdd6f4]">(node.left)</span></div>
            <div><span className="text-[#cdd6f4]">        right = </span><span className="text-[#89b4fa]">height</span><span className="text-[#cdd6f4]">(node.right)</span></div>
            <div><span className="text-[#cdd6f4]">        best = </span><span className="text-[#89b4fa]">max</span><span className="text-[#cdd6f4]">(best, left + right)</span></div>
            <div><span className="text-[#cdd6f4]">        </span><span className="text-[#cba6f7]">return</span><span className="text-[#cdd6f4]"> </span><span className="text-[#b5cea8]">1</span><span className="text-[#cdd6f4]"> + </span><span className="text-[#89b4fa]">max</span><span className="text-[#cdd6f4]">(left, right)</span></div>
            <div><span className="text-[#cdd6f4]">    </span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#89b4fa]">height</span><span className="text-[#cdd6f4]">(root)</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#cba6f7]">return</span><span className="text-[#cdd6f4]"> best</span></div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">05</span>
          <h2 className="text-xl font-semibold text-slate-900">Complexity</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-emerald-50 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 mb-1">Time</p>
            <p className="text-3xl font-mono font-semibold text-emerald-800 mb-1">O(n)</p>
            <p className="text-sm text-emerald-700">Each node is processed exactly once.</p>
          </div>
          <div className="rounded-xl bg-cyan-50 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-cyan-600 mb-1">Space</p>
            <p className="text-3xl font-mono font-semibold text-cyan-800 mb-1">O(h)</p>
            <p className="text-sm text-cyan-700">Recursion stack depth equals tree height.</p>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">06</span>
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

function DeepMode() {
  return (
    <>
      <hr className="border-t border-slate-200 mb-8" />

      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">01 · Foundation</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">What diameter really means</h2>
        <p className="text-[15px] leading-relaxed text-slate-700 mb-4">
          Diameter is the longest path between any two nodes in the tree. That path may or may not pass through the root.
          In this guide, length means number of edges.
        </p>
        <div className="flex justify-center mb-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <TreeDiagram highlightDiameter />
        </div>
        <div className="rounded-xl bg-teal-50 border-l-[3px] border-teal-500 p-4">
          <p className="text-sm text-teal-800">
            Local insight: for any node, the best path through it is leftHeight + rightHeight.
          </p>
        </div>
      </div>

      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">02 · Strategy</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Brute force vs one-pass DFS</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.04em] text-amber-700">Brute Force</p>
            <p className="mt-1 text-sm leading-6 text-amber-900">Recompute subtree heights for many nodes. Can degrade to O(n^2).</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.04em] text-emerald-700">Optimal</p>
            <p className="mt-1 text-sm leading-6 text-emerald-900">Single DFS returns height while updating global best diameter. O(n).</p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">03 · Recursion Q and A</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Why this helper pattern works</h2>
        <div className="overflow-hidden rounded-2xl bg-[#1e1e2e] shadow-lg mb-5">
          <div className="p-5 font-mono text-[13.5px] leading-8 text-[#cdd6f4]">
            <div><span className="text-[#cba6f7]">def</span> <span className="text-[#89b4fa]">height</span>(node):</div>
            <div>    <span className="text-[#cba6f7]">if</span> node <span className="text-[#cba6f7]">is</span> <span className="text-[#cba6f7]">None</span>: <span className="text-[#cba6f7]">return</span> <span className="text-[#b5cea8]">0</span></div>
            <div>    left = height(node.left)</div>
            <div>    right = height(node.right)</div>
            <div>    best = max(best, left + right)</div>
            <div>    <span className="text-[#cba6f7]">return</span> <span className="text-[#b5cea8]">1</span> + max(left, right)</div>
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

      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">04 · Full trace</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Step-by-step state updates</h2>
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
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">05 · Table dry run</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Node-wise values</h2>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
          {DRY_RUN_STEPS.map((step) => (
            <div key={step.num} className={`rounded-xl border p-3 ${step.highlight ? "border-teal-200 bg-teal-50/60" : "border-slate-200 bg-slate-50/50"}`}>
              <p className="text-sm font-medium text-slate-800">Step {step.num} · Node {step.node}</p>
              <p className="text-[13px] text-slate-500 mt-0.5 leading-relaxed">{step.what}</p>
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
        <h2 className="text-lg font-medium text-slate-900 mb-4">Problems that reuse this pattern</h2>
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

export default function DiameterGuidePage() {
  const [mode, setMode] = useState<"quick" | "deep">("quick");

  return (
    <section className="relative min-h-0 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,#ccfbf1_0%,transparent_50%),radial-gradient(ellipse_at_bottom_left,#cffafe_0%,transparent_50%)]" />

      <div className="relative z-[1] mx-auto max-w-[860px] px-6 py-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-teal-500" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-teal-600">Binary Tree · Diameter</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/problems/binary-tree/diameter-of-binary-tree"
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

          <h1 className="text-3xl font-semibold text-slate-900 mb-2">Diameter of Binary Tree</h1>
          <p className="text-base text-slate-500 mb-5 max-w-xl">
            Compute the longest path in one DFS by returning subtree heights and updating a running best.
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-200 px-3 py-1.5 text-xs font-medium text-teal-700"><span className="h-1.5 w-1.5 rounded-full bg-teal-500" />Recursion</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 border border-cyan-200 px-3 py-1.5 text-xs font-medium text-cyan-700"><span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />DFS</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Tree DP</span>
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
              ? "Key concepts at a glance for revision."
              : "Detailed walkthrough with trace, Q and A, and common pitfalls."}
          </p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-8" />

        {mode === "quick" ? <QuickMode /> : <DeepMode />}

        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-teal-50/30 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[15px] font-medium text-slate-800">Ready to watch candidate updates live?</p>
              <p className="text-[13px] text-slate-500 mt-0.5">Open the visualizer and inspect leftHeight, rightHeight, and best at each node.</p>
            </div>
            <Link
              href="/problems/binary-tree/diameter-of-binary-tree"
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

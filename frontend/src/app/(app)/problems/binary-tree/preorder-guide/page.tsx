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
            stroke="#C4BEFF" strokeWidth="1.5"
          />
        );
      })}
      {NODES.map((node) => {
        const isLeaf = node.id >= 4;
        const fill = highlightLeaves && isLeaf ? "#E1F5EE" : "#EEEDFE";
        const stroke = highlightLeaves && isLeaf ? "#1D9E75" : "#7C6FE0";
        const textColor = highlightLeaves && isLeaf ? "#085041" : "#3C3489";
        return (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r="22" fill={fill} stroke={stroke} strokeWidth="1.5" />
            <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="13" fontWeight="500" fill={textColor}>{node.id}</text>
            {highlightLeaves && isLeaf && (
              <text x={node.x} y={node.y + 30} textAnchor="middle" fontSize="10" fill="#1D9E75">leaf</text>
            )}
            {node.id === 1 && highlightLeaves && (
              <text x={node.x} y={node.y - 16} textAnchor="middle" fontSize="10" fill="#7C6FE0">root</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ═══════════════ Quick Mode Data ═══════════════ */

const DRY_RUN_STEPS = [
  { num: 1, node: 1, what: "Visit 1 immediately. Then go left → 2.", highlight: true },
  { num: 2, node: 2, what: "Visit 2 immediately. Then go left → 4.", highlight: true },
  { num: 3, node: 4, what: "Visit 4. No children. Return to 2.", highlight: false },
  { num: 4, node: 2, what: "Left done. Now go right → 5.", highlight: true },
  { num: 5, node: 5, what: "Visit 5. No children. Return to 2, then to 1.", highlight: false },
  { num: 6, node: 1, what: "Left subtree done. Now go right → 3.", highlight: true },
  { num: 7, node: 3, what: "Visit 3 immediately. Then go left → 6.", highlight: true },
  { num: 8, node: 6, what: "Visit 6. No children. Return to 3.", highlight: false },
  { num: 9, node: 3, what: "Left done. Now go right → 7.", highlight: true },
  { num: 10, node: 7, what: "Visit 7. No children. Done! Result: [1, 2, 4, 5, 3, 6, 7]", highlight: false },
];

const INTERVIEW_ITEMS = [
  { title: "Serialize a binary tree", desc: "Preorder output + nulls fully reconstructs the tree." },
  { title: "Copy / clone a tree", desc: "Root-first creation means children can be attached right after." },
  { title: "Print directory structure", desc: "Preorder mirrors how file systems display nested folders." },
  { title: "Find a path to a node", desc: "Root-to-leaf path tracking is naturally preorder." },
];

/* ═══════════════ Deep Mode Data ═══════════════ */

const TRACE_STEPS = [
  { phase: "Visit", phaseClass: "bg-violet-100 text-violet-700", title: "Record 1 → result = [1]", desc: "Enter preorder(1) — the root. We record it immediately before doing anything else. Then recurse left → preorder(2)." },
  { phase: "Visit", phaseClass: "bg-violet-100 text-violet-700", title: "Record 2 → result = [1, 2]", desc: "Enter preorder(2). Record it immediately. Then recurse left → preorder(4). Node 2's right call is queued for later." },
  { phase: "Visit", phaseClass: "bg-violet-100 text-violet-700", title: "Record 4 → result = [1, 2, 4]", desc: "Enter preorder(4) — a leaf. Record it. preorder(None) for left returns instantly. preorder(None) for right returns instantly. Done with node 4, return to node 2." },
  { phase: "Going", phaseClass: "bg-blue-100 text-blue-700", title: "Back at node 2 — now go right", desc: "Left subtree of 2 is fully done. Now execute the right call → preorder(5)." },
  { phase: "Visit", phaseClass: "bg-violet-100 text-violet-700", title: "Record 5 → result = [1, 2, 4, 5]", desc: "Enter preorder(5) — a leaf. Record it. Both children are None, so it returns. Entire left subtree of root (node 1) is now done." },
  { phase: "Going", phaseClass: "bg-blue-100 text-blue-700", title: "Back at root node 1 — now go right", desc: "Left subtree of 1 is fully done. Now execute the right call → preorder(3)." },
  { phase: "Visit", phaseClass: "bg-violet-100 text-violet-700", title: "Record 3 → result = [1, 2, 4, 5, 3]", desc: "Enter preorder(3). Record it immediately. Then recurse left → preorder(6)." },
  { phase: "Visit", phaseClass: "bg-violet-100 text-violet-700", title: "Record 6 → result = [1, 2, 4, 5, 3, 6]", desc: "Enter preorder(6) — a leaf. Record it. Both children are None. Return to node 3." },
  { phase: "Visit", phaseClass: "bg-violet-100 text-violet-700", title: "Record 7 → result = [1, 2, 4, 5, 3, 6, 7] ✓", desc: "Back at node 3, now go right → preorder(7). Node 7 is a leaf. Record it. All done — this is the final preorder sequence." },
];

const COMMON_MISTAKES = [
  {
    icon: "✕",
    title: "Forgetting the base case",
    desc: "Without if node is None: return, the function tries to access None.val and crashes. Unlike inorder, in preorder this crash happens before the append — so you'd never even see partial output.",
  },
  {
    icon: "✕",
    title: "Moving the append to the middle or end",
    desc: "Moving append between the two calls gives inorder. Moving it after both calls gives postorder. The position of append defines which traversal you're doing.",
  },
  {
    icon: "✕",
    title: "Thinking preorder = BFS (level-order)",
    desc: "Preorder is a DFS — it dives deep left before going right. BFS visits nodes level by level using a queue. They look similar on paper but produce very different outputs.",
  },
  {
    icon: "✕",
    title: "Confusing serialization with sorted output",
    desc: "Preorder does not give sorted output even for a BST. That's inorder's job. Preorder's superpower is tree reconstruction — not sorting.",
  },
];

const QA_ITEMS = [
  {
    q: "Why does append come before the recursive calls?",
    a: "Because 'pre' means before. We record the current node's value before we dive into either subtree. This is the only difference from inorder — in inorder, the append is sandwiched between the two calls. Flip it to first and you get preorder.",
  },
  {
    q: "Why do we still check if node is None: return?",
    a: "This is the base case — it stops the recursion. Without it, when we reach a leaf and try to call preorder(leaf.left), we'd be calling preorder(None), which would then try to access None.val and crash. The base case makes every leaf safe.",
  },
  {
    q: "What does the recursion stack look like when we first reach node 4?",
    a: "In preorder we've already recorded nodes 1, 2, and 4 before the stack gets this deep. When we call preorder(4.left), the stack has frames for preorder(4), preorder(2), and preorder(1) — all already recorded their values.",
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
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Problem Statement</h3>
              <p className="text-sm text-slate-500">Binary Tree Preorder Traversal</p>
            </div>
          </div>
          <div className="text-[15px] leading-relaxed text-slate-700 mb-5">
            Given the <span className="font-medium text-slate-900">root</span> of a binary tree, return <span className="font-medium text-slate-900">the preorder traversal of its node values</span>.
          </div>

          {/* Examples */}
          <div className="space-y-3">
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Example 1</div>
              <div className="px-4 py-3">
                <p className="text-[13px] font-mono text-slate-600 mb-2">Input: root = [1, null, 2, 3]</p>
                <p className="text-[13px] font-mono text-violet-700">Output: [1, 2, 3]</p>
                <p className="text-[12px] text-slate-400 mt-1.5">Tree: 1 → right child 2, left child of 2 is 3.</p>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Example 2</div>
              <div className="px-4 py-3">
                <p className="text-[13px] font-mono text-slate-600 mb-2">Input: root = [1, 2, 3, 4, 5, 6, 7]</p>
                <p className="text-[13px] font-mono text-violet-700">Output: [1, 2, 4, 5, 3, 6, 7]</p>
                <p className="text-[12px] text-slate-400 mt-1.5">Perfect binary tree — root, left subtree, right subtree.</p>
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
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 p-6 text-white shadow-lg shadow-violet-500/20">
          <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-white/10" />
          <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-6 translate-y-6 rounded-full bg-white/10" />
          <div className="relative">
            <p className="text-2xl font-semibold tracking-wide mb-2">Root → Left → Right</p>
            <p className="text-violet-100 text-sm leading-relaxed">
              The current node is always visited <em>before</em> exploring any of its children.
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
            { n: 1, text: "Visit (record) the current node immediately", sub: "Before going anywhere — this is what makes it 'pre' order." },
            { n: 2, text: "Recurse into the left subtree", sub: "Handle the entire left branch, root-first, the same way." },
            { n: 3, text: "Recurse into the right subtree", sub: "Apply Root → Left → Right recursively to the right branch." },
          ].map((item) => (
            <div key={item.n} className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">{item.n}</div>
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
            <div><span className="text-[#cba6f7]">def</span> <span className="text-[#89b4fa]">preorder</span><span className="text-[#cdd6f4]">(node, result):</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#cba6f7]">if</span><span className="text-[#cdd6f4]"> node </span><span className="text-[#cba6f7]">is</span><span className="text-[#cdd6f4]"> </span><span className="text-[#cba6f7]">None</span><span className="text-[#cdd6f4]">: </span><span className="text-[#cba6f7]">return</span> <span className="ml-2 text-[#6c7086] italic"># base case</span></div>
            <div><span className="text-[#cdd6f4]">    result.</span><span className="text-[#89b4fa]">append</span><span className="text-[#cdd6f4]">(node.val)     </span><span className="text-[#6c7086] italic"># 1. root ← first!</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#89b4fa]">preorder</span><span className="text-[#cdd6f4]">(node.left, result) </span><span className="text-[#6c7086] italic"># 2. left</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#89b4fa]">preorder</span><span className="text-[#cdd6f4]">(node.right, result)</span><span className="text-[#6c7086] italic"># 3. right</span></div>
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
            <p className="text-sm text-emerald-700">Every node visited once.</p>
          </div>
          <div className="rounded-xl bg-violet-50 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-600 mb-1">Space</p>
            <p className="text-3xl font-mono font-semibold text-violet-800 mb-1">O(h)</p>
            <p className="text-sm text-violet-700">Stack depth = tree height.</p>
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
              <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-violet-500" />
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

      {/* 01 - What is a binary tree? */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">01 · Start here — what even is a binary tree?</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Build the foundation first</h2>
        <p className="text-[15px] leading-relaxed text-slate-700 mb-4">
          Before traversal makes sense, you need to picture the structure. A binary tree is a collection of nodes where each node has at most two children — called the <strong className="font-medium text-slate-900">left child</strong> and the <strong className="font-medium text-slate-900">right child</strong>. The topmost node is called the <strong className="font-medium text-slate-900">root</strong>. Nodes with no children are called <strong className="font-medium text-slate-900">leaves</strong>.
        </p>
        <div className="flex justify-center mb-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <TreeDiagram highlightLeaves />
        </div>
        <div className="rounded-xl bg-blue-50 border-l-[3px] border-blue-400 p-4">
          <p className="text-sm text-blue-800">
            The purple node is the <strong className="font-medium">root</strong>. The green nodes are <strong className="font-medium">leaves</strong> — they have no children. Every other node is an internal node.
          </p>
        </div>
      </div>

      {/* 02 - What is traversal? */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">02 · What does "traversal" mean?</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Visiting every node — in what order?</h2>
        <p className="text-[15px] leading-relaxed text-slate-700 mb-4">
          Traversal simply means visiting every node in the tree exactly once. The question is — in what order do you visit them? There are three classic DFS orders:
        </p>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center rounded-lg bg-violet-50 p-3 ring-2 ring-violet-500">
              <p className="text-xs font-medium text-violet-700 mb-1">Preorder ← you are here</p>
              <p className="text-sm text-violet-800 font-mono">Root→L→R</p>
            </div>
            <div className="text-center rounded-lg bg-emerald-50 p-3">
              <p className="text-xs font-medium text-emerald-700 mb-1">Inorder</p>
              <p className="text-sm text-emerald-800 font-mono">L→Root→R</p>
            </div>
            <div className="text-center rounded-lg bg-amber-50 p-3">
              <p className="text-xs font-medium text-amber-700 mb-1">Postorder</p>
              <p className="text-sm text-amber-800 font-mono">L→R→Root</p>
            </div>
          </div>
        </div>
        <p className="text-[15px] leading-relaxed text-slate-700">
          Preorder means: for any node, visit it <em>immediately</em>, then explore the entire left subtree, then the entire right subtree. The "pre" in preorder means the root comes <strong className="font-medium">before</strong> its children.
        </p>
      </div>

      {/* 03 - Analogy */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">03 · The real-world analogy</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Think of it like exploring a cave system</h2>
        <div className="rounded-xl bg-amber-50 p-4 mb-4">
          <p className="text-[15px] leading-relaxed text-amber-900/80 mb-0">
            Imagine you're a cave explorer. Every time you enter a new chamber, you mark it on your map <em>immediately</em> — before heading deeper. Then you go left as far as you can, marking each chamber as you enter. Only after you've fully explored the left tunnel do you backtrack and explore the right. Preorder traversal works exactly the same way: mark now, explore later.
          </p>
        </div>
        <div className="rounded-xl bg-violet-50 border-l-[3px] border-violet-500 p-4">
          <p className="text-sm text-violet-800">
            <strong className="font-medium">The key insight:</strong> Preorder naturally produces a "top-down" view of the tree. The root always appears first in the output, making preorder ideal for serializing and reconstructing trees.
          </p>
        </div>
      </div>

      {/* 04 - Recursion */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">04 · Understanding recursion here</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">What is the function actually doing?</h2>
        <p className="text-[15px] leading-relaxed text-slate-700 mb-4">
          Recursion is when a function calls itself. In preorder, the crucial difference from inorder is that <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-slate-600">append</code> happens <strong className="font-medium">first</strong> — before any recursive calls. Here is how to read the code line by line:
        </p>
        <div className="overflow-hidden rounded-2xl bg-[#1e1e2e] shadow-lg mb-5">
          <div className="p-5 font-mono text-[13.5px] leading-8">
            <div><span className="text-[#cba6f7]">def</span> <span className="text-[#89b4fa]">preorder</span><span className="text-[#cdd6f4]">(node, result):</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#cba6f7]">if</span><span className="text-[#cdd6f4]"> node </span><span className="text-[#cba6f7]">is</span><span className="text-[#cdd6f4]"> </span><span className="text-[#cba6f7]">None</span><span className="text-[#cdd6f4]">: </span><span className="text-[#cba6f7]">return</span></div>
            <div><span className="text-[#cdd6f4]">    result.</span><span className="text-[#89b4fa]">append</span><span className="text-[#cdd6f4]">(node.val)</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#89b4fa]">preorder</span><span className="text-[#cdd6f4]">(node.left, result)</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#89b4fa]">preorder</span><span className="text-[#cdd6f4]">(node.right, result)</span></div>
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
        {/* Stack visual */}
        <div className="mt-5">
          <p className="text-sm font-medium text-slate-700 mb-2">When we first reach node 4, the stack looks like this:</p>
          <div className="overflow-hidden rounded-xl bg-[#1e1e2e] p-4 font-mono text-sm">
            <div className="rounded bg-[#313244] text-[#cdd6f4] px-3 py-1.5 mb-1 border-l-2 border-[#cba6f7]">→ preorder(node=None) <span className="text-[#6c7086]">← base case, returns</span></div>
            <div className="rounded bg-[#1e1e2e] text-[#6c7086] px-3 py-1.5 mb-1 border-l-2 border-[#45475a]">&nbsp;&nbsp; preorder(node=4) <span className="text-[#45475a]">← already recorded 4</span></div>
            <div className="rounded bg-[#1e1e2e] text-[#6c7086] px-3 py-1.5 mb-1 border-l-2 border-[#45475a]">&nbsp;&nbsp; preorder(node=2) <span className="text-[#45475a]">← already recorded 2</span></div>
            <div className="rounded bg-[#1e1e2e] text-[#6c7086] px-3 py-1.5 border-l-2 border-[#45475a]">&nbsp;&nbsp; preorder(node=1) <span className="text-[#45475a]">← already recorded 1</span></div>
          </div>
        </div>
      </div>

      {/* 05 - Full trace */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">05 · Full trace — every step explained</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Walking through the example tree</h2>
        <p className="text-[15px] leading-relaxed text-slate-700 mb-6">
          Let's trace every single action the algorithm takes on this tree, narrated step by step. Expected output: <strong className="font-medium">[1, 2, 4, 5, 3, 6, 7]</strong>
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
        <h2 className="text-lg font-medium text-slate-900 mb-4">Why O(n) time and O(h) space?</h2>
        <div className="grid gap-4 md:grid-cols-2 mb-4">
          <div className="rounded-xl bg-emerald-50 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 mb-1">Time</p>
            <p className="text-3xl font-mono font-semibold text-emerald-800 mb-1">O(n)</p>
            <p className="text-sm text-emerald-700 leading-relaxed">We visit every node exactly once — no node is skipped or revisited — so time grows linearly with the number of nodes.</p>
          </div>
          <div className="rounded-xl bg-violet-50 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-600 mb-1">Space</p>
            <p className="text-3xl font-mono font-semibold text-violet-800 mb-1">O(h)</p>
            <p className="text-sm text-violet-700 leading-relaxed">The call stack holds one frame per level of depth. h = log n for balanced trees, h = n for skewed (like a linked list).</p>
          </div>
        </div>
        <div className="rounded-xl bg-amber-50 border-l-[3px] border-amber-400 p-4">
          <p className="text-sm text-amber-800">
            <strong className="font-medium">Interview tip:</strong> If they ask "what is the space complexity?", always clarify — O(log n) for a balanced tree, O(n) worst case for a skewed tree. Showing you know both impresses interviewers.
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
              <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-violet-500" />
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

export default function PreorderGuidePage() {
  const [mode, setMode] = useState<"quick" | "deep">("quick");

  return (
    <section className="relative min-h-0 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,#ede9fe_0%,transparent_50%),radial-gradient(ellipse_at_bottom_left,#fef3c7_0%,transparent_50%)]" />

      <div className="relative z-[1] mx-auto max-w-[860px] px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-violet-500" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-violet-600">Binary Tree · Traversal</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/problems/binary-tree/preorder-traversal"
                className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 transition hover:bg-violet-100"
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
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">Preorder Traversal</h1>
          <p className="text-base text-slate-500 mb-5 max-w-xl">
            Visit nodes in Root → Left → Right order. The root is always processed first, before any subtree.
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 border border-violet-200 px-3 py-1.5 text-xs font-medium text-violet-700">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
              Recursion
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              DFS
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
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-violet-50/30 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[15px] font-medium text-slate-800">Ready to see it in action?</p>
              <p className="text-[13px] text-slate-500 mt-0.5">Step through the visualizer to watch the recursion stack live.</p>
            </div>
            <Link
              href="/problems/binary-tree/preorder-traversal"
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-violet-600/20 transition hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-600/25"
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
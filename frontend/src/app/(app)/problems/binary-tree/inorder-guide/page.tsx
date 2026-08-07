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
            stroke="#B5D4F4" strokeWidth="1.5"
          />
        );
      })}
      {NODES.map((node) => {
        const isLeaf = node.id >= 4;
        const fill = highlightLeaves && isLeaf ? "#E1F5EE" : "#E6F1FB";
        const stroke = highlightLeaves && isLeaf ? "#1D9E75" : "#378ADD";
        const textColor = highlightLeaves && isLeaf ? "#085041" : "#0C447C";
        return (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r="22" fill={fill} stroke={stroke} strokeWidth="1.5" />
            <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="13" fontWeight="500" fill={textColor}>{node.id}</text>
            {highlightLeaves && isLeaf && (
              <text x={node.x} y={node.y + 30} textAnchor="middle" fontSize="10" fill="#1D9E75">leaf</text>
            )}
            {node.id === 1 && highlightLeaves && (
              <text x={node.x} y={node.y - 16} textAnchor="middle" fontSize="10" fill="#378ADD">root</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ═══════════════ Quick Mode Data ═══════════════ */

const DRY_RUN_STEPS = [
  { num: 1, node: 4, what: "No left child. Visit 4. No right child. Done.", highlight: false },
  { num: 2, node: 2, what: "Left (4) already done. Visit 2. Now go right → 5.", highlight: true },
  { num: 3, node: 5, what: "No left child. Visit 5. No right child. Done.", highlight: false },
  { num: 4, node: 1, what: "Entire left subtree (4,2,5) done. Visit root 1. Go right → 3.", highlight: true },
  { num: 5, node: 6, what: "No left child. Visit 6. No right child. Done.", highlight: false },
  { num: 6, node: 3, what: "Left (6) done. Visit 3. Go right → 7.", highlight: true },
  { num: 7, node: 7, what: "No left child. Visit 7. No right child. Done.", highlight: false },
];

const INTERVIEW_ITEMS = [
  { title: "Kth smallest in BST", desc: "Inorder gives sorted order, so the kth element is the answer." },
  { title: "Validate a BST", desc: "Check that the inorder sequence is strictly increasing." },
  { title: "Convert BST to sorted array", desc: "Directly collect inorder result." },
  { title: "Recover BST", desc: "Find the two swapped nodes by spotting where inorder order breaks." },
];

/* ═══════════════ Deep Mode Data ═══════════════ */

const TRACE_STEPS = [
  { phase: "Going", phaseClass: "bg-blue-100 text-blue-700", title: "Enter inorder(1) — the root", desc: "We start at 1. Rule says go left first, so we call inorder(1.left) = inorder(2). Node 1 is now waiting." },
  { phase: "Going", phaseClass: "bg-blue-100 text-blue-700", title: "Enter inorder(2)", desc: "At node 2. Go left first → call inorder(2.left) = inorder(4). Node 2 is now waiting." },
  { phase: "Going", phaseClass: "bg-blue-100 text-blue-700", title: "Enter inorder(4) — leftmost leaf", desc: "At node 4. Try to go left → inorder(None) → base case, returns immediately. Now visit node 4." },
  { phase: "Visit", phaseClass: "bg-emerald-100 text-emerald-700", title: "Record 4 → result = [4]", desc: "Node 4 has no left, no right. We're done with it. Return back to node 2." },
  { phase: "Visit", phaseClass: "bg-emerald-100 text-emerald-700", title: "Record 2 → result = [4, 2]", desc: "Left subtree of 2 is finished. Now visit node 2 itself. Then go right → inorder(5)." },
  { phase: "Visit", phaseClass: "bg-emerald-100 text-emerald-700", title: "Record 5 → result = [4, 2, 5]", desc: "Node 5 has no children. Visit it and return. Left subtree of root (1) is now fully done." },
  { phase: "Visit", phaseClass: "bg-emerald-100 text-emerald-700", title: "Record 1 → result = [4, 2, 5, 1]", desc: "Entire left subtree finished. Now visit the root itself. Then go right → inorder(3)." },
  { phase: "Visit", phaseClass: "bg-emerald-100 text-emerald-700", title: "Record 6 → result = [4, 2, 5, 1, 6]", desc: "Enter node 3, go left to 6. Node 6 is a leaf. Visit it and return to 3." },
  { phase: "Visit", phaseClass: "bg-emerald-100 text-emerald-700", title: "Record 3 → result = [4, 2, 5, 1, 6, 3]", desc: "Left of 3 is done. Visit node 3. Go right → inorder(7)." },
  { phase: "Visit", phaseClass: "bg-emerald-100 text-emerald-700", title: "Record 7 → result = [4, 2, 5, 1, 6, 3, 7] ✓", desc: "Node 7 is a leaf. Visit it. All done — this is the final inorder sequence." },
];

const COMMON_MISTAKES = [
  {
    icon: "✕",
    title: "Forgetting the base case",
    desc: "Without if node is None: return, the function crashes with a recursion error when it tries to access None.left.",
  },
  {
    icon: "✕",
    title: "Mixing up the order",
    desc: "Moving the append before the left call gives preorder. Moving it after both calls gives postorder. Position of append defines the traversal.",
  },
  {
    icon: "✕",
    title: "Thinking inorder = sorted for all trees",
    desc: "Inorder only gives sorted output for a BST. For a random binary tree, the output order depends entirely on node placement.",
  },
  {
    icon: "✕",
    title: "Not passing result by reference",
    desc: "In Python, lists are passed by reference — all recursive calls share the same list. If you create a new list inside each call instead, results will be lost.",
  },
];

const QA_ITEMS = [
  {
    q: "Why do we check if node is None: return?",
    a: "This is the base case — it stops the recursion. Without it, the function would keep calling itself forever. When a node has no left child, node.left is None, so we call inorder(None) which immediately returns. This is how recursion knows when to stop going deeper.",
  },
  {
    q: "Why does the append line come in the middle — not first or last?",
    a: "Because inorder means Left first, then Root, then Right. Appending in the middle means we only record the current node after the entire left subtree is finished. If you moved the append line to the top, you'd get preorder. If you moved it to the bottom, you'd get postorder.",
  },
  {
    q: "What does the recursion stack look like at the deepest point?",
    a: "When we first reach node 4 (the leftmost leaf), the call stack has three frames: inorder(4) on top, then inorder(2), then inorder(1) at the bottom. Each frame is waiting for the one above it to return.",
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
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Problem Statement</h3>
              <p className="text-sm text-slate-500">Binary Tree Inorder Traversal</p>
            </div>
          </div>
          <div className="text-[15px] leading-relaxed text-slate-700 mb-5">
            Given the <span className="font-medium text-slate-900">root</span> of a binary tree, return <span className="font-medium text-slate-900">the inorder traversal of its node values</span>.
          </div>

          {/* Examples */}
          <div className="space-y-3">
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Example 1</div>
              <div className="px-4 py-3">
                <p className="text-[13px] font-mono text-slate-600 mb-2">Input: root = [1, null, 2, 3]</p>
                <p className="text-[13px] font-mono text-emerald-700">Output: [1, 3, 2]</p>
                <p className="text-[12px] text-slate-400 mt-1.5">Tree: 1 → right child 2, left child of 2 is 3.</p>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Example 2</div>
              <div className="px-4 py-3">
                <p className="text-[13px] font-mono text-slate-600 mb-2">Input: root = [1, 2, 3, 4, 5, 6, 7]</p>
                <p className="text-[13px] font-mono text-emerald-700">Output: [4, 2, 5, 1, 6, 3, 7]</p>
                <p className="text-[12px] text-slate-400 mt-1.5">Perfect binary tree — left subtree, root, right subtree.</p>
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

      {/* 01 - Task */}
      <div className="mb-12">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">01</span>
          <h2 className="text-xl font-semibold text-slate-900">The Task</h2>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <p className="text-[15px] leading-relaxed text-slate-700 mb-3">
            Given the <span className="font-medium text-slate-900">root</span> of a binary tree, return a list of all node values in <span className="font-medium text-emerald-700">inorder sequence</span>.
          </p>
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">Input:</span>
              <span className="font-mono text-slate-700">binary tree</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-slate-400"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">Output:</span>
              <span className="font-mono text-emerald-700 font-medium">[4, 2, 5, 1, 6, 3, 7]</span>
            </div>
          </div>
        </div>
      </div>

      {/* 02 - Rule */}
      <div className="mb-12">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">02</span>
          <h2 className="text-xl font-semibold text-slate-900">The Rule</h2>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white shadow-lg shadow-emerald-500/20">
          <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-white/10" />
          <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-6 translate-y-6 rounded-full bg-white/10" />
          <div className="relative">
            <p className="text-2xl font-semibold tracking-wide mb-2">Left → Root → Right</p>
            <p className="text-emerald-100 text-sm leading-relaxed">
              At every node: go as far left as possible, visit the current node, then explore the right subtree.
            </p>
          </div>
        </div>
      </div>

      {/* 03 - Intuition */}
      <div className="mb-12">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">03</span>
          <h2 className="text-xl font-semibold text-slate-900">The Intuition</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
            <div className="mb-3 flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-amber-600"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              <span className="text-sm font-semibold text-amber-800">Analogy</span>
            </div>
            <p className="text-[14px] leading-relaxed text-amber-900/80">
              Think of a bookshelf — books sorted left to right. You always finish the left shelf before reading the current book, then move right.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
            <div className="mb-3 flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-emerald-600"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className="text-sm font-semibold text-emerald-800">Superpower</span>
            </div>
            <p className="text-[14px] leading-relaxed text-emerald-900/80">
              Inorder of a <strong>Binary Search Tree</strong> always produces values in <strong>ascending sorted order</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* 04 - Mental Model */}
      <div className="mb-12">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">04</span>
          <h2 className="text-xl font-semibold text-slate-900">Mental Model</h2>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="space-y-0">
            <div className="flex gap-4 py-4 border-b border-slate-100">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-semibold text-white shadow-sm">1</div>
              <div>
                <p className="text-[15px] font-medium text-slate-800 mb-0.5">Go Left</p>
                <p className="text-[13px] text-slate-500">Keep going left until you hit <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-slate-600">None</code> — the recursion dives to the leftmost leaf.</p>
              </div>
            </div>
            <div className="flex gap-4 py-4 border-b border-slate-100">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-semibold text-white shadow-sm">2</div>
              <div>
                <p className="text-[15px] font-medium text-slate-800 mb-0.5">Visit Current</p>
                <p className="text-[13px] text-slate-500">Only after the entire left subtree is done, append this node's value.</p>
              </div>
            </div>
            <div className="flex gap-4 py-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-semibold text-white shadow-sm">3</div>
              <div>
                <p className="text-[15px] font-medium text-slate-800 mb-0.5">Go Right</p>
                <p className="text-[13px] text-slate-500">The right subtree is a new problem — apply the same Left → Root → Right rule.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 05 - Dry Run */}
      <div className="mb-12">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">05</span>
          <h2 className="text-xl font-semibold text-slate-900">Dry Run</h2>
        </div>

        <div className="mb-6 flex justify-center rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <TreeDiagram highlightLeaves />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="grid grid-cols-[48px_100px_1fr] bg-slate-50/80">
            <div className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-r border-slate-200">Step</div>
            <div className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-r border-slate-200">Node</div>
            <div className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">What Happens</div>
          </div>
          {DRY_RUN_STEPS.map((step) => (
            <div
              key={step.num}
              className={`grid grid-cols-[48px_100px_1fr] border-t border-slate-100 transition-colors ${step.highlight ? "bg-emerald-50/60" : "bg-white"}`}
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

      {/* 06 - Code */}
      <div className="mb-12">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">06</span>
          <h2 className="text-xl font-semibold text-slate-900">Code</h2>
        </div>
        <div className="overflow-hidden rounded-2xl bg-[#1e1e2e] shadow-lg shadow-slate-900/20">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-2 text-[11px] text-slate-400 font-mono">solution.py</span>
          </div>
          <div className="p-5 font-mono text-[13.5px] leading-8">
            <div><span className="text-[#cba6f7]">def</span> <span className="text-[#89b4fa]">inorder</span><span className="text-[#cdd6f4]">(node, result):</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#cba6f7]">if</span><span className="text-[#cdd6f4]"> node </span><span className="text-[#cba6f7]">is</span><span className="text-[#cdd6f4]"> </span><span className="text-[#cba6f7]">None</span><span className="text-[#cdd6f4]">: </span><span className="text-[#cba6f7]">return</span> <span className="ml-2 text-[#6c7086] italic"># base case</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#89b4fa]">inorder</span><span className="text-[#cdd6f4]">(node.left, result)  </span><span className="text-[#6c7086] italic"># 1. go left</span></div>
            <div><span className="text-[#cdd6f4]">    result.</span><span className="text-[#89b4fa]">append</span><span className="text-[#cdd6f4]">(node.val)      </span><span className="text-[#6c7086] italic"># 2. visit</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#89b4fa]">inorder</span><span className="text-[#cdd6f4]">(node.right, result) </span><span className="text-[#6c7086] italic"># 3. go right</span></div>
          </div>
        </div>
      </div>

      {/* 07 - Complexity */}
      <div className="mb-12">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">07</span>
          <h2 className="text-xl font-semibold text-slate-900">Complexity</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 border border-emerald-200/60">
            <div className="absolute top-3 right-3 h-16 w-16 rounded-full bg-emerald-200/40 blur-xl" />
            <div className="relative">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-emerald-600 mb-1">Time</p>
              <p className="text-3xl font-mono font-semibold text-emerald-800 mb-2">O(n)</p>
              <p className="text-[13px] leading-relaxed text-emerald-700/80">Every node visited exactly once.</p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 p-6 border border-purple-200/60">
            <div className="absolute top-3 right-3 h-16 w-16 rounded-full bg-purple-200/40 blur-xl" />
            <div className="relative">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-purple-600 mb-1">Space</p>
              <p className="text-3xl font-mono font-semibold text-purple-800 mb-2">O(h)</p>
              <p className="text-[13px] leading-relaxed text-purple-700/80">Recursion stack = tree height. Balanced: log n. Skewed: n.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 08 - Interview */}
      <div className="mb-10">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">08</span>
          <h2 className="text-xl font-semibold text-slate-900">Interview Questions</h2>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          {INTERVIEW_ITEMS.map((item, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl p-4 transition-colors hover:bg-slate-50/50">
              <div className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <div>
                <p className="text-[14px] font-medium text-slate-800">{item.title}</p>
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
            The blue node is the <strong className="font-medium">root</strong>. The green nodes are <strong className="font-medium">leaves</strong> — they have no children. Every other node is an internal node.
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
            <div className="text-center rounded-lg bg-violet-50 p-3">
              <p className="text-xs font-medium text-violet-700 mb-1">Preorder</p>
              <p className="text-sm text-violet-800 font-mono">Root→L→R</p>
            </div>
            <div className="text-center rounded-lg bg-emerald-50 p-3 ring-2 ring-emerald-500">
              <p className="text-xs font-medium text-emerald-700 mb-1">Inorder ← you are here</p>
              <p className="text-sm text-emerald-800 font-mono">L→Root→R</p>
            </div>
            <div className="text-center rounded-lg bg-amber-50 p-3">
              <p className="text-xs font-medium text-amber-700 mb-1">Postorder</p>
              <p className="text-sm text-amber-800 font-mono">L→R→Root</p>
            </div>
          </div>
        </div>
        <p className="text-[15px] leading-relaxed text-slate-700">
          Inorder means: for any node, always finish the entire left subtree first, then visit that node, then finish the entire right subtree.
        </p>
      </div>

      {/* 03 - Analogy */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">03 · The real-world analogy</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Think of it like reading a bookshelf</h2>
        <div className="rounded-xl bg-amber-50 p-4 mb-4">
          <p className="text-[15px] leading-relaxed text-amber-900/80 mb-0">
            Imagine a bookshelf where books are arranged from left to right in sorted order. Inorder traversal is exactly like reading them in that order — you always finish everything to the left before reading the current book, and only then move to the right. The "current book" (root) sits between everything on its left and everything on its right.
          </p>
        </div>
        <div className="rounded-xl bg-emerald-50 border-l-[3px] border-emerald-500 p-4">
          <p className="text-sm text-emerald-800">
            <strong className="font-medium">The BST superpower:</strong> If the tree is a Binary Search Tree (BST), inorder traversal always gives you values in ascending sorted order. This is one of the most tested facts in tree interviews.
          </p>
        </div>
      </div>

      {/* 04 - Recursion */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">04 · Understanding recursion here</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">What is the function actually doing?</h2>
        <p className="text-[15px] leading-relaxed text-slate-700 mb-4">
          Recursion is when a function calls itself. The trick is that each call handles one node, and trusts that the same function will correctly handle the subtrees. Here is how to read the code line by line:
        </p>
        <div className="overflow-hidden rounded-2xl bg-[#1e1e2e] shadow-lg mb-5">
          <div className="p-5 font-mono text-[13.5px] leading-8">
            <div><span className="text-[#cba6f7]">def</span> <span className="text-[#89b4fa]">inorder</span><span className="text-[#cdd6f4]">(node, result):</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#cba6f7]">if</span><span className="text-[#cdd6f4]"> node </span><span className="text-[#cba6f7]">is</span><span className="text-[#cdd6f4]"> </span><span className="text-[#cba6f7]">None</span><span className="text-[#cdd6f4]">: </span><span className="text-[#cba6f7]">return</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#89b4fa]">inorder</span><span className="text-[#cdd6f4]">(node.left, result)</span></div>
            <div><span className="text-[#cdd6f4]">    result.</span><span className="text-[#89b4fa]">append</span><span className="text-[#cdd6f4]">(node.val)</span></div>
            <div><span className="text-[#cdd6f4]">    </span><span className="text-[#89b4fa]">inorder</span><span className="text-[#cdd6f4]">(node.right, result)</span></div>
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
          <p className="text-sm font-medium text-slate-700 mb-2">When we first reach node 4 (the leftmost leaf), the call stack looks like this:</p>
          <div className="overflow-hidden rounded-xl bg-[#1e1e2e] p-4 font-mono text-sm">
            <div className="rounded bg-[#313244] text-[#cdd6f4] px-3 py-1.5 mb-1 border-l-2 border-[#89b4fa]">→ inorder(node=4) &nbsp;<span className="text-[#6c7086]">← currently here</span></div>
            <div className="rounded bg-[#1e1e2e] text-[#6c7086] px-3 py-1.5 mb-1 border-l-2 border-[#45475a]">&nbsp;&nbsp; inorder(node=2)</div>
            <div className="rounded bg-[#1e1e2e] text-[#6c7086] px-3 py-1.5 border-l-2 border-[#45475a]">&nbsp;&nbsp; inorder(node=1) <span className="text-[#45475a]">← original call</span></div>
          </div>
        </div>
      </div>

      {/* 05 - Full trace */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">05 · Full trace — every step explained</p>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Walking through the example tree</h2>
        <p className="text-[15px] leading-relaxed text-slate-700 mb-6">
          Let's trace every single action the algorithm takes on this tree, narrated step by step.
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
              <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
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

export default function InorderGuidePage() {
  const [mode, setMode] = useState<"quick" | "deep">("quick");

  return (
    <section className="relative min-h-0 overflow-hidden bg-gradient-to-br from-slate-50 via-slate-50 to-emerald-50/20">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,#e0f2fe_0%,transparent_48%),radial-gradient(ellipse_at_bottom_left,#e2f6ef_0%,transparent_52%)]" />

      <div className="relative z-[1] mx-auto max-w-[860px] px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-emerald-500" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-600">Binary Tree · Traversal</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/problems/binary-tree/inorder-traversal"
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
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
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">Inorder Traversal</h1>
          <p className="text-base text-slate-500 mb-5 max-w-xl">
            Visit nodes in Left → Root → Right order. For a BST, this gives you a sorted sequence.
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Recursion
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-200 px-3 py-1.5 text-xs font-medium text-purple-700">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
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
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-emerald-50/30 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[15px] font-medium text-slate-800">Ready to see it in action?</p>
              <p className="text-[13px] text-slate-500 mt-0.5">Step through the visualizer to watch the algorithm state update live.</p>
            </div>
            <Link
              href="/problems/binary-tree/inorder-traversal"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/25"
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
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
  { id: 1, x: 180, y: 50 },
  { id: 2, x: 100, y: 110 },
  { id: 3, x: 260, y: 110 },
  { id: 4, x: 50, y: 170 },
  { id: 5, x: 150, y: 170 },
  { id: 6, x: 210, y: 170 },
  { id: 7, x: 310, y: 170 },
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

function TreeDiagram({ highlightPre = false, highlightIn = false, highlightPost = false }: { 
  highlightPre?: boolean; 
  highlightIn?: boolean; 
  highlightPost?: boolean; 
}) {
  return (
    <svg viewBox="0 0 360 220" width="340" height="200" xmlns="http://www.w3.org/2000/svg" className="max-w-[360px]">
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
        const isPre = highlightPre && [1, 2, 4, 5, 3, 6, 7].includes(node.id);
        const isIn = highlightIn && [4, 2, 5, 1, 6, 3, 7].includes(node.id);
        const isPost = highlightPost && [4, 5, 2, 6, 7, 3, 1].includes(node.id);
        
        // Priority: Post > In > Pre for coloring
        let fill = "#E6F1FB";
        let stroke = "#378ADD";
        let textColor = "#0C447C";
        
        if (isPost) {
          fill = "#FAECE7";
          stroke = "#993C1D";
          textColor = "#712B13";
        } else if (isIn) {
          fill = "#E1F5EE";
          stroke = "#1D9E75";
          textColor = "#085041";
        } else if (isPre) {
          fill = "#E6F1FB";
          stroke = "#378ADD";
          textColor = "#0C447C";
        }
        
        return (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r="22" fill={fill} stroke={stroke} strokeWidth="1.5" />
            <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="13" fontWeight="500" fill={textColor}>
              {node.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ═══════════════ Quick Mode Data ═══════════════ */

const QUICK_STEPS = [
  { num: 1, step: "Push (root, state=1) onto the stack", sub: "Each stack frame is a (node, count) pair." },
  { num: 2, step: 'Pop top frame. Check the state counter.', sub: "Increment counter and push the frame back before doing any child push." },
  { num: 3, step: 'State 1 → add to pre[], push left child (state=1)', sub: "" },
  { num: 4, step: 'State 2 → add to in[], push right child (state=1)', sub: "" },
  { num: 5, step: 'State 3 → add to post[], do not push back', sub: "Node is fully processed. Naturally falls off the stack." },
];

const INTERVIEW_ITEMS = [
  { title: "Optimize multiple traversal calls", desc: "when a problem requires more than one traversal result, this avoids repeated tree walks." },
  { title: "Iterative DFS mastery", desc: "demonstrates deep understanding of the call stack and how recursion works under the hood." },
  { title: "Tree reconstruction", desc: "preorder + inorder together uniquely identify a binary tree. Getting both in one pass is efficient." },
  { title: "Space-constrained environments", desc: "avoids 3× recursion overhead when working with very deep or large trees." },
];

/* ═══════════════ Deep Mode Data ═══════════════ */

const TRACE_STEPS = [
  { badge: "push", title: "Stack init: [(1,1)]", desc: "Start with root node 1 at state 1." },
  { badge: "pre", title: "Pop (1,1) → pre=[1]. Push (1,2), push (2,1)", desc: "State 1: record 1 for preorder. Push 1 back at state 2, then push left child 2 at state 1. Stack: [(1,2),(2,1)]" },
  { badge: "pre", title: "Pop (2,1) → pre=[1,2]. Push (2,2), push (4,1)", desc: "State 1: record 2 for preorder. Push 2 back at state 2, push left child 4. Stack: [(1,2),(2,2),(4,1)]" },
  { badge: "pre", title: "Pop (4,1) → pre=[1,2,4]. Push (4,2). No left child.", desc: "State 1: record 4. Push 4 back at state 2. Node 4 has no left, so nothing else pushed. Stack: [(1,2),(2,2),(4,2)]" },
  { badge: "in", title: "Pop (4,2) → ino=[4]. Push (4,3). No right child.", desc: "State 2: record 4 for inorder. Push 4 at state 3. No right child. Stack: [(1,2),(2,2),(4,3)]" },
  { badge: "post", title: "Pop (4,3) → post=[4]. Done with node 4.", desc: "State 3: record 4 for postorder. Do not push back. Node 4 fully processed. Stack: [(1,2),(2,2)]" },
  { badge: "in", title: "Pop (2,2) → ino=[4,2]. Push (2,3), push (5,1)", desc: "State 2: record 2 for inorder. Push 2 at state 3, push right child 5 at state 1. Stack: [(1,2),(2,3),(5,1)]" },
  { badge: "pre", title: "Pop (5,1) → pre=[1,2,4,5]. Push (5,2). No left child.", desc: "State 1: record 5 for preorder. No left child. Stack: [(1,2),(2,3),(5,2)]" },
  { badge: "in", title: "Pop (5,2) → ino=[4,2,5]. Push (5,3). No right child.", desc: "State 2: record 5 for inorder. No right child. Stack: [(1,2),(2,3),(5,3)]" },
  { badge: "post", title: "Pop (5,3) → post=[4,5]. Done with node 5.", desc: "State 3: record 5 for postorder. Stack: [(1,2),(2,3)]" },
  { badge: "post", title: "Pop (2,3) → post=[4,5,2]. Done with node 2.", desc: "State 3: record 2 for postorder. Left subtree of root fully done. Stack: [(1,2)]" },
  { badge: "in", title: "Pop (1,2) → ino=[4,2,5,1]. Push (1,3), push (3,1)", desc: "State 2: record root 1 for inorder. Push 1 at state 3, push right child 3 at state 1. Stack: [(1,3),(3,1)]" },
  { badge: "pre", title: "Pop (3,1) → pre=[1,2,4,5,3]. Push (3,2), push (6,1)", desc: "State 1: record 3 for preorder. Push right subtree next. Stack: [(1,3),(3,2),(6,1)]" },
];

const BEGINNER_MISTAKES = [
  { x: "Forgetting to push the node back with incremented state", desc: "This causes the algorithm to skip states 2 and 3. The node will never be revisited." },
  { x: "Pushing children before pushing the node back", desc: "LIFO order matters. Push node back first, then the child on top. Otherwise, the node won't be waiting when the child finishes." },
  { x: "Pushing the node back at state 3", desc: "At state 3, the node is fully done. Pushing it back creates an infinite loop or crashes." },
  { x: "Not checking if children exist", desc: "If node.left or node.right is None, pushing it creates a NullPointerException." },
];

export default function PageGuidePage() {
  const [mode, setMode] = useState<"quick" | "deep">("quick");
  const [highlightPre, setHighlightPre] = useState(false);
  const [highlightIn, setHighlightIn] = useState(false);
  const [highlightPost, setHighlightPost] = useState(false);

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 font-sans">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Binary Tree · DFS</p>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Pre, In & Post Order in One Traversal</h1>
        <p className="text-base text-gray-600 mb-4">
          Compute all three DFS traversals simultaneously in a single pass using an explicit stack and a visit-count per node.
        </p>
        
        {/* Badges */}
        <div className="flex gap-2 flex-wrap mb-6">
          <span className="inline-block text-xs font-medium px-3 py-1 rounded-full" style={{background: "#EEEDFE", color: "#3C3489"}}>Stack</span>
          <span className="inline-block text-xs font-medium px-3 py-1 rounded-full" style={{background: "#E1F5EE", color: "#0F6E56"}}>DFS</span>
          <span className="inline-block text-xs font-medium px-3 py-1 rounded-full" style={{background: "#FAEEDA", color: "#854F0B"}}>Optimization</span>
          <span className="inline-block text-xs font-medium px-3 py-1 rounded-full" style={{background: "#FAECE7", color: "#993C1D"}}>Interview Hard</span>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit border border-gray-200 mb-4">
          <button
            onClick={() => setMode("quick")}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
              mode === "quick" 
                ? "bg-white text-gray-900 border border-gray-200" 
                : "bg-transparent text-gray-600"
            }`}
          >
            Quick Recap
          </button>
          <button
            onClick={() => setMode("deep")}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
              mode === "deep" 
                ? "bg-white text-gray-900 border border-gray-200" 
                : "bg-transparent text-gray-600"
            }`}
          >
            Deep Explain
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mb-8">
          {mode === "quick" ? "Key concepts at a glance — for those who already know the basics." : "A full beginner-friendly walkthrough — understand it from scratch."}
        </p>
      </div>

      <hr className="border-t border-gray-200 mb-8" />

      {/* Quick Mode */}
      {mode === "quick" && (
        <div className="space-y-12">
          {/* 01 Core Idea */}
          <div className="mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">01 · The core idea</p>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 p-6 text-white shadow-lg shadow-violet-500/20">
              <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-white/10" />
              <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-6 translate-y-6 rounded-full bg-white/10" />
              <div className="relative">
                <p className="text-[18px] leading-relaxed font-semibold tracking-wide mb-2">
                  Every node is visited exactly 3 times. The state counter decides what to do on each visit.
                </p>
                <p className="text-violet-100 text-[14px]">
                  Normally, these need 3 separate DFS passes. This algorithm does all three in one pass.
                </p>
              </div>
            </div>
          </div>

          {/* 02 Three Traversals Compared */}
          <div className="mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">02 · The three traversals compared</p>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-3">1</div>
                <p className="text-sm font-semibold text-slate-900 mb-1">Preorder</p>
                <p className="font-mono text-[13px] font-medium text-blue-700">[1, 2, 4, 5, 3, 6, 7]</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 mb-3">2</div>
                <p className="text-sm font-semibold text-slate-900 mb-1">Inorder</p>
                <p className="font-mono text-[13px] font-medium text-emerald-700">[4, 2, 5, 1, 6, 3, 7]</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600 mb-3">3</div>
                <p className="text-sm font-semibold text-slate-900 mb-1">Postorder</p>
                <p className="font-mono text-[13px] font-medium text-orange-700">[4, 5, 2, 6, 7, 3, 1]</p>
              </div>
            </div>
          </div>

          {/* 03 Algorithm Steps */}
          <section>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-3">03 · Algorithm steps</p>
            <div className="space-y-4 bg-white border border-gray-200 p-6 rounded-lg">
              {QUICK_STEPS.map((step) => (
                <div key={step.num} className="flex gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-semibold text-sm" style={{background: "#EEEDFE", color: "#3C3489"}}>
                    {step.num}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 font-medium">{step.step}</p>
                    {step.sub && <p className="text-xs text-gray-600 mt-1">{step.sub}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 04 Code */}
          <section>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-3">04 · Code</p>
            <div className="bg-gray-950 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <div>def <span style={{color: "#89b4fa"}}>allTraversals</span>(root):</div>
              <div>    pre, ino, post = [], [], []</div>
              <div>    stack = [(root, <span style={{color: "#fab387"}}>1</span>)]  <span style={{color: "#6c7086"}}>// (node, state)</span></div>
              <div>    <span style={{color: "#cba6f7"}}>while</span> stack:</div>
              <div>        node, state = stack.pop()</div>
              <div>        <span style={{color: "#cba6f7"}}>if</span> state == <span style={{color: "#fab387"}}>1</span>:              <span style={{color: "#6c7086"}}>// first visit → preorder</span></div>
              <div>            pre.append(node.val)</div>
              <div>            stack.append((node, <span style={{color: "#fab387"}}>2</span>))   <span style={{color: "#6c7086"}}>// come back at state 2</span></div>
              <div>            <span style={{color: "#cba6f7"}}>if</span> node.left: stack.append((node.left, <span style={{color: "#fab387"}}>1</span>))</div>
              <div>        <span style={{color: "#cba6f7"}}>elif</span> state == <span style={{color: "#fab387"}}>2</span>:             <span style={{color: "#6c7086"}}>// second visit → inorder</span></div>
              <div>            ino.append(node.val)</div>
              <div>            stack.append((node, <span style={{color: "#fab387"}}>3</span>))   <span style={{color: "#6c7086"}}>// come back at state 3</span></div>
              <div>            <span style={{color: "#cba6f7"}}>if</span> node.right: stack.append((node.right, <span style={{color: "#fab387"}}>1</span>))</div>
              <div>        <span style={{color: "#cba6f7"}}>else</span>:                       <span style={{color: "#6c7086"}}>// third visit → postorder</span></div>
              <div>            post.append(node.val)</div>
              <div>    <span style={{color: "#cba6f7"}}>return</span> pre, ino, post</div>
            </div>
          </section>

          {/* 05 Complexity */}
          <section>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-3">05 · Complexity</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded" style={{background: "#EEEDFE"}}>
                <p className="text-xs font-medium mb-1" style={{color: "#534AB7"}}>Time</p>
                <p className="text-2xl font-semibold" style={{color: "#3C3489"}}>O(n)</p>
                <p className="text-xs mt-2" style={{color: "#534AB7"}}>Each node is pushed/popped exactly 3 times. Total operations = 3n.</p>
              </div>
              <div className="p-4 rounded" style={{background: "#FAECE7"}}>
                <p className="text-xs font-medium mb-1" style={{color: "#993C1D"}}>Space</p>
                <p className="text-2xl font-semibold" style={{color: "#712B13"}}>O(n)</p>
                <p className="text-xs mt-2" style={{color: "#993C1D"}}>Stack holds at most O(h) frames at once. Output arrays together hold 3n values.</p>
              </div>
            </div>
          </section>

          {/* 06 Interview Uses */}
          <section>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-3">06 · Interview uses</p>
            <div className="space-y-3 bg-white border border-gray-200 p-4 rounded-lg">
              {INTERVIEW_ITEMS.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full mt-2" style={{background: "#7F77DD"}}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    <p className="text-[14px] leading-relaxed text-slate-700">— {item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Deep Mode */}
      {mode === "deep" && (
        <div className="space-y-12">
          {/* 01 Why do we need this */}
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">01 · Why do we need this at all?</p>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">The problem with three separate traversals</h2>
            <p className="text-sm text-gray-700 mb-4 leading-relaxed">
              You already know how to do inorder, preorder, and postorder traversal individually — each is a clean recursive function. But what if you need all three results from the same tree? The naive approach is to call three separate functions, each walking every node once. That works, but it means three full passes over the tree.
            </p>
            <div className="p-4 rounded-lg" style={{background: "#EEEDFE", borderLeft: "3px solid #7F77DD"}}>
              <p className="text-sm text-gray-900" style={{color: "#26215C"}}>
                This algorithm does all three traversals in a single pass — O(n) time, touching each node exactly 3 times instead of n×3 = 3n separate function calls spread across three traversals.
              </p>
            </div>
            <p className="text-sm text-gray-700 mt-4 leading-relaxed">
              The key insight: when recursion traverses a tree, every node is actually encountered three times — once going in (before left), once between left and right, and once coming back up (after right). Those three moments are exactly when preorder, inorder, and postorder record their values.
            </p>
          </section>

          {/* 02 Three moments */}
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">02 · The three moments of a node</p>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">When does each traversal "see" a node?</h2>
            <p className="text-sm text-gray-700 mb-4 leading-relaxed">
              Think about what happens when the recursive call stack visits any node during a normal DFS. It passes through that node three distinct times:
            </p>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-3 bg-gray-100">
                <div className="p-3 text-xs font-semibold text-gray-700 border-r border-gray-200">Moment</div>
                <div className="p-3 text-xs font-semibold text-gray-700 border-r border-gray-200">What's Happening</div>
                <div className="p-3 text-xs font-semibold text-gray-700">Traversal Records</div>
              </div>
              <div className="border-t border-gray-200 grid grid-cols-3">
                <div className="p-3 text-sm border-r border-gray-200">1st visit</div>
                <div className="p-3 text-sm border-r border-gray-200">Node enters. About to go left.</div>
                <div className="p-3 text-sm">Preorder</div>
              </div>
              <div className="border-t border-gray-200 grid grid-cols-3 bg-gray-50">
                <div className="p-3 text-sm border-r border-gray-200">2nd visit</div>
                <div className="p-3 text-sm border-r border-gray-200">Returned from left. About to go right.</div>
                <div className="p-3 text-sm">Inorder</div>
              </div>
              <div className="border-t border-gray-200 grid grid-cols-3">
                <div className="p-3 text-sm border-r border-gray-200">3rd visit</div>
                <div className="p-3 text-sm border-r border-gray-200">Returned from right. Node fully done.</div>
                <div className="p-3 text-sm">Postorder</div>
              </div>
            </div>
            <div className="p-4 rounded-lg mt-4" style={{background: "#E6F1FB", borderLeft: "3px solid #378ADD"}}>
              <p className="text-sm text-gray-900" style={{color: "#0C447C"}}>
                This is the fundamental insight. All three traversals are just different checkpoints at the same node during a single DFS walk. The algorithm makes this explicit with a state counter.
              </p>
            </div>
          </section>

          {/* 03 State Counter */}
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">03 · The state counter — the key mechanism</p>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">How the stack tracks which visit this is</h2>
            <p className="text-sm text-gray-700 mb-4 leading-relaxed">
              Since we're implementing this iteratively (without recursion), we need to manually track which visit this is for this node. We do this by storing a state counter alongside each node on the stack.
            </p>
            <p className="text-sm text-gray-700 mb-4 leading-relaxed">
              Each stack entry is a pair: <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">(node, state)</code> where state starts at 1 and increments each time we revisit the node.
            </p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="p-4 rounded" style={{background: "#E6F1FB"}}>
                <p className="text-xs font-medium text-blue-700 mb-2">State 1</p>
                <p className="font-mono text-xs font-semibold text-blue-900">(node, 1)</p>
                <p className="text-xs text-blue-700 mt-2">→ Append node to pre[]</p>
              </div>
              <div className="p-4 rounded" style={{background: "#E1F5EE"}}>
                <p className="text-xs font-medium text-teal-700 mb-2">State 2</p>
                <p className="font-mono text-xs font-semibold text-teal-900">(node, 2)</p>
                <p className="text-xs text-teal-700 mt-2">→ Append node to in[]</p>
              </div>
              <div className="p-4 rounded" style={{background: "#FAECE7"}}>
                <p className="text-xs font-medium text-orange-700 mb-2">State 3</p>
                <p className="font-mono text-xs font-semibold text-orange-900">(node, 3)</p>
                <p className="text-xs text-orange-700 mt-2">→ Append node to post[]</p>
              </div>
            </div>
            <div className="space-y-3 bg-white border border-gray-200 p-4 rounded-lg">
              <div>
                <p className="font-semibold text-sm text-gray-900">Why do we push the node back with an incremented state before pushing the child?</p>
                <p className="text-sm text-gray-700 mt-2">Because we want to return to this node after the child is fully processed. The stack is LIFO — last in, first out. So we push the node back first (it will be processed later), then push the child on top (it will be processed next). When the child finishes, the parent node is waiting on the stack at the next state.</p>
              </div>
              <hr className="border-gray-200" />
              <div>
                <p className="font-semibold text-sm text-gray-900">What if a node has no left or no right child?</p>
                <p className="text-sm text-gray-700 mt-2">We simply skip the push. If <code className="bg-gray-100 px-1 rounded text-xs">node.left</code> is None at state 1, we don't push anything for the left child — we just push the node back at state 2. The algorithm handles missing children naturally with the <code className="bg-gray-100 px-1 rounded text-xs">if node.left:</code> guard.</p>
              </div>
            </div>
          </section>

          {/* 04 Full Trace */}
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">04 · Full trace — every stack operation</p>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Step-by-step on the example tree</h2>
            <p className="text-sm text-gray-600 mb-4">Tree: 1 → left: 2 (children: 4, 5), right: 3 (children: 6, 7). We trace every single push, pop, and record.</p>
            
            <div className="space-y-4">
              {TRACE_STEPS.map((step, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <span
                    className={`shrink-0 text-[11px] font-semibold px-3 py-1 rounded-full text-center ${step.badge === 'push' ? 'bg-violet-100 text-violet-700' : step.badge === 'pre' ? 'bg-blue-100 text-blue-700' : step.badge === 'in' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}
                  >
                    {step.badge === "push" ? "Push" : step.badge === "pre" ? "Pre ✓" : step.badge === "in" ? "In ✓" : "Post ✓"}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800 mb-0.5">{step.title}</p>
                    <p className="text-[13px] text-slate-500 leading-relaxed mt-0">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 05 Beginner Mistakes */}
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">05 · Common beginner mistakes</p>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">What trips people up</h2>
            <div className="space-y-3 bg-white border border-gray-200 p-4 rounded-lg">
              {BEGINNER_MISTAKES.map((mistake, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold" style={{background: "#FCEBEB", color: "#A32D2D"}}>
                    ✕
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{mistake.x}</p>
                    <p className="text-sm text-gray-600 mt-1">{mistake.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 06 Complexity */}
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">06 · Complexity — the full explanation</p>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Why O(n) time and O(n) space?</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-4 rounded" style={{background: "#EEEDFE"}}>
                <p className="text-xs font-medium mb-1" style={{color: "#534AB7"}}>Time: O(n)</p>
                <p className="text-xs" style={{color: "#534AB7"}}>Every node is pushed and popped exactly 3 times. Each operation is O(1). Total = 3n operations.</p>
              </div>
              <div className="p-4 rounded" style={{background: "#FAECE7"}}>
                <p className="text-xs font-medium mb-1" style={{color: "#993C1D"}}>Space: O(n)</p>
                <p className="text-xs" style={{color: "#993C1D"}}>Stack depth is at most O(h) (tree height). Output arrays store 3n values total.</p>
              </div>
            </div>
            <div className="p-4 rounded-lg" style={{background: "#FAEEDA", borderLeft: "3px solid #EF9F27"}}>
              <p className="text-sm text-gray-900" style={{color: "#633806"}}>
                <strong>Interview tip:</strong> Compared to three separate recursive traversals (each O(n) time, O(h) space), this algorithm uses the same asymptotic complexity but better constant factors — one tree walk, one stack, no repeated traversal overhead. Mention this trade-off explicitly.
              </p>
            </div>
          </section>

          {/* 07 Interview Context */}
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">07 · Interview context</p>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Where you'll actually use this</h2>
            <div className="space-y-3 bg-white border border-gray-200 p-4 rounded-lg">
              {INTERVIEW_ITEMS.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full mt-2" style={{background: "#7F77DD"}}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    <p className="text-[14px] leading-relaxed text-slate-700">— {item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* CTA */}
      <hr className="border-t border-gray-200 mb-8 mt-12" />
      <div className="flex items-center justify-between gap-4 p-4 bg-gray-100 rounded-lg flex-wrap">
        <div>
          <p className="font-semibold text-sm text-gray-900">Ready to see it in action?</p>
          <p className="text-xs text-gray-600">Step through the visualizer to watch all three arrays build simultaneously at each stack operation.</p>
        </div>
        <Link href="/problems/binary-tree/preorder-inorder-postorder-in-a-single-traversal">
          <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Open visualizer →
          </button>
        </Link>
      </div>
    </div>
  );
}

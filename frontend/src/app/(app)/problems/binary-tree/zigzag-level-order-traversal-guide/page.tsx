'use client';

/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import { useState } from "react";

export default function ZigzagLevelOrderTraversalGuide() {
  const [mode, setMode] = useState<"quick" | "deep">("quick");

  return (
    <section className="relative min-h-0 overflow-hidden bg-gradient-to-br from-slate-50 via-slate-50 to-emerald-50/20">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,#e0f2fe_0%,transparent_48%),radial-gradient(ellipse_at_bottom_left,#e2f6ef_0%,transparent_52%)]" />

      <div className="relative z-[1] mx-auto max-w-[860px] px-6 py-6">
        {/* ═══════════════ HERO ═══════════════ */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-emerald-500" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-600">Binary Tree · BFS</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/problems/binary-tree/zigzag-level-order-traversal"
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
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">
            Binary Tree Zigzag Level Order Traversal
          </h1>
          <p className="text-base text-slate-500 mb-5 max-w-xl">
            Level-order traversal where each level alternates direction &mdash; left&rarr;right, then right&rarr;left, then left&rarr;right&hellip;
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              BFS + Deque
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-200 px-3 py-1.5 text-xs font-medium text-purple-700">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
              Level-by-Level
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Direction Flag
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              Medium
            </span>
          </div>

          {/* Mode Toggle */}
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

        {/* QUICK MODE */}
        {mode === "quick" && <div>
          <div className="mb-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">Problem Statement</h3>
                  <p className="text-sm text-slate-500">Binary Tree Zigzag Level Order Traversal</p>
                </div>
              </div>
              <div className="text-[15px] leading-relaxed text-slate-700 mb-5">
                Given the <span className="font-medium text-slate-900">root</span> of a binary tree, return the zigzag level order traversal where level order is preserved but the output direction alternates at every depth.
              </div>

              <div className="space-y-3">
                <div className="rounded-lg border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Example</div>
                  <div className="px-4 py-3">
                    <p className="text-[13px] font-mono text-slate-600 mb-2">Input: root = [3, 9, 20, null, null, 15, 7]</p>
                    <p className="text-[13px] font-mono text-emerald-700">Output: [[3], [20, 9], [15, 7]]</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-lg bg-slate-50 p-4 border border-slate-200">
                <p className="text-xs font-semibold text-slate-600 mb-2">Constraints</p>
                <ul className="text-[13px] text-slate-600 space-y-1">
                  <li className="flex items-start gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />The number of nodes in the tree is in range <span className="font-mono text-slate-800">[0, 2000]</span>.</li>
                  <li className="flex items-start gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />Node values are in range <span className="font-mono text-slate-800">[-100, 100]</span>.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 01 · The rule */}
          <div className="mb-10">
            <p className="text-xs font-medium tracking-widest uppercase text-slate-500 mb-3">
              01 · The rule
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-3 rounded">
              <p className="text-xl font-medium text-blue-900">
                BFS level-by-level, but flip the collection direction each level
              </p>
            </div>
            <p className="text-sm text-slate-600">
              Use a standard BFS queue. After collecting each level&apos;s nodes, check a boolean flag: if <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">left_to_right</code> is True, keep the level as-is; otherwise reverse it before appending to results. Toggle the flag after every level.
            </p>
          </div>

          {/* 02 · How to think */}
          <div className="mb-10">
            <p className="text-xs font-medium tracking-widest uppercase text-slate-500 mb-3">
              02 · How to think
            </p>
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              {/* Step 1 */}
              <div className="flex gap-4 mb-4">
                <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0 font-medium text-sm">
                  1
                </div>
                <div>
                  <div className="text-base text-slate-900 font-medium">
                    BFS level by level — collect all nodes at each depth
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    Use <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">len(queue)</code> at the start of each iteration to know exactly how many nodes belong to the current level.
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 mb-4">
                <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0 font-medium text-sm">
                  2
                </div>
                <div>
                  <div className="text-base text-slate-900 font-medium">
                    Reverse the level list when going right→left
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    Level 0 (root): left&rarr;right. Level 1: right&rarr;left. Level 2: left&rarr;right. Toggle <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">left_to_right</code> after every level.
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0 font-medium text-sm">
                  3
                </div>
                <div>
                  <div className="text-base text-slate-900 font-medium">
                    Append (possibly reversed) level to result
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    Children are always enqueued left-then-right &mdash; only the output list is reversed. The queue order never changes.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 03 · Code */}
          <div className="mb-10">
            <p className="text-xs font-medium tracking-widest uppercase text-slate-500 mb-3">
              03 · Code (Python)
            </p>
            <pre className="bg-slate-900 text-slate-200 p-5 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed">
              <code>{`from collections import deque

def zigzagLevelOrder(root):
    if not root: return []
    result        = []
    queue         = deque([root])          # standard BFS queue
    left_to_right = True                   # direction flag

    while queue:
        level_size = len(queue)           # freeze current level count
        level      = []

        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            if node.left:  queue.append(node.left)
            if node.right: queue.append(node.right)

        if not left_to_right:   # flip if right-to-left level
            level.reverse()
        result.append(level)
        left_to_right = not left_to_right  # toggle for next level

    return result`}</code>
            </pre>
          </div>

          {/* 04 · Example with Diagram */}
          <div className="mb-10">
            <p className="text-xs font-medium tracking-widest uppercase text-slate-500 mb-3">
              04 · Example tree & zigzag output
            </p>

            {/* SVG Diagram */}
            <div className="flex justify-center mb-5">
              <svg viewBox="0 0 480 300" width="460" height="290" className="w-full max-w-md">
                {/* Level labels */}
                <text x="14" y="70" fontSize="10" fill="#8888a8" fontWeight="500">
                  L0
                </text>
                <text x="14" y="152" fontSize="10" fill="#8888a8" fontWeight="500">
                  L1
                </text>
                <text x="14" y="234" fontSize="10" fill="#8888a8" fontWeight="500">
                  L2
                </text>

                {/* Direction text */}
                <text x="38" y="70" fontSize="11" fill="#185FA5">
                  L→R
                </text>
                <text x="38" y="152" fontSize="11" fill="#854F0B">
                  R→L
                </text>
                <text x="38" y="234" fontSize="11" fill="#185FA5">
                  L→R
                </text>

                {/* Edges */}
                <line x1="240" y1="80" x2="170" y2="162" stroke="#B5D4F4" strokeWidth="2" />
                <line x1="240" y1="80" x2="330" y2="162" stroke="#B5D4F4" strokeWidth="2" />
                <line x1="330" y1="162" x2="285" y2="244" stroke="#B5D4F4" strokeWidth="2" />
                <line x1="330" y1="162" x2="375" y2="244" stroke="#B5D4F4" strokeWidth="2" />

                {/* Nodes */}
                <circle cx="240" cy="62" r="22" fill="#E6F1FB" stroke="#378ADD" strokeWidth="1.8" />
                <text x="240" y="67" textAnchor="middle" fontSize="15" fontWeight="600" fill="#0C447C">
                  3
                </text>

                <circle cx="170" cy="144" r="22" fill="#FAEEDA" stroke="#EF9F27" strokeWidth="1.8" />
                <text x="170" y="149" textAnchor="middle" fontSize="15" fontWeight="600" fill="#633806">
                  9
                </text>

                <circle cx="330" cy="144" r="22" fill="#FAEEDA" stroke="#EF9F27" strokeWidth="1.8" />
                <text x="330" y="149" textAnchor="middle" fontSize="15" fontWeight="600" fill="#633806">
                  20
                </text>

                <circle cx="285" cy="226" r="22" fill="#E1F5EE" stroke="#1D9E75" strokeWidth="1.8" />
                <text x="285" y="231" textAnchor="middle" fontSize="14" fontWeight="600" fill="#085041">
                  15
                </text>

                <circle cx="375" cy="226" r="22" fill="#E1F5EE" stroke="#1D9E75" strokeWidth="1.8" />
                <text x="375" y="231" textAnchor="middle" fontSize="15" fontWeight="600" fill="#085041">
                  7
                </text>

                {/* Arrows */}
                <defs>
                  <marker id="arr-amber" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                    <polygon points="0 0, 7 3.5, 0 7" fill="#EF9F27" />
                  </marker>
                  <marker id="arr-green" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                    <polygon points="0 0, 7 3.5, 0 7" fill="#1D9E75" />
                  </marker>
                </defs>

                <path d="M 315,136 Q 250,120 188,136" fill="none" stroke="#EF9F27" strokeWidth="1.6" strokeDasharray="5,3" markerEnd="url(#arr-amber)" />
                <text x="252" y="118" fontSize="10" fill="#EF9F27" textAnchor="middle">
                  right → left
                </text>

                <path d="M 308,222 Q 340,205 357,222" fill="none" stroke="#1D9E75" strokeWidth="1.6" strokeDasharray="5,3" markerEnd="url(#arr-green)" />
                <text x="333" y="205" fontSize="10" fill="#1D9E75" textAnchor="middle">
                  left → right
                </text>

                <rect x="100" y="272" width="280" height="22" rx="6" fill="#1e1e2e" />
                <text x="240" y="287" textAnchor="middle" fontSize="12" fill="#cdd6f4" fontFamily="monospace">
                  Output: [[3], [20, 9], [15, 7]]
                </text>
              </svg>
            </div>

            {/* Dry run table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="grid grid-cols-4 gap-0">
                <div className="bg-slate-50 px-4 py-3 text-xs font-medium text-slate-600 border-b border-r border-slate-200">
                  Level
                </div>
                <div className="bg-slate-50 px-4 py-3 text-xs font-medium text-slate-600 border-b border-r border-slate-200">
                  Direction
                </div>
                <div className="bg-slate-50 px-4 py-3 text-xs font-medium text-slate-600 border-b border-r border-slate-200">
                  Nodes collected
                </div>
                <div className="bg-slate-50 px-4 py-3 text-xs font-medium text-slate-600 border-b border-slate-200">
                  After flip?
                </div>

                {/* Row 1 */}
                <div className="px-4 py-3 text-sm text-slate-900 border-b border-r border-slate-200">
                  0
                </div>
                <div className="px-4 py-3 text-sm border-b border-r border-slate-200" style={{ color: '#185FA5' }}>
                  L → R
                </div>
                <div className="px-4 py-3 text-sm font-mono text-slate-900 border-b border-r border-slate-200">
                  [3]
                </div>
                <div className="px-4 py-3 text-sm text-slate-900 border-b border-slate-200">
                  No flip → <strong>[3]</strong>
                </div>

                {/* Row 2 */}
                <div className="px-4 py-3 text-sm text-slate-900 bg-slate-50 border-b border-r border-slate-200">
                  1
                </div>
                <div className="px-4 py-3 text-sm bg-slate-50 border-b border-r border-slate-200" style={{ color: '#854F0B' }}>
                  R → L
                </div>
                <div className="px-4 py-3 text-sm font-mono text-slate-900 bg-slate-50 border-b border-r border-slate-200">
                  [9, 20]
                </div>
                <div className="px-4 py-3 text-sm text-slate-900 bg-slate-50 border-b border-slate-200">
                  Reversed → <strong>[20, 9]</strong>
                </div>

                {/* Row 3 */}
                <div className="px-4 py-3 text-sm text-slate-900 border-r border-slate-200">
                  2
                </div>
                <div className="px-4 py-3 text-sm border-r border-slate-200" style={{ color: '#185FA5' }}>
                  L → R
                </div>
                <div className="px-4 py-3 text-sm font-mono text-slate-900 border-r border-slate-200">
                  [15, 7]
                </div>
                <div className="px-4 py-3 text-sm text-slate-900">
                  No flip → <strong>[15, 7]</strong>
                </div>
              </div>
            </div>
          </div>

          {/* 05 · Complexity */}
          <div className="mb-0">
            <p className="text-xs font-medium tracking-widest uppercase text-slate-500 mb-3">
              05 · Complexity
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-5">
                <div className="text-xs font-medium tracking-widest uppercase text-blue-600 mb-2">
                  Time
                </div>
                <div className="text-3xl font-medium text-blue-900 font-mono mb-2">
                  O(n)
                </div>
                <div className="text-sm text-blue-700">
                  Every node is enqueued and dequeued exactly once. Reversing a level costs O(w) where w is the level width — summing across all levels gives O(n) total.
                </div>
              </div>
              <div className="bg-violet-50 rounded-lg p-5">
                <div className="text-xs font-medium tracking-widest uppercase text-violet-600 mb-2">
                  Space
                </div>
                <div className="text-3xl font-medium text-violet-900 font-mono mb-2">
                  O(n)
                </div>
                <div className="text-sm text-violet-700">
                  Queue holds at most O(w) nodes (widest level). Result list stores all n values. Both bounded by O(n).
                </div>
              </div>
            </div>
          </div>
        </div>}

        {/* DEEP MODE */}
        {mode === "deep" && <div>
          {/* 01 · What is zigzag? */}
          <div className="mb-12">
            <p className="text-xs font-medium tracking-widest uppercase text-slate-500 mb-2">
              01 · What is zigzag traversal?
            </p>
            <h2 className="text-xl font-medium text-slate-900 mb-4">
              The concept from scratch
            </h2>
            <p className="text-base text-slate-900 leading-relaxed mb-4">
              Normal level-order traversal reads each level of a binary tree from left to right, top to bottom. Zigzag (or spiral) traversal does almost the same thing — but it <em>flips the reading direction every other level</em>. Level 0 goes left→right, level 1 goes right→left, level 2 goes left→right again, and so on.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <p className="text-sm text-blue-900">
                The crucial insight: <strong>the queue order never changes</strong>. Children are always enqueued left-then-right regardless of the current zigzag direction. Only the <em>output list</em> for right-to-left levels gets reversed after collection. The traversal itself is pure BFS.
              </p>
            </div>
          </div>

          {/* 02 · Why BFS? */}
          <div className="mb-12">
            <p className="text-xs font-medium tracking-widest uppercase text-slate-500 mb-2">
              02 · Why BFS is the natural fit
            </p>
            <h2 className="text-xl font-medium text-slate-900 mb-4">
              BFS gives you levels for free
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-4 text-center">
                <p className="text-xs font-medium text-blue-600 mb-2">BFS &larr; natural fit</p>
                <p className="text-sm text-blue-900">
                  Processes nodes level-by-level naturally. Snapshot <code className="bg-white px-1 py-0.5 rounded text-xs">len(queue)</code> at the start of each iteration to isolate exactly one level. Then reverse if needed. Clean and simple.
                </p>
              </div>
              <div className="bg-violet-50 rounded-lg p-4 text-center">
                <p className="text-xs font-medium text-violet-600 mb-2">DFS (recursive)</p>
                <p className="text-sm text-violet-900">
                  Must pass the depth down through recursion and determine direction from <code className="bg-white px-1 py-0.5 rounded text-xs">depth % 2</code>. Requires a pre-allocated result list indexed by depth. More ceremony, same result.
                </p>
              </div>
            </div>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
              <p className="text-sm text-amber-900">
                <strong>Interview tip:</strong> Always lead with BFS. If the interviewer asks for DFS, say "I'd use depth % 2 to decide direction and insert into a result list pre-indexed by depth — but BFS is cleaner because level isolation is natural."
              </p>
            </div>
          </div>

          {/* 03 · Analogy */}
          <div className="mb-12">
            <p className="text-xs font-medium tracking-widest uppercase text-slate-500 mb-2">
              03 · The real-world analogy
            </p>
            <h2 className="text-xl font-medium text-slate-900 mb-4">
              Think of reading a bookshelf with alternating spines
            </h2>
            <div className="bg-amber-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-amber-900 leading-relaxed">
                Imagine a library where each shelf holds books from one tree level. On odd shelves you read left-to-right; on even shelves the librarian has flipped all the books &mdash; you read their titles right-to-left. The books themselves didn&apos;t move: you just read them in the opposite order. That&apos;s exactly what the <code className="bg-white px-1 py-0.5 rounded text-xs">level.reverse()</code> call does &mdash; it doesn&apos;t change how nodes are stored in the queue, it just changes how you report that level&apos;s values.
              </p>
            </div>
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded">
              <p className="text-sm text-emerald-900">
                <strong>Key insight:</strong> Because only the output list is reversed (not the queue), children are always enqueued in the correct left-then-right order for the next level. There&apos;s no &quot;undo the flip&quot; logic needed &mdash; the queue is direction-agnostic.
              </p>
            </div>
          </div>

          {/* 04 · Full Diagram */}
          <div className="mb-12">
            <p className="text-xs font-medium tracking-widest uppercase text-slate-500 mb-2">
              04 · Detailed diagram — every node annotated
            </p>
            <h2 className="text-xl font-medium text-slate-900 mb-4">
              Larger example: 7-node tree
            </h2>
            <p className="text-base text-slate-900 mb-4">
              Let's use a fuller tree to really see the zigzag in action.
            </p>

            <div className="flex justify-center mb-5">
              <svg viewBox="0 0 520 330" width="500" height="315" className="w-full max-w-md">
                {/* Level labels */}
                <text x="8" y="68" fontSize="10" fill="#8888a8">
                  L0
                </text>
                <text x="8" y="152" fontSize="10" fill="#8888a8">
                  L1
                </text>
                <text x="8" y="236" fontSize="10" fill="#8888a8">
                  L2
                </text>

                {/* Direction badges */}
                <rect x="32" y="52" width="54" height="18" rx="9" fill="#E6F1FB" />
                <text x="59" y="64" textAnchor="middle" fontSize="10" fill="#185FA5" fontWeight="500">
                  L → R
                </text>
                <rect x="32" y="136" width="54" height="18" rx="9" fill="#FAEEDA" />
                <text x="59" y="148" textAnchor="middle" fontSize="10" fill="#854F0B" fontWeight="500">
                  R → L
                </text>
                <rect x="32" y="220" width="54" height="18" rx="9" fill="#E1F5EE" />
                <text x="59" y="232" textAnchor="middle" fontSize="10" fill="#0F6E56" fontWeight="500">
                  L → R
                </text>

                {/* Edges */}
                <line x1="260" y1="80" x2="160" y2="162" stroke="#B5D4F4" strokeWidth="2" />
                <line x1="260" y1="80" x2="360" y2="162" stroke="#B5D4F4" strokeWidth="2" />
                <line x1="160" y1="162" x2="110" y2="246" stroke="#B5D4F4" strokeWidth="2" />
                <line x1="160" y1="162" x2="210" y2="246" stroke="#B5D4F4" strokeWidth="2" />
                <line x1="360" y1="162" x2="310" y2="246" stroke="#B5D4F4" strokeWidth="2" />
                <line x1="360" y1="162" x2="410" y2="246" stroke="#B5D4F4" strokeWidth="2" />

                {/* Nodes L0 */}
                <circle cx="260" cy="62" r="22" fill="#E6F1FB" stroke="#378ADD" strokeWidth="2" />
                <text x="260" y="67" textAnchor="middle" fontSize="15" fontWeight="700" fill="#0C447C">
                  1
                </text>

                {/* Nodes L1 */}
                <circle cx="160" cy="144" r="22" fill="#FAEEDA" stroke="#EF9F27" strokeWidth="2" />
                <text x="160" y="149" textAnchor="middle" fontSize="15" fontWeight="700" fill="#633806">
                  2
                </text>
                <circle cx="360" cy="144" r="22" fill="#FAEEDA" stroke="#EF9F27" strokeWidth="2" />
                <text x="360" y="149" textAnchor="middle" fontSize="15" fontWeight="700" fill="#633806">
                  3
                </text>

                {/* Nodes L2 */}
                <circle cx="110" cy="228" r="22" fill="#E1F5EE" stroke="#1D9E75" strokeWidth="2" />
                <text x="110" y="233" textAnchor="middle" fontSize="15" fontWeight="700" fill="#085041">
                  4
                </text>
                <circle cx="210" cy="228" r="22" fill="#E1F5EE" stroke="#1D9E75" strokeWidth="2" />
                <text x="210" y="233" textAnchor="middle" fontSize="15" fontWeight="700" fill="#085041">
                  5
                </text>
                <circle cx="310" cy="228" r="22" fill="#E1F5EE" stroke="#1D9E75" strokeWidth="2" />
                <text x="310" y="233" textAnchor="middle" fontSize="15" fontWeight="700" fill="#085041">
                  6
                </text>
                <circle cx="410" cy="228" r="22" fill="#E1F5EE" stroke="#1D9E75" strokeWidth="2" />
                <text x="410" y="233" textAnchor="middle" fontSize="15" fontWeight="700" fill="#085041">
                  7
                </text>

                {/* Collection order labels */}
                <text x="260" y="92" textAnchor="middle" fontSize="9" fill="#6c7086">
                  collect:1st
                </text>
                <text x="160" y="174" textAnchor="middle" fontSize="9" fill="#6c7086">
                  collect:1st
                </text>
                <text x="360" y="174" textAnchor="middle" fontSize="9" fill="#6c7086">
                  collect:2nd
                </text>
                <text x="110" y="258" textAnchor="middle" fontSize="9" fill="#6c7086">
                  collect:1st
                </text>
                <text x="210" y="258" textAnchor="middle" fontSize="9" fill="#6c7086">
                  collect:2nd
                </text>
                <text x="310" y="258" textAnchor="middle" fontSize="9" fill="#6c7086">
                  collect:3rd
                </text>
                <text x="410" y="258" textAnchor="middle" fontSize="9" fill="#6c7086">
                  collect:4th
                </text>

                {/* Arrows */}
                <defs>
                  <marker id="ma" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                    <polygon points="0 0,7 3.5,0 7" fill="#EF9F27" />
                  </marker>
                  <marker id="mg" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                    <polygon points="0 0,7 3.5,0 7" fill="#1D9E75" />
                  </marker>
                </defs>

                <path d="M 342,136 Q 260,116 180,136" fill="none" stroke="#EF9F27" strokeWidth="1.8" strokeDasharray="5,3" markerEnd="url(#ma)" />
                <text x="260" y="112" textAnchor="middle" fontSize="10" fill="#EF9F27">
                  output: [3, 2]
                </text>

                <path d="M 133,222 Q 210,200 290,222" fill="none" stroke="#1D9E75" strokeWidth="1.8" strokeDasharray="5,3" markerEnd="url(#mg)" />
                <path d="M 233,222 Q 310,200 390,222" fill="none" stroke="#1D9E75" strokeWidth="1.8" strokeDasharray="5,3" markerEnd="url(#mg)" />
                <text x="260" y="198" textAnchor="middle" fontSize="10" fill="#1D9E75">
                  output: [4, 5, 6, 7]
                </text>

                <rect x="95" y="285" width="330" height="22" rx="6" fill="#1e1e2e" />
                <text x="260" y="300" textAnchor="middle" fontSize="11.5" fill="#cdd6f4" fontFamily="monospace">
                  [[1], [3, 2], [4, 5, 6, 7]]
                </text>
              </svg>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <p className="text-sm text-blue-900">
                Notice how BFS collects Level 1 as <strong>[2, 3]</strong> (left&rarr;right from the queue) but the output for that level is <strong>[3, 2]</strong> (reversed). Level 2 is collected as <strong>[4, 5, 6, 7]</strong> and kept as-is since it&apos;s a left&rarr;right level. The queue is untouched &mdash; only <code className="bg-white px-1 py-0.5 rounded text-xs">level.reverse()</code> runs on odd levels.
              </p>
            </div>
          </div>

          {/* 05 · Code walkthrough */}
          <div className="mb-12">
            <p className="text-xs font-medium tracking-widest uppercase text-slate-500 mb-2">
              05 · Understanding the code line by line
            </p>
            <h2 className="text-xl font-medium text-slate-900 mb-4">
              What each part actually does
            </h2>
            <p className="text-base text-slate-900 leading-relaxed mb-4">
              The trick is using <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">len(queue)</code> at the top of each loop iteration to &quot;freeze&quot; the current level&apos;s size before any children get enqueued. Without this snapshot, the loop would consume children from the next level too.
            </p>
            <pre className="bg-slate-900 text-slate-200 p-5 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed mb-6">
              <code>{`queue = deque([root])         # seed with root only
left_to_right = True         # Level 0 reads L→R

while queue:
    level_size = len(queue) # ← KEY: snapshot before children are added
    level = []

    for _ in range(level_size):  # process exactly this level
        node = queue.popleft()
        level.append(node.val)
        if node.left:  queue.append(node.left)   # children go to NEXT level
        if node.right: queue.append(node.right)

    if not left_to_right:
        level.reverse()          # flip output only — queue unchanged
    result.append(level)
    left_to_right = not left_to_right  # toggle for next level`}</code>
            </pre>

            {/* Q&A Blocks */}
            <div className="space-y-3">
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900">
                  Why snapshot <code className="bg-white px-1 py-0.5 rounded text-xs">len(queue)</code> before the inner loop?
                </div>
                <div className="px-4 py-3 text-sm text-slate-900 border-t border-slate-200">
                  When we dequeue a node, we immediately enqueue its children. If we looped on <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">while queue</code> inside the same iteration, we'd accidentally process the next level's nodes too. Snapshotting <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">level_size = len(queue)</code> at the top tells us exactly how many nodes to pull before we've added any new children — giving us a clean per-level boundary.
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900">
                  Why does reversing the output list work correctly? Doesn't it mess up child order?
                </div>
                <div className="px-4 py-3 text-sm text-slate-900 border-t border-slate-200">
                  No — by the time we call <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">level.reverse()</code>, all children from this level are already enqueued in the correct left-then-right order. The reversal happens on the <em>local output list</em> only, not on the queue. So the queue always contains children in the proper left-to-right BFS order, ready for the next level.
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900">
                  Could you use a <code className="bg-white px-1 py-0.5 rounded text-xs">collections.deque</code> with <code className="bg-white px-1 py-0.5 rounded text-xs">appendleft</code> instead of reversing?
                </div>
                <div className="px-4 py-3 text-sm text-slate-900 border-t border-slate-200">
                  Yes — an alternative is to build each level into a deque and use <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">appendleft</code> for right-to-left levels and <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">append</code> for left-to-right. This avoids the final <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">reverse()</code> call and is O(1) per insert. It's a valid micro-optimisation but adds code complexity. Both approaches are O(n) overall.
                </div>
              </div>
            </div>
          </div>

          {/* 06 · Full Trace */}
          <div className="mb-12">
            <p className="text-xs font-medium tracking-widest uppercase text-slate-500 mb-2">
              06 · Full trace — every BFS step
            </p>
            <h2 className="text-xl font-medium text-slate-900 mb-4">
              Walking through the 5-node example
            </h2>
            <p className="text-base text-slate-900 mb-6">
              Tree: root=3. Left=9 (no children). Right=20 with children 15 and 7. We trace every queue state and flag value.
            </p>

            <div className="space-y-4">
              {/* Trace steps */}
              <div className="flex gap-4">
                <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700 h-fit whitespace-nowrap">
                  Init
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    queue = [3] | left_to_right = True
                  </p>
                  <p className="text-sm text-slate-600">
                    Seed the queue with the root. Direction flag starts True (Level 0 is left→right).
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 h-fit whitespace-nowrap">
                  Level 0
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    level_size = 1 | Dequeue 3 → level = [3]
                  </p>
                  <p className="text-sm text-slate-600">
                    Enqueue 3's children: left=9, right=20. Queue is now [9, 20]. <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">left_to_right=True</code> → no reverse. Append [3] to result. Toggle flag → False.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-violet-100 text-violet-700 h-fit whitespace-nowrap">
                  Level 1
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    level_size = 2 | Dequeue 9, 20 → level = [9, 20]
                  </p>
                  <p className="text-sm text-slate-600">
                    9 has no children. 20&apos;s children (15, 7) are enqueued. Queue is [15, 7]. <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">left_to_right=False</code> → <strong>reverse</strong> level → [20, 9]. Append [20, 9] to result. Toggle flag → True.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 h-fit whitespace-nowrap">
                  Level 2
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    level_size = 2 | Dequeue 15, 7 → level = [15, 7]
                  </p>
                  <p className="text-sm text-slate-600">
                    Both are leaves — nothing enqueued. Queue is empty. <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">left_to_right=True</code> → no reverse. Append [15, 7] to result. Queue empty → loop ends.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded mt-6">
              <p className="text-sm text-emerald-900">
                <strong>Final result:</strong> [[3], [20, 9], [15, 7]] ✓
              </p>
            </div>
          </div>

          {/* 07 · Common mistakes */}
          <div className="mb-12">
            <p className="text-xs font-medium tracking-widest uppercase text-slate-500 mb-2">
              07 · Common beginner mistakes
            </p>
            <h2 className="text-xl font-medium text-slate-900 mb-4">
              What trips people up
            </h2>
            <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-200">
              <div className="p-4 flex gap-3">
                <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0 font-bold text-sm">×</div>
                <div>
                  <p className="text-sm font-medium text-slate-900 mb-1">
                    Reversing the queue instead of the output list
                  </p>
                  <p className="text-sm text-slate-600">
                    If you reverse the queue or enqueue right-then-left for &quot;reverse&quot; levels, children of those nodes get enqueued in wrong order &mdash; corrupting the direction logic for the next level. Only the output list for that level should be reversed.
                  </p>
                </div>
              </div>

              <div className="p-4 flex gap-3">
                <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0 font-bold text-sm">×</div>
                <div>
                  <p className="text-sm font-medium text-slate-900 mb-1">
                    Forgetting to snapshot <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">len(queue)</code> before the inner loop
                  </p>
                  <p className="text-sm text-slate-600">
                    Without the snapshot, your inner loop runs on a growing queue and mixes two levels together. Always capture <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">level_size = len(queue)</code> at the top of each outer-loop iteration, before any children are enqueued.
                  </p>
                </div>
              </div>

              <div className="p-4 flex gap-3">
                <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0 font-bold text-sm">×</div>
                <div>
                  <p className="text-sm font-medium text-slate-900 mb-1">
                    Using a list's <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">.pop(0)</code> instead of <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">deque.popleft()</code>
                  </p>
                  <p className="text-sm text-slate-600">
                    <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">list.pop(0)</code> is O(n) because it shifts all elements. Over n nodes this makes BFS O(n²). Always use <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">collections.deque</code> which gives O(1) <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">popleft()</code>.
                  </p>
                </div>
              </div>

              <div className="p-4 flex gap-3">
                <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0 font-bold text-sm">×</div>
                <div>
                  <p className="text-sm font-medium text-slate-900 mb-1">
                    Off-by-one on the direction — starting with right→left
                  </p>
                  <p className="text-sm text-slate-600">
                    The problem defines Level 0 (root) as left→right. Initialise <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">left_to_right = True</code>. Setting it to False initially swaps every level's direction and produces wrong output.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 08 · Complexity full */}
          <div className="mb-12">
            <p className="text-xs font-medium tracking-widest uppercase text-slate-500 mb-2">
              08 · Complexity — the full explanation
            </p>
            <h2 className="text-xl font-medium text-slate-900 mb-4">
              Why O(n) time and O(n) space?
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-5">
                <div className="text-xs font-medium tracking-widest uppercase text-blue-600 mb-2">
                  Time
                </div>
                <div className="text-3xl font-medium text-blue-900 font-mono mb-2">
                  O(n)
                </div>
                <div className="text-sm text-blue-700">
                  Each node is enqueued once and dequeued once — O(n). Reversing a level costs O(w) where w is the width. Summing all widths across all levels equals n. Total: O(n).
                </div>
              </div>
              <div className="bg-violet-50 rounded-lg p-5">
                <div className="text-xs font-medium tracking-widest uppercase text-violet-600 mb-2">
                  Space
                </div>
                <div className="text-3xl font-medium text-violet-900 font-mono mb-2">
                  O(n)
                </div>
                <div className="text-sm text-violet-700">
                  Queue holds at most the widest level — O(n) in the worst case (complete binary tree's last level has n/2 nodes). Result list stores all n values. Both O(n).
                </div>
              </div>
            </div>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
              <p className="text-sm text-amber-900">
                <strong>Interview tip:</strong> Distinguish between queue space (O(width)) and result space (O(n)). For a skewed tree, the queue is O(1) at any moment but total work is still O(n). For a perfect binary tree the last level has ⌈n/2⌉ nodes — that's the queue's worst-case size.
              </p>
            </div>
          </div>

          {/* 09 · Interview context */}
          <div className="mb-0">
            <p className="text-xs font-medium tracking-widest uppercase text-slate-500 mb-2">
              09 · Interview context
            </p>
            <h2 className="text-xl font-medium text-slate-900 mb-4">
              Where you'll actually use this
            </h2>
            <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-200">
              <div className="p-4 flex gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900 mb-1">
                    Binary Tree Level Order Traversal (LC 102)
                  </p>
                  <p className="text-sm text-slate-600">
                    The direct predecessor problem — identical BFS structure, no direction flag. If you can do zigzag, you can do normal level-order in your sleep.
                  </p>
                </div>
              </div>

              <div className="p-4 flex gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900 mb-1">
                    Binary Tree Level Order Traversal II (LC 107)
                  </p>
                  <p className="text-sm text-slate-600">
                    Same BFS, but you reverse the final result list to return levels bottom-up. One extra line of code on top of LC 102.
                  </p>
                </div>
              </div>

              <div className="p-4 flex gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900 mb-1">
                    Average of Levels in Binary Tree (LC 637)
                  </p>
                  <p className="text-sm text-slate-600">
                    Same level-isolation pattern — replace the output append with a sum ÷ count per level. Core BFS skeleton is identical.
                  </p>
                </div>
              </div>

              <div className="p-4 flex gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900 mb-1">
                    Spiral Matrix (LC 54)
                  </p>
                  <p className="text-sm text-slate-600">
                    The 2-D matrix analogue of zigzag — traverse rows alternating left→right and right→left. The direction-flag mental model from this problem applies directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>}

        {/* Footer CTA */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-emerald-50/30 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[15px] font-medium text-slate-800">Ready to see it in action?</p>
              <p className="text-[13px] text-slate-500 mt-0.5">Step through the visualizer to watch the algorithm state update live.</p>
            </div>
            <Link
              href="/problems/binary-tree/zigzag-level-order-traversal"
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

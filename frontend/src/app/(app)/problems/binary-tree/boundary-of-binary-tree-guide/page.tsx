"use client";

import { useState } from "react";
import Link from "next/link";

const QUICK_MODE_HTML = String.raw`
<hr class="divider" style="margin-top:0;">

<div class="section">
  <p class="section-label">01 · The definition</p>
  <div class="rule-box" style="margin-bottom:0.75rem;">
    <p class="rule-text">Boundary = Left Boundary (top→down, no leaves) + All Leaves (left→right) + Right Boundary (bottom→up, no leaves)</p>
  </div>
  <p style="font-size:14px;color:var(--color-text-secondary);margin:0;">The root is always included. Nodes are collected anti-clockwise so the output "traces the perimeter" of the tree.</p>
</div>

<div class="section">
  <p class="section-label">02 · The key insight</p>
  <div class="card">
    <div class="step-row">
      <div class="step-num">1</div>
      <div>
        <div class="step-text">Split the problem into 3 independent passes</div>
        <div class="step-sub">Left boundary (top-down, skip leaves) → Leaves (any order, left-to-right) → Right boundary (bottom-up, skip leaves).</div>
      </div>
    </div>
    <div class="step-row">
      <div class="step-num">2</div>
      <div>
        <div class="step-text">Left boundary prefers left child; right boundary prefers right child</div>
        <div class="step-sub">If the preferred child doesn't exist, go to the other side. Stop before reaching a leaf.</div>
      </div>
    </div>
    <div class="step-row" style="margin-bottom:0;">
      <div class="step-num">3</div>
      <div>
        <div class="step-text">Right boundary is appended after recursion (post-order) to reverse it</div>
        <div class="step-sub">Anti-clockwise order means the right side must be bottom-up, so we recurse first, append second.</div>
      </div>
    </div>
  </div>
</div>

<div class="section">
  <p class="section-label">03 · Visual — how the boundary is traced</p>

  <div class="legend-row">
    <div class="legend-item"><div class="legend-dot" style="background:#185FA5;"></div> Root</div>
    <div class="legend-item"><div class="legend-dot" style="background:#EF9F27;"></div> Left Boundary</div>
    <div class="legend-item"><div class="legend-dot" style="background:#1D9E75;"></div> Leaves</div>
    <div class="legend-item"><div class="legend-dot" style="background:#A32D2D;"></div> Right Boundary</div>
    <div class="legend-item"><div class="legend-dot" style="background:#c0c0d0;"></div> Internal (skipped)</div>
  </div>

  <div class="card" style="padding:1.5rem;display:flex;justify-content:center;overflow:hidden;">
    <svg viewBox="0 0 520 340" width="100%" style="max-width:520px;display:block;" xmlns="http://www.w3.org/2000/svg">
      <line x1="260" y1="48"  x2="140" y2="112" stroke="#d0d0e0" stroke-width="1.5"/>
      <line x1="260" y1="48"  x2="380" y2="112" stroke="#d0d0e0" stroke-width="1.5"/>
      <line x1="140" y1="112" x2="80"  y2="186" stroke="#d0d0e0" stroke-width="1.5"/>
      <line x1="140" y1="112" x2="200" y2="186" stroke="#d0d0e0" stroke-width="1.5"/>
      <line x1="380" y1="112" x2="320" y2="186" stroke="#d0d0e0" stroke-width="1.5"/>
      <line x1="380" y1="112" x2="440" y2="186" stroke="#d0d0e0" stroke-width="1.5"/>
      <line x1="80"  y1="186" x2="50"  y2="272" stroke="#d0d0e0" stroke-width="1.5"/>
      <line x1="80"  y1="186" x2="110" y2="272" stroke="#d0d0e0" stroke-width="1.5"/>
      <line x1="200" y1="186" x2="200" y2="272" stroke="#d0d0e0" stroke-width="1.5"/>

      <circle cx="260" cy="44" r="24" fill="#E6F1FB" stroke="#185FA5" stroke-width="2"/>
      <text x="260" y="50" text-anchor="middle" font-size="14" font-weight="600" fill="#0C447C" font-family="monospace">1</text>
      <circle cx="140" cy="112" r="24" fill="#FAEEDA" stroke="#EF9F27" stroke-width="2"/>
      <text x="140" y="118" text-anchor="middle" font-size="14" font-weight="600" fill="#633806" font-family="monospace">2</text>
      <circle cx="380" cy="112" r="24" fill="#FCEBEB" stroke="#A32D2D" stroke-width="2"/>
      <text x="380" y="118" text-anchor="middle" font-size="14" font-weight="600" fill="#791F1F" font-family="monospace">3</text>
      <circle cx="80" cy="186" r="24" fill="#FAEEDA" stroke="#EF9F27" stroke-width="2"/>
      <text x="80" y="192" text-anchor="middle" font-size="14" font-weight="600" fill="#633806" font-family="monospace">4</text>
      <circle cx="200" cy="186" r="24" fill="#f0f0f6" stroke="#c0c0d0" stroke-width="1.5"/>
      <text x="200" y="192" text-anchor="middle" font-size="14" font-weight="600" fill="#8080a0" font-family="monospace">5</text>
      <circle cx="320" cy="186" r="24" fill="#E1F5EE" stroke="#1D9E75" stroke-width="2"/>
      <text x="320" y="192" text-anchor="middle" font-size="14" font-weight="600" fill="#085041" font-family="monospace">6</text>
      <circle cx="440" cy="186" r="24" fill="#FCEBEB" stroke="#A32D2D" stroke-width="2"/>
      <text x="440" y="192" text-anchor="middle" font-size="14" font-weight="600" fill="#791F1F" font-family="monospace">7</text>
      <circle cx="50" cy="272" r="24" fill="#E1F5EE" stroke="#1D9E75" stroke-width="2"/>
      <text x="50" y="278" text-anchor="middle" font-size="14" font-weight="600" fill="#085041" font-family="monospace">8</text>
      <circle cx="110" cy="272" r="24" fill="#E1F5EE" stroke="#1D9E75" stroke-width="2"/>
      <text x="110" y="278" text-anchor="middle" font-size="14" font-weight="600" fill="#085041" font-family="monospace">9</text>
      <circle cx="200" cy="272" r="24" fill="#E1F5EE" stroke="#1D9E75" stroke-width="2"/>
      <text x="200" y="278" text-anchor="middle" font-size="13" font-weight="600" fill="#085041" font-family="monospace">10</text>

      <path d="M 220 25 Q 180 10 150 30" stroke="#185FA5" stroke-width="1.5" fill="none" stroke-dasharray="4,3" marker-end="url(#arr-blue)"/>
      <path d="M 108 145 Q 90 165 75 160" stroke="#EF9F27" stroke-width="1.5" fill="none" stroke-dasharray="4,3" marker-end="url(#arr-amber)"/>
      <path d="M 76 300 Q 140 318 196 300" stroke="#1D9E75" stroke-width="1.5" fill="none" stroke-dasharray="4,3" marker-end="url(#arr-green)"/>
      <path d="M 418 218 Q 440 200 435 175" stroke="#A32D2D" stroke-width="1.5" fill="none" stroke-dasharray="4,3" marker-end="url(#arr-red)"/>

      <text x="260" y="18" text-anchor="middle" font-size="11" fill="#185FA5" font-family="sans-serif" font-weight="500">① Root</text>
      <text x="32" y="175" text-anchor="middle" font-size="11" fill="#EF9F27" font-family="sans-serif" font-weight="500" transform="rotate(-90,32,175)">② Left Boundary ↓</text>
      <text x="155" y="318" text-anchor="middle" font-size="11" fill="#1D9E75" font-family="sans-serif" font-weight="500">③ Leaves →</text>
      <text x="488" y="175" text-anchor="middle" font-size="11" fill="#A32D2D" font-family="sans-serif" font-weight="500" transform="rotate(90,488,175)">④ Right Boundary ↑</text>

      <defs>
        <marker id="arr-blue"  markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#185FA5"/></marker>
        <marker id="arr-amber" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#EF9F27"/></marker>
        <marker id="arr-green" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#1D9E75"/></marker>
        <marker id="arr-red"   markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#A32D2D"/></marker>
      </defs>
    </svg>
  </div>

  <div class="callout callout-info" style="margin-top:1rem;">
    <p><strong style="font-weight:500;">Output for this tree:</strong> [1, 2, 4, 8, 9, 10, 6, 7, 3] — root, left boundary (2,4), all leaves left-to-right (8,9,10,6), right boundary reversed (7,3).</p>
  </div>
</div>

<div class="section">
  <p class="section-label">04 · Code (Python)</p>
  <div class="code-block">
    <div><span class="c-kw">class </span><span class="c-fn">Solution</span><span class="c-plain">:</span></div>
    <div><span class="c-plain">  </span><span class="c-kw">def </span><span class="c-fn">boundaryOfBinaryTree</span><span class="c-plain">(self, root) -> </span><span class="c-fn">list</span><span class="c-plain">:</span></div>
    <div>&nbsp;</div>
    <div><span class="c-plain">    </span><span class="c-kw">if not </span><span class="c-plain">root: </span><span class="c-kw">return </span><span class="c-plain">[]</span></div>
    <div><span class="c-plain">    res = [root.val]</span></div>
    <div>&nbsp;</div>
    <div><span class="c-plain">    </span><span class="c-kw">def </span><span class="c-fn">is_leaf</span><span class="c-plain">(node):                    </span><span class="c-cm"># helper</span></div>
    <div><span class="c-plain">      </span><span class="c-kw">return not </span><span class="c-plain">node.left </span><span class="c-kw">and not </span><span class="c-plain">node.right</span></div>
    <div>&nbsp;</div>
    <div><span class="c-plain">    </span><span class="c-kw">def </span><span class="c-fn">left_boundary</span><span class="c-plain">(node):              </span><span class="c-cm"># top-down, skip leaves</span></div>
    <div><span class="c-plain">      </span><span class="c-kw">if not </span><span class="c-plain">node </span><span class="c-kw">or </span><span class="c-fn">is_leaf</span><span class="c-plain">(node): </span><span class="c-kw">return</span></div>
    <div><span class="c-plain">      res.append(node.val)</span></div>
    <div><span class="c-plain">      </span><span class="c-kw">if </span><span class="c-plain">node.left:  </span><span class="c-fn">left_boundary</span><span class="c-plain">(node.left)</span></div>
    <div><span class="c-plain">      </span><span class="c-kw">else</span><span class="c-plain">:          </span><span class="c-fn">left_boundary</span><span class="c-plain">(node.right)</span></div>
    <div>&nbsp;</div>
    <div><span class="c-plain">    </span><span class="c-kw">def </span><span class="c-fn">leaves</span><span class="c-plain">(node):                      </span><span class="c-cm"># collect all leaves L→R</span></div>
    <div><span class="c-plain">      </span><span class="c-kw">if not </span><span class="c-plain">node: </span><span class="c-kw">return</span></div>
    <div><span class="c-plain">      </span><span class="c-kw">if </span><span class="c-fn">is_leaf</span><span class="c-plain">(node):</span></div>
    <div><span class="c-plain">        res.append(node.val); </span><span class="c-kw">return</span></div>
    <div><span class="c-plain">      </span><span class="c-fn">leaves</span><span class="c-plain">(node.left)</span></div>
    <div><span class="c-plain">      </span><span class="c-fn">leaves</span><span class="c-plain">(node.right)</span></div>
    <div>&nbsp;</div>
    <div><span class="c-plain">    </span><span class="c-kw">def </span><span class="c-fn">right_boundary</span><span class="c-plain">(node):             </span><span class="c-cm"># bottom-up, skip leaves</span></div>
    <div><span class="c-plain">      </span><span class="c-kw">if not </span><span class="c-plain">node </span><span class="c-kw">or </span><span class="c-fn">is_leaf</span><span class="c-plain">(node): </span><span class="c-kw">return</span></div>
    <div><span class="c-plain">      </span><span class="c-kw">if </span><span class="c-plain">node.right: </span><span class="c-fn">right_boundary</span><span class="c-plain">(node.right)</span></div>
    <div><span class="c-plain">      </span><span class="c-kw">else</span><span class="c-plain">:          </span><span class="c-fn">right_boundary</span><span class="c-plain">(node.left)</span></div>
    <div><span class="c-plain">      res.append(node.val)             </span><span class="c-cm"># append AFTER recursion → reversed</span></div>
    <div>&nbsp;</div>
    <div><span class="c-plain">    </span><span class="c-fn">left_boundary</span><span class="c-plain">(root.left)</span></div>
    <div><span class="c-plain">    </span><span class="c-fn">leaves</span><span class="c-plain">(root)               </span><span class="c-cm"># includes root if it's a leaf</span></div>
    <div><span class="c-plain">    </span><span class="c-fn">right_boundary</span><span class="c-plain">(root.right)</span></div>
    <div><span class="c-plain">    </span><span class="c-kw">return </span><span class="c-plain">res</span></div>
  </div>
</div>

<div class="section">
  <p class="section-label">05 · Dry run — tree [1,2,3,4,5,6,7,8,9,10]</p>
  <div class="card" style="padding:0;">
    <div class="dry-head">
      <div class="dry-cell">Phase</div>
      <div class="dry-cell">Node visited</div>
      <div class="dry-cell">Action</div>
      <div class="dry-cell">res so far</div>
    </div>
    <div class="dry-run-row"><div class="dry-cell" style="color:#185FA5;font-weight:500;">Init</div><div class="dry-cell">1 (root)</div><div class="dry-cell">Always append root</div><div class="dry-cell" style="font-family:monospace;">[1]</div></div>
    <div class="dry-run-row highlight-row"><div class="dry-cell" style="color:#854F0B;font-weight:500;">Left B.</div><div class="dry-cell">2 → left child</div><div class="dry-cell">Not leaf → append, go left</div><div class="dry-cell" style="font-family:monospace;">[1,2]</div></div>
    <div class="dry-run-row"><div class="dry-cell" style="color:#854F0B;font-weight:500;">Left B.</div><div class="dry-cell">4 → left child of 2</div><div class="dry-cell">Not leaf → append, go left</div><div class="dry-cell" style="font-family:monospace;">[1,2,4]</div></div>
    <div class="dry-run-row highlight-row"><div class="dry-cell" style="color:#854F0B;font-weight:500;">Left B.</div><div class="dry-cell">8 → left child of 4</div><div class="dry-cell">Is leaf → STOP (leaves phase will add it)</div><div class="dry-cell" style="font-family:monospace;">[1,2,4]</div></div>
    <div class="dry-run-row"><div class="dry-cell" style="color:#0F6E56;font-weight:500;">Leaves</div><div class="dry-cell">8</div><div class="dry-cell">Leaf → append</div><div class="dry-cell" style="font-family:monospace;">[1,2,4,8]</div></div>
    <div class="dry-run-row highlight-row"><div class="dry-cell" style="color:#0F6E56;font-weight:500;">Leaves</div><div class="dry-cell">9</div><div class="dry-cell">Leaf → append</div><div class="dry-cell" style="font-family:monospace;">[1,2,4,8,9]</div></div>
    <div class="dry-run-row"><div class="dry-cell" style="color:#0F6E56;font-weight:500;">Leaves</div><div class="dry-cell">10</div><div class="dry-cell">Leaf → append</div><div class="dry-cell" style="font-family:monospace;">[1,2,4,8,9,10]</div></div>
    <div class="dry-run-row highlight-row"><div class="dry-cell" style="color:#0F6E56;font-weight:500;">Leaves</div><div class="dry-cell">6</div><div class="dry-cell">Leaf (no children) → append</div><div class="dry-cell" style="font-family:monospace;">[1,2,4,8,9,10,6]</div></div>
    <div class="dry-run-row"><div class="dry-cell" style="color:#A32D2D;font-weight:500;">Right B.</div><div class="dry-cell">7 → right child of 3</div><div class="dry-cell">Leaf → STOP (append after recursion)</div><div class="dry-cell" style="font-family:monospace;">[1,2,4,8,9,10,6]</div></div>
    <div class="dry-run-row highlight-row"><div class="dry-cell" style="color:#A32D2D;font-weight:500;">Right B.</div><div class="dry-cell">3</div><div class="dry-cell">Append after right child returns</div><div class="dry-cell" style="font-family:monospace;">[1,2,4,8,9,10,6,7,3]</div></div>
  </div>
</div>

<div class="section" style="margin-bottom:0;">
  <p class="section-label">06 · Complexity</p>
  <div class="complexity-grid">
    <div class="complexity-card" style="background:#E6F1FB;"><div class="complexity-label" style="color:#185FA5;">Time</div><div class="complexity-value" style="color:#0C447C;">O(n)</div><div class="complexity-why" style="color:#185FA5;">Each node is visited at most once across the three passes. No node is processed twice.</div></div>
    <div class="complexity-card" style="background:#EEEDFE;"><div class="complexity-label" style="color:#534AB7;">Space</div><div class="complexity-value" style="color:#3C3489;">O(h)</div><div class="complexity-why" style="color:#534AB7;">Recursion stack depth equals the tree height h. O(log n) for balanced, O(n) for a skewed tree.</div></div>
  </div>
</div>
`;

const DEEP_MODE_HTML = String.raw`
<hr class="divider" style="margin-top:0;">

<div class="deep-section">
  <p class="section-label">01 · Building the intuition</p>
  <h2 class="section-title">What does "boundary" actually mean?</h2>
  <p class="deep-para">Imagine you are standing outside the tree and tracing its outline with your finger, moving anti-clockwise (counter-clockwise). You start at the root, go down the left side, walk across the bottom (all the leaves), then come back up the right side. That outline — with no interior nodes — is the boundary.</p>
  <div class="analogy-box" style="margin-bottom:1rem;"><p class="analogy-text">🏠 Think of the binary tree as the floorplan of a house. The boundary is the outer wall. Interior rooms (non-boundary internal nodes) are invisible from outside. You trace the perimeter: front door (root) → left wall (left boundary) → floor tiles (leaves) → right wall (right boundary, reversed) → back to door.</p></div>
  <p class="deep-para">The problem decomposes naturally into 3 separate walks along this perimeter, which is the key to a clean implementation.</p>
</div>

<div class="deep-section">
  <p class="section-label">02 · The three passes in detail</p>
  <h2 class="section-title">Pass 1 — Left Boundary</h2>
  <p class="deep-para">Start at <code>root.left</code> (not root — root is already added). At each node: if it's a leaf, stop. Otherwise append the node's value. Prefer going left; if no left child exists, go right.</p>
  <div class="callout callout-info"><p><strong style="font-weight:500;">Pass summary:</strong> Left boundary collects outer-left internal nodes, leaves collects all terminal nodes, and right boundary collects outer-right internal nodes in reverse.</p></div>
</div>

<div class="deep-section">
  <p class="section-label">03 · The trickiest part</p>
  <h2 class="section-title">Why is the right boundary reversed — and how?</h2>
  <p class="deep-para">Anti-clockwise traversal means after the leaves we go UP the right side, from the deepest right node back to the root's right child. A normal DFS would give us nodes top-to-bottom. To reverse this, we append after the recursive call instead of before — this is post-order appending.</p>
  <div class="callout callout-info"><p><strong style="font-weight:500;">The trick:</strong> <code>right_boundary</code> recurses to the deepest right node first, then appends on the way back up. No extra array or <code>.reverse()</code> needed — the call stack does the reversal automatically.</p></div>
  <div class="callout callout-warn"><p><strong style="font-weight:500;">Common mistake:</strong> Appending before recursing in <code>right_boundary</code>. That gives a top-down order, breaking the anti-clockwise direction and producing duplicate-looking output.</p></div>
</div>

<div class="deep-section">
  <p class="section-label">04 · Deep questions</p>
  <h2 class="section-title">Thinking it through</h2>
  <div class="qa-block"><div class="qa-q">Why do we call <code>leaves(root)</code> and not <code>leaves(root.left)</code>?</div><div class="qa-a">Because the root itself could be the only node in the tree (a leaf). In that case, the root is both the left boundary start and the only leaf — but we already added root.val initially. We call <code>leaves(root)</code> so that if root is a leaf it's covered, and for non-leaf roots the leaves function skips non-leaf nodes naturally. However, since root is added first, the <code>is_leaf</code> check on root during the leaves pass avoids a duplicate because <code>leaves(root)</code> will just return immediately for a single-node tree (already added).</div></div>
  <div class="qa-block"><div class="qa-q">What happens when the root has only a left subtree (no right child)?</div><div class="qa-a">The right boundary pass starts with <code>right_boundary(root.right)</code> which is <code>None</code>, so it returns immediately — nothing is added. The output is just root + left boundary + leaves. This is correct because there is no right side to trace.</div></div>
  <div class="qa-block"><div class="qa-q">Can a node appear in both the left boundary and the leaves?</div><div class="qa-a">No — the left and right boundary functions explicitly stop when they reach a leaf (<code>if is_leaf(node): return</code>). So boundary nodes are always internal nodes, and the leaves phase only collects leaf nodes. The two sets are mutually exclusive by construction.</div></div>
  <div class="qa-block"><div class="qa-q">Why does left boundary prefer left, and right boundary prefer right?</div><div class="qa-a">Because we're tracing the outermost edge. The leftmost path down the tree uses the leftmost child at every level. Only when there's no left child do we "slip" to the right — because that's still the outermost node at that level when viewed from the left side. Symmetrically for the right boundary.</div></div>
</div>

<div class="deep-section">
  <p class="section-label">05 · Full trace — tree [1, null, 2, 3, 4]</p>
  <h2 class="section-title">Edge case: root has no left child</h2>
  <p class="deep-para" style="margin-bottom:1.5rem;">Tree: root=1 (no left child). Right child=2. 2 has children 3 (left) and 4 (right). Let's trace all three passes.</p>
  <div class="trace-step"><span class="trace-badge trace-going">Init</span><div class="trace-content"><p class="trace-title">res = [1]</p><p class="trace-desc">Root is always appended first, no matter what.</p></div></div>
  <div class="trace-step"><span class="trace-badge trace-skip">Left B.</span><div class="trace-content"><p class="trace-title">left_boundary(root.left = None) → returns immediately</p><p class="trace-desc">Root has no left child, so the entire left boundary pass is a no-op. res stays [1].</p></div></div>
  <div class="trace-step"><span class="trace-badge trace-leaf">Leaves</span><div class="trace-content"><p class="trace-title">leaves(1): 1 is not a leaf — recurse into children</p><p class="trace-desc">1 has a right child (2), so call leaves(None) [left child, returns] then leaves(2).</p></div></div>
  <div class="trace-step"><span class="trace-badge trace-leaf">Leaves</span><div class="trace-content"><p class="trace-title">leaves(2): not a leaf — recurse into 3 and 4</p><p class="trace-desc">Node 2 has children 3 and 4. Call leaves(3), then leaves(4).</p></div></div>
  <div class="trace-step"><span class="trace-badge trace-record">Append</span><div class="trace-content"><p class="trace-title">leaves(3) → leaf! res = [1, 3]</p><p class="trace-desc">Node 3 has no children. is_leaf=True → append 3.</p></div></div>
  <div class="trace-step"><span class="trace-badge trace-record">Append</span><div class="trace-content"><p class="trace-title">leaves(4) → leaf! res = [1, 3, 4]</p><p class="trace-desc">Node 4 has no children. is_leaf=True → append 4.</p></div></div>
  <div class="trace-step"><span class="trace-badge trace-back">Right B.</span><div class="trace-content"><p class="trace-title">right_boundary(root.right = 2): not a leaf — prefer right child (4)</p><p class="trace-desc">Node 2 has a right child (4). Call right_boundary(4) first before appending 2.</p></div></div>
  <div class="trace-step"><span class="trace-badge trace-skip">Right B.</span><div class="trace-content"><p class="trace-title">right_boundary(4): is_leaf → return immediately</p><p class="trace-desc">Node 4 is a leaf. The right boundary stops here (leaves phase already added it).</p></div></div>
  <div class="trace-step" style="margin-bottom:0;"><span class="trace-badge trace-record">Append</span><div class="trace-content"><p class="trace-title">Back in right_boundary(2): append 2 → res = [1, 3, 4, 2]</p><p class="trace-desc">Post-order append — 2 is added after its right child is fully processed. Final answer: [1, 3, 4, 2].</p></div></div>
</div>

<div class="deep-section">
  <p class="section-label">06 · Common beginner mistakes</p>
  <h2 class="section-title">What trips people up</h2>
  <div class="card" style="padding:0.75rem 1.5rem;">
    <div class="mistake-row"><div class="mistake-x">✕</div><div><p style="font-size:14px;font-weight:500;color:var(--color-text-primary);margin:0 0 3px;">Appending in right_boundary before recursing</p><p style="font-size:13px;color:var(--color-text-secondary);margin:0;line-height:1.6;">This gives a top-down order for the right side, but the problem requires bottom-up (anti-clockwise). Always recurse first, append second in right_boundary.</p></div></div>
    <div class="mistake-row"><div class="mistake-x">✕</div><div><p style="font-size:14px;font-weight:500;color:var(--color-text-primary);margin:0 0 3px;">Including leaves in the left or right boundary</p><p style="font-size:13px;color:var(--color-text-secondary);margin:0;line-height:1.6;">Without the <code>is_leaf(node)</code> guard, leaf nodes get added twice — once in the boundary pass and once in the leaves pass. Always stop boundary traversal at leaf nodes.</p></div></div>
    <div class="mistake-row"><div class="mistake-x">✕</div><div><p style="font-size:14px;font-weight:500;color:var(--color-text-primary);margin:0 0 3px;">Starting left_boundary at root instead of root.left</p><p style="font-size:13px;color:var(--color-text-secondary);margin:0;line-height:1.6;">Root is always added separately. If you pass root into left_boundary, it'll be added again — a duplicate at the start of the output.</p></div></div>
    <div class="mistake-row" style="border:none;"><div class="mistake-x">✕</div><div><p style="font-size:14px;font-weight:500;color:var(--color-text-primary);margin:0 0 3px;">Forgetting the single-node edge case</p><p style="font-size:13px;color:var(--color-text-secondary);margin:0;line-height:1.6;">When the tree has only a root and no children, root is a leaf. The output should be just [root.val]. Without the early <code>if not root: return []</code> and proper leaf guards, extra passes may cause issues.</p></div></div>
  </div>
</div>

<div class="deep-section">
  <p class="section-label">07 · Complexity — the full explanation</p>
  <h2 class="section-title">Why O(n) time and O(h) space?</h2>
  <div class="complexity-grid" style="margin-bottom:1rem;">
    <div class="complexity-card" style="background:#E6F1FB;"><div class="complexity-label" style="color:#185FA5;">Time</div><div class="complexity-value" style="color:#0C447C;">O(n)</div><div class="complexity-why" style="color:#185FA5;">The three passes together visit every node at most once. Left boundary visits at most O(h) nodes, leaves visits all n nodes across the tree, right boundary visits at most O(h) nodes. Total: O(n).</div></div>
    <div class="complexity-card" style="background:#EEEDFE;"><div class="complexity-label" style="color:#534AB7;">Space</div><div class="complexity-value" style="color:#3C3489;">O(h)</div><div class="complexity-why" style="color:#534AB7;">The call stack grows to depth h (tree height). O(log n) for a balanced tree, O(n) for a completely skewed one. Output array is O(n) but not usually counted as auxiliary space.</div></div>
  </div>
  <div class="callout callout-warn"><p><strong style="font-weight:500;">Interview tip:</strong> Distinguish auxiliary space (O(h) for recursion stack) from total space (O(n) including output). Interviewers often mean auxiliary space — clarify which one you're reporting.</p></div>
</div>

<div class="deep-section" style="margin-bottom:0;">
  <p class="section-label">08 · Related problems</p>
  <h2 class="section-title">Where this pattern shows up</h2>
  <div class="card" style="padding:0.75rem 1.5rem;">
    <div class="interview-item"><div class="interview-dot"></div><div><p style="font-size:14px;font-weight:500;color:var(--color-text-primary);margin:0 0 3px;">Binary Tree Right Side View (LeetCode 199)</p><p style="font-size:13px;color:var(--color-text-secondary);margin:0;line-height:1.6;">Only collects the rightmost node at each level — a simplified version of the right boundary concept. Good warm-up before attempting #545.</p></div></div>
    <div class="interview-item"><div class="interview-dot"></div><div><p style="font-size:14px;font-weight:500;color:var(--color-text-primary);margin:0 0 3px;">Binary Tree Leaves (LeetCode 366)</p><p style="font-size:13px;color:var(--color-text-secondary);margin:0;line-height:1.6;">Repeatedly collects and removes all leaf nodes. The leaf-collection logic here is the same in-order DFS used in the leaves phase of #545.</p></div></div>
    <div class="interview-item"><div class="interview-dot"></div><div><p style="font-size:14px;font-weight:500;color:var(--color-text-primary);margin:0 0 3px;">Binary Tree Zigzag Level Order Traversal (LeetCode 103)</p><p style="font-size:13px;color:var(--color-text-secondary);margin:0;line-height:1.6;">Alternates direction of appending per level — the same idea as reversing the right boundary by appending post-order instead of pre-order.</p></div></div>
    <div class="interview-item" style="border:none;"><div class="interview-dot"></div><div><p style="font-size:14px;font-weight:500;color:var(--color-text-primary);margin:0 0 3px;">Vertical Order Traversal (LeetCode 987)</p><p style="font-size:13px;color:var(--color-text-secondary);margin:0;line-height:1.6;">Requires tracking node positions (column, row) and grouping them — a harder spatial traversal problem that builds on the same DFS-with-extra-state pattern.</p></div></div>
  </div>
</div>
`;

export default function BoundaryOfBinaryTreeGuidePage() {
  const [mode, setMode] = useState<"quick" | "deep">("quick");

  return (
    <section className="relative min-h-0 overflow-hidden bg-gradient-to-br from-slate-50 via-slate-50 to-emerald-50/20">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,#e0f2fe_0%,transparent_48%),radial-gradient(ellipse_at_bottom_left,#e2f6ef_0%,transparent_52%)]" />
      <div className="boundary-readhere-wrapper relative z-[1]">
      <style jsx global>{`
        .boundary-readhere-wrapper, .boundary-readhere-wrapper * { box-sizing: border-box; margin: 0; padding: 0; }
        .boundary-readhere-wrapper {
          --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          --font-mono: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
          --color-text-primary: #1a1a2e;
          --color-text-secondary: #4a4a6a;
          --color-text-tertiary: #7a7a9a;
          --color-background-primary: #ffffff;
          --color-background-secondary: #f5f5fa;
          --color-border-tertiary: #e0e0ee;
          --border-radius-lg: 12px;
          --border-radius-md: 8px;
          background: transparent;
          font-family: var(--font-sans);
          color: var(--color-text-primary);
        }
        .boundary-readhere-wrapper .page { max-width: 860px; margin: 0 auto; padding: 2rem 1.5rem; }
        .boundary-readhere-wrapper .badge { display: inline-block; font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 20px; }
        .boundary-readhere-wrapper .badge-teal { background: #E1F5EE; color: #0F6E56; }
        .boundary-readhere-wrapper .badge-amber { background: #FAEEDA; color: #854F0B; }
        .boundary-readhere-wrapper .badge-purple { background: #EEEDFE; color: #3C3489; }
        .boundary-readhere-wrapper .section { margin-bottom: 2.5rem; }
        .boundary-readhere-wrapper .section-label { font-size: 11px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-tertiary); margin-bottom: 0.5rem; }
        .boundary-readhere-wrapper .section-title { font-size: 18px; font-weight: 500; color: var(--color-text-primary); margin: 0 0 1rem; }
        .boundary-readhere-wrapper .card { background: var(--color-background-primary); border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); padding: 1.25rem 1.5rem; }
        .boundary-readhere-wrapper .rule-box { background: #E6F1FB; padding: 1rem 1.25rem; border-left: 3px solid #378ADD; }
        .boundary-readhere-wrapper .rule-text { font-size: 18px; font-weight: 500; color: #0C447C; line-height: 1.6; }
        .boundary-readhere-wrapper .step-row { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 0.85rem; }
        .boundary-readhere-wrapper .step-num { width: 26px; height: 26px; border-radius: 50%; background: #E6F1FB; color: #185FA5; font-size: 13px; font-weight: 500; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .boundary-readhere-wrapper .step-text { font-size: 15px; color: var(--color-text-primary); line-height: 1.6; padding-top: 3px; }
        .boundary-readhere-wrapper .step-sub { font-size: 13px; color: var(--color-text-secondary); margin-top: 2px; }
        .boundary-readhere-wrapper .code-block { background: #1e1e2e; border-radius: var(--border-radius-md); padding: 1.25rem 1.5rem; font-family: var(--font-mono); font-size: 13.5px; line-height: 2; overflow-x: auto; }
        .boundary-readhere-wrapper .c-kw { color: #cba6f7; }
        .boundary-readhere-wrapper .c-fn { color: #89b4fa; }
        .boundary-readhere-wrapper .c-cm { color: #6c7086; font-style: italic; }
        .boundary-readhere-wrapper .c-plain { color: #cdd6f4; }
        .boundary-readhere-wrapper .dry-run-row { display: flex; border-bottom: 0.5px solid var(--color-border-tertiary); }
        .boundary-readhere-wrapper .dry-cell { padding: 10px 14px; font-size: 13.5px; color: var(--color-text-primary); line-height: 1.5; flex: 1; }
        .boundary-readhere-wrapper .dry-head { font-size: 12px; font-weight: 500; color: var(--color-text-secondary); padding: 8px 14px; background: var(--color-background-secondary); border-bottom: 0.5px solid var(--color-border-tertiary); display: flex; }
        .boundary-readhere-wrapper .highlight-row { background: var(--color-background-secondary); }
        .boundary-readhere-wrapper .complexity-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .boundary-readhere-wrapper .complexity-card { border-radius: var(--border-radius-md); padding: 1rem 1.25rem; }
        .boundary-readhere-wrapper .complexity-label { font-size: 11px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px; }
        .boundary-readhere-wrapper .complexity-value { font-size: 28px; font-weight: 500; font-family: var(--font-mono); }
        .boundary-readhere-wrapper .complexity-why { font-size: 13px; margin-top: 6px; }
        .boundary-readhere-wrapper .interview-item { display: flex; gap: 10px; padding: 10px 0; border-bottom: 0.5px solid var(--color-border-tertiary); }
        .boundary-readhere-wrapper .interview-dot { width: 8px; height: 8px; border-radius: 50%; background: #378ADD; flex-shrink: 0; margin-top: 7px; }
        .boundary-readhere-wrapper .hero-title { font-size: 28px; font-weight: 500; color: var(--color-text-primary); margin: 0 0 6px; }
        .boundary-readhere-wrapper .hero-sub { font-size: 15px; color: var(--color-text-secondary); margin: 0 0 1.5rem; }
        .boundary-readhere-wrapper .hero-tags { display: flex; gap: 8px; flex-wrap: wrap; }
        .boundary-readhere-wrapper .divider { border: none; border-top: 0.5px solid var(--color-border-tertiary); margin: 2rem 0; }
        .boundary-readhere-wrapper .analogy-box { background: #FAEEDA; border-radius: var(--border-radius-md); padding: 1rem 1.25rem; }
        .boundary-readhere-wrapper .analogy-text { font-size: 15px; color: #633806; line-height: 1.7; margin: 0; }
        .boundary-readhere-wrapper .mode-toggle { display: flex; background: var(--color-background-secondary); border-radius: 10px; padding: 4px; gap: 4px; width: fit-content; margin-bottom: 2rem; border: 0.5px solid var(--color-border-tertiary); }
        .boundary-readhere-wrapper .mode-btn { padding: 7px 20px; border-radius: 8px; border: none; background: transparent; font-size: 13px; font-weight: 500; color: var(--color-text-secondary); cursor: pointer; transition: all 0.18s ease; }
        .boundary-readhere-wrapper .mode-btn.active { background: var(--color-background-primary); color: var(--color-text-primary); border: 0.5px solid var(--color-border-tertiary); }
        .boundary-readhere-wrapper .mode-desc { font-size: 12px; color: var(--color-text-tertiary); margin-bottom: 2rem; }
        .boundary-readhere-wrapper .deep-section { margin-bottom: 3rem; }
        .boundary-readhere-wrapper .callout { border-radius: var(--border-radius-md); padding: 1rem 1.25rem; margin: 1rem 0; }
        .boundary-readhere-wrapper .callout-info { background: #E6F1FB; border-left: 3px solid #378ADD; border-radius: 0; }
        .boundary-readhere-wrapper .callout-info p { color: #0C447C; font-size: 14px; line-height: 1.7; margin: 0; }
        .boundary-readhere-wrapper .callout-warn { background: #FAEEDA; border-left: 3px solid #EF9F27; border-radius: 0; }
        .boundary-readhere-wrapper .callout-warn p { color: #633806; font-size: 14px; line-height: 1.7; margin: 0; }
        .boundary-readhere-wrapper .deep-para { font-size: 15px; color: var(--color-text-primary); line-height: 1.8; margin: 0 0 1rem; }
        .boundary-readhere-wrapper .qa-block { border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); overflow: hidden; margin-bottom: 12px; }
        .boundary-readhere-wrapper .qa-q { background: var(--color-background-secondary); padding: 0.9rem 1.25rem; font-size: 14px; font-weight: 500; color: var(--color-text-primary); }
        .boundary-readhere-wrapper .qa-a { padding: 0.9rem 1.25rem; font-size: 14px; color: var(--color-text-primary); line-height: 1.7; border-top: 0.5px solid var(--color-border-tertiary); }
        .boundary-readhere-wrapper .trace-step { display: flex; gap: 14px; margin-bottom: 1.25rem; align-items: flex-start; }
        .boundary-readhere-wrapper .trace-badge { min-width: 80px; font-size: 11px; font-weight: 500; padding: 4px 10px; border-radius: 20px; text-align: center; }
        .boundary-readhere-wrapper .trace-going { background: #E6F1FB; color: #185FA5; }
        .boundary-readhere-wrapper .trace-record { background: #E1F5EE; color: #0F6E56; }
        .boundary-readhere-wrapper .trace-skip { background: #EEEDFE; color: #534AB7; }
        .boundary-readhere-wrapper .trace-back { background: #FAEEDA; color: #854F0B; }
        .boundary-readhere-wrapper .trace-leaf { background: #E1F5EE; color: #0F6E56; }
        .boundary-readhere-wrapper .trace-title { font-size: 14px; font-weight: 500; color: var(--color-text-primary); margin: 0 0 3px; }
        .boundary-readhere-wrapper .trace-desc { font-size: 13px; color: var(--color-text-secondary); line-height: 1.6; margin: 0; }
        .boundary-readhere-wrapper .mistake-row { display: flex; gap: 12px; padding: 12px 0; border-bottom: 0.5px solid var(--color-border-tertiary); align-items: flex-start; }
        .boundary-readhere-wrapper .mistake-x { width: 20px; height: 20px; border-radius: 50%; background: #FCEBEB; color: #A32D2D; font-size: 12px; font-weight: 500; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
        .boundary-readhere-wrapper code { font-size: 12.5px; background: var(--color-background-secondary); padding: 2px 5px; border-radius: 4px; font-family: var(--font-mono); }
        .boundary-readhere-wrapper .legend-row { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 1rem; }
        .boundary-readhere-wrapper .legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--color-text-secondary); }
        .boundary-readhere-wrapper .legend-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
      `}</style>

      <div className="page">
        <div className="section">
          <div className="flex items-center justify-between mb-3" style={{ marginBottom: "12px" }}>
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-emerald-500" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-600">Binary Tree · DFS</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/problems/binary-tree/boundary-of-binary-tree"
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
          <p className="section-label">Binary Tree · DFS · BFS</p>
          <h1 className="hero-title">Boundary of Binary Tree</h1>
          <p className="hero-sub">Return the boundary nodes of a binary tree in anti-clockwise order: left boundary → leaves → right boundary (reversed).</p>
          <div className="hero-tags" style={{ marginBottom: "1.5rem" }}>
            <span className="badge badge-teal">DFS · Recursion</span>
            <span className="badge badge-purple">3-Pass Traversal</span>
            <span className="badge badge-amber">LeetCode #545 · Medium</span>
          </div>
          <div className="mode-toggle">
            <button className={`mode-btn ${mode === "quick" ? "active" : ""}`} onClick={() => setMode("quick")}>Quick Recap</button>
            <button className={`mode-btn ${mode === "deep" ? "active" : ""}`} onClick={() => setMode("deep")}>Deep Explain</button>
          </div>
          <p className="mode-desc">{mode === "quick" ? "Key concepts at a glance — for those who already know the basics." : "A full beginner-friendly walkthrough — understand it from scratch."}</p>
        </div>

        {mode === "quick" ? (
          <div dangerouslySetInnerHTML={{ __html: QUICK_MODE_HTML }} />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: DEEP_MODE_HTML }} />
        )}

        <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 3px" }}>Practice on LeetCode</p>
            <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", margin: 0 }}>Try #199 (Right Side View) first — simpler boundary concept to build intuition.</p>
          </div>
          <a href="https://leetcode.com/problems/boundary-of-binary-tree/" target="_blank" rel="noreferrer" style={{ fontSize: "13px", padding: "8px 18px", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-primary)", cursor: "pointer", fontFamily: "var(--font-sans)", color: "inherit", textDecoration: "none" }}>Open on LeetCode ↗</a>
        </div>
      </div>
      </div>
    </section>
  );
}

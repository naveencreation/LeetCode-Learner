"use client";

import { useState } from "react";
import Link from "next/link";

const QUICK_MODE_HTML = String.raw`
<hr class="divider" style="margin-top:0;">

<div class="section">
  <p class="section-label">01 · The rule</p>
  <div class="rule-box" style="margin-bottom:0.75rem;">
    <p class="rule-text">A tree is symmetric if its left and right subtrees are mirrors of each other</p>
  </div>
  <p style="font-size:14px;color:var(--color-text-secondary);margin:0;">
    Two subtrees are mirrors when: their roots have equal values, the left child of one equals the right child of the other, and vice versa - checked recursively all the way down.
  </p>
</div>

<div class="section">
  <p class="section-label">02 · How to think</p>
  <div class="card">
    <div class="step-row">
      <div class="step-num">1</div>
      <div>
        <div class="step-text">Start with the root's two children</div>
        <div class="step-sub">Call a helper <code>isMirror(left, right)</code> with <code>root.left</code> and <code>root.right</code>.</div>
      </div>
    </div>
    <div class="step-row">
      <div class="step-num">2</div>
      <div>
        <div class="step-text">Check the base cases first</div>
        <div class="step-sub">Both <code>None</code> -> symmetric. One <code>None</code>, one not -> asymmetric. Both exist -> compare values.</div>
      </div>
    </div>
    <div class="step-row">
      <div class="step-num">3</div>
      <div>
        <div class="step-text">Recurse with the outer and inner pairs</div>
        <div class="step-sub">Outer: <code>left.left</code> vs <code>right.right</code>. Inner: <code>left.right</code> vs <code>right.left</code>. Both must pass.</div>
      </div>
    </div>
    <div class="step-row" style="margin-bottom:0;">
      <div class="step-num">4</div>
      <div>
        <div class="step-text">Return True only when values match AND both recursive calls pass</div>
        <div class="step-sub">Any mismatch anywhere in the subtree short-circuits the whole check to False.</div>
      </div>
    </div>
  </div>
</div>

<div class="section">
  <p class="section-label">03 · Code (Python)</p>
  <div class="code-block">
    <div><span class="c-kw">def</span> <span class="c-fn">isSymmetric</span><span class="c-plain">(root) -&gt; bool:</span></div>
    <div>&nbsp;</div>
    <div><span class="c-plain">    </span><span class="c-kw">def</span> <span class="c-fn">isMirror</span><span class="c-plain">(left, right) -&gt; bool:</span></div>
    <div><span class="c-plain">        </span><span class="c-kw">if not</span><span class="c-plain"> left </span><span class="c-kw">and not</span><span class="c-plain"> right:  </span><span class="c-cm"># both None -> symmetric</span></div>
    <div><span class="c-plain">            </span><span class="c-kw">return True</span></div>
    <div><span class="c-plain">        </span><span class="c-kw">if not</span><span class="c-plain"> left </span><span class="c-kw">or not</span><span class="c-plain"> right:   </span><span class="c-cm"># one None -> not symmetric</span></div>
    <div><span class="c-plain">            </span><span class="c-kw">return False</span></div>
    <div>&nbsp;</div>
    <div><span class="c-plain">        </span><span class="c-kw">return</span><span class="c-plain"> (</span></div>
    <div><span class="c-plain">            left.val == right.val          </span><span class="c-cm"># values match</span></div>
    <div><span class="c-plain">            </span><span class="c-kw">and</span><span class="c-plain"> </span><span class="c-fn">isMirror</span><span class="c-plain">(left.left,  right.right)  </span><span class="c-cm"># outer pair</span></div>
    <div><span class="c-plain">            </span><span class="c-kw">and</span><span class="c-plain"> </span><span class="c-fn">isMirror</span><span class="c-plain">(left.right, right.left)   </span><span class="c-cm"># inner pair</span></div>
    <div><span class="c-plain">        )</span></div>
    <div>&nbsp;</div>
    <div><span class="c-plain">    </span><span class="c-kw">return</span><span class="c-plain"> </span><span class="c-fn">isMirror</span><span class="c-plain">(root.left, root.right)</span></div>
  </div>
</div>

<div class="section">
  <p class="section-label">04 · Example tree &amp; mirror check</p>

  <div style="display:flex;justify-content:center;margin-bottom:1rem;">
    <svg viewBox="0 0 540 340" width="520" height="330" xmlns="http://www.w3.org/2000/svg" font-family="monospace">
      <line x1="270" y1="30" x2="270" y2="310" stroke="#e0e0ee" stroke-width="1.5" stroke-dasharray="6,4"/>
      <text x="270" y="22" text-anchor="middle" font-size="10" fill="#8888a8" font-weight="500">mirror axis</text>

      <line x1="270" y1="82" x2="160" y2="154" stroke="#B5D4F4" stroke-width="2"/>
      <line x1="270" y1="82" x2="380" y2="154" stroke="#B5D4F4" stroke-width="2"/>
      <line x1="160" y1="154" x2="100" y2="236" stroke="#B5D4F4" stroke-width="2"/>
      <line x1="160" y1="154" x2="220" y2="236" stroke="#B5D4F4" stroke-width="2"/>
      <line x1="380" y1="154" x2="320" y2="236" stroke="#B5D4F4" stroke-width="2"/>
      <line x1="380" y1="154" x2="440" y2="236" stroke="#B5D4F4" stroke-width="2"/>

      <path d="M 100,258 Q 270,290 440,258" fill="none" stroke="#1D9E75" stroke-width="1.4" stroke-dasharray="5,3"/>
      <text x="270" y="305" text-anchor="middle" font-size="10" fill="#1D9E75">outer pair</text>

      <path d="M 220,258 Q 270,278 320,258" fill="none" stroke="#EF9F27" stroke-width="1.4" stroke-dasharray="5,3"/>
      <text x="270" y="276" text-anchor="middle" font-size="10" fill="#EF9F27">inner pair</text>

      <circle cx="270" cy="62" r="22" fill="#E6F1FB" stroke="#378ADD" stroke-width="1.8"/>
      <text x="270" y="67" text-anchor="middle" font-size="15" font-weight="600" fill="#0C447C">1</text>

      <circle cx="160" cy="136" r="22" fill="#FAEEDA" stroke="#EF9F27" stroke-width="1.8"/>
      <text x="160" y="141" text-anchor="middle" font-size="15" font-weight="600" fill="#633806">2</text>

      <circle cx="380" cy="136" r="22" fill="#FAEEDA" stroke="#EF9F27" stroke-width="1.8"/>
      <text x="380" y="141" text-anchor="middle" font-size="15" font-weight="600" fill="#633806">2</text>

      <circle cx="100" cy="218" r="22" fill="#E1F5EE" stroke="#1D9E75" stroke-width="1.8"/>
      <text x="100" y="223" text-anchor="middle" font-size="15" font-weight="600" fill="#085041">3</text>

      <circle cx="220" cy="218" r="22" fill="#EEEDFE" stroke="#8B87E3" stroke-width="1.8"/>
      <text x="220" y="223" text-anchor="middle" font-size="15" font-weight="600" fill="#3C3489">4</text>

      <circle cx="320" cy="218" r="22" fill="#EEEDFE" stroke="#8B87E3" stroke-width="1.8"/>
      <text x="320" y="223" text-anchor="middle" font-size="15" font-weight="600" fill="#3C3489">4</text>

      <circle cx="440" cy="218" r="22" fill="#E1F5EE" stroke="#1D9E75" stroke-width="1.8"/>
      <text x="440" y="223" text-anchor="middle" font-size="15" font-weight="600" fill="#085041">3</text>

      <rect x="145" y="318" width="250" height="18" rx="5" fill="#1e1e2e"/>
      <text x="270" y="331" text-anchor="middle" font-size="11" fill="#a6e3a1" font-family="monospace">Output: True (symmetric)</text>
    </svg>
  </div>

  <div class="card" style="padding:0;">
    <div style="display:grid;grid-template-columns:140px 140px 140px 1fr;">
      <div class="dry-head">Call</div>
      <div class="dry-head">left</div>
      <div class="dry-head">right</div>
      <div class="dry-head">Result</div>
    </div>
    <div class="dry-run-row">
      <div class="dry-cell-plain">isMirror(2, 2)</div>
      <div class="dry-cell">node(2)</div>
      <div class="dry-cell">node(2)</div>
      <div class="dry-cell-plain">2==2, recurse</div>
    </div>
    <div class="dry-run-row highlight-row">
      <div class="dry-cell-plain">isMirror(3, 3)</div>
      <div class="dry-cell">node(3)</div>
      <div class="dry-cell">node(3)</div>
      <div class="dry-cell-plain">3==3, both children None => <strong>True</strong></div>
    </div>
    <div class="dry-run-row">
      <div class="dry-cell-plain">isMirror(4, 4)</div>
      <div class="dry-cell">node(4)</div>
      <div class="dry-cell">node(4)</div>
      <div class="dry-cell-plain">4==4, both children None => <strong>True</strong></div>
    </div>
    <div class="dry-run-row highlight-row">
      <div class="dry-cell-plain">Final</div>
      <div class="dry-cell">-</div>
      <div class="dry-cell">-</div>
      <div class="dry-cell-plain"><strong>True</strong> - tree is symmetric</div>
    </div>
  </div>
</div>

<div class="section" style="margin-bottom:0;">
  <p class="section-label">05 · Complexity</p>
  <div class="complexity-grid">
    <div class="complexity-card" style="background:#E6F1FB;">
      <div class="complexity-label" style="color:#185FA5;">Time</div>
      <div class="complexity-value" style="color:#0C447C;">O(n)</div>
      <div class="complexity-why" style="color:#185FA5;">Every node is visited exactly once in mirror comparisons.</div>
    </div>
    <div class="complexity-card" style="background:#EEEDFE;">
      <div class="complexity-label" style="color:#534AB7;">Space</div>
      <div class="complexity-value" style="color:#3C3489;">O(h)</div>
      <div class="complexity-why" style="color:#534AB7;">Call stack depth equals tree height h.</div>
    </div>
  </div>
</div>
`;

const DEEP_MODE_HTML = String.raw`
<hr class="divider" style="margin-top:0;">

<div class="deep-section">
  <p class="section-label">01 · What does "symmetric" mean for a tree?</p>
  <h2 class="section-title">The concept from scratch</h2>
  <p class="deep-para">A binary tree is symmetric if it looks the same when you fold it along a vertical axis through the root. This means: the left subtree of the root is a mirror image of the right subtree. Not just their values - the entire shape and structure must be mirrored too.</p>
  <div class="callout callout-info">
    <p>Key insight: symmetry is <strong>not</strong> about any single node's children - it's a structural relationship between two separate subtrees. You always compare two nodes at a time: one from the left branch and its corresponding mirror node from the right branch.</p>
  </div>
  <p class="deep-para">Two subtrees are mirrors of each other when: their root values are equal, the left child of the left subtree mirrors the right child of the right subtree (outer pair), and the right child of the left subtree mirrors the left child of the right subtree (inner pair). This definition is naturally recursive.</p>
</div>

<div class="deep-section">
  <p class="section-label">02 · Counter-example - what breaks symmetry</p>
  <h2 class="section-title">Spotting an asymmetric tree</h2>
  <p class="deep-para">The tree below has the same values at every level but its structure is not mirrored - the extra child appears on the same side both times, breaking symmetry.</p>

  <div style="display:flex;justify-content:center;margin-bottom:1rem;">
    <svg viewBox="0 0 480 280" width="460" height="270" xmlns="http://www.w3.org/2000/svg" font-family="monospace">
      <line x1="240" y1="30" x2="240" y2="260" stroke="#e0e0ee" stroke-width="1.5" stroke-dasharray="6,4"/>
      <text x="240" y="22" text-anchor="middle" font-size="10" fill="#8888a8">mirror axis</text>

      <line x1="240" y1="82" x2="140" y2="154" stroke="#B5D4F4" stroke-width="2"/>
      <line x1="240" y1="82" x2="340" y2="154" stroke="#B5D4F4" stroke-width="2"/>
      <line x1="140" y1="154" x2="190" y2="226" stroke="#B5D4F4" stroke-width="2"/>
      <line x1="340" y1="154" x2="390" y2="226" stroke="#B5D4F4" stroke-width="2"/>

      <circle cx="240" cy="62" r="22" fill="#E6F1FB" stroke="#378ADD" stroke-width="1.8"/>
      <text x="240" y="67" text-anchor="middle" font-size="15" font-weight="600" fill="#0C447C">1</text>

      <circle cx="140" cy="136" r="22" fill="#FAEEDA" stroke="#EF9F27" stroke-width="1.8"/>
      <text x="140" y="141" text-anchor="middle" font-size="15" font-weight="600" fill="#633806">2</text>

      <circle cx="340" cy="136" r="22" fill="#FAEEDA" stroke="#EF9F27" stroke-width="1.8"/>
      <text x="340" y="141" text-anchor="middle" font-size="15" font-weight="600" fill="#633806">2</text>

      <circle cx="190" cy="208" r="22" fill="#EEEDFE" stroke="#8B87E3" stroke-width="1.8"/>
      <text x="190" y="213" text-anchor="middle" font-size="15" font-weight="600" fill="#3C3489">3</text>

      <circle cx="390" cy="208" r="22" fill="#FDECEA" stroke="#D95C5C" stroke-width="2"/>
      <text x="390" y="213" text-anchor="middle" font-size="15" font-weight="600" fill="#9B1B1B">3</text>

      <text x="240" y="218" text-anchor="middle" font-size="26" fill="#D95C5C" font-weight="700">x</text>
      <text x="240" y="240" text-anchor="middle" font-size="10" fill="#9B1B1B">inner pair mismatch</text>
      <text x="240" y="254" text-anchor="middle" font-size="10" fill="#9B1B1B">(left.right=3, right.left=None)</text>

      <rect x="120" y="262" width="240" height="18" rx="5" fill="#1e1e2e"/>
      <text x="240" y="275" text-anchor="middle" font-size="11" fill="#f38ba8" font-family="monospace">Output: False (not symmetric)</text>
    </svg>
  </div>

  <div class="callout callout-warn">
    <p>The asymmetry is caught when <code>isMirror(left.right, right.left)</code> is called - <code>left.right</code> is node(3) but <code>right.left</code> is <code>None</code>. One is null and the other isn't, so the call returns <code>False</code> immediately.</p>
  </div>
</div>

<div class="deep-section">
  <p class="section-label">03 · Outer pair vs Inner pair</p>
  <h2 class="section-title">Understanding which children to compare</h2>
  <p class="deep-para">This is the most confusing part for beginners. When you compare two mirror nodes L and R, you don't compare L's left with R's left - you cross the axis. Here's the rule visualised:</p>

  <div style="display:flex;justify-content:center;margin-bottom:1rem;">
    <svg viewBox="0 0 500 200" width="480" height="195" xmlns="http://www.w3.org/2000/svg" font-family="monospace">
      <rect x="60" y="30" width="60" height="36" rx="8" fill="#FAEEDA" stroke="#EF9F27" stroke-width="1.5"/>
      <text x="90" y="53" text-anchor="middle" font-size="14" font-weight="600" fill="#633806">L</text>

      <rect x="380" y="30" width="60" height="36" rx="8" fill="#FAEEDA" stroke="#EF9F27" stroke-width="1.5"/>
      <text x="410" y="53" text-anchor="middle" font-size="14" font-weight="600" fill="#633806">R</text>

      <rect x="20" y="130" width="60" height="36" rx="8" fill="#E1F5EE" stroke="#1D9E75" stroke-width="1.5"/>
      <text x="50" y="153" text-anchor="middle" font-size="12" font-weight="600" fill="#085041">L.left</text>

      <rect x="100" y="130" width="60" height="36" rx="8" fill="#EEEDFE" stroke="#8B87E3" stroke-width="1.5"/>
      <text x="130" y="153" text-anchor="middle" font-size="12" font-weight="600" fill="#3C3489">L.right</text>

      <rect x="340" y="130" width="60" height="36" rx="8" fill="#EEEDFE" stroke="#8B87E3" stroke-width="1.5"/>
      <text x="370" y="153" text-anchor="middle" font-size="12" font-weight="600" fill="#3C3489">R.left</text>

      <rect x="420" y="130" width="60" height="36" rx="8" fill="#E1F5EE" stroke="#1D9E75" stroke-width="1.5"/>
      <text x="450" y="153" text-anchor="middle" font-size="12" font-weight="600" fill="#085041">R.right</text>

      <line x1="80" y1="66" x2="50" y2="130" stroke="#B5D4F4" stroke-width="1.5"/>
      <line x1="100" y1="66" x2="130" y2="130" stroke="#B5D4F4" stroke-width="1.5"/>
      <line x1="400" y1="66" x2="370" y2="130" stroke="#B5D4F4" stroke-width="1.5"/>
      <line x1="420" y1="66" x2="450" y2="130" stroke="#B5D4F4" stroke-width="1.5"/>

      <path d="M 50,168 Q 250,195 450,168" fill="none" stroke="#1D9E75" stroke-width="1.8" stroke-dasharray="5,3" marker-end="url(#arr-green2)"/>
      <defs>
        <marker id="arr-green2" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <polygon points="0 0, 7 3.5, 0 7" fill="#1D9E75"/>
        </marker>
        <marker id="arr-amber2" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <polygon points="0 0, 7 3.5, 0 7" fill="#EF9F27"/>
        </marker>
      </defs>
      <text x="250" y="195" text-anchor="middle" font-size="10" fill="#1D9E75" font-weight="500">OUTER pair - isMirror(L.left, R.right)</text>

      <path d="M 130,130 Q 250,105 370,130" fill="none" stroke="#EF9F27" stroke-width="1.8" stroke-dasharray="5,3" marker-end="url(#arr-amber2)"/>
      <text x="250" y="102" text-anchor="middle" font-size="10" fill="#854F0B" font-weight="500">INNER pair - isMirror(L.right, R.left)</text>

      <line x1="250" y1="20" x2="250" y2="175" stroke="#e0e0ee" stroke-width="1.5" stroke-dasharray="5,3"/>
      <text x="250" y="14" text-anchor="middle" font-size="9" fill="#8888a8">axis</text>
    </svg>
  </div>

  <div class="callout callout-success">
    <p><strong>Memory trick:</strong> Outer pair = both point away from the axis (far-left vs far-right). Inner pair = both point toward the axis (near-right vs near-left). Always cross the axis - never compare same-side children.</p>
  </div>
</div>

<div class="deep-section">
  <p class="section-label">04 · BFS / Iterative alternative</p>
  <h2 class="section-title">Solving it without recursion</h2>
  <p class="deep-para">You can solve this iteratively using a queue. Instead of pushing single nodes, push pairs of nodes that should be mirrors. Each iteration pops one pair and checks them.</p>
  <div class="code-block">
    <div><span class="c-kw">from</span><span class="c-plain"> collections </span><span class="c-kw">import</span><span class="c-plain"> deque</span></div>
    <div>&nbsp;</div>
    <div><span class="c-kw">def</span> <span class="c-fn">isSymmetric</span><span class="c-plain">(root) -&gt; bool:</span></div>
    <div><span class="c-plain">    queue = deque([(root.left, root.right)])  </span><span class="c-cm"># seed with the first pair</span></div>
    <div>&nbsp;</div>
    <div><span class="c-plain">    </span><span class="c-kw">while</span><span class="c-plain"> queue:</span></div>
    <div><span class="c-plain">        left, right = queue.popleft()</span></div>
    <div>&nbsp;</div>
    <div><span class="c-plain">        </span><span class="c-kw">if not</span><span class="c-plain"> left </span><span class="c-kw">and not</span><span class="c-plain"> right: </span><span class="c-kw">continue</span></div>
    <div><span class="c-plain">        </span><span class="c-kw">if not</span><span class="c-plain"> left </span><span class="c-kw">or not</span><span class="c-plain"> right: </span><span class="c-kw">return False</span>  <span class="c-cm"># one None -> fail</span></div>
    <div><span class="c-plain">        </span><span class="c-kw">if</span><span class="c-plain"> left.val != right.val: </span><span class="c-kw">return False</span></div>
    <div>&nbsp;</div>
    <div><span class="c-plain">        queue.append((left.left, right.right))  </span><span class="c-cm"># outer pair</span></div>
    <div><span class="c-plain">        queue.append((left.right, right.left))   </span><span class="c-cm"># inner pair</span></div>
    <div>&nbsp;</div>
    <div><span class="c-plain">    </span><span class="c-kw">return True</span></div>
  </div>
  <div class="callout callout-info" style="margin-top:1rem;">
    <p>The BFS version avoids recursion stack overflow on very deep trees. The logic is identical to the recursive version - you're just explicitly managing the stack of pairs to check using a deque instead of the call stack.</p>
  </div>
</div>

<div class="deep-section">
  <p class="section-label">05 · Real-world analogy</p>
  <h2 class="section-title">Think of a folded paper</h2>
  <div class="analogy-box" style="margin-bottom:1rem;">
    <p class="analogy-text">Imagine printing the tree on paper and folding it vertically down the middle through the root. A symmetric tree is one where every node on the left half lands exactly on top of a matching node on the right half - same value, same position relative to the fold. The <code>isMirror</code> function is simply checking, for each such pair of overlapping nodes, that their values agree and that their children will also overlap correctly when you unfold one level further.</p>
  </div>
</div>

<div class="deep-section">
  <p class="section-label">06 · Full recursive trace</p>
  <h2 class="section-title">Walking through [1, 2, 2, 3, 4, 4, 3]</h2>

  <div class="trace-step">
    <div class="trace-badge trace-going">Entry</div>
    <div class="trace-content">
      <p class="trace-title">isSymmetric(root=1) -> isMirror(node(2), node(2))</p>
      <p class="trace-desc">Root is valid. We hand both children off to isMirror and let recursion handle everything.</p>
    </div>
  </div>
  <div class="trace-step">
    <div class="trace-badge trace-record">Check</div>
    <div class="trace-content">
      <p class="trace-title">isMirror(L=node(2), R=node(2))</p>
      <p class="trace-desc">Neither is None. 2 == 2. Now recurse on the outer pair (3, 3) and inner pair (4, 4). Both must return True.</p>
    </div>
  </div>
  <div class="trace-step">
    <div class="trace-badge trace-flip">Outer</div>
    <div class="trace-content">
      <p class="trace-title">isMirror(L=node(3), R=node(3))</p>
      <p class="trace-desc">3 == 3. Both have no children (both left and right are None). isMirror(None, None) returns True twice. This call returns True.</p>
    </div>
  </div>
  <div class="trace-step">
    <div class="trace-badge trace-back">Inner</div>
    <div class="trace-content">
      <p class="trace-title">isMirror(L=node(4), R=node(4))</p>
      <p class="trace-desc">4 == 4. Both have no children. Returns True. All recursive calls complete successfully.</p>
    </div>
  </div>
  <div class="trace-step" style="margin-bottom:0;">
    <div class="trace-badge trace-record">Done</div>
    <div class="trace-content">
      <p class="trace-title">Result: True</p>
      <p class="trace-desc">All pairs matched and all None-check base cases passed. The tree is symmetric.</p>
    </div>
  </div>
</div>

<div class="deep-section">
  <p class="section-label">07 · Common mistakes</p>
  <h2 class="section-title">Errors to avoid in interviews</h2>
  <div class="card" style="padding:1rem 1.5rem;">
    <div class="mistake-row">
      <div class="mistake-x">x</div>
      <div>
        <p style="font-size:14px;font-weight:500;color:var(--color-text-primary);margin:0 0 3px;">Comparing same-side children</p>
        <p style="font-size:13px;color:var(--color-text-secondary);margin:0;line-height:1.6;">Calling <code>isMirror(left.left, right.left)</code> is wrong. You must cross the axis: outer pair is <code>left.left</code> vs <code>right.right</code>; inner pair is <code>left.right</code> vs <code>right.left</code>.</p>
      </div>
    </div>
    <div class="mistake-row">
      <div class="mistake-x">x</div>
      <div>
        <p style="font-size:14px;font-weight:500;color:var(--color-text-primary);margin:0 0 3px;">Calling isMirror(root, root)</p>
        <p style="font-size:13px;color:var(--color-text-secondary);margin:0;line-height:1.6;">Calling <code>isMirror(root, root)</code> will always return True for any tree - you end up comparing a node to its own copy. The correct seed is <code>isMirror(root.left, root.right)</code>.</p>
      </div>
    </div>
    <div class="mistake-row">
      <div class="mistake-x">x</div>
      <div>
        <p style="font-size:14px;font-weight:500;color:var(--color-text-primary);margin:0 0 3px;">Forgetting both-null base case</p>
        <p style="font-size:13px;color:var(--color-text-secondary);margin:0;line-height:1.6;">If both are <code>None</code>, that is a valid symmetric leaf - return <code>True</code>. Falling through to a value comparison will crash.</p>
      </div>
    </div>
    <div class="mistake-row" style="border:none;">
      <div class="mistake-x">x</div>
      <div>
        <p style="font-size:14px;font-weight:500;color:var(--color-text-primary);margin:0 0 3px;">Only checking values, not structure</p>
        <p style="font-size:13px;color:var(--color-text-secondary);margin:0;line-height:1.6;">A tree with mirrored values but different structure is not symmetric. The one-null check catches this.</p>
      </div>
    </div>
  </div>
</div>

<div class="deep-section">
  <p class="section-label">08 · Complexity</p>
  <h2 class="section-title">Why O(n) time and O(h) space?</h2>
  <div class="complexity-grid" style="margin-bottom:1rem;">
    <div class="complexity-card" style="background:#E6F1FB;">
      <div class="complexity-label" style="color:#185FA5;">Time</div>
      <div class="complexity-value" style="color:#0C447C;">O(n)</div>
      <div class="complexity-why" style="color:#185FA5;">Each node participates in exactly one isMirror call as part of one pair.</div>
    </div>
    <div class="complexity-card" style="background:#EEEDFE;">
      <div class="complexity-label" style="color:#534AB7;">Space</div>
      <div class="complexity-value" style="color:#3C3489;">O(h)</div>
      <div class="complexity-why" style="color:#534AB7;">The recursion stack depth equals the tree height h. For balanced trees h = O(log n); skewed trees h = O(n).</div>
    </div>
  </div>
</div>

<div class="deep-section">
  <p class="section-label">09 · Interview Q&amp;A</p>
  <h2 class="section-title">Questions you'll actually get asked</h2>

  <div class="qa-block">
    <div class="qa-q">Can you solve this without recursion?</div>
    <div class="qa-a">Yes - use an iterative BFS with a deque of pairs. Seed with <code>(root.left, root.right)</code>; compare each popped pair, then push outer and inner pairs.</div>
  </div>
  <div class="qa-block">
    <div class="qa-q">What if the tree has only one node?</div>
    <div class="qa-a">A single-node tree is symmetric by definition. <code>isMirror(None, None)</code> returns True immediately.</div>
  </div>
  <div class="qa-block">
    <div class="qa-q">How is this different from Same Tree?</div>
    <div class="qa-a">Same Tree compares same-side children. Symmetry crosses the axis: <code>left.left</code> with <code>right.right</code>, and <code>left.right</code> with <code>right.left</code>.</div>
  </div>
</div>

<div class="deep-section">
  <p class="section-label">10 · Interview context</p>
  <h2 class="section-title">Where you'll see this pattern again</h2>
  <div class="card" style="padding:0.75rem 1.5rem;">
    <div class="interview-item">
      <div class="interview-dot"></div>
      <div>
        <p style="font-size:14px;font-weight:500;color:var(--color-text-primary);margin:0 0 3px;">Same Tree (LC 100)</p>
        <p style="font-size:13px;color:var(--color-text-secondary);margin:0;line-height:1.6;">Nearly identical recursive structure - compare same-side children instead of crossing the axis.</p>
      </div>
    </div>
    <div class="interview-item">
      <div class="interview-dot"></div>
      <div>
        <p style="font-size:14px;font-weight:500;color:var(--color-text-primary);margin:0 0 3px;">Invert Binary Tree (LC 226)</p>
        <p style="font-size:13px;color:var(--color-text-secondary);margin:0;line-height:1.6;">Producing the mirror image instead of checking for it.</p>
      </div>
    </div>
    <div class="interview-item" style="border:none;">
      <div class="interview-dot"></div>
      <div>
        <p style="font-size:14px;font-weight:500;color:var(--color-text-primary);margin:0 0 3px;">Subtree of Another Tree (LC 572)</p>
        <p style="font-size:13px;color:var(--color-text-secondary);margin:0;line-height:1.6;">Uses the same recursive equality-check helper style as a subroutine.</p>
      </div>
    </div>
  </div>
</div>
`;

export default function SymmetricTreeGuidePage() {
  const [mode, setMode] = useState<"quick" | "deep">("quick");

  return (
    <div className="symmetric-readhere-wrapper">
      <style jsx global>{`
        .symmetric-readhere-wrapper {
          --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          --font-mono: "SF Mono", "Fira Code", "Consolas", monospace;
          --color-text-primary: #1a1a2e;
          --color-text-secondary: #4a4a6a;
          --color-text-tertiary: #8888a8;
          --color-background-primary: #ffffff;
          --color-background-secondary: #f5f5fa;
          --color-border-tertiary: #e0e0ee;
          --border-radius-lg: 12px;
          --border-radius-md: 8px;
          min-height: 100%;
          background: var(--color-background-secondary);
          font-family: var(--font-sans);
        }
        .symmetric-readhere-wrapper * { box-sizing: border-box; margin: 0; padding: 0; }
        .symmetric-readhere-wrapper .page { max-width: 860px; margin: 0 auto; padding: 2rem 1.5rem; }
        .symmetric-readhere-wrapper .badge { display: inline-block; font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 20px; }
        .symmetric-readhere-wrapper .badge-teal { background: #E1F5EE; color: #0F6E56; }
        .symmetric-readhere-wrapper .badge-amber { background: #FAEEDA; color: #854F0B; }
        .symmetric-readhere-wrapper .badge-purple { background: #EEEDFE; color: #3C3489; }
        .symmetric-readhere-wrapper .badge-rose { background: #FDECEA; color: #9B1B1B; }
        .symmetric-readhere-wrapper .section { margin-bottom: 2.5rem; }
        .symmetric-readhere-wrapper .section-label { font-size: 11px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-tertiary); margin-bottom: 0.5rem; }
        .symmetric-readhere-wrapper .section-title { font-size: 18px; font-weight: 500; color: var(--color-text-primary); margin: 0 0 1rem; }
        .symmetric-readhere-wrapper .card { background: var(--color-background-primary); border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); padding: 1.25rem 1.5rem; }
        .symmetric-readhere-wrapper .rule-box { background: #E6F1FB; padding: 1rem 1.25rem; border-left: 3px solid #378ADD; }
        .symmetric-readhere-wrapper .rule-text { font-size: 20px; font-weight: 500; color: #0C447C; }
        .symmetric-readhere-wrapper .step-row { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 0.85rem; }
        .symmetric-readhere-wrapper .step-num { width: 26px; height: 26px; border-radius: 50%; background: #E6F1FB; color: #185FA5; font-size: 13px; font-weight: 500; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .symmetric-readhere-wrapper .step-text { font-size: 15px; color: var(--color-text-primary); line-height: 1.6; padding-top: 3px; }
        .symmetric-readhere-wrapper .step-sub { font-size: 13px; color: var(--color-text-secondary); margin-top: 2px; }
        .symmetric-readhere-wrapper .code-block { background: #1e1e2e; border-radius: var(--border-radius-md); padding: 1.25rem 1.5rem; font-family: var(--font-mono); font-size: 13.5px; line-height: 2; overflow-x: auto; }
        .symmetric-readhere-wrapper .c-kw { color: #cba6f7; }
        .symmetric-readhere-wrapper .c-fn { color: #89b4fa; }
        .symmetric-readhere-wrapper .c-cm { color: #6c7086; font-style: italic; }
        .symmetric-readhere-wrapper .c-plain { color: #cdd6f4; }
        .symmetric-readhere-wrapper .dry-run-row { display: flex; border-bottom: 0.5px solid var(--color-border-tertiary); }
        .symmetric-readhere-wrapper .dry-run-row:last-child { border-bottom: none; }
        .symmetric-readhere-wrapper .dry-cell, .symmetric-readhere-wrapper .dry-cell-plain { padding: 10px 14px; font-size: 13.5px; color: var(--color-text-primary); line-height: 1.5; }
        .symmetric-readhere-wrapper .dry-cell { font-family: var(--font-mono); }
        .symmetric-readhere-wrapper .dry-head { font-size: 12px; font-weight: 500; color: var(--color-text-secondary); padding: 8px 14px; background: var(--color-background-secondary); border-bottom: 0.5px solid var(--color-border-tertiary); }
        .symmetric-readhere-wrapper .highlight-row { background: var(--color-background-secondary); }
        .symmetric-readhere-wrapper .complexity-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .symmetric-readhere-wrapper .complexity-card { border-radius: var(--border-radius-md); padding: 1rem 1.25rem; }
        .symmetric-readhere-wrapper .complexity-label { font-size: 11px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px; }
        .symmetric-readhere-wrapper .complexity-value { font-size: 28px; font-weight: 500; font-family: var(--font-mono); }
        .symmetric-readhere-wrapper .complexity-why { font-size: 13px; margin-top: 6px; }
        .symmetric-readhere-wrapper .interview-item { display: flex; gap: 10px; padding: 10px 0; border-bottom: 0.5px solid var(--color-border-tertiary); }
        .symmetric-readhere-wrapper .interview-item:last-child { border-bottom: none; }
        .symmetric-readhere-wrapper .interview-dot { width: 8px; height: 8px; border-radius: 50%; background: #378ADD; flex-shrink: 0; margin-top: 7px; }
        .symmetric-readhere-wrapper .hero-title { font-size: 28px; font-weight: 500; color: var(--color-text-primary); margin: 0 0 6px; }
        .symmetric-readhere-wrapper .hero-sub { font-size: 15px; color: var(--color-text-secondary); margin: 0 0 1.5rem; }
        .symmetric-readhere-wrapper .hero-tags { display: flex; gap: 8px; flex-wrap: wrap; }
        .symmetric-readhere-wrapper .divider { border: none; border-top: 0.5px solid var(--color-border-tertiary); margin: 2rem 0; }
        .symmetric-readhere-wrapper .analogy-box { background: #FAEEDA; border-radius: var(--border-radius-md); padding: 1rem 1.25rem; }
        .symmetric-readhere-wrapper .analogy-text { font-size: 15px; color: #633806; line-height: 1.7; margin: 0; }
        .symmetric-readhere-wrapper .mode-toggle { display: flex; background: var(--color-background-secondary); border-radius: 10px; padding: 4px; gap: 4px; width: fit-content; margin-bottom: 2rem; border: 0.5px solid var(--color-border-tertiary); }
        .symmetric-readhere-wrapper .mode-btn { padding: 7px 20px; border-radius: 8px; border: none; background: transparent; font-size: 13px; font-weight: 500; color: var(--color-text-secondary); cursor: pointer; transition: all 0.18s ease; }
        .symmetric-readhere-wrapper .mode-btn.active { background: var(--color-background-primary); color: var(--color-text-primary); border: 0.5px solid var(--color-border-tertiary); }
        .symmetric-readhere-wrapper .mode-desc { font-size: 12px; color: var(--color-text-tertiary); margin-bottom: 2rem; }
        .symmetric-readhere-wrapper .deep-section { margin-bottom: 3rem; }
        .symmetric-readhere-wrapper .callout { border-radius: var(--border-radius-md); padding: 1rem 1.25rem; margin: 1rem 0; }
        .symmetric-readhere-wrapper .callout-info { background: #E6F1FB; border-left: 3px solid #378ADD; border-radius: 0; }
        .symmetric-readhere-wrapper .callout-warn { background: #FAEEDA; border-left: 3px solid #EF9F27; border-radius: 0; }
        .symmetric-readhere-wrapper .callout-success { background: #E1F5EE; border-left: 3px solid #1D9E75; border-radius: 0; }
        .symmetric-readhere-wrapper .callout p { font-size: 14px; line-height: 1.7; margin: 0; }
        .symmetric-readhere-wrapper .callout-info p { color: #0C447C; }
        .symmetric-readhere-wrapper .callout-warn p { color: #633806; }
        .symmetric-readhere-wrapper .callout-success p { color: #085041; }
        .symmetric-readhere-wrapper .deep-para { font-size: 15px; color: var(--color-text-primary); line-height: 1.8; margin: 0 0 1rem; }
        .symmetric-readhere-wrapper .qa-block { border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); overflow: hidden; margin-bottom: 12px; }
        .symmetric-readhere-wrapper .qa-q { background: var(--color-background-secondary); padding: 0.9rem 1.25rem; font-size: 14px; font-weight: 500; color: var(--color-text-primary); }
        .symmetric-readhere-wrapper .qa-a { padding: 0.9rem 1.25rem; font-size: 14px; color: var(--color-text-primary); line-height: 1.7; border-top: 0.5px solid var(--color-border-tertiary); }
        .symmetric-readhere-wrapper .trace-step { display: flex; gap: 14px; margin-bottom: 1.25rem; align-items: flex-start; }
        .symmetric-readhere-wrapper .trace-badge { min-width: 80px; font-size: 11px; font-weight: 500; padding: 4px 10px; border-radius: 20px; text-align: center; white-space: nowrap; }
        .symmetric-readhere-wrapper .trace-going { background: #E6F1FB; color: #185FA5; }
        .symmetric-readhere-wrapper .trace-record { background: #E1F5EE; color: #0F6E56; }
        .symmetric-readhere-wrapper .trace-flip { background: #EEEDFE; color: #534AB7; }
        .symmetric-readhere-wrapper .trace-back { background: #FAEEDA; color: #854F0B; }
        .symmetric-readhere-wrapper .trace-title { font-size: 14px; font-weight: 500; color: var(--color-text-primary); margin: 0 0 3px; }
        .symmetric-readhere-wrapper .trace-desc { font-size: 13px; color: var(--color-text-secondary); line-height: 1.6; margin: 0; }
        .symmetric-readhere-wrapper .mistake-row { display: flex; gap: 12px; padding: 12px 0; border-bottom: 0.5px solid var(--color-border-tertiary); align-items: flex-start; }
        .symmetric-readhere-wrapper .mistake-row:last-child { border-bottom: none; }
        .symmetric-readhere-wrapper .mistake-x { width: 20px; height: 20px; border-radius: 50%; background: #FCEBEB; color: #A32D2D; font-size: 12px; font-weight: 500; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
        .symmetric-readhere-wrapper code { font-size: 12.5px; background: var(--color-background-secondary); padding: 2px 5px; border-radius: 4px; font-family: var(--font-mono); }
      `}</style>

      <div className="page">
        <div className="section">
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginBottom: "0.9rem", flexWrap: "wrap" }}>
            <Link
              href="/problems/binary-tree/symmetric-tree"
              style={{ fontSize: "13px", padding: "8px 14px", borderRadius: "var(--border-radius-md)", background: "#E6F1FB", color: "#185FA5", fontWeight: 500, textDecoration: "none", border: "0.5px solid #B5D4F4" }}
            >
              Open Visualizer
            </Link>
            <Link
              href="/problems/topics/trees"
              style={{ fontSize: "13px", padding: "8px 14px", borderRadius: "var(--border-radius-md)", background: "#ffffff", color: "#4a4a6a", fontWeight: 500, textDecoration: "none", border: "0.5px solid var(--color-border-tertiary)" }}
            >
              Back to Problems
            </Link>
          </div>
          <p className="section-label">Binary Tree · DFS / BFS · LC 101</p>
          <h1 className="hero-title">Symmetric Tree</h1>
          <p className="hero-sub">Check whether a binary tree is a mirror of itself - left subtree mirrors the right subtree at every level.</p>
          <div className="hero-tags" style={{ marginBottom: "1.5rem" }}>
            <span className="badge badge-teal">Recursive DFS</span>
            <span className="badge badge-purple">Mirror Check</span>
            <span className="badge badge-amber">BFS Variant</span>
            <span className="badge badge-rose">Easy</span>
          </div>

          <div className="mode-toggle">
            <button
              className={`mode-btn ${mode === "quick" ? "active" : ""}`}
              onClick={() => setMode("quick")}
            >
              Quick Recap
            </button>
            <button
              className={`mode-btn ${mode === "deep" ? "active" : ""}`}
              onClick={() => setMode("deep")}
            >
              Deep Explain
            </button>
          </div>
          <p className="mode-desc">
            {mode === "quick"
              ? "Key concepts at a glance - for those who already know the basics."
              : "A full beginner-friendly walkthrough - understand it from scratch."}
          </p>
        </div>

        {mode === "quick" ? (
          <div dangerouslySetInnerHTML={{ __html: QUICK_MODE_HTML }} />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: DEEP_MODE_HTML }} />
        )}

        <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 3px" }}>Try it yourself</p>
            <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", margin: 0 }}>LeetCode 101 · Easy · Tags: Tree, DFS, BFS, Binary Tree</p>
          </div>
          <a href="https://leetcode.com/problems/symmetric-tree/" target="_blank" rel="noreferrer" style={{ fontSize: "13px", padding: "8px 18px", borderRadius: "var(--border-radius-md)", background: "#E6F1FB", color: "#185FA5", fontWeight: 500, textDecoration: "none", border: "0.5px solid #B5D4F4" }}>Open on LeetCode ↗</a>
        </div>
      </div>
    </div>
  );
}

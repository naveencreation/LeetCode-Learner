# ThinkDSA — Changes Checklist

Tracking all changes made during this session. Updated as fixes are completed.

---

## Completed

- [x] **Sidebar floating toggle button** — Moved toggle from header to floating circular button on sidebar right edge (`app-sidebar.tsx`, `layout.tsx`)
- [x] **Toggle button position** — Moved from vertical center to header/nav intersection (`top-16`)
- [x] **Custom scrollbar** — Thin (6px), auto-hiding, semi-transparent globally (`globals.css`)
- [x] **Topic sidebar redesign** — Circular progress ring, inline icon+title, inline stats row, "Start Practicing" CTA (`[topicKey]/page.tsx`)
- [x] **Removed redundant progress bar** — Kept only circular ring, removed horizontal bar
- [x] **Problem list height** — Extended panel downward (`100dvh - 5.5rem`)
- [x] **Rename CodeArena → ThinkDSA** — All 24 occurrences across 8 files + SVG logo files renamed
- [x] **New ThinkDSA logo** — Replaced mark SVG with new design (code brackets + play + progress bar)
- [x] **Start button label** — Controls bar shows "Start" at step 0, then "Next Step" after first click (`UnifiedControlsBar.tsx`)
- [x] **Remove subtitle from header** — Hidden subtitle text across all 25 visualizers via `problem-focus-header.tsx` (kept as `sr-only` for accessibility)
- [x] **Style "Select Tree" button** — Teal-tinted pill (`border-teal-200 bg-teal-50 text-teal-700`) via `traversal-pill` class in `globals.css`
- [x] **Fix hover override on Select Tree** — Removed inline `hover:bg-slate-50` from 23 TreePanel files so the teal hover (`hover:bg-teal-100`) from the CSS class takes effect
- [x] **Copy code button** — Added `CopyCodeButton` component (Copy→Check icon) to all 25 CodePanel headers (`shared/components/CopyCodeButton.tsx`)
- [x] **Sliding segmented toggle** — Created shared `SegmentedToggle` component with animated sliding pill indicator. Applied to Snippet/Full Code (25 CodePanels) and Manual/Auto (UnifiedControlsBar)
- [x] **Back arrow icon** — Replaced raw `←` with Lucide `ArrowLeft` in "Back To Trees List" button (`problem-focus-header.tsx`)
- [x] **Style "Back To Trees List" button** — Teal-tinted pill (`border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100`) to match other interactive buttons
- [x] **Merge Beginner/Advanced modes** — Removed mode toggle from all 22 TreeSetupModal files. All features (rename, remove subtree, drag, auto layout) now always visible. Fixed 15-node limit. 8 formerly-simple modals upgraded to full feature parity. LCA p/q selectors preserved.
- [x] **Remove Manual Position Controls** — Removed state, handler, and UI for manual x/y coordinate input from all 22 TreeSetupModal files. Drag-to-reposition and Auto Layout remain.
- [x] **Regroup left panel** — Merged 4 sections into 2: "Build Tree" (Preset + Add Child + Layout/Auto Layout) and "Edit Tree" (Rename + Remove Subtree, always visible). Consistent white sub-cards within slate sections.
- [x] **Add Left / Add Right buttons** — Replaced Left/Right dropdown + Add button with two distinct "+ Left" (filled teal) and "+ Right" (outlined teal) buttons. Fewer clicks per node.
- [x] **Smooth animations & transitions** — Full animation pass across all panels. Added shared CSS keyframes (`fadeIn`, `slideUpFadeIn`, `scaleIn`, `nodePulse`, `badgePopIn`, `frameSlideIn`) in `globals.css`. TreePanel SVG nodes get smooth fill/stroke transitions + pulse on current node. TreeSetupModal gets fade-in backdrop, slide-up card, scale-in dialogs, fade-in tooltips. CallStack frames get slide-in + staggered delay. CodePanel lines get `transition-all duration-200`. ResultPanel badges get `animate-badge-pop`. Added `prefers-reduced-motion` media query.
- [x] **Replace emojis with Lucide icons** — Replaced ✅/❌/👉 emojis in 22 ResultPanel files with `CheckCircle2`, `XCircle`, `ArrowRight` from lucide-react. Replaced ✓/✗ in `balancedbinarytree` (Layout, ExplanationPanel, engine) and `symmetrictree` (Layout) with Lucide icons or plain text. Widened `TraversalShellStat.value` type to `ReactNode`.
- [x] **Type fixes** — Added missing `NodePosition`/`TreePresetKey` exports in `balancedtree`, `zigzagtree`, `lc105`, `lc106`, `lc114`. Fixed duplicate export in `zigzag`. Restored `sametree` custom dual-tree TreeSetupModal. Added missing `handleViewModeChange` in `sametree/CodePanel`.

## In Progress


## Upcoming

### Binary Tree (current)
- [ ] Additional tree problems (Morris traversal, serialize/deserialize, max path sum, etc.)

### Arrays & Strings
- [ ] Two pointers (two sum, container with most water, trapping rain water)
- [ ] Sliding window (max subarray, minimum window substring)
- [ ] Prefix sums & Kadane's algorithm
- [ ] Binary search variations (rotated sorted array, search insert position)

### Linked Lists
- [ ] Reversal (reverse linked list, reverse in K-group)
- [ ] Cycle detection (Floyd's algorithm)
- [ ] Merge / intersection / reorder

### Stacks & Queues
- [ ] Monotonic stack (next greater element, daily temperatures)
- [ ] Valid parentheses, min stack
- [ ] Queue using stacks

### Graphs
- [ ] BFS / DFS traversal visualizer
- [ ] Topological sort (course schedule)
- [ ] Shortest path (Dijkstra, Bellman-Ford)
- [ ] Union-Find (connected components, redundant connection)

### Dynamic Programming
- [ ] 1D DP (climbing stairs, house robber, coin change)
- [ ] 2D DP (unique paths, edit distance, LCS)
- [ ] Knapsack variants (0/1, unbounded)
- [ ] Subsequence problems (LIS, palindromic subsequence)

### Recursion & Backtracking
- [ ] Permutations & combinations
- [ ] N-Queens, Sudoku solver
- [ ] Word search, subsets

### Sorting & Searching
- [ ] Merge sort / quick sort visualizer
- [ ] Quick select (Kth largest)
- [ ] Heap operations visualizer

### Advanced
- [ ] Tries (prefix search, autocomplete)
- [ ] Segment trees / BIT (range queries)
- [ ] Greedy (interval scheduling, activity selection)
- [ ] Bit manipulation patterns


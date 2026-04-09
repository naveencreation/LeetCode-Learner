# Tree Problem Standard (Authoritative)

Use this document as the contract for any new tree problem.
Goal: if a new problem is added, it should feel identical in structure and interaction quality to existing implemented problems.

## 1) Non-Negotiable Outcomes

- Same learning flow across all problems: code, tree, progress, stack/queue, explanation, controls.
- Same interaction model: drag-resizable layout, reset behavior, saved splitter memory.
- Same design language: panel primitives, spacing rhythm, typography hierarchy, button styles.
- Same engineering baseline: strict TypeScript, lint clean, reusable architecture.
- Minimal-change delivery: avoid broad rewrites when a targeted patch or shared reuse solves the requirement.

## 2) Required File Structure for a New Problem

Create a dedicated feature folder under `src/features/<problem-key>/` with:

- `constants.ts`
- `types.ts`
- `engine.ts`
- `selectors.ts`
- `use<ProblemName>Traversal.ts`
- `components/`
  - `<ProblemName>Layout.tsx`
  - `CodePanel.tsx`
  - `TreePanel.tsx`
  - `ResultPanel.tsx`
  - `CallStackPanel.tsx` (or queue/state panel equivalent)
  - `ExplanationPanel.tsx`
  - `ControlsBar.tsx`
  - `TreeSetupModal.tsx`

Also create route pages:

- Problem page: `src/app/(app)/problems/binary-tree/<slug>/page.tsx`
- Guide page: `src/app/(app)/problems/binary-tree/<slug>-guide/page.tsx`

Also register catalog wiring:

- Add/update `getProblemHref` mapping in `src/app/(app)/problems/page.tsx`.
- Ensure section-aware mapping exists for `Binary Tree Part-II` / `Binary Tree Part-III` problems.
- If study-mode fallback is needed, add/update `src/features/binary-tree/problemData.ts` entry.
- Add/update traversal route detection in `src/app/(app)/layout.tsx` so interactive pages render in fixed viewport shell (not scroll shell).

Read Here guide-page contract:

- `TREE_READ_HERE_PAGE_MICRO_STANDARD.md` is mandatory when creating or updating any `/<slug>-guide/page.tsx` file.

Architecture guardrails (mandatory):

- Layouts must use `src/features/shared/components/ResizableTraversalGrid.tsx` for resizing and persistence.
- Do not implement custom drag/splitter engines in problem layout files.
- Do not import panels from another concrete problem folder.
- Allowed imports for panels: same feature folder or shared panel modules.
- Prefer extending shared modules over cloning large blocks into each problem feature.

## 3) Layout and Header Standard

All new problems must use shared layout engine:

- `src/features/shared/components/ResizableTraversalGrid.tsx`

Layout assembly rules:

- Provide `left`, `middleTop`, `middleBottom`, `middleFooter`, `rightTop`, `rightBottom`.
- Use a `ProblemFocusHeader` above the grid.
- Include top `Reset Layout` action in header `extraActions` with existing button style.
- Wire header reset to shared grid reset callback.

Safe callback pattern (required):

- Never pass state setter directly to `onResetReady`.
- Use function-wrapper storage pattern:
  - `onResetReady={(resetFn) => setResetLayout(() => resetFn)}`

## 4) Resizable Layout Behavior (Must Match Existing)

- Column drag: left/middle/right splitters.
- Row drag: middle and right vertical stacks.
- Divider double-click resets layout.
- Header `Reset Layout` button resets layout.
- Splitter positions persist per route using `localStorage` through shared grid.
- Max-drag must remain safe (no panel overlap).

Do not re-implement drag logic in each feature unless explicitly required.

## 5) Panel Content Standard

### Code Panel

- Snippet vs Full code toggle.
- Execution-aware highlighted lines.
- Clear active-line state.
- Full code remains scroll-accessible.

### Tree Panel

- Visual node-state rendering tied to active step.
- Entry point to open `TreeSetupModal`.
- Keep panel primitives consistent.

### Result Panel

- Current operation state + output state.
- Clear per-step progression context.
- Output semantics must match the problem result contract (do not force traversal-array semantics onto scalar-output problems).

### Stack/Queue Panel

- Use the problem-appropriate execution structure (stack/queue/state list).
- Empty-state message when no active frames/items.

### Explanation Panel

- Step narrative tied to active execution step.
- Clear user-facing guidance language.

### Controls Bar

- Manual mode: previous/next/reset.
- Auto mode: play/pause + speed selection.
- Consistent button sizing, spacing, and icon set.

## 6) Tree Setup Modal Standard

- Must open from `TreePanel` action.
- Two modes:
  - Beginner mode (essential controls)
  - Advanced mode (full editing)
- Left controls scroll, right preview fixed.
- In-app unsaved-changes confirmation only (no native browser confirm).
- Required capabilities:
  - Presets/templates
  - Add node by parent + side
  - Drag/drop node positioning in preview
  - Auto-layout options
  - Rename node value
  - Remove subtree
  - Structural validation before apply

Node limits:

- Beginner max: 10
- Advanced max: 20
- Display explicit helper text and limit-reached feedback.

## 7) Visual and Interaction Consistency Rules

- Reuse shared classes from global styles:
  - `traversal-panel`
  - `traversal-panel-header`
  - `traversal-panel-title`
  - `traversal-pill`
  - `traversal-kbd`
- Preserve spacing rhythm already used in implemented problems.
- Keep hover/active/focus behavior subtle and consistent.
- Avoid one-off decorative styles for a single problem.
- Avoid ad-hoc status badges that diverge from current problems.

## 8) Accessibility and Reliability Rules

- Keyboard reachable actions for all important controls.
- Predictable focus order.
- Visible focus states.
- Readable contrast for text and control labels.
- No React render/update loop warnings.
- No console errors during common interaction paths.

## 9) Quality Gates Before Merge

### Static checks

- `npx eslint` must pass for all newly created/edited files.
- TypeScript compile must stay clean for changed scope.
- New feature files must not introduce `any` or `Record<number, any>`.
- Diff scope should remain focused:
  - no unnecessary edits in unrelated features
  - no large copied blocks where shared extraction is possible

### Manual behavior QA

- Drag columns to both extremes: no overlap, no clipping.
- Drag rows to both extremes: headers remain usable.
- Divider double-click reset works.
- Header `Reset Layout` works.
- Refresh page: splitter positions restore correctly.
- Change route and return: route-specific layout state is preserved.
- Tree setup flow works: open, edit, apply, apply-and-run, unsaved-close path.
- Problem card is `Live` (not `Planned`) in `/problems` and opens the correct route.
- Code panel and Explanation panel content is problem-specific (not inherited from a different problem module).
- Interactive shell is fixed-height (no outer page scroll caused by app layout routing).

### Responsive QA

- Validate at minimum widths: 1366, 1536, 1920.
- No control overlap in header or controls bar.
- No panel overflow causing broken layout.

## 10) New Problem Checklist (Copy/Paste)

- [ ] Created `src/features/<problem-key>/` with standard files.
- [ ] Added problem route page and guide route page.
- [ ] Added `getProblemHref` catalog wiring so problem appears as Live.
- [ ] Added app-layout traversal route wiring (`src/app/(app)/layout.tsx`) for fixed interactive shell.
- [ ] Built layout using `ResizableTraversalGrid`.
- [ ] Avoided custom splitter implementation in layout file.
- [ ] Added header `Reset Layout` action.
- [ ] Wired `onResetReady` with safe wrapper callback pattern.
- [ ] Implemented required panels and controls.
- [ ] Avoided cross-problem component imports.
- [ ] Avoided unnecessary broad rewrites outside new feature scope.
- [ ] Integrated `TreeSetupModal` with standard capabilities.
- [ ] Result panel semantics match the problem output contract.
- [ ] Kept visual style and shared classes consistent.
- [ ] Lint/typecheck passed.
- [ ] Manual QA passed for drag/reset/persistence/responsive.

## 11) Recommended Implementation Sequence

1. Duplicate a stable, shared-grid-based layout from an existing problem.
2. Replace only problem-specific engine/types/selectors/hooks.
3. Keep panel shell and controls structure unchanged.
4. Validate behavior with manual + autoplay flows.
5. Run lint/typecheck and complete checklist above.

Following this standard is mandatory for any new tree problem so all modules remain consistent with implemented pages.

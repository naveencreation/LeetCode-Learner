# Inorder Traversal Component Plan (Next.js)

This plan ports the reference prototype from `reference/` into the Next.js app with no loss of behavior, while keeping the current Problems page flow.

## Scope

- Preserve all prototype behavior:
  - Step controls: Next, Previous, Reset
  - Keyboard shortcuts: Right Arrow, Left Arrow
  - Tree visualization and traversal path
  - Code line highlighting
  - Call stack panel
  - Step explanation panel
  - Result array and progress indicators
- Integrate as a React route reachable from Problems -> Binary Tree -> Inorder Traversal.

## Phase 1 - Parity Contract (Current)

### Objective

Freeze what "done" means before implementation starts.

### Tasks

1. Create a parity checklist grouped by feature area.
2. Define acceptance checks for each feature.
3. Mark non-negotiable behaviors as `Must`.

### Deliverables

- This plan file.
- A parity checklist section in this file used during QA.

### Acceptance Criteria

- Every feature from the prototype appears in the checklist.
- No implementation starts without a mapped acceptance check.

## Phase 2 - Domain Model and Data Contracts

### Objective

Define strongly-typed traversal state and step data for React rendering.

### File Targets

- `src/features/inorder/types.ts`
- `src/features/inorder/constants.ts`

### Tasks

1. Add `TreeNode`, `ExecutionStep`, `NodeState`, `CallStackFrame` types.
2. Add operation types: `enter_function`, `traverse_left`, `visit`, `traverse_right`, `exit_function`.
3. Add static sample tree data and code-line mapping.

### Acceptance Criteria

- Types compile in strict TypeScript mode.
- All operation types from prototype are represented.

## Phase 3 - Traversal Engine Extraction

### Objective

Move traversal and step generation into pure reusable utilities.

### File Targets

- `src/features/inorder/engine.ts`
- `src/features/inorder/selectors.ts`

### Tasks

1. Implement deterministic step generation from tree root.
2. Keep immutable snapshots for node states and call stack.
3. Add selectors for current operation, phase text, and code line.

### Acceptance Criteria

- Generated step count and step order match reference prototype.
- No direct DOM usage in engine code.

## Phase 4 - React State and Controls

### Objective

Implement step navigation logic in React without behavior drift.

### File Targets

- `src/features/inorder/useInorderTraversal.ts`

### Tasks

1. Add state for `currentStep`, `result`, `visitedNodes`, `currentNode`.
2. Implement `nextStep`, `previousStep`, `resetTraversal`.
3. Implement keyboard shortcuts with cleanup.

### Acceptance Criteria

- Navigation behavior matches prototype exactly.
- Buttons disable correctly at boundaries.

## Phase 5 - UI Component Shell

### Objective

Build panel-based React UI equivalent to prototype.

### File Targets

- `src/features/inorder/components/InorderLayout.tsx`
- `src/features/inorder/components/CodePanel.tsx`
- `src/features/inorder/components/TreePanel.tsx`
- `src/features/inorder/components/CallStackPanel.tsx`
- `src/features/inorder/components/ExplanationPanel.tsx`
- `src/features/inorder/components/ResultPanel.tsx`
- `src/features/inorder/components/ControlsBar.tsx`

### Tasks

1. Recreate panel layout with Tailwind + shadcn cards.
2. Port visual states and labels from prototype.
3. Keep responsive behavior and no major UX regressions.

### Acceptance Criteria

- All prototype panels appear with working data.
- Visual hierarchy remains clear on desktop and laptop widths.

## Phase 6 - Tree Rendering and Animation

### Objective

Render tree, links, node states, and traversal path in React.

### File Targets

- `src/features/inorder/components/TreeCanvas.tsx` (SVG preferred)
- `src/features/inorder/layout.ts`

### Tasks

1. Compute node coordinates from static sample tree.
2. Render edges and nodes with state-aware classes.
3. Render traversal path and active operation highlight.

### Acceptance Criteria

- Node colors/states align with current step.
- Path and operation badge update per step.

## Phase 7 - Route Integration

### Objective

Make the problem reachable from the Problems page.

### File Targets

- `src/app/(app)/problems/page.tsx`
- `src/app/(app)/problems/binary-tree/inorder-traversal/page.tsx`

### Tasks

1. Add route page for Inorder Traversal component.
2. Make `Inorder Traversal` item clickable.
3. Add lightweight header context (topic + problem name).

### Acceptance Criteria

- Clicking Inorder in Problems opens the traversal page.
- Back navigation returns user to Problems naturally.

## Phase 8 - QA and Regression Check

### Objective

Confirm one-to-one behavior parity before moving to other problems.

### Tasks

1. Run parity checklist manually.
2. Confirm keyboard controls and button boundaries.
3. Confirm step-by-step match against reference output array.
4. Run lint and fix issues.

### Acceptance Criteria

- All `Must` parity checks pass.
- `npm run lint` passes.

## Parity Checklist (Must)

- [x] Next step advances exactly one execution step.
- [x] Previous step reverses exactly one execution step.
- [x] Reset returns all panels to initial state.
- [x] Current node and phase reflect active step.
- [x] Code line highlight maps correctly to operation.
- [x] Call stack panel reflects recursion depth and states.
- [x] Explanation text updates per operation type.
- [x] Result array appends only on `visit`.
- [x] Keyboard shortcuts work and are boundary-safe.
- [x] Completion state shows final inorder result.

## Execution Mode

Work one phase at a time. Do not start the next phase until acceptance criteria for the current phase are met.
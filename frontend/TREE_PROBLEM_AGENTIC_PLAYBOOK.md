# Tree Problem Agentic Playbook (Strict, Step-by-Step)

Purpose:
- This file is the execution script for adding any new tree problem with full consistency.
- Follow every step in order.
- Do not skip steps.
- Do not add custom one-off UI behavior.

Primary Standard:
- First read TREE_PROBLEM_STANDARD.md.
- This playbook is the execution process that enforces that standard.

Use Case:
- When asked to implement a new tree problem such as Diameter of Binary Tree, Zigzag Traversal, Boundary Traversal, etc.

--------------------------------------------------

## 0) Inputs Required Before You Start

Collect and write down:
- Problem name
- Route slug (example: diameter-of-binary-tree)
- Source platform link(s)
- Expected output format
- Constraints (node count, value ranges, recursion depth concerns)
- Whether traversal state is recursion-based or queue-based

If any of these are missing, stop and clarify first.

--------------------------------------------------

## 1) Research Phase (Mandatory)

Goal:
- Build a complete understanding of the problem before coding.

Sources to check (in this order):
1. LeetCode official problem statement and examples
2. Striver explanation/video notes
3. At least one additional source (NeetCode, GeeksforGeeks, etc.)

Research output must include:
- Canonical problem statement
- Input and output contract
- Constraints
- 3 to 6 edge cases
- Brute-force approach summary
- Optimal approach summary
- Time complexity and space complexity
- Why optimal approach is correct

Conflict resolution rule:
- If sources disagree, use LeetCode statement as final source of truth.
- Note any assumptions explicitly.

Required artifact to produce in notes:
- Problem Research Brief
  - Problem
  - Constraints
  - Edge Cases
  - Brute Force
  - Optimal
  - Complexity
  - Assumptions

--------------------------------------------------

## 2) Visualization Design Phase (Mandatory)

Goal:
- Convert algorithm into step events that can be animated and explained.

Define the execution model:
- What is one step?
- Which node is active per step?
- Which phase names are needed? (example: enter, process, backtrack, enqueue, dequeue)
- What data updates per step?

Define event schema in plain language:
- Step index
- Node value or node id
- Operation label
- Phase label
- Snapshot fields needed by panels

Define panel mapping:
- Code panel: highlighted line(s)
- Tree panel: node visual states
- Result panel: current answer state
- Stack or queue panel: runtime container state
- Explanation panel: human-readable explanation for this step

Define result contract (mandatory):
- Final output shape for the problem (scalar, array, matrix, etc.)
- Per-step output snapshot shape shown in Result panel
- Exact relationship between engine state and Result panel fields

Do not start coding until this mapping is complete.

--------------------------------------------------

## 3) File Planning Phase (Mandatory)

Create and use the exact feature structure:
- src/features/<problem-key>/constants.ts
- src/features/<problem-key>/types.ts
- src/features/<problem-key>/engine.ts
- src/features/<problem-key>/selectors.ts
- src/features/<problem-key>/use<ProblemName>Traversal.ts
- src/features/<problem-key>/components/<ProblemName>Layout.tsx
- src/features/<problem-key>/components/CodePanel.tsx
- src/features/<problem-key>/components/TreePanel.tsx
- src/features/<problem-key>/components/ResultPanel.tsx
- src/features/<problem-key>/components/CallStackPanel.tsx (or queue/state equivalent)
- src/features/<problem-key>/components/ExplanationPanel.tsx
- src/features/<problem-key>/components/ControlsBar.tsx
- src/features/<problem-key>/components/TreeSetupModal.tsx

Create route files:
- src/app/(app)/problems/binary-tree/<slug>/page.tsx
- src/app/(app)/problems/binary-tree/<slug>-guide/page.tsx

Change-scope guardrails (mandatory):
- Prefer minimal diffs over broad rewrites.
- Do not rewrite existing, working shared infrastructure for one problem.
- If a shared behavior is missing, extend shared modules first, then consume them in the feature.
- Any edit outside the new problem folder and route wiring must include one-line justification in the final summary.
- If a single problem implementation touches more than 3 unrelated existing files, stop and re-check approach before continuing.

--------------------------------------------------

## 4) Implementation Phase (Strict Order)

### Step 4.1: Types and constants
- Define all event and state types first in types.ts.
- Add operation labels, phase labels, presets, limits, and UI constants in constants.ts.

### Step 4.2: Engine
- Implement deterministic step generation in engine.ts.
- Engine must be pure and reproducible.
- Every step must include enough data for all panels.

### Step 4.3: Selectors
- Map step to code lines and display helpers in selectors.ts.
- Keep selectors pure.

### Step 4.4: Traversal hook
- Implement use<ProblemName>Traversal.ts with:
  - current step state
  - play or pause
  - speed control
  - next and previous
  - reset
  - derived states for panels

### Step 4.5: Layout shell
- Build <ProblemName>Layout.tsx using ResizableTraversalGrid.
- Required header behavior:
  - ProblemFocusHeader
  - top Reset Layout button
  - onResetReady safe callback wrapper pattern:
    - onResetReady={(resetFn) => setResetLayout(() => resetFn)}

Hard rule:
- Do not implement custom drag logic, custom divider handlers, or route-local localStorage layout persistence in new problem layouts.
- New layouts must delegate resizing and persistence to ResizableTraversalGrid.
- Do not copy large layout blocks from another problem when shared grid composition already supports the requirement.

### Step 4.6: Panels
- Build all required panels.
- Reuse shared panel primitives and style classes.
- Keep hierarchy and spacing consistent with existing problems.

Import boundary rule:
- Do not import panel components from another concrete problem folder (example: importing from inorder inside diameter).
- Allowed panel sources:
  - same problem folder
  - shared panel modules/utilities

Shared-first rule:
- If two or more problems need the same panel behavior, move that behavior to shared modules.
- Do not duplicate large panel code across problem folders when shared extraction is feasible.

### Step 4.7: Tree setup modal
- Integrate TreeSetupModal from TreePanel trigger.
- Keep beginner and advanced flows.
- Keep limit handling and validation behavior consistent.

### Step 4.8: Problem catalog wiring (Mandatory)
- Register the new problem link in `src/app/(app)/problems/page.tsx` inside `getProblemHref`.
- If the problem is in `Binary Tree Part-II` or `Binary Tree Part-III`, add an explicit section-aware mapping.
- Verify the problem shows as `Live` (not `Planned`) in topic/problem lists.
- If a study-mode fallback page is used for the same slug, add/update entry in `src/features/binary-tree/problemData.ts`.
- Register the route in traversal shell detection (`src/app/(app)/layout.tsx`) so interactive pages use fixed viewport (`h-screen overflow-hidden`) instead of scroll mode.

--------------------------------------------------

## 5) Required Layout and UX Parity Checks

Must match current implemented behavior:
- Draggable columns
- Draggable middle and right row splitters
- Divider double-click reset
- Header Reset Layout button
- Splitter persistence after refresh (localStorage through shared grid)
- No overlap at extreme drag positions

If any parity item is missing, implementation is incomplete.

--------------------------------------------------

## 6) Read Here Guide Page Standard

Detailed micro-level contract (mandatory companion):
- `TREE_READ_HERE_PAGE_MICRO_STANDARD.md`

Guide page must include:
1. Problem statement in simple language
2. Intuition
3. Brute-force approach
4. Optimal approach
5. Dry run on sample input
6. Complexity analysis
7. Common mistakes
8. Interview-style follow-up notes
9. Link back to interactive problem page

Guide page content quality rules:
- Beginner friendly language
- No contradiction with engine logic
- Complexity statements must match implementation

--------------------------------------------------

## 7) Validation Phase (Mandatory)

### Static validation
- Run lint on all changed files.
- Run typecheck for changed scope.
- Enforce strict typing in new feature files:
  - no `any`
  - no `Record<number, any>`
  - no unsafe casts unless justified in comment
- Run change-scope validation:
  - verify no unnecessary edits to unrelated features
  - verify large copied blocks are not introduced when shared component usage is possible

### Runtime validation
- Open the new problem page.
- Verify no console errors.
- Verify no React update depth warnings.
- Verify no hydration warnings.
- Open the problem from `/problems` and `/problems/topics/<topic-key>` lists and confirm the card is `Live`.
- Verify shell mode: interactive page is fixed (no outer page scrolling introduced by app layout routing).
- Verify panel correctness:
  - Code panel shows problem-specific code (not copied from another problem)
  - Explanation panel text and labels are problem-specific
  - Result panel semantics match the result contract from Phase 2

### Interaction validation
- Manual mode: next, previous, reset
- Auto mode: play, pause, speed change
- Tree setup flow: open, edit, apply, apply-and-run, unsaved close
- Layout behavior: drag, double-click reset, header reset, refresh restore

### Responsive validation
- Check at widths: 1366, 1536, 1920
- Ensure no clipped controls or overlapping panels

--------------------------------------------------

## 8) Consistency Review Against Existing Problems

Before closing task, compare against at least two existing implemented problems.

Compare these items:
- Header structure
- Stats format
- Panel shell and spacing
- Controls layout and labels
- Explanation clarity
- Tree setup entry point and behavior

If deviations are intentional, document why.
If deviations are accidental, fix before finish.

--------------------------------------------------

## 9) Done Criteria (Strict)

A new tree problem is done only if all are true:
- Research Brief completed
- Engine and panels implemented
- Shared layout parity achieved
- Guide page completed
- Catalog wiring completed (`getProblemHref` + list visibility)
- Panel correctness validated (code/explanation/result are problem-specific)
- Strict typing gate passed (no `any` in new feature files)
- Change-scope gate passed (no unnecessary broad rewrites)
- Lint and type checks pass
- Manual and responsive QA pass
- No runtime console errors
- PR Review Template completed with required evidence fields

If one item fails, task is not done.

--------------------------------------------------

## 10) Copy-Paste Execution Prompt for Smaller Models

Use this prompt exactly when assigning a new tree problem implementation:

You must implement a new tree problem end-to-end using TREE_PROBLEM_STANDARD.md and TREE_PROBLEM_AGENTIC_PLAYBOOK.md with zero exceptions.
Follow strict phases in order: research, visualization design, file planning, implementation, guide page, validation, consistency review.
Research must use LeetCode first, then Striver, then one additional source. Resolve conflicts using LeetCode as source of truth.
Use shared layout engine and keep full UI parity with existing tree problems including reset and persistence behaviors.
Do not invent a new layout pattern.
Do not skip QA.
Deliverables must include:
1) feature files,
2) problem route,
3) guide route,
4) completed validation summary,
5) list of assumptions.

--------------------------------------------------

## 11) Quick Anti-Pattern List (Never Do)

- Do not code before research is complete.
- Do not bypass shared grid for new layouts.
- Do not add custom splitter engines in problem layout files.
- Do not pass state setters directly when storing callback functions.
- Do not import components from another concrete problem folder.
- Do not perform broad rewrites when a shared or minimal patch is sufficient.
- Do not add one-off styles that diverge from established panels.
- Do not ship with console errors even if lint is clean.
- Do not skip guide page.

--------------------------------------------------

## 12) PR Review Template (Required Evidence)

Copy and fill this template in every implementation review.

### Changed files list
- List every changed file path.
- Mark each file as one of:
  - `new problem feature`
  - `route wiring`
  - `shared extraction`
  - `other`

### Justification list
- For each changed file outside `src/features/<problem-key>/` and route pages, add one-line justification.
- If no external files changed, write: `No external files changed`.

### Shared extraction decision
- `Decision`: `Used existing shared module` | `Extended shared module` | `No shared extraction needed`
- `Reason`: one to three lines.
- `Alternative considered`: brief note on what was rejected and why.

### Validation evidence
- Lint result summary.
- Typecheck result summary.
- Runtime checks summary (console errors, hydration, update-depth).
- Live-card verification from `/problems` and `/problems/topics/<topic-key>`.

This playbook is mandatory for all future tree problem implementations.
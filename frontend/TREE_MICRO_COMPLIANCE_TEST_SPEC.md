# Tree Micro Compliance Test Spec

Purpose:
- Define strict, micro-level automated checks for:
  - Read Here guide pages
  - Tree layout pages
- Provide an enforceable pass/fail gate with optional auto-fix and re-test loop.

Primary runner:
- scripts/tree-micro-compliance.cjs

--------------------------------------------------

## 1) Scope

Default target files:
- all guide pages under src/app/(app)/problems/binary-tree/*-guide/page.tsx
- all layout pages under src/features/**/components/*Layout.tsx

Optional narrower scope:
- one or more explicit guide files via --guide <path>
- one or more explicit layout files via --layout <path>

--------------------------------------------------

## 2) Guide Page Hard Checks

Required symbols/text:
- "use client"
- function QuickMode()
- function DeepMode()
- const DRY_RUN_STEPS
- const TRACE_STEPS
- const COMMON_MISTAKES
- const INTERVIEW_ITEMS or const QA_ITEMS
- toggle labels: Quick Recap, Deep Explain
- route action labels: Visual Editor, Tree Problems
- CTA label: Open Visualizer

Required mode state:
- const [mode, setMode] = useState<"quick" | "deep">("quick");

Required export naming:
- default export function name must end with GuidePage

--------------------------------------------------

## 3) Layout Page Hard Checks

Required structure markers:
- ProblemFocusHeader
- ResizableTraversalGrid
- left=, middleTop=, middleBottom=, middleFooter=, rightTop=, rightBottom=
- Reset Layout action text

Required reset callback safety:
- onResetReady={(resetFn) => setResetLayout(() => resetFn)}

Required reset state typing:
- useState<(() => void) | null>(null)

Import boundary check (layout-level):
- layout file must not import concrete components from another feature folder
- allowed feature component imports for layout:
  - same feature folder
  - shared modules

--------------------------------------------------

## 4) Auto-fix Behavior

When --fix is used, runner may auto-fix:
- mode state signature normalization for guide pages
- default export name suffix normalization to GuidePage
- onResetReady unsafe patterns to safe wrapper pattern
- resetLayout useState typing normalization

Auto-fix is iterative:
- run checks
- apply safe rewrites
- run checks again
- repeat up to max iterations

If still failing after max iterations:
- fail with non-zero exit code
- print exact file and violated rules

--------------------------------------------------

## 5) Commands

Run strict checks only:
- npm run tree:micro:test

Run auto-fix + re-test loop:
- npm run tree:micro:fix

Scoped coverage examples:
- node scripts/tree-micro-compliance.cjs --guide src/app/(app)/problems/binary-tree/diameter-guide/page.tsx --layout src/features/diameter/components/DiameterLayout.tsx
- node scripts/tree-micro-compliance.cjs --fix --guide src/app/(app)/problems/binary-tree/diameter-guide/page.tsx --layout src/features/diameter/components/DiameterLayout.tsx

--------------------------------------------------

## 6) Exit Behavior

Pass:
- all selected files satisfy all rules
- process exits with code 0

Fail:
- one or more rules violated after optional fix loop
- process exits with code 1

--------------------------------------------------

This spec is mandatory for micro-level interaction and structure quality enforcement.

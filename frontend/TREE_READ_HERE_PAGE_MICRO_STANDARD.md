# Tree Read Here Page Micro Standard (Authoritative)

Purpose:
- This file is the exact execution contract for writing or upgrading any Tree "Read Here" guide page.
- It is intentionally micro-level.
- Follow every step in order.
- Do not skip sections.

Applies to:
- `src/app/(app)/problems/binary-tree/<slug>-guide/page.tsx`

Companion standards:
- `TREE_PROBLEM_STANDARD.md`
- `TREE_PROBLEM_AGENTIC_PLAYBOOK.md`

--------------------------------------------------

## 0) Required Inputs Before Writing

Collect and lock these values first:
- Problem title
- Interactive route (`/problems/binary-tree/<slug>`)
- Guide route (`/problems/binary-tree/<slug>-guide`)
- Output contract (scalar, array, matrix, boolean, etc.)
- Complexity target from engine implementation
- Canonical sample tree used for dry run
- Color theme family for this problem (must be distinct but consistent)

Stop and clarify if any input is missing.

--------------------------------------------------

## 1) Source-of-Truth Rules

Use this priority order:
1. Implemented engine/hook behavior in `src/features/<problem-key>/`
2. LeetCode statement/examples
3. Existing implemented Read Here pages for layout/style parity

Hard rule:
- Guide content must not contradict engine behavior.
- If guide and engine disagree, engine or guide must be corrected before merge.

--------------------------------------------------

## 2) Mandatory Page Architecture

Every guide page must include:
- `"use client"`
- `useState` mode toggle with exactly two modes:
  - `quick`
  - `deep`
- Header with:
  - problem label strip
  - title
  - subtitle
  - topic badges
  - `Quick Recap` and `Deep Explain` toggle
  - route actions:
    - `Visual Editor` (interactive page)
    - `Tree Problems` (topic listing)
- Main content switch:
  - `mode === "quick" ? <QuickMode /> : <DeepMode />`
- Bottom CTA card with `Open Visualizer` button

Do not add third mode.
Do not remove either route action.

--------------------------------------------------

## 3) Quick Mode Section Contract (Strict Order)

Quick mode must present condensed revision content in this order:

1) Problem Statement card
- one-line plain-language statement
- minimum two examples
- constraints block

2) Core Rule or Formula block
- highlighted gradient card
- one canonical formula/rule line
- one short explanation sentence

3) How to Think block
- exactly 3 conceptual steps
- each step includes short primary line + secondary hint

4) Dry Run block
- sample tree visualization OR compact state table
- explicit step progression (must include node/state references)

5) Code block
- Python reference solution
- formatting with readable syntax coloring classes

6) Complexity block
- Time and Space cards
- values must match implementation

7) Interview Uses block
- 3 to 5 concrete follow-up problem links (textual links, not URLs required)

Quick mode language constraints:
- short sentences
- low jargon
- no unresolved assumptions

--------------------------------------------------

## 4) Deep Mode Section Contract (Strict Order)

Deep mode must teach from fundamentals to execution detail.

Deep section order is mandatory:

1) Foundation
- define key terms
- clarify output measurement details (edge vs node, etc.)

2) Strategy comparison
- brute-force summary
- optimal summary
- why optimal wins

3) Recursion or traversal logic
- explain helper contract (inputs, returns, side effects)
- include code excerpt if needed

4) Full trace walkthrough
- chronological steps
- each step includes phase badge + explanation

5) Tabular or card-based dry run
- node-by-node state snapshots
- include changing `best`/result state where relevant

6) Common mistakes
- minimum 4 pitfalls
- each pitfall must include correction hint

7) Interview Q&A or reuse map
- 3 to 5 targeted questions
- or 3 to 5 reusable patterns where this logic appears

Deep mode language constraints:
- beginner-friendly but technically exact
- explain why, not only what
- no contradictions with quick mode

--------------------------------------------------

## 5) Visual and Copy Consistency Rules

Must match existing implemented guides:
- same spacing rhythm (`mb-12`, rounded cards, panel hierarchy)
- same toggle behavior and CTA placement
- same action naming (`Visual Editor`, `Tree Problems`, `Open Visualizer`)
- same tone:
  - supportive
  - instructional
  - concise

Theme rules:
- choose one primary accent family per problem (example: teal/cyan for diameter)
- keep badges, gradient blocks, CTA, and key highlights in that family
- avoid random color mixing across sections

Do not:
- copy another problem title/body and partially rename
- keep unrelated traversal words from another problem
- use placeholders like "TODO", "example pending"

--------------------------------------------------

## 6) Technical Content Integrity Checklist

Before completion, verify:
- output definition matches problem contract
- base case wording matches engine base case
- complexity claims match engine complexity
- dry run result equals algorithm result
- code snippet produces same semantics as engine approach
- mistake list is specific to this problem, not generic filler

If any item fails, page is not done.

--------------------------------------------------

## 7) Required Data Blocks in File (Recommended Shape)

For maintainability, define data arrays near top of file:
- `DRY_RUN_STEPS`
- `TRACE_STEPS`
- `COMMON_MISTAKES`
- `QA_ITEMS` or `INTERVIEW_ITEMS`

Rules:
- keep copy in data arrays, not hardcoded repeatedly in JSX
- no unused arrays/constants
- keep labels and field names readable

--------------------------------------------------

## 8) Mandatory Validation Steps

Run all checks after edits:

1) Static checks
- `npx eslint "src/app/(app)/problems/binary-tree/<slug>-guide/page.tsx"`
- file-level type/diagnostic check in editor

2) Runtime checks
- open guide route and interactive route
- verify no console errors
- verify toggle switches content correctly
- verify both route buttons navigate correctly
- verify CTA button opens the correct interactive page

3) Content checks
- read entire page once in Quick mode
- read entire page once in Deep mode
- verify zero contradictory statements

--------------------------------------------------

## 9) Micro QA Rubric (Pass/Fail)

A guide page passes only if all are true:
- Quick and Deep mode both implemented
- all mandatory section blocks present in required order
- interactive link and topic link both correct
- CTA exists and works
- complexity and formula correct
- dry run and trace are problem-specific
- no copied incorrect terminology from other problems
- lint and diagnostics clean

--------------------------------------------------

## 10) Anti-Pattern List (Never Do)

- Do not write only one long article without Quick/Deep split.
- Do not omit examples or constraints.
- Do not keep traversal-array language for scalar-output problems.
- Do not claim O(n) if implementation is O(n^2).
- Do not keep old route paths after copy.
- Do not ship with dead constants or unused imports.
- Do not make guide more advanced than beginner readability target.

--------------------------------------------------

## 11) PR Evidence Template for Guide Pages

Copy and fill this in review notes:

### Guide file
- Path:
- Problem:
- Interactive route:
- Guide route:

### Section presence
- [ ] Quick mode blocks 1-7 present
- [ ] Deep mode blocks 1-7 present

### Integrity checks
- [ ] Formula/rule matches engine
- [ ] Complexity matches implementation
- [ ] Dry run final value verified
- [ ] Problem-specific mistakes/follow-ups

### Validation
- ESLint result:
- Runtime console check:
- Navigation checks:

--------------------------------------------------

## 12) Copy-Paste Execution Prompt

Use this exact prompt for smaller models:

You must create or upgrade a Tree Read Here guide page using TREE_READ_HERE_PAGE_MICRO_STANDARD.md with zero exceptions.
Implement two modes only (Quick Recap, Deep Explain), include all mandatory sections in strict order, and ensure content exactly matches engine semantics.
Add correct links to Visual Editor, Tree Problems, and Open Visualizer CTA.
Run lint and runtime checks and provide evidence using the guide PR template.

--------------------------------------------------

## 13) Naming Conventions (Hard Lint-Style Rules)

This section is mandatory for all Tree Read Here guide pages.

### Required top-level symbols

Use these exact identifiers unless the page has a documented exception:

- `DRY_RUN_STEPS`
- `TRACE_STEPS`
- `COMMON_MISTAKES`
- `INTERVIEW_ITEMS` or `QA_ITEMS` (at least one required)
- `QuickMode`
- `DeepMode`
- default export page component named `<ProblemName>GuidePage`

### Required mode state naming

Use exactly:

- `const [mode, setMode] = useState<"quick" | "deep">("quick");`

Do not rename to alternatives like `view`, `tab`, `activeMode`, `sectionMode`.

### Required mode labels

Use exactly these toggle labels:

- `Quick Recap`
- `Deep Explain`

Do not substitute synonyms.

### Required route action labels

Use exactly:

- `Visual Editor`
- `Tree Problems`
- `Open Visualizer`

### Constant naming style rules

- All immutable guide data arrays must be `UPPER_SNAKE_CASE`.
- No camelCase names for major data blocks.
- No generic names like `data`, `items`, `list`, `steps` without domain prefix.

### Component block naming rules

- Quick mode JSX must be in `function QuickMode()`.
- Deep mode JSX must be in `function DeepMode()`.
- Do not inline both mode bodies directly inside default export.
- Do not create extra mode components unless explicitly justified.

### Fail conditions (automatic reject)

Reject the guide page update if any are true:

- Missing any required symbol from this section.
- `mode` state not using `"quick" | "deep"`.
- Toggle labels differ from required text.
- Route action labels differ from required text.
- Major guide data blocks not in `UPPER_SNAKE_CASE`.

### Allowed exceptions policy

Exceptions are allowed only if all are provided in PR notes:

- exact symbol being changed
- reason change is required
- compatibility impact
- reviewer approval note

Without this evidence, naming deviations are not allowed.

--------------------------------------------------

This standard is mandatory for all future tree guide page work.

# Think DSA — Folder Structure & Naming Convention Analysis

> **Status**: Analysis only — no files have been renamed or moved. This document establishes the diagnosis and the proposed target standard before any migration begins.

---

## 1. Current Structure Overview

```
frontend/src/
├── app/                         (Next.js App Router)
│   ├── (app)/                   (route group)
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   ├── problems/
│   │   │   ├── binary-tree/     (48 flat subdirectories!)
│   │   │   ├── linked-list/
│   │   │   └── topics/
│   │   ├── profile/
│   │   ├── progress/
│   │   └── settings/
│   ├── 401/
│   ├── 500/
│   ├── landing/
│   ├── globals.css
│   ├── page.module.css          (45KB CSS file!)
│   ├── landing.module.css
│   ├── layout.tsx
│   └── error.tsx
├── components/
│   ├── DSASidebar.tsx           (re-export wrapper)
│   ├── dsa-sidebar.tsx          (actual implementation)
│   ├── app-sidebar.tsx
│   ├── InteractiveShowcase.tsx
│   ├── LandingNav.tsx
│   ├── Logo.tsx
│   ├── ScrollReveal.tsx
│   ├── dsa-icons.tsx
│   ├── error-state.tsx
│   ├── problem-focus-header.tsx
│   ├── problem-list-drawer.tsx
│   ├── theme-provider.tsx
│   └── ui/
│       ├── button.tsx
│       └── tooltip.tsx
├── data/
│   └── problems-data.ts         (690-line monolith)
├── features/
│   ├── trees/
│   │   ├── balancedbinarytree/  (camelCase, no separator)
│   │   ├── balancedtree/        (ambiguous vs balancedbinarytree)
│   │   ├── binary-tree/         (kebab-case, just a data file)
│   │   ├── bottomview/          (camelCase, no separator)
│   │   ├── lc105/               (LeetCode number — opaque name)
│   │   ├── lc106/
│   │   ├── lc114/
│   │   ├── zigzag/
│   │   ├── zigzagtree/          (ambiguous vs zigzag)
│   │   └── shared/
│   └── linked-lists/
│       ├── add-two-numbers/     (kebab-case)
│       ├── detect-cycle-linkedlist/ (vs route: detect-cycle)
│       └── shared/
├── lib/
│   └── utils.ts
└── (no hooks/, types/, config/ etc.)
```

---

## 2. Identified Problems

### 🔴 Critical Issues

#### Problem 1 — Route Directory Names Diverge from Feature Directory Names

| App Route | Feature Module | Mismatch |
|---|---|---|
| `app/.../reverse-a-linkedlist` | `features/linked-lists/reverse-linkedlist` | `-a-` dropped |
| `app/.../detect-cycle` | `features/linked-lists/detect-cycle-linkedlist` | `-linkedlist` appended |
| `app/.../merge-two-sorted-lists` | `features/linked-lists/merge-sorted-lists` | `two-` dropped |
| `app/.../zigzag-level-order` + `zigzag-level-order-traversal` | `features/trees/zigzag` vs `features/trees/zigzagtree` | Two different features, no clear distinction |

**Why it's a problem:** A developer following a URL cannot find the feature code without guessing. Maintenance of route ↔ feature pairing becomes error-prone as the app grows.

---

#### Problem 2 — Opaque LeetCode Number-Based Feature Folder Names

`features/trees/lc105`, `lc106`, `lc114` — these are LeetCode problem numbers that tell you nothing about what the visualizer does.

- `lc105` = Construct Binary Tree from Preorder & Inorder
- `lc106` = Construct Binary Tree from Inorder & Postorder
- `lc114` = Flatten Binary Tree to Linked List

The corresponding app routes **do have descriptive names**, but feature folders don't match them.

**Why it's a problem:** Zero discoverability. When a teammate opens `features/trees/lc106`, they have to look inside to understand what it is.

---

#### Problem 3 — Ambiguous Duplicate-Sounding Feature Folders

Two parallel folders exist with nearly identical names:
- `features/trees/balancedbinarytree/` vs `features/trees/balancedtree/`
- `features/trees/zigzag/` vs `features/trees/zigzagtree/`

**Why it's a problem:** Confusion causes incorrect file edits in the wrong module. High risk of accidental cross-contamination.

---

#### Problem 4 — Inconsistent File Naming Convention in `components/`

| Convention | Files |
|---|---|
| PascalCase | `DSASidebar.tsx`, `InteractiveShowcase.tsx`, `LandingNav.tsx`, `Logo.tsx`, `ScrollReveal.tsx` |
| kebab-case | `dsa-sidebar.tsx`, `app-sidebar.tsx`, `dsa-icons.tsx`, `error-state.tsx`, `problem-focus-header.tsx`, `problem-list-drawer.tsx`, `theme-provider.tsx` |

Two naming systems running in parallel in the same flat directory.

---

#### Problem 5 — Redundant Re-export Wrapper File

`components/DSASidebar.tsx` is a 3-line file that simply re-exports from `dsa-sidebar.tsx`. Adds an extra file, an import indirection, and a false naming convention signal.

---

#### Problem 6 — Feature Module Root Files with No Consistent Pattern

Some modules have a root-level layout re-export file (`lc105/Lc105Layout.tsx`, `zigzag/ZigzagVisualization.tsx`), others have an `index.ts` barrel (`zigzag/index.ts`), and most have neither. No consistent entry point pattern across feature modules.

---

### 🟡 Moderate Issues

#### Problem 7 — 48 Flat App Route Directories Under `binary-tree/`

Every problem and its guide sits flat at the same level with no grouping. Every new problem requires a manual new directory (new route folder + new feature module + data entry).

#### Problem 8 — Guide Pages as 700-Line Inline Files

Files like `app/(app)/problems/binary-tree/inorder-guide/page.tsx` are 699 lines containing types, data, SVG constants, and React components all inlined in a page file. No reuse possible.

#### Problem 9 — `data/` Folder Has Only One 690-Line Monolith File

`data/problems-data.ts` mixes: type definitions, all problem sections, URL generation logic, and difficulty mapping — all in one file.

#### Problem 10 — `UnifiedControlsBar.tsx` Duplicated Across Feature Boundaries

`features/trees/shared/components/UnifiedControlsBar.tsx` and `features/linked-lists/shared/components/UnifiedControlsBar.tsx` are the same filename and likely near-identical files. Any fix must be applied in two places.

#### Problem 11 — `useTraversalKeyboardShortcuts.ts` Duplicated Across Feature Boundaries

Same file exists in both `features/trees/shared/` and `features/linked-lists/shared/`. Same problem as above.

#### Problem 12 — `app/(app)/layout.tsx` Contains a Hard-Coded List of 28 Routes

The layout file contains a static `const traversalRoutes = [...]` array with 28 hardcoded URL strings. Every time a new visualizer is added, this file must be manually updated or layouts break.

#### Problem 13 — `features/trees/binary-tree/` Is a Folder Containing Only One File

`features/trees/binary-tree/problemData.ts` — a single file in its own directory. Should live in `data/` or `features/trees/shared/`.

#### Problem 14 — `page.module.css` (45KB) at App Root Level

A 45KB CSS module at `src/app/page.module.css` with no clear, scoped usage.

---

### 🟢 Minor Issues

- `features/linked-lists/shared/linked-list-types.ts` uses a different naming pattern vs `features/trees/shared/types.ts`
- No `index.ts` barrel files in most feature modules (inconsistent — `zigzag` has one, `inorder` doesn't)
- `features/trees/zigzag/ZigzagVisualization.tsx` at root level while other features use different patterns

---

## 3. Proposed Target Architecture

### Naming Convention Standard

| Artifact | Convention | Example |
|---|---|---|
| React Component files | `PascalCase.tsx` | `TreePanel.tsx`, `CodePanel.tsx` |
| Hook files | `camelCase.ts` with `use` prefix | `useInorderTraversal.ts` |
| Utility / helper files | `camelCase.ts` | `treeUtils.ts` |
| Type definition files | `types.ts` per module | `types.ts` |
| Constant files | `constants.ts` | `constants.ts` |
| Feature module directories | `kebab-case`, descriptive, matching route | `inorder-traversal/` |
| App route directories | `kebab-case` (Next.js enforced) | `inorder-traversal/` |
| Shared component directories | `kebab-case` | `shared/` |
| CSS module files | `ComponentName.module.css` | `LandingPage.module.css` |

---

## 4. Migration Priority

| Priority | Problem # | Description | Risk |
|---|---|---|---|
| **P0** | 4, 5 | Standardize `components/` naming, delete `DSASidebar.tsx` shim | Low |
| **P0** | 2 | Rename `lc105`, `lc106`, `lc114` to descriptive kebab-case | Medium |
| **P0** | 3 | Rename ambiguous folders (`balancedbinarytree`, `balancedtree`, `zigzag`, `zigzagtree`) | Medium |
| **P1** | 1 | Align feature dir names with route names | Medium |
| **P1** | 10, 11 | De-duplicate `UnifiedControlsBar.tsx` and `useTraversalKeyboardShortcuts.ts` | Low |
| **P1** | 9 | Split `problems-data.ts` monolith | Low |
| **P2** | 12 | Replace hardcoded route list in layout with pattern matching | Low |
| **P2** | 13 | Move `features/trees/binary-tree/problemData.ts` to proper location | Low |
| **P3** | 7, 8 | Consolidate guide pages and route directories | High |

> Any rename of feature directories requires updating every `import` statement that references that path.
> P0 and P1 items have zero user-visible impact.
> P3 items involve URL changes and need redirect planning if the site is publicly indexed.

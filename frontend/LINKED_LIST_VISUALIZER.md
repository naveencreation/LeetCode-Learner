# Linked List Visualizer — Complete Implementation Reference

> **Purpose of this document:** A comprehensive technical reference for any AI or developer continuing work on this codebase. It covers every file, every design decision, every data flow, and every pattern used to build the Linked List visualizer framework and the first problem (Reverse a Linked List). Read this before touching any linked list feature files.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [File Tree](#2-file-tree)
3. [Shared Framework Layer](#3-shared-framework-layer)
4. [Reverse LinkedList Feature Layer](#4-reverse-linkedlist-feature-layer)
5. [Data Flow — End to End](#5-data-flow--end-to-end)
6. [The Engine — Step Generation](#6-the-engine--step-generation)
7. [The Generic Hook — useGenericLinkedList](#7-the-generic-hook--usegenericlinkedlist)
8. [The Shell — LinkedListShell](#8-the-shell--linkedlistshell)
9. [The SVG Renderer — LinkedListSVG](#9-the-svg-renderer--linkedlistsvg)
10. [The UI Panels](#10-the-ui-panels)
11. [The Setup Modal — ListSetupModal](#11-the-setup-modal--listsetupmodal)
12. [Routing & Sidebar](#12-routing--sidebar)
13. [CSS Animations](#13-css-animations)
14. [How to Add a New Linked List Problem](#14-how-to-add-a-new-linked-list-problem)
15. [Design Decisions & Gotchas](#15-design-decisions--gotchas)

---

## 1. Architecture Overview

The visualizer is split into two distinct layers:

```
┌─────────────────────────────────────────────────────────┐
│                SHARED FRAMEWORK LAYER                   │
│  Re-usable for every linked list problem                │
│                                                         │
│  linked-list-types.ts      — ListNode, states, presets  │
│  useGenericLinkedList.ts   — step engine + playback     │
│  LinkedListShell.tsx       — page layout + header       │
│  LinkedListSVG.tsx         — SVG renderer               │
└─────────────────────────────────────────────────────────┘
          ↑ depends on
┌─────────────────────────────────────────────────────────┐
│             PROBLEM-SPECIFIC FEATURE LAYER              │
│  One folder per problem: features/reverse-linkedlist/   │
│                                                         │
│  types.ts                  — op types, ExecutionStep    │
│  engine.ts                 — step generation algorithm  │
│  constants.ts              — Python code, line map      │
│  selectors.ts              — phase/badge/codeline fns   │
│  useReverseLinkedList.ts   — wires engine into generic  │
│  components/               — all UI panels              │
└─────────────────────────────────────────────────────────┘
```

**Key design principle:** The generic framework knows nothing about "reversing" — it only knows about step navigation, playback, and rendering a linked list. Problem-specific logic (step generation, code, explanations) lives entirely in the feature folder.

This mirrors exactly how tree problems work (`features/shared/useGenericTraversal.ts` + `features/inorder/`, etc.), so any developer familiar with the tree visualizer pattern will immediately understand this.

---

## 2. File Tree

```
src/
├── features/
│   ├── shared/
│   │   ├── linked-list-types.ts          ← NEW: shared LL types + helpers
│   │   ├── useGenericLinkedList.ts        ← NEW: generic LL hook
│   │   └── components/
│   │       ├── LinkedListShell.tsx        ← NEW: page shell layout
│   │       └── LinkedListSVG.tsx          ← NEW: SVG node chain renderer
│   │
│   └── reverse-linkedlist/               ← NEW: first LL problem
│       ├── types.ts
│       ├── engine.ts
│       ├── constants.ts
│       ├── selectors.ts
│       ├── useReverseLinkedList.ts
│       └── components/
│           ├── ReverseLinkedListLayout.tsx  ← top-level page component
│           ├── CodePanel.tsx
│           ├── LinkedListPanel.tsx
│           ├── ResultPanel.tsx
│           ├── ExplanationPanel.tsx
│           ├── PointerStatePanel.tsx
│           └── ListSetupModal.tsx
│
├── app/
│   ├── (app)/
│   │   ├── layout.tsx                   ← MODIFIED: sidebar hide logic
│   │   └── problems/
│   │       └── linked-list/
│   │           └── reverse-a-linkedlist/
│   │               └── page.tsx          ← NEW: Next.js route
│   └── globals.css                       ← MODIFIED: added LL keyframes
│
└── app/(app)/problems/page.tsx           ← MODIFIED: getProblemHref mapping
```

---

## 3. Shared Framework Layer

### 3.1 `linked-list-types.ts`

**Path:** `src/features/shared/linked-list-types.ts`

The single source of truth for all linked list type definitions and utility functions.

#### Key Types

```typescript
interface ListNode {
  val: number;
  next: ListNode | null;
}
```
This is the runtime linked list node. The engine builds actual `ListNode` chains in memory and walks them to generate steps.

```typescript
type LinkedListNodeState =
  | "unvisited"
  | "prev"
  | "current"
  | "next_saved"
  | "reversed"
  | "completed";
```
These are the 6 possible visual states of a node at any given step. The SVG renderer maps each state to a unique color scheme. Note: the `prev` state is defined here but the engine for Reverse LinkedList actually uses `completed` for nodes that have had their link reversed — `prev` in the type exists for future problems that may need it.

```typescript
type LinkedListPresetKey = "short" | "medium" | "long" | "single" | "two_nodes";
```
Preset keys that the `ListSetupModal` and `useGenericLinkedList` understand. Default sample list uses `"medium"` (5 nodes: 1→2→3→4→5).

#### Utility Functions

- `createLinkedList(values: number[]): ListNode | null` — builds a linked list from an array
- `linkedListToArray(head): number[]` — flattens back to array
- `cloneLinkedList(head): ListNode | null` — deep clone (important: the hook always clones before storing to prevent mutation)

#### `linkedListPresets` map
```typescript
{
  short:     { label: "3 Nodes", create: () => createLinkedList([1, 2, 3]) },
  medium:    { label: "5 Nodes", create: () => createLinkedList([1, 2, 3, 4, 5]) },
  long:      { label: "7 Nodes", create: () => createLinkedList([1, 2, 3, 4, 5, 6, 7]) },
  single:    { label: "1 Node",  create: () => createLinkedList([1]) },
  two_nodes: { label: "2 Nodes", create: () => createLinkedList([1, 2]) },
}
```

---

### 3.2 `useGenericLinkedList.ts`

**Path:** `src/features/shared/useGenericLinkedList.ts`

The generic React hook that every linked list problem hooks into. Analogous to `useGenericTraversal` for tree problems.

#### Configuration Interface

```typescript
interface GenericLinkedListConfig<TStep> {
  generateSteps: (head: ListNode | null) => {
    executionSteps: TStep[];
    initialNodeStates: Record<number, LinkedListNodeState>;
    originalValues: number[];
  };
  presets: Record<LinkedListPresetKey, LinkedListPreset>;
  createSampleList: () => ListNode | null;
  getCodeLineForStep: (step: TStep | undefined) => number;
  getOperationBadge:  (step: TStep | undefined) => string;
  getPhaseLabel:      (step: TStep | undefined) => string;
  getNodeStatesForStep: (
    currentStep: number,
    executionSteps: TStep[],
    initialNodeStates: Record<number, LinkedListNodeState>
  ) => Record<number, LinkedListNodeState>;
}
```

The config is passed in by the problem-specific hook (e.g. `useReverseLinkedList`). The generic hook never imports anything from a problem folder — all problem-specific logic is injected via this config object.

#### State managed internally

| State | Type | Purpose |
|-------|------|---------|
| `head` | `ListNode \| null` | The current list being visualized |
| `selectedPreset` | `LinkedListPresetKey` | Which preset is active (for modal highlight) |
| `controlMode` | `"manual" \| "auto"` | Manual stepping or auto-play |
| `isPlaying` | `boolean` | Auto-play active |
| `autoPlaySpeedMs` | `number` | Auto-play interval (default 900ms) |
| `currentStep` | `number` | Index into executionSteps (0 = before start) |

#### Step indexing convention (IMPORTANT)

- `currentStep = 0` means "before any step has been executed" — initial state
- `currentStep = N` means N steps have been executed
- `activeStep = executionSteps[currentStep]` — the step about to be shown
- `executedStep = executionSteps[currentStep - 1]` — the last completed step
- `displayStep = executedStep ?? activeStep` — derived in `ReverseLinkedListLayout`, then passed to panels

This means the displayed state is always **the result of the last executed step**, not the step currently queued. In this implementation, `displayStep` is derived in the layout and passed through panel props.

#### Auto-play

Uses `window.setInterval` inside a `useEffect`. The interval is torn down and rebuilt whenever `controlMode`, `isPlaying`, `currentStep`, or `autoPlaySpeedMs` changes. Safe — no memory leaks.

#### Keyboard shortcuts

Delegates to `useTraversalKeyboardShortcuts` from shared — same ← → and R shortcuts as tree problems.

#### `applyListConfiguration`

```typescript
applyListConfiguration(nextHead: ListNode | null, preset: LinkedListPresetKey, runImmediately = false)
```
Called by `ListSetupModal`. Clones the head (never stores the raw modal-created node), updates preset, resets step to 0 (or 1 if `runImmediately`).

---

### 3.3 `LinkedListShell.tsx`

**Path:** `src/features/shared/components/LinkedListShell.tsx`

The page-level layout shell. Analogous to `TraversalShell` for tree problems.

#### Slot Props (mirrors TraversalShell exactly)

```
left          → CodePanel
middleTop     → LinkedListPanel (SVG visualization)
middleBottom  → ResultPanel
middleFooter  → UnifiedControlsBar
rightTop      → PointerStatePanel
rightBottom   → ExplanationPanel
modal         → ListSetupModal (conditionally rendered)
```

#### What it does

1. Renders the purple/lavender background gradient (`#f0f0ff → #fdfdfc → #eef4fb`) with radial overlay blobs
2. Renders `ProblemFocusHeader` with hardcoded `backHref="/problems/topics/linked-list#problem-list"` and `backLabel="Back To Linked List"`
3. Injects a **"Reset Layout"** button into the header's `extraActions` slot — calls `resetLayout()` which is wired from `ResizableTraversalGrid`'s `onResetReady` callback
4. Passes all 6 content slots into `ResizableTraversalGrid` — this is what gives the panel drag-to-resize, localStorage persistence, and collapse behavior

#### Background design

```
bg: linear-gradient(140deg, #f0f0ff 0%, #fdfdfc 60%, #eef4fb 100%)
overlay: radial-gradient(purple blob at 15% 20%) + radial-gradient(pink blob at 82% 10%)
```
This gives the LL visualizer a distinct purple-tinted identity vs. the teal/green tree visualizer.

---

### 3.4 `LinkedListSVG.tsx`

**Path:** `src/features/shared/components/LinkedListSVG.tsx`

The pure SVG renderer for the linked list chain. Receives only declarative data — no engine, no hook. Fully re-usable for any linked list problem.

#### Props

```typescript
interface LinkedListSVGProps {
  values: number[];          // original node values in order [1, 2, 3, 4, 5]
  nodeStates: Record<number, LinkedListNodeState>; // val → visual state
  links: Record<number, number | null>;            // val → next val (or null)
  pointers: { prev: number | null; curr: number | null; nextSaved: number | null };
}
```

**CRITICAL:** `values` is the **original order** of values, used to determine node positions. `links` is the **current state of next pointers**, which changes as the algorithm runs (reversed links will point backwards). This is the key distinction that enables the animated arrow reversal.

#### Layout Constants

```
NODE_W  = 72     node total width
NODE_H  = 48     node height
DIVIDER = 48     x-split inside node: 0..48 is value zone, 48..72 is "next" zone
GAP     = 52     horizontal gap between nodes
PAD_X   = 36     left/right padding
BADGE_H = 24     pointer badge height
BADGE_PAD_TOP = 12  space above chain for badges
CHAIN_Y = BADGE_H + BADGE_PAD_TOP + 8 = 44  y-coordinate of node tops
NULL_W  = 44     width of null terminal box
```

#### Node Design — Two-Zone Memory Diagram

Each node is rendered as a realistic CS textbook memory cell:

```
┌──────────────┬─────────┐
│      3       │  next   │  ← two fill colors
│   (value)    │ pointer │
└──────────────┴─────────┘
         ↑ divider at x=48
```

- Left zone (0–48): value, lighter tint of state color
- Right zone (48–72): "next" label, darker tint of state color
- Divider line at `x=48`, slightly opaque
- Drop shadow via SVG `<filter id="ll-shadow">` with `<feDropShadow>`

#### State Color Scheme

| State | valFill | nextFill | stroke | text |
|-------|---------|----------|--------|------|
| unvisited | #f1f5f9 | #e2e8f0 | #94a3b8 | #475569 |
| prev | #ffe4e6 | #fecdd3 | #f43f5e | #881337 |
| current | #fef9c3 | #fde68a | #d97706 | #78350f |
| next_saved | #dbeafe | #bfdbfe | #3b82f6 | #1e3a5a |
| reversed | #ede9fe | #ddd6fe | #8b5cf6 | #3b0764 |
| completed | #dcfce7 | #bbf7d0 | #22c55e | #14532d |

#### Glow Ring + Pop Animation

Active nodes (any state except `unvisited`) get:
1. A pulsing outer `<rect>` glow ring: `animation: llPulse 1.6s ease-in-out infinite`
2. The node `<g>` key is `node-${val}-${state}` — changing state forces React to remount the `<g>` which re-triggers the `llNodePop` CSS animation (scale 1 → 1.09 → 1 in 320ms)

```tsx
key={`node-${val}-${state}`}  // state in key = remount on state change = re-animation
style={{ animation: "llNodePop 320ms ...", transformOrigin: "cx cy" }}
```

#### Arrow Rendering

Arrows are drawn **before nodes** in the SVG (lower z-order), so they appear behind the node boxes.

Three arrow types:
1. **Forward arrow** (target index > source index): horizontal `<line>`, slate color, turns emerald when source is `completed`
2. **Reversed arc** (target index < source index): cubic bezier `<path>` drawn **above** the chain. Arc height = `32 + |i - targetIdx| * 6` — longer arcs go higher to prevent overlap
3. **Null arrow**: dashed `<line>` to the null terminal box

SVG `<marker>` definitions (in `<defs>`):
- `ll-fwd`: slate arrowhead
- `ll-done`: emerald arrowhead (completed forward links)
- `ll-rev`: purple arrowhead pointing left (reversed arc, `orient="auto-start-reverse"`)
- `ll-null`: grey dashed arrowhead

#### Pointer Badge Rendering

Pointer badges are drawn **after nodes** (higher z-order), appearing above the chain.

```
          ┌─────┐
          │ curr│  ← colored pill badge
          └──┬──┘
             │      ← vertical stem
             ▼      ← triangle tip
        ┌─────────┐
        │    3    │ next │
        └─────────┘
```

**Stagger logic for same-node pointers:** When `prev`, `curr`, and/or `next` all point to the same node, they are arranged side-by-side:
```typescript
const totalW = ptrs.length * badgeW + (ptrs.length - 1) * 4;
const startX = cx - totalW / 2;
const bx = startX + slot * (badgeW + 4);
```
This prevents overlap by centering the group of badges over the node's center x.

The `ptrByIndex` map is computed with `useMemo`:
```typescript
// Groups pointers by which node index they point to
const ptrByIndex: Record<number, Array<PointerConfig>> = { ... }
```

---

## 4. Reverse LinkedList Feature Layer

### 4.1 `types.ts`

**Path:** `src/features/reverse-linkedlist/types.ts`

```typescript
type ReverseOperationType =
  | "init"          // prev=None, curr=head
  | "save_next"     // next_node = curr.next
  | "reverse_link"  // curr.next = prev
  | "move_prev"     // prev = curr
  | "move_curr"     // curr = next_node
  | "complete";     // return prev

interface PointerSnapshot {
  prev: number | null;       // node value prev points to
  curr: number | null;       // node value curr points to
  nextSaved: number | null;  // node value next_node points to
}

interface ExecutionStep {
  type: ReverseOperationType;
  operation: string;                         // human-readable description
  nodeStates: Record<number, LinkedListNodeState>; // full state snapshot
  pointers: PointerSnapshot;                 // pointer values at this moment
  links: Record<number, number | null>;      // full links snapshot (next-pointer map)
}
```

**Why snapshot everything per step?** Because the visualizer must be freely scrubbable — stepping forward AND backward. Each step is a complete immutable snapshot of the entire visual state, so jumping to any step is O(1) with no need to re-simulate.

---

### 4.2 `engine.ts`

**Path:** `src/features/reverse-linkedlist/engine.ts`

The pure function that simulates the reversal algorithm and captures one `ExecutionStep` per meaningful operation.

#### Algorithm Simulated

```python
def reverseList(head):
    prev = None
    curr = head
    while curr:
        next_node = curr.next   # save_next
        curr.next = prev        # reverse_link
        prev = curr             # move_prev
        curr = next_node        # move_curr
    return prev                 # complete
```

#### Step Count Formula

For a list of `n` nodes: `1 (init) + n * 4 (save_next + reverse_link + move_prev + move_curr) + 1 (complete)` = `4n + 2` steps.

For the default 5-node list: `4×5 + 2 = 22 steps`.

#### Snapshot Strategy

Three clone helpers are used at every step push:
```typescript
cloneStates(nodeStates)  // shallow clone of state record
cloneLinks(links)        // shallow clone of links record
snap(pointers)           // shallow clone of pointer snapshot
```
These are shallow clones of flat records (all values are primitives), so they are efficient.

#### State Transitions per Node

When processing node `curr`:
1. `save_next` step: `nodeStates[nextNode.val] = "next_saved"`
2. `reverse_link` step: `nodeStates[curr.val] = "reversed"`
3. `move_prev` step: `nodeStates[curr.val] = "completed"`
4. `move_curr` step: clean up any `"next_saved"` back to `"unvisited"`, advance curr to `"current"`

The `links` record is mutated at `reverse_link`:
```typescript
links[curr.val] = prev?.val ?? null;  // THIS is what makes the SVG arrow flip
```

---

### 4.3 `constants.ts`

**Path:** `src/features/reverse-linkedlist/constants.ts`

Contains:
1. `PYTHON_CODE` — the raw Python code string (12 lines)
2. `PYTHON_CODE_LINES = PYTHON_CODE.split("\n")` — used by `CodePanel`
3. `OPERATION_TO_LINE_MAP` — maps each `ReverseOperationType` to a 1-indexed line number

```typescript
const OPERATION_TO_LINE_MAP: Record<ReverseOperationType, number> = {
  init: 2,          // "prev = None"
  save_next: 7,     // "next_node = curr.next"
  reverse_link: 8,  // "curr.next = prev"
  move_prev: 9,     // "prev = curr"
  move_curr: 10,    // "curr = next_node"
  complete: 12,     // "return prev"
};
```

Line numbers are 1-indexed to match the CodePanel's line number display.

---

### 4.4 `selectors.ts`

**Path:** `src/features/reverse-linkedlist/selectors.ts`

Three pure functions, all accepting `ExecutionStep | undefined`:

```typescript
getPhaseLabel(step)     → "Initialize" | "Save Next" | "Reverse Link" | ...
getCodeLineForStep(step) → number (1-indexed line)
getOperationBadge(step) → "READY" | "INIT" | "SAVE NEXT" | ...
```

`getOperationBadge` returns `step.type.toUpperCase().replace("_", " ")`.

---

### 4.5 `useReverseLinkedList.ts`

**Path:** `src/features/reverse-linkedlist/useReverseLinkedList.ts`

Thin adapter that creates the config object and calls `useGenericLinkedList(config)`.

```typescript
const config = useMemo(() => ({
  generateSteps: generateReverseSteps,
  presets: linkedListPresets,
  createSampleList: () => createLinkedList([1, 2, 3, 4, 5]),
  getCodeLineForStep,
  getOperationBadge,
  getPhaseLabel,
  getNodeStatesForStep: (currentStep, executionSteps, initialNodeStates) => {
    if (currentStep === 0) return { ...initialNodeStates };
    const stepIndex = Math.min(currentStep, executionSteps.length) - 1;
    return { ...executionSteps[stepIndex].nodeStates };
  },
}), []);
```

The `config` is memoized with `[]` deps — it never changes. This is important to prevent `useGenericLinkedList`'s `useMemo(() => config.generateSteps(head), [head, config])` from re-running unnecessarily.

---

## 5. Data Flow — End to End

```
User clicks "Next Step"
        │
        ▼
useReverseLinkedList() → useGenericLinkedList(config)
        │
        │  setCurrentStep(prev + 1)
        ▼
nodeStates = config.getNodeStatesForStep(currentStep, executionSteps, initialNodeStates)
        │           = executionSteps[currentStep - 1].nodeStates (snapshot from engine)
        ▼
displayStep = executedStep ?? activeStep (derived in layout)
        │
  ├─→ LinkedListPanel receives: originalValues, nodeStates, activeStep prop (= displayStep)
        │       └─→ LinkedListSVG receives: values, nodeStates, links (from step), pointers (from step)
        │               └─→ SVG re-renders with new node colors, arrow directions, badge positions
        │
  ├─→ ResultPanel receives: currentNode (from pointers.curr), currentPhase, activeStep prop (= displayStep)
        │       └─→ Shows gradient cards + animated reversed-portion badges
        │
  ├─→ PointerStatePanel receives: activeStep prop (= displayStep)
        │       └─→ Shows prev/curr/next values
        │
  ├─→ ExplanationPanel receives: currentStep, activeStep prop (= displayStep), currentCodeLine
        │       └─→ Shows structured title/description/details for the step type
        │
        └─→ CodePanel receives: currentCodeLine (= getCodeLineForStep(displayStep))
                └─→ Highlights the active Python line
```

---

## 6. The Engine — Step Generation

The engine runs **once per list configuration change** (not per step click). All `4n+2` steps are pre-computed eagerly. This approach:
- Makes stepping O(1) — just index into the array
- Makes the visualizer reversible — no need to re-simulate backwards
- Is consistent with how all tree traversal engines work in this codebase

#### Engine Input/Output

```typescript
generateReverseSteps(head: ListNode | null) → {
  executionSteps: ExecutionStep[],        // all steps pre-computed
  initialNodeStates: Record<number, LinkedListNodeState>,  // all "unvisited"
  originalValues: number[],              // [1, 2, 3, 4, 5]
}
```

`originalValues` is critical — it captures the order of nodes **before** any reversal. The SVG uses this to determine node positions. Even after the links are reversed, nodes stay at their original screen positions (what changes is the arrow directions).

---

## 7. The Generic Hook — useGenericLinkedList

See Section 3.2 for full detail. Key return values to know:

| Return Value | Description |
|---|---|
| `originalValues` | Array of node values in original order (used for SVG positioning) |
| `executionSteps` | All pre-computed steps |
| `currentStep` | Current step index (0 = before start) |
| `nodeStates` | Current visual state per node value |
| `activeStep` | `executionSteps[currentStep]` — the upcoming step |
| `executedStep` | `executionSteps[currentStep - 1]` — the just-completed step |
| `displayStep` (derived in layout) | `executedStep ?? activeStep`; not returned directly by `useGenericLinkedList` |
| `isAtStart` | `currentStep === 0` |
| `isAtEnd` | `currentStep === executionSteps.length` |
| `applyListConfiguration` | Call to change list (from modal) |
| `selectedPreset` | Pass to modal to highlight active preset |

---

## 8. The Shell — LinkedListShell

See Section 3.3. Key things another AI needs to know:

- **Slot names are identical to `TraversalShell`**: `left`, `middleTop`, `middleBottom`, `middleFooter`, `rightTop`, `rightBottom`, `modal`
- Uses `ResizableTraversalGrid` — the same component as tree problems. Columns are draggable, layout is persisted in `localStorage`, each panel has collapse behavior
- The `"Reset Layout"` button is built into the shell — it does **not** need to be added by the layout component
- `topicKey` defaults to `"linked-list"` — drives the Problem List drawer content
- `backHref` is hardcoded to `"/problems/topics/linked-list#problem-list"` — change this if the topics page URL changes

---

## 9. The SVG Renderer — LinkedListSVG

See Section 3.4. Key things another AI needs to know:

- **Props are purely declarative** — no engine imports, no hooks. Just renders what it's given
- **`values` = original order, `links` = current next-pointer state** — this distinction is critical. `values` never changes (positions are stable), `links` changes as reversal progresses
- **Reversed arrows go above the chain** (negative Y arcs). Forward arrows go at node centerline
- **Badge stagger** prevents overlap when multiple pointers are on the same node
- **`key={node-${val}-${state}}`** on node `<g>` elements — including state in the key forces React remount → re-triggers CSS animation on every state change. This is intentional.
- The SVG is responsive: `viewBox` is computed from node count, `preserveAspectRatio="xMidYMid meet"`, and the container is `overflow-hidden` with a gradient background

---

## 10. The UI Panels

### Panel: `CodePanel`

- Shows syntax-highlighted Python code with line numbers
- Toggle between "Snippet" (only executed lines) and "Full Code" views
- Active line highlighted with blue `bg-[#264f78]/60 ring-1 ring-[#264f78]`
- `CopyCodeButton` in header copies `PYTHON_CODE_LINES`

### Panel: `LinkedListPanel`

- `grid-rows-[auto_1fr]` — header row + full-height SVG area
- Operation badge shown inline in header (not a separate bottom bar)
- "Select List" pill button triggers `onOpenListSetup` callback → opens `ListSetupModal`
- SVG container background: `from-[#f8faff] to-[#f0f4fb]` (blue-tinted gradient)

### Panel: `ResultPanel`

- `grid-rows-[auto_minmax(0,1fr)]` — header + scrollable body
- Two gradient teal cards: "Current Node" (shows `pointers.curr`) and "Phase"
- "Reversed So Far" section: builds the reversed portion by walking `links` from `pointers.prev`
  ```typescript
  let v: number | null = prevVal;
  while (v !== null && !visited.has(v)) {
    reversedSoFar.push(v);
    v = links[v] ?? null;
  }
  ```
- Reversed nodes shown as animated pop-in badges (`animate-badge-pop`)
- Step message bar: amber (in progress) or emerald (complete) with icon

### Panel: `PointerStatePanel`

- Shows `prev`, `curr`, `next_node` values in colored pill cards
- Rose/Amber/Blue color scheme matching SVG badge colors exactly
- Idle state (step 0): centered "Pointers are empty" message
- "Current Action" section shows the raw operation string from the step

### Panel: `ExplanationPanel`

- `grid-rows-[auto_1fr_auto]` — header + explanation card + legend
- Explanation card: cyan gradient (`from-cyan-50 to-sky-50`) with title + description + `details[]` list
- `getExplanation(step, currentStep, totalSteps, currentCodeLine)` function returns a structured `{ title, description, details[] }` object — different content per `step.type`
- Bottom legend grid: 6 colored circles with labels matching SVG state colors
- Line reference shown at bottom of explanation: `"Line {currentCodeLine} | Step N of M"`

---

## 11. The Setup Modal — ListSetupModal

**Path:** `src/features/reverse-linkedlist/components/ListSetupModal.tsx`

Loaded with `dynamic()` import to avoid bundle bloat:
```typescript
const ListSetupModal = dynamic(() =>
  import("./ListSetupModal").then((m) => m.ListSetupModal),
);
```

#### UX Behavior

- Clicking a preset tile: deactivates custom mode, selects preset, shows preview
- Clicking the custom input: activates custom mode, deactivates preset tiles
- Preset preview renders an inline mini chain of node boxes
- Validation: integers only, max 15 nodes, at least 1 node
- Three footer buttons: Cancel / Apply (reset to step 0) / Apply & Run (jump to step 1)
- Backdrop click and Escape key close the modal
- Animation: `animate-scale-in` (scaleIn keyframe)

#### Callback signatures

```typescript
onApply(head: ListNode | null, preset: LinkedListPresetKey)    // apply, keep at step 0
onApplyAndRun(head: ListNode | null, preset: LinkedListPresetKey) // apply, jump to step 1
```

Both call `applyListConfiguration(head, preset, runImmediately)` from the hook.

Note: when custom input mode is used, the modal currently returns `preset: "medium"` for state tracking.

---

## 12. Routing & Sidebar

### Route

**Path:** `src/app/(app)/problems/linked-list/reverse-a-linkedlist/page.tsx`

```typescript
"use client";
import { ReverseLinkedListLayout } from "@/features/reverse-linkedlist/components/ReverseLinkedListLayout";
export default function ReverseLinkedListPage() {
  return <ReverseLinkedListLayout />;
}
```

Minimal — just renders the layout. It is currently marked `"use client"` in this repo; technically, a Server Component page can also render a Client Component layout.

### Sidebar Suppression

**File:** `src/app/(app)/layout.tsx`

The app sidebar is suppressed for all linked list visualizer routes via two mechanisms:

```typescript
// 1. Added to traversalRoutes array (gives full-screen h-screen layout):
"/problems/linked-list/reverse-a-linkedlist",

// 2. Added isLinkedListProblemRoute check:
const isLinkedListProblemRoute = pathname.startsWith("/problems/linked-list/");
const isProblemFocusPage = isTraversalPage || isBinaryTreeProblemRoute || isLinkedListProblemRoute;
```

When `isTraversalPage = true` (route is in `traversalRoutes`): the main gets `"flex h-screen flex-1 flex-col overflow-hidden p-0"` — full viewport height, no padding, no overflow.

When adding new LL problems: add their route string to `traversalRoutes`. The `isLinkedListProblemRoute` catch-all handles guide pages and other `/problems/linked-list/` sub-routes.

### Problem List Drawer Mapping

**File:** `src/app/(app)/problems/page.tsx`

`getProblemHref` function has an explicit mapping:
```typescript
if (sectionName === "Linked List" && problemName === "Reverse a LinkedList") {
  return "/problems/linked-list/reverse-a-linkedlist";
}
```

This makes the Problem List drawer highlight the correct item and creates a working link. Every new LL problem needs its own entry here.

---

## 13. CSS Animations

**File:** `src/app/globals.css`

Three keyframes added for linked list:

```css
@keyframes llNodePop {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.09); }
  100% { transform: scale(1); }
}
/* Used on node <g> when state changes. 320ms spring easing. */

@keyframes llPulse {
  0%, 100% { opacity: 0.55; }
  50%       { opacity: 1; }
}
/* Used on glow ring <rect>. 1.6s infinite. */

@keyframes llDashFlow {
  from { stroke-dashoffset: 24; }
  to   { stroke-dashoffset: 0; }
}
/* Available for future use — e.g. animating a link being reversed. */
```

These are applied inline via `style={{ animation: "..." }}` in `LinkedListSVG` — not via Tailwind class utilities — because SVG elements don't support Tailwind's `animate-*` utilities reliably.

The existing `animate-badge-pop` class (from `badgePopIn` keyframe) is reused in `ResultPanel` for the reversed-node badges.

---

## 14. How to Add a New Linked List Problem

Follow these exact steps to add, say, "Detect Cycle in Linked List":

### 1. Create the feature folder

```
src/features/detect-cycle/
├── types.ts
├── engine.ts
├── constants.ts
├── selectors.ts
├── useDetectCycle.ts
└── components/
    ├── DetectCycleLayout.tsx
    ├── CodePanel.tsx
    ├── LinkedListPanel.tsx
    ├── ResultPanel.tsx
    ├── ExplanationPanel.tsx
    └── (problem-specific panels...)
```

### 2. Define types

```typescript
// types.ts
type DetectCycleOpType = "init" | "advance_slow" | "advance_fast" | "found_cycle" | "no_cycle";

interface ExecutionStep {
  type: DetectCycleOpType;
  operation: string;
  nodeStates: Record<number, LinkedListNodeState>;
  pointers: { slow: number | null; fast: number | null };
  // No links needed if list doesn't change structure
}
```

### 3. Write the engine

```typescript
// engine.ts
export function generateDetectCycleSteps(head: ListNode | null) { ... }
// Returns: { executionSteps, initialNodeStates, originalValues }
```

### 4. Write constants + selectors (same pattern as reverse-linkedlist)

### 5. Write the problem hook

```typescript
// useDetectCycle.ts
export function useDetectCycle() {
  const config = useMemo(() => ({
    generateSteps: generateDetectCycleSteps,
    presets: linkedListPresets,
    createSampleList: () => createLinkedList([3, 2, 0, -4]),
    getCodeLineForStep,
    getOperationBadge,
    getPhaseLabel,
    getNodeStatesForStep: (step, steps, initial) => { ... },
  }), []);
  return useGenericLinkedList(config);
}
```

Note: if `useGenericLinkedList` doesn't cover all needed state (e.g. cycle detection needs a `hasCycle` boolean), you can extend the hook's return value by calling the generic hook and then adding extra derived state alongside it.

### 6. Create the Layout

```typescript
// components/DetectCycleLayout.tsx
export function DetectCycleLayout() {
  const { ... } = useDetectCycle();
  return (
    <LinkedListShell
      title="Detect Cycle in Linked List"
      guideHref="/problems/linked-list/detect-cycle-guide"
      currentHref="/problems/linked-list/detect-cycle"
      stats={[...]}
      left={<CodePanel ... />}
      middleTop={<LinkedListPanel ... />}
      middleBottom={<ResultPanel ... />}
      middleFooter={<UnifiedControlsBar ... />}
      rightTop={<PointerStatePanel ... />}
      rightBottom={<ExplanationPanel ... />}
    />
  );
}
```

### 7. Create the route

```
src/app/(app)/problems/linked-list/detect-cycle/page.tsx
```

### 8. Add to traversalRoutes in layout.tsx

```typescript
"/problems/linked-list/detect-cycle",
```

### 9. Add to getProblemHref in page.tsx

```typescript
if (sectionName === "Linked List" && problemName === "Detect Cycle in Linked List") {
  return "/problems/linked-list/detect-cycle";
}
```

---

## 15. Design Decisions & Gotchas

### Why snapshots instead of replay?

Each `ExecutionStep` stores a complete snapshot of `nodeStates` and `links`. This costs more memory (O(n×steps)) but makes stepping O(1) and scrubbing trivially easy. For lists up to 15 nodes with ~62 max steps (15×4+2), this is at most ~930 state objects — negligible.

### Why `values` (original order) for SVG positions?

Node positions are determined by the original array order, not by following `links`. If positions were based on `links`, reversing nodes would cause them to jump to new screen positions — visually confusing. Keeping positions fixed and only animating arrow directions is the correct educational approach.

### Why are arrows drawn before nodes in SVG?

SVG has no z-index — rendering order determines layering. Arrows must appear behind node boxes. The render order is: arrows → null box → nodes → pointer badges.

### Why `key={node-${val}-${state}}`?

Including `state` in the React key forces a DOM remount when state changes. This re-triggers the `llNodePop` CSS animation on each state transition. Without the state in the key, the animation would only fire once on mount and never again.

### Why the layout derives `displayStep = executedStep ?? activeStep`?

`executedStep` is the last **completed** step (`executionSteps[currentStep - 1]`). At step 0, there is no executed step, so the layout falls back to `activeStep` (the first step to be executed). This keeps panel rendering consistent while still showing the "Ready to Start" state at step 0 via `!step && currentStep === 0` checks in `ExplanationPanel`.

### Why is `ListSetupModal` dynamically imported?

`ListSetupModal` is ~200 lines of UI code that is only needed when the user clicks "Select List". Dynamic import (`next/dynamic`) lazy-loads it, keeping the initial bundle smaller. This matches how `TreeSetupModal` is imported in tree visualizers.

### The `topicKey` prop on LinkedListShell

This is passed to `ProblemFocusHeader` → `ProblemListDrawer`. It controls which section of the Problem List drawer is shown. It should always be `"linked-list"` for LL problems. If the topic sections in `problems/page.tsx` change their key names, update this default.

### `backHref` hardcoding

`LinkedListShell` hardcodes `backHref="/problems/topics/linked-list#problem-list"`. If the topics page structure changes, update this in `LinkedListShell.tsx` (one place, not in every layout component).

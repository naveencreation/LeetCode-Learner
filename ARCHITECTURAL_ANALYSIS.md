# Binary Tree Visualizer: Comprehensive Architectural Analysis

**Date:** April 7, 2026  
**Last Updated By:** Architecture Analysis Agent  
**Purpose:** Complete codebase documentation for architectural redesign planning

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [File & Folder Structure](#file--folder-structure-full-tree)
3. [Architecture Diagram](#architecture-diagram)
4. [State Management Deep Dive](#state-management-deep-dive)
5. [The Step Engine](#the-step-engine)
6. [Panel Communication Map](#panel-communication-map)
7. [Inorder Traversal: Complete Step-by-Step Trace](#inorder-traversal-complete-step-by-step-trace)
8. [Pain Points & Coupling Analysis](#pain-points--coupling-analysis)
9. [Adding a New Traversal: Full Change Checklist](#adding-a-new-traversal-full-change-checklist)
10. [Component API Reference](#component-api-reference)
11. [Performance Audit Notes](#performance-audit-notes)
12. [Recommended Improvement Areas](#recommended-improvement-areas)

---

## Project Overview

### What This Is

A Next.js-based educational platform for visualizing binary tree traversal algorithms step-by-step. Currently supports 8 core traversal algorithms and 3 detailed study guide pages.

### Core Purpose

- **Interactive Learning:** Users step through tree traversals manually or via auto-play, seeing:
  - Highlighted Python code lines in real-time
  - Tree nodes animated with state transitions (unvisited → exploring left → current → exploring right → completed)
  - Recursion call stack visualization
  - Traversal result array building in real-time
  - Queue/deque states (for breadth-first algorithms)
  - Numerical explanations of each operation

- **Multiple Algorithm Support:**
  - **Recursive DFS:** Inorder, Preorder, Postorder, Pre-In-Post Single Traversal
  - **Breadth-First:** Left View, Right View, Bottom View, Top View, Vertical Order
  - **Study Guides:** Deep-dive pages with problem intuition and Python code

### Technology Stack

- **Framework:** Next.js 13+ (App Router)
- **UI:** React 18 with TypeScript
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui + custom components
- **State:** React hooks (useState, useMemo, useCallback)
- **Code Highlighting:** Custom tokenization for Python

### User Flow

1. **Enter a traversal page** → e.g., `/problems/binary-tree/inorder-traversal`
2. **Optional tree configuration** → Click "Setup" to select preset or edit positions
3. **Manual step through** → Click Next/Previous (arrow keys work too)
4. **Or auto-play** → Switch to Auto mode, choose speed, play
5. **Watch all 4 panels sync** → Code, Tree, Stack, Explanation all update together
6. **Review result** → Final output shown when complete

---

## File & Folder Structure (Full Tree)

```
frontend/
├── src/
│   ├── app/
│   │   ├── (app)/
│   │   │   ├── layout.tsx                    [App shell: routing logic, sidebar, main container]
│   │   │   ├── problems/
│   │   │   │   └── binary-tree/
│   │   │   │       ├── [problemSlug]/
│   │   │   │       │   └── page.tsx          [Study mode: problem intuition + code]
│   │   │   │       ├── inorder-traversal/
│   │   │   │       │   └── page.tsx          [Route wrapper for inorder feature]
│   │   │   │       ├── preorder-traversal/
│   │   │   │       ├── postorder-traversal/
│   │   │   │       ├── leftview-of-binary-tree/
│   │   │   │       ├── top-view-of-binary-tree/
│   │   │   │       ├── bottom-view-of-binary-tree/
│   │   │   │       ├── vertical-order-traversal/
│   │   │   │       ├── preorder-inorder-postorder-in-a-single-traversal/
│   │   │   │       │
│   │   │   │       ├── inorder-guide/
│   │   │   │       ├── preorder-guide/
│   │   │   │       ├── postorder-guide/
│   │   │   │       ├── leftview-guide/
│   │   │   │       ├── topview-guide/
│   │   │   │       ├── bottomview-guide/
│   │   │   │       ├── roottonode-guide/
│   │   │   │       ├── maxwidth-guide/
│   │   │   │       └── [other guides...]
│   │   │   │
│   │   │   └── dashboard/
│   │   │
│   │   ├── layout.tsx                        [Root layout]
│   │   ├── page.tsx                          [Landing page]
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   └── globals.css                       [Base styles, shared tokens, panel classes]
│   │
│   ├── components/
│   │   ├── problem-focus-header.tsx          [Shared header across all traversal pages]
│   │   ├── app-sidebar.tsx
│   │   ├── error-state.tsx
│   │   └── ui/
│   │       ├── button.tsx
│   │       └── [other shadcn components...]
│   │
│   ├── features/
│   │   ├── binary-tree/
│   │   │   └── problemData.ts                [Central problem metadata]
│   │   │
│   │   ├── shared/
│   │   │   └── useTraversalKeyboardShortcuts.ts
│   │   │
│   │   ├── inorder/                          [Full inorder feature module]
│   │   │   ├── types.ts                      [Type definitions]
│   │   │   ├── constants.ts                  [Python code lines, operation map, explanations]
│   │   │   ├── engine.ts                     [generateInorderExecutionSteps()]
│   │   │   ├── selectors.ts                  [Derived state helpers]
│   │   │   ├── useInorderTraversal.ts        [Main state management hook]
│   │   │   └── components/
│   │   │       ├── InorderLayout.tsx         [Main layout orchestrator]
│   │   │       ├── CodePanel.tsx
│   │   │       ├── TreePanel.tsx
│   │   │       ├── ResultPanel.tsx
│   │   │       ├── CallStackPanel.tsx
│   │   │       ├── ExplanationPanel.tsx
│   │   │       ├── ControlsBar.tsx
│   │   │       └── TreeSetupModal.tsx
│   │   │
│   │   ├── preorder/                         [Preorder feature module - same structure]
│   │   │   ├── types.ts
│   │   │   ├── constants.ts
│   │   │   ├── engine.ts
│   │   │   ├── selectors.ts
│   │   │   ├── usePreorderTraversal.ts
│   │   │   └── components/
│   │   │       └── [same 8 components]
│   │   │
│   │   ├── postorder/                        [Postorder feature module - same structure]
│   │   │
│   │   ├── leftview/                         [Left view feature module - queue-based]
│   │   │   ├── types.ts                      [ExecutionStep includes queueBefore, queueAfter, etc.]
│   │   │   ├── constants.ts
│   │   │   ├── engine.ts
│   │   │   ├── selectors.ts
│   │   │   ├── useLeftViewTraversal.ts
│   │   │   └── components/
│   │   │
│   │   ├── bottomview/                       [Bottom view feature module - queue + horizontal dist]
│   │   │   ├── types.ts                      [ExecutionStep includes hd for horizontal distance]
│   │   │   ├── engine.ts
│   │   │   └── [rest of structure]
│   │   │
│   │   ├── topview/
│   │   │   └── [similar to bottomview]
│   │   │
│   │   ├── preinpostsingle/                  [Pre-In-Post single traversal - stack state 1/2/3]
│   │   │   ├── types.ts                      [CallStackFrame has traversalState: 1|2|3]
│   │   │   ├── engine.ts                     [Tracks preResult, inResult, postResult separately]
│   │   │   └── [rest of structure]
│   │   │
│   │   └── [other traversal modules...]
│   │
│   └── lib/
│       └── utils.ts
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.ts
└── [config files...]
```

---

## Architecture Diagram

### High-Level System Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                          User Actions                                │
│                   (Click Next/Prev, Auto-play, Setup)               │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────────────┐
        │  useXxxTraversal() Hook                      │
        │  - Manages currentStep state                 │
        │  - Calls generateXxxExecutionSteps once      │
        │  - Projects state for current step           │
        │  - Derives display values (code line, etc)   │
        └──────────────┬───────────────────────────────┘
                       │
        ┌──────────────┴──────────────────────────────────────────┐
        │                                                          │
        ▼                                                          ▼
    ┌────────────────────┐                        ┌──────────────────────┐
    │ generateXxxSteps() │                        │ projectStateForStep()│
    │ (Pre-computed once)│                        │ (On each step change)│
    │                    │                        │                      │
    │ Generates complete │◄──────────────────────►│ Slices steps 0..N   │
    │ step array upfront │    executionSteps[]    │ Builds result array │
    │                    │                        │ Extracts node states│
    └────────────────────┘                        └──────────────────────┘
        │                                                  │
        └──────────────────┬───────────────────────────────┘
                           │
        ┌──────────────────┴──────────────────────────────┐
        │                                                 │
        ▼                                                 ▼
    ┌────────────────────────────┐        ┌────────────────────────────┐
    │  XxxLayout Component       │        │  Derived Values Export     │
    │  (InorderLayout, etc)      │        │  - result[]                │
    │                            │        │  - currentNode             │
    │  Receives state from hook: │        │  - nodeStates{}            │
    │  - executionSteps[]        │        │  - currentCodeLine         │
    │  - currentStep             │        │  - currentPhase            │
    │  - result[]                │        │  - activeCallStack[]       │
    │  - nodeStates{}            │        │  - operationBadge          │
    │  - ...all display values   │        │  - etc.                    │
    │                            │        └────────────────────────────┘
    │  Renders 4 panels in grid: │
    └────────────────────────────┘
        │
    ┌───┼───┬──────────────┬────────────────────┐
    │   │   │              │                    │
    ▼   ▼   ▼              ▼                    ▼
  Code  Tree Recursion   Traversal     Explanation
  Panel Panel Stack       Progress      Panel
                         Panel
```

### Data Flow: Single "Next Step" Click

```
User clicks "Next Step"
        │
        ▼
nextStep() callback fires
        │
        ▼
setCurrentStep(previous => previous + 1)
        │
        ▼
currentStep state updates
        │
        ▼
useInorderTraversal() runs useMemo dependencies
        │
        ├─► projectedState = projectStateForStep(currentStep, executionSteps, ...)
        │        └─► result, visitedNodes, currentNode, nodeStates
        │
        ├─► activeStep = executionSteps[currentStep]
        │
        ├─► executedStep = currentStep > 0 ? executionSteps[currentStep - 1] : undefined
        │
        ├─► derivedValues = {
        │     currentCodeLine: getCodeLineForStep(executedStep),
        │     currentPhase: getPhaseLabel(executedStep),
        │     operationBadge: getOperationBadge(executedStep),
        │     activeCallStack: executedStep?.callStack ?? []
        │   }
        │
        └─► Return all values to hook consumer
        
        ▼
InorderLayout receives updated props
        │
        ├─► <CodePanel currentCodeLine={currentCodeLine} />
        │    └─► Highlights specific line in Python code
        │
        ├─► <TreePanel nodeStates={nodeStates} activeStep={activeStep} />
        │    └─► Re-renders tree with new node colors
        │    └─► Draws badges on nodes showing operation
        │
        ├─► <ResultPanel result={result} currentNode={currentNode} />
        │    └─► Displays result array pills
        │    └─► Shows current node value
        │    └─► Shows current phase (Enter/Left/Root/Right/Exit)
        │
        ├─► <CallStackPanel activeCallStack={activeCallStack} />
        │    └─► Renders stack frames with state (pending/executing/returned)
        │
        └─► <ExplanationPanel activeStep={executedStep} />
             └─► Shows step explanation and guidance
```

---

## State Management Deep Dive

### The Mental Model

**Key insight:** This codebase follows a **pre-compute-then-project** pattern:

1. **Pre-compute phase (once per root):**
   - When `root` changes, `generateXxxExecutionSteps(root)` is called once
   - Returns **all steps in advance** as a static array
   - No lazy evaluation; full traversal simulation happens upfront
   - Result: `executionSteps: ExecutionStep[]` with 200-500+ steps per leaf

2. **Projection phase (once per step click):**
   - When `currentStep` changes, `projectStateForStep()` iterates steps[0..currentStep]
   - Accumulates state: result array, visited node set, node color states
   - Returns a snapshot of state at that step number
   - Result: `projectedState: StepProjection` with just-in-time calculated values

### State Tree for useInorderTraversal()

```typescript
{
  // ═══ Core Input State ═══
  root: TreeNode                               // Current tree structure
  selectedPreset: TreePresetKey                // Which preset tree is active
  customNodePositions: Record<number, NodePosition>  // User-set node coordinates
  
  // ═══ Pre-computed (Memoized) ═══
  executionSteps: ExecutionStep[]              // [step0, step1, ..., stepN]
  initialNodeStates: Record<number, NodeVisualState>  // Starting node colors
  
  // ═══ Playback Control ═══
  currentStep: number                          // Index into executionSteps[]
  controlMode: "manual" | "auto"               // Step-by-step vs auto-play
  isPlaying: boolean                           // Is auto-play running?
  autoPlaySpeedMs: number                      // Interval duration
  
  // ═══ Projected State (Memoized on currentStep) ═══
  projectedState: {
    result: number[]                           // Built-up traversal result
    visitedNodes: Set<number>                  // Set of processed node values
    currentNode: number | null                 // Last-processed node
    nodeStates: Record<number, NodeVisualState>  // Current node colors
  }
  
  // ═══ Derived Display Values ═══
  currentCodeLine: number                      // Python line # to highlight
  currentPhase: string                         // "Enter Function", "Traverse Left", etc
  currentOperation: string                     // Full operation text
  operationBadge: string                       // Short badge label
  
  // ═══ Step References ═══
  activeStep: ExecutionStep | undefined        // Current step (lookahead)
  executedStep: ExecutionStep | undefined      // Previous step (for code line)
  activeCallStack: CallStackFrame[]            // Current call stack
  
  // ═══ UI State ═══
  isAtStart: boolean                           // currentStep === 0
  isAtEnd: boolean                             // currentStep === executionSteps.length
  totalSteps: number                           // executionSteps.length
}
```

### Inorder-Specific ExecutionStep Structure

```typescript
interface ExecutionStep {
  type: InorderOperationType          // "enter_function" | "traverse_left" | "visit" | "traverse_right" | "exit_function"
  node: TreeNode                      // The tree node being operated on
  value: number | undefined           // node.val for convenience
  operation: string                   // "Enter: inorder(node=2)", "Process node 2", etc
  
  callStack: CallStackFrame[]          // Stack snapshot at this step
  nodeStates: Record<number, NodeVisualState>  // Node color state map
  
  // Pre-computed call stack frame
  // Each frame represents one level of recursion
}

interface CallStackFrame {
  nodeVal: number                     // Value of node in this frame
  depth: number                       // Depth level in tree
  id: number                          // Unique frame ID (incrementing counter)
  state: "pending" | "executing" | "returned"  // Frame status
}
```

### Left-View-Specific ExecutionStep Structure

**Extends base with queue tracking:**

```typescript
interface ExecutionStep {
  type: LeftViewOperationType         // "start_level" | "dequeue" | "capture_left_view" | "enqueue_left" | "enqueue_right" | "end_level" | "finish"
  
  // Base fields (same as inorder)
  node: TreeNode | null
  value: number | undefined
  operation: string
  callStack: CallStackFrame[]
  nodeStates: Record<number, NodeVisualState>
  
  // Queue-specific fields
  level: number                       // BFS level number
  indexInLevel: number                // Position within level
  queueBefore: number[]               // Queue state before this step
  queueAfter: number[]                // Queue state after this step
  
  // Optional dequeue/enqueue tracking
  dequeued?: number                   // Node value dequeued this step
  enqueued?: number[]                 // Node values enqueued this step
  captured?: boolean                  // Whether result was captured
}
```

### Bottom-View-Specific ExecutionStep Structure

**Extends left-view with horizontal distance:**

```typescript
interface ExecutionStep {
  type: BottomViewOperationType       // like LeftViewOperationType, but "capture_bottom_view"
  
  // All left-view fields plus:
  hd?: number                         // Horizontal distance (-1, 0, 1, etc)
  
  // Tracks: which HD values were overwritten with this node
  // "Bottom" means keep overwriting with latest node at each HD
}
```

### Pre-In-Post-Single Traversal: Stack State Tracking

**Most complex: tracks 3 separate result arrays:**

```typescript
interface ExecutionStep {
  type: PreInPostOperationType        // "pre_visit" | "schedule_in" | "traverse_left" | "in_visit" | "schedule_post" | "traverse_right" | "post_visit"
  
  node: TreeNode | null
  value: number | undefined
  operation: string
  
  // Extended call stack with traversal state
  callStack: CallStackFrame[]
  
  // Each frame has traversal state: 1=PRE, 2=IN, 3=POST
  interface CallStackFrame {
    nodeVal: number
    depth: number
    id: number
    state: "pending" | "executing" | "returned"
    traversalState: 1 | 2 | 3         // ← Unique field
  }
  
  nodeStates: Record<number, NodeVisualState>
  
  // Three result arrays built simultaneously
  preResult: number[]                 // Preorder result so far
  inResult: number[]                  // Inorder result so far
  postResult: number[]                // Postorder result so far
}
```

### Key Insight: Pre-computed Steps vs Lazy

**Current approach: Pre-compute all steps upfront**
- ✅ Pro: Instant step navigation, random access to any step
- ✅ Pro: Predictable memory (all iterations known)
- ❌ Con: Memory spike for large trees (e.g., 1000+ nodes)
- ❌ Con: Can't easily support "infinite" or procedurally-generated trees

---

## The Step Engine

### How Steps Are Generated

Each traversal has its own `generate{Xxx}ExecutionSteps()` function that:

1. **Initializes state:**
   ```typescript
   const executionSteps: ExecutionStep[] = [];
   const nodeStates: Record<number, NodeVisualState> = {};
   const callStack: InternalFrame[] = [];
   let frameCounter = 0;
   ```

2. **Initializes node colors:**
   ```typescript
   initializeNodeStates(root, nodeStates)  // All nodes "unvisited"
   const initialNodeStates = cloneNodeStates(nodeStates)
   ```

3. **Runs algorithm with logging:**
   - For **inorder:** recursively visits left → process → right
   - For **preorder:** recursively visits process → left → right
   - For **postorder:** recursively visits left → right → process
   - For **left-view:** iterates levels via queue, captures first node per level
   - For **bottom-view:** iterates levels via queue, tracks horizontal distance, overwrites per HD
   - For **pre-in-post-single:** uses explicit stack with (node, state:1|2|3) tuples

4. **After each operation, pushes a step:**
   ```typescript
   pushStep(
     executionSteps,
     "enter_function",           // type
     node,
     `Enter: inorder(node=${node.val})`,  // operation text
     getCallStackSnapshot(...),  // call stack at this moment
     nodeStates,                 // node colors at this moment
   )
   ```

### Step Snapshot Semantics

**Each step captures a *before-state* snapshot:**

```
executionSteps[0] = {
  type: "enter_function",
  node: TreeNode(1),
  callStack: [{ nodeVal: 1, depth: 0, id: 0, state: "executing" }],
  nodeStates: { 1: "exploring_left", 2: "unvisited", ... }
}

executionSteps[1] = {
  type: "traverse_left",
  node: TreeNode(1),
  callStack: [same as above],
  nodeStates: [same as above]
}

executionSteps[2] = {
  type: "enter_function",
  node: TreeNode(2),
  callStack: [{ nodeVal: 1, depth: 0, id: 0, state: "pending" },
              { nodeVal: 2, depth: 1, id: 1, state: "executing" }],
  nodeStates: { 1: "exploring_left", 2: "exploring_left", 3: "unvisited", ... }
}
```

**Key insight:** When rendering step N, we use **step N-1** for the "just completed" state, not step N. This is why:

```typescript
const executedStep = currentStep > 0 ? executionSteps[currentStep - 1] : undefined;
const displayStep = executedStep ?? activeStep;
```

The code line to highlight comes from **executedStep**, not activeStep.

### How Manual Mode Works

1. **User clicks "Next Step"**
2. `nextStep()` callback increments `currentStep`
3. React re-renders with new `currentStep` value
4. All derived values update via useMemo
5. Panels re-render with new data

### How Auto Mode Works

```typescript
useEffect(() => {
  if (controlMode !== "auto" || !isPlaying || currentStep >= executionSteps.length) {
    return;
  }

  const intervalId = window.setInterval(() => {
    setCurrentStep((previous) =>
      previous < executionSteps.length ? previous + 1 : previous,
    );
  }, autoPlaySpeedMs);  // 900ms default, user can change

  return () => window.clearInterval(intervalId);
}, [controlMode, isPlaying, currentStep, executionSteps.length, autoPlaySpeedMs]);
```

**Effect re-runs on dependency changes**, so:
- Changing speed re-starts the interval
- Setting isPlaying=false clears the interval
- Reaching the end stops the interval (condition check)

### How Reset Works

```typescript
const resetTraversal = useCallback(() => {
  setCurrentStep(0);
  setIsPlaying(false);
}, []);
```

Simple: jump to step 0 and stop auto-play.

### Keyboard Shortcuts

```typescript
// useTraversalKeyboardShortcuts hook
- ArrowRight → nextStep()
- ArrowLeft → previousStep()
- "r" key → resetTraversal()
```

---

## Panel Communication Map

### How Panels Sync

All 4 panels **derive their data from the same hook export**. When currentStep changes:

```
useInorderTraversal() state updates
        ↓
All components receive new props via destructuring in InorderLayout
        ↓
Each panel re-renders independently (no inter-panel communication)
```

**There is NO direct communication between panels.** Changes are always:  
`User Action → Hook State → All Panels Re-render`

### Panel-by-Panel Data Receipt

#### 1. CodePanel
**Receives:**
```typescript
props: {
  currentCodeLine: number             // Which line to highlight
  executionLineNumbers: number[]      // All lines used by this traversal
}
```

**Uses:**
- `currentCodeLine` to highlight the current line in Yellow (#fef3c7)
- `executionLineNumbers` to show all "relevant" lines with orange background
- `INORDER_CODE_LINES` constant for the full Python code
- `INORDER_LINE_LABELS` constant for annotations

**Re-renders when:**
- `currentCodeLine` changes (every step)
- `executionLineNumbers` computed first render only

---

#### 2. TreePanel
**Receives:**
```typescript
props: {
  root: TreeNode                               // Tree structure
  currentOperation: string                     // "Enter: inorder(node=2)"
  operationBadge: string                       // "ENTER", "LEFT", "VISIT"
  nodeStates: Record<number, NodeVisualState>  // Node color map
  activeStep: ExecutionStep | undefined        // Current step object
  customNodePositions: Record<number, NodePosition>  // User-set positions
  onOpenTreeSetup: () => void                  // Callback for setup modal
}
```

**Does:**
- Renders SVG of tree structure
- Colors nodes per `nodeStates` map
- Draws edges between nodes
- Renders operation badge on active node
- Handles tree repositioning logic
- Provides "Setup" button

**Re-renders when:**
- `root` changes (new tree)
- `nodeStates` changes (every step)
- `operationBadge` changes
- `customNodePositions` changes (user drags nodes)

**Key rendering logic:**
```typescript
const stateStyles = {
  unvisited: { fill: "#e5e7eb", stroke: "#cbd5e1" },
  exploring_left: { fill: "#bfdbfe", stroke: "#60a5fa" },      // Blue
  current: { fill: "#f59e0b", stroke: "#d97706" },              // Amber
  exploring_right: { fill: "#c084fc", stroke: "#a855f7" },      // Purple
  completed: { fill: "#86efac", stroke: "#22c55e" },            // Green
};

// Nodes are SVG circles positioned per customNodePositions
// with fill/stroke from stateStyles[nodeStates[value]]
```

---

#### 3. ResultPanel
**Receives:**
```typescript
props: {
  currentNode: number | null                   // activeNode in traversal
  currentPhase: string                         // "Enter Function", "Process Node"
  result: number[]                             // Result array built so far
  currentStep: number                          // Step counter
  totalSteps: number                           // executionSteps.length
  currentOperation: string                     // Full operation text
}
```

**Displays:**
- Current node value (box)
- Current phase (box)
- Result array as colored pills
- Completion message when done

**Re-renders when:**
- `result` changes (new element added)
- `currentNode` changes
- `currentPhase` changes
- `currentStep` changes

---

#### 4. CallStackPanel
**Receives:**
```typescript
props: {
  activeCallStack: CallStackFrame[]            // Stack frames at current step
}
```

**Displays:**
- Stack frames as indented boxes
- Frame node value (e.g., "inorder(2)")
- Frame state (pending=amber, executing=cyan, returned=green)
- Indentation shows depth

**Re-renders when:**
- `activeCallStack` changes (every step usually)

**Frame state colors:**
```typescript
const frameStyles = {
  pending: "border-amber-200 bg-amber-50",      // Waiting to execute
  executing: "border-primary/30 bg-primary/10",   // Currently active
  returned: "border-emerald-200 bg-emerald-50",   // Done, about to pop
};
```

---

#### 5. ExplanationPanel
**Receives:**
```typescript
props: {
  currentStep: number
  totalSteps: number
  result: number[]
  activeStep: ExecutionStep | undefined        // Current step for detailed info
  currentCodeLine: number
}
```

**Shows:**
- Contextual explanation of current operation
- Why the line/operation matters
- What happens next
- Current result snapshot (for reference)
- Legend of node colors

**Logic:**
```typescript
function getExplanation(step, currentStep, totalSteps, result, currentCodeLine) {
  if (!step && currentStep === 0) {
    return { title: "Ready to Start", ... }
  }
  if (currentStep >= totalSteps) {
    return { title: "Traversal Complete", ... }
  }
  
  // Look up line-specific guide
  const lineGuide = INORDER_LINE_GUIDE[currentCodeLine]
  if (lineGuide) {
    return {
      title: `Line ${currentCodeLine + 1}: ${label}`,
      description: lineGuide.meaning,
      details: [why, next, current result, ...]
    }
  }
  
  // Fall back to operation-type guide
  switch (step?.type) {
    case "enter_function": return { title: "Entering...", ... }
    ...
  }
}
```

---

#### 6. ControlsBar
**Receives:**
```typescript
props: {
  isAtStart: boolean
  isAtEnd: boolean
  controlMode: "manual" | "auto"
  setControlMode: (mode) => void
  isPlaying: boolean
  autoPlaySpeedMs: number
  setAutoPlaySpeedMs: (speed) => void
  playTraversal: () => void
  pauseTraversal: () => void
  nextStep: () => void
  previousStep: () => void
  resetTraversal: () => void
}
```

**Provides:**
- Manual/Auto toggle
- Previous/Next buttons
- Play/Pause button
- Speed selector (0.5x, 1x, 1.5x, 2x)
- Reset button

**Button logic:**
- Previous disabled when `isAtStart`
- Next disabled when `isAtEnd` (manual mode)
- Play/Pause disabled when `isAtEnd` (auto mode)
- Speed selector only shown in Auto mode

---

### Inter-Panel Sync Example: Single Step Through

**Step 0 → Step 1 on inorder tree [1, 2, 3, 4, 5, 6, 7]:**

```
executionSteps[1] = {
  type: "traverse_left",
  node: TreeNode(1),
  operation: "Traverse left from node 1",
  callStack: [{ nodeVal: 1, depth: 0, id: 0, state: "executing" }],
  nodeStates: { 1: "exploring_left", 2: "unvisited", 3: "unvisited", ... }
}

Hook derives:
  currentCodeLine = 14 (from OPERATION_TO_LINE_MAP["traverse_left"])
  currentPhase = "Traverse Left"
  operationBadge = "TRAVERSE"
  currentOperation = "Traverse left from node 1"
  activeCallStack = [{ nodeVal: 1, ..., state: "executing" }]
  result = [] (no visits yet)
  currentNode = 1

All panels update:
  - CodePanel: Highlights line 14 in yellow
  - TreePanel: Colors node 1 as blue (exploring_left), shows "TRAVERSE" badge
  - ResultPanel: Shows current node = 1, phase = "Traverse Left", result = []
  - CallStackPanel: Shows "inorder(1)" in executing state
  - ExplanationPanel: Shows "Line 14: Traverse Left Subtree" with guidance
  - ControlsBar: Shows Previous enabled, Next enabled
```

---

## Inorder Traversal: Complete Step-by-Step Trace

### Tree Setup

```
Input: [1, 2, 3, 4, 5, 6, 7]

Resulting tree structure:
        1
       / \
      2   3
     / \   \
    4   5   6
   /       /
  7       (empty)

Wait, that doesn't match. Let me recalculate.
Standard array-to-tree (level-order):
- Index 0 (value 1) → root
- Index 1 (value 2) → root.left
- Index 2 (value 3) → root.right
- Index 3 (value 4) → node(2).left
- Index 4 (value 5) → node(2).right
- Index 5 (value 6) → node(3).left
- Index 6 (value 7) → node(3).right

Tree:
        1
       / \
      2   3
     / \ / \
    4 5 6 7

Inorder (Left → Root → Right): 4, 2, 5, 1, 6, 3, 7
```

### Step-by-Step Execution

#### Steps 0-2: Enter Node 1, Traverse Left

**Step 0: Enter function inorder(1)**
```typescript
executionSteps[0] = {
  type: "enter_function",
  node: TreeNode(1),
  value: 1,
  operation: "Enter: inorder(node=1)",
  callStack: [{
    nodeVal: 1,
    depth: 0,
    id: 0,
    state: "executing"
  }],
  nodeStates: {
    1: "exploring_left",
    2: "unvisited",
    3: "unvisited",
    4: "unvisited",
    5: "unvisited",
    6: "unvisited",
    7: "unvisited"
  }
}

UI Display:
  Code: Line 10 (Function Entry) highlighted in yellow
  Tree: Node 1 colored blue (exploring_left)
  Stack: [inorder(1) - executing]
  Result: []
  Explanation: "We entered recursiveInorder for the current node. Check whether root is None."
```

**Step 1: Traverse left from node 1**
```typescript
executionSteps[1] = {
  type: "traverse_left",
  node: TreeNode(1),
  value: 1,
  operation: "Traverse left from node 1",
  callStack: [{
    nodeVal: 1,
    depth: 0,
    id: 0,
    state: "executing"
  }],
  nodeStates: {
    1: "exploring_left",
    2: "unvisited",
    3: "unvisited",
    4: "unvisited",
    5: "unvisited",
    6: "unvisited",
    7: "unvisited"
  }
}

UI Display:
  Code: Line 14 (Traverse Left Subtree) highlighted yellow
  Tree: Node 1 still blue, now "TRAVERSE" badge on it
  Stack: [inorder(1) - executing]
  Result: []
  Explanation: "Move recursively to the left child first. ... After left subtree completes, current node is processed."
```

**Step 2: Enter function inorder(2)**
```typescript
executionSteps[2] = {
  type: "enter_function",
  node: TreeNode(2),
  value: 2,
  operation: "Enter: inorder(node=2)",
  callStack: [
    { nodeVal: 1, depth: 0, id: 0, state: "pending" },
    { nodeVal: 2, depth: 1, id: 1, state: "executing" }
  ],
  nodeStates: {
    1: "exploring_left",
    2: "exploring_left",
    3: "unvisited",
    4: "unvisited",
    5: "unvisited",
    6: "unvisited",
    7: "unvisited"
  }
}

UI Display:
  Code: Line 10 highlighted yellow
  Tree: Node 1 light blue (pending), Node 2 bright blue (exploring_left)
  Stack: [inorder(1) - pending, inorder(2) - executing]  ← Stack grew!
  Result: []
  Explanation: "We entered recursiveInorder for node 2..."
```

#### Steps 3-9: Traverse to Node 4

**Step 3: Traverse left from node 2**
```
callStack: [
  { nodeVal: 1, state: "pending" },
  { nodeVal: 2, state: "executing" }
]
nodeStates: { 1: "exploring_left", 2: "exploring_left", 3: "unvisited", 4: "unvisited", ... }
```

**Step 4: Enter function inorder(4)**
```
callStack: [
  { nodeVal: 1, state: "pending" },
  { nodeVal: 2, state: "pending" },
  { nodeVal: 4, state: "executing" }
]
nodeStates: { 1: "exploring_left", 2: "exploring_left", 4: "exploring_left", ... }
```

**Step 5: Traverse left from node 4**
```
Same stack
```

**Step 6: Enter function inorder(7)**
```
callStack: [
  { nodeVal: 1, state: "pending" },
  { nodeVal: 2, state: "pending" },
  { nodeVal: 4, state: "pending" },
  { nodeVal: 7, state: "executing" }
]
nodeStates: { 1: "exploring_left", 2: "exploring_left", 4: "exploring_left", 7: "exploring_left", ... }
```

**Step 7: Traverse left from node 7**
```
7 has no left child, so no actual recursion happens.
nodeStates: { 7: "exploring_left", ... }
```

**Step 8: Process node 7 (visit)**
```typescript
executionSteps[8] = {
  type: "visit",
  node: TreeNode(7),
  value: 7,
  operation: "Process node 7",
  callStack: [
    { nodeVal: 1, state: "pending" },
    { nodeVal: 2, state: "pending" },
    { nodeVal: 4, state: "pending" },
    { nodeVal: 7, state: "executing" }
  ],
  nodeStates: {
    1: "exploring_left",
    2: "exploring_left",
    4: "exploring_left",
    7: "current",  ← Changed to "current"!
    3: "unvisited",
    5: "unvisited",
    6: "unvisited"
  }
}

UI Display:
  Code: Line 15 (Process Current Node) highlighted yellow
  Tree: Node 7 colored AMBER (current)
  Stack: [inorder(1), inorder(2), inorder(4), inorder(7) - executing]
  Result: [7]  ← First element added!
  Explanation: "Append current node value into result array. This is the Root step in Left -> Root -> Right."
```

**Step 9: Traverse right from node 7**
```
7 has no right child.
nodeStates: { 7: "exploring_right", ... }
```

#### Step 10: Exit Node 7

**Step 10: Return from inorder(7)**
```typescript
executionSteps[10] = {
  type: "exit_function",
  node: TreeNode(7),
  operation: "Return from inorder(node=7)",
  callStack: [
    { nodeVal: 1, state: "pending" },
    { nodeVal: 2, state: "pending" },
    { nodeVal: 4, state: "executing" },
    { nodeVal: 7, state: "returned" }  ← returned!
  ],
  nodeStates: {
    7: "completed",  ← Changed to "completed"
    4: "exploring_right",
    ...
  }
}

UI Display:
  Code: Line 13 (Return To Caller) highlighted yellow
  Tree: Node 7 colored GREEN (completed), Node 4 exploring right
  Stack: [inorder(1), inorder(2), inorder(4) - executing, inorder(7) - returned]
  Result: [7]
  Explanation: "Return control to the previous recursive call..."
```

#### Steps 11-14: Back to Node 4, then Traverse Right to Node 2

After exiting node 7, we're back in `inorder(4)`. Node 4 has no right child, so:
- Step 11: Process node 4 (visit) → result becomes [7, 4]
- Step 12: Traverse right (no right) → nodeStates[4] = "exploring_right"
- Step 13: Exit inorder(4) → nodeStates[4] = "completed", stack pops
- Step 14: Back in inorder(2), process node 2 (visit) → result becomes [7, 4, 2]

#### Steps continuing...

Following the same pattern:
- node 2 processes → result [7, 4, 2]
- node 2 explores right → node 5
- node 5: enter, left (none), visit → result [7, 4, 2, 5], exit
- Back to node 1: process node 1 → result [7, 4, 2, 5, 1]
- node 1 explores right → node 3
- node 3: enter, no left, visit → result [7, 4, 2, 5, 1, 3], traverse right
- node 6: enter, left (none), visit → result [7, 4, 2, 5, 1, 3, 6]
- node 3 continues right → node 7... wait, no.

Let me recalculate the final result:
- Inorder of [1, 2, 3, 4, 5, 6, 7] as a level-order tree:
  ```
            1
           / \
          2   3
         / \ / \
        4 5 6 7
  ```
  Inorder: **4 2 5 1 6 3 7** ✓

#### Final State

**Step N (Total steps ≈ 35 for this tree):**
```typescript
currentStep = 35  // executionSteps.length
result = [4, 2, 5, 1, 6, 3, 7]
nodeStates = {
  1: "completed",
  2: "completed",
  3: "completed",
  4: "completed",
  5: "completed",
  6: "completed",
  7: "completed"
}
activeCallStack = []  // Stack is empty

UI Display:
  ResultPanel shows: "✅ Perfect! Traversal complete. Result: [4, 2, 5, 1, 6, 3, 7]"
  TreePanel: All nodes GREEN (completed)
  CodePanel: No specific line highlighted
  CallStackPanel: Empty stack
```

---

## Pain Points & Coupling Analysis

### Critical Issue 1: Step Structure Fragmentation

**Problem:** Each traversal type has a **completely different** `ExecutionStep` interface:

```typescript
// Inorder, Preorder, Postorder (recursive DFS)
interface ExecutionStep {
  type: InorderOperationType,
  node: TreeNode,
  value: number,
  operation: string,
  callStack: CallStackFrame[],
  nodeStates: Record<number, NodeVisualState>
}

// LeftView, BottomView, TopView (BFS)
interface ExecutionStep {
  type: LeftViewOperationType,
  node: TreeNode | null,
  value: number | undefined,
  operation: string,
  level: number,           // ← New
  indexInLevel: number,    // ← New
  queueBefore: number[],   // ← New
  queueAfter: number[],    // ← New
  dequeued?: number,       // ← New
  enqueued?: number[],     // ← New
  captured?: boolean,      // ← New
  callStack: CallStackFrame[],
  nodeStates: Record<number, NodeVisualState>
}

// BottomView (BFS + horizontal distance)
interface ExecutionStep extends LeftViewExecutionStep {
  hd?: number              // ← New field
}

// PreInPostSingle (3-pass traversal with state)
interface ExecutionStep {
  type: PreInPostOperationType,
  node: TreeNode | null,
  value: number | undefined,
  operation: string,
  callStack: CallStackFrame[],      // Has traversalState: 1|2|3
  nodeStates: Record<number, NodeVisualState>,
  preResult: number[],     // ← New
  inResult: number[],      // ← New
  postResult: number[]     // ← New
}
```

**Impact:**
- Panels must handle multiple step structures (discriminated union)
- Can't share panel components across traversals
- Adding a new traversal means defining new ExecutionStep interface
- Type-casting required in panels

**Evidence in codebase:**
```typescript
// In LeftViewTraversalState vs InorderTraversalState
// The "result" type is different:
//   Inorder uses: result: number[]
//   PreInPost uses: preResult, inResult, postResult separately
```

---

### Critical Issue 2: Engine Logic Duplication

**Problem:** Each of the 8 traversals has its own **complete engine implementation**, but they share 80%+ of the code:

```
inorder/engine.ts          ~150 lines
preorder/engine.ts         ~150 lines
postorder/engine.ts        ~150 lines

Each has:
  ✓ initializeNodeStates()     [100% identical]
  ✓ cloneNodeStates()          [100% identical]
  ✓ getCallStackSnapshot()     [100% identical]
  ✓ pushStep()                 [95% identical, params differ]
  ✓ traverse() recursive fn    [90% identical, operation order differs]
```

**For leftview/bottomview/topview**, additional duplication:
```
leftview/engine.ts         ~200 lines
bottomview/engine.ts       ~220 lines
topview/engine.ts          ~220 lines

Each implements:
  ✓ Queue initialization
  ✓ Level-order BFS loop
  ✓ Enqueue/dequeue logic
  ✓ Level tracking variables
  
  MINUS: Specific capture logic per algorithm
```

**Impact:**
- Bugs fixed in one engine don't automatically propagate
- Adding a new traversal means copying 150+ lines and modifying the algorithm part
- No shared "engine template" or base implementation

---

### Critical Issue 3: Hook Duplication

**Problem:** 8 copies of `useXxxTraversal()` with nearly identical structure:

```
useInorderTraversal.ts     ~250 lines
usePreorderTraversal.ts    ~250 lines
usePostorderTraversal.ts   ~250 lines
useLeftViewTraversal.ts    ~280 lines
useBottomViewTraversal.ts  ~280 lines
...

Each implements:
  ✓ useState for root, selectedPreset, customNodePositions, controlMode, isPlaying, etc.
  ✓ useMemo for executionSteps generation
  ✓ useMemo for currentStep projection
  ✓ useCallback for nextStep, previousStep, resetTraversal
  ✓ useCallback for playTraversal, pauseTraversal
  ✓ useCallback for setControlMode
  ✓ useCallback for applyTreeConfiguration
  ✓ useEffect for auto-play interval
  ✓ useTraversalKeyboardShortcuts hook call
  ✓ Return 40+ derived values object
```

**Impact:**
- Logic changes need 8 edits (e.g., adding a new callback)
- Inconsistencies can creep in (one hook uses different variable names)
- Hard to maintain consistent auto-play, reset, keyboard behavior

---

### Critical Issue 4: Component Prop Incompatibility

**Problem:** Panels receive different props across traversal types because step structures differ:

```typescript
// InorderLayout passes:
<ResultPanel
  currentNode={currentNode}
  currentPhase={currentPhase}
  result={result}                    // number[]
  currentStep={currentStep}
  totalSteps={totalSteps}
  currentOperation={currentOperation}
/>

// PreInPostLayout would need to pass:
<ResultPanel
  currentNode={currentNode}
  currentPhase={currentPhase}
  preResult={preResult}              // number[]
  inResult={inResult}                // number[]
  postResult={postResult}            // number[]
  currentStep={currentStep}
  totalSteps={totalSteps}
  currentOperation={currentOperation}
/>
```

**Consequence:** Can't use the same ResultPanel component for both.

---

### Critical Issue 5: Constants & Selectors Coupling

**Problem:** Each traversal is hardcoded with specific code lines and operation types:

```typescript
// inorder/constants.ts
export const INORDER_CODE_LINES = [...]
export const OPERATION_TO_LINE_MAP = {
  enter_function: 10,
  traverse_left: 14,
  visit: 15,
  traverse_right: 16,
  exit_function: 13,
}

// preorder/constants.ts
export const PREORDER_CODE_LINES = [...]  // Different code!
export const OPERATION_TO_LINE_MAP = {
  enter_function: 10,
  traverse_left: 14,       // Could be different line #!
  visit: 15,
  traverse_right: 16,
  exit_function: 13,
}
```

**The real issue:**
- If the visualizer ever shows generic/abstract Python code instead of concrete code, we'd need to refactor all 8 modules simultaneously
- Code line highlighting is **tightly coupled** to the exact Python implementation shown

---

### Critical Issue 6: No Shared Panel Infrastructure

**Problem:** Each traversal has **completely separate component folders**:

```
inorder/components/
  ├── InorderLayout.tsx
  ├── CodePanel.tsx
  ├── TreePanel.tsx
  ├── ResultPanel.tsx
  ├── CallStackPanel.tsx
  ├── ExplanationPanel.tsx
  ├── ControlsBar.tsx
  └── TreeSetupModal.tsx

preorder/components/
  ├── PreorderLayout.tsx      [Nearly identical to InorderLayout]
  ├── CodePanel.tsx           [98% identical]
  ├── TreePanel.tsx           [95% identical]
  ├── ResultPanel.tsx         [100% identical]
  ├── CallStackPanel.tsx      [100% identical]
  ├── ExplanationPanel.tsx    [95% identical]
  ├── ControlsBar.tsx         [100% identical]
  └── TreeSetupModal.tsx      [98% identical]
```

**Impact:**
- UI/UX consistency must be maintained manually across 8 folders
- Bug fix in one ResultPanel doesn't fix others
- Layout tweaks replicated 8 times
- Total cloned code: ~2,500 lines for panels alone

**Evidence:** Many components should be shared:
- `ResultPanel` is 100% generic (just displays result array)
- `CallStackPanel` is 100% generic (displays stack frames)
- `ControlsBar` is completely algorithm-agnostic
- `TreeSetupModal` is completely algorithm-agnostic
- `TreePanel` needs only algorithm-specific operation badges

---

### Secondary Issue 7: Types Module Duplication

Each traversal has types.ts that **redefines common types**:

```typescript
// inorder/types.ts
export interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export interface NodePosition {
  x: number;
  y: number;
}

export type NodeVisualState = /* 5 values */;

export interface CallStackFrame {
  nodeVal: number;
  depth: number;
  id: number;
  state: "pending" | "executing" | "returned";
}

// postorder/types.ts
export interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}  // [Same definition]

export interface NodePosition {
  x: number;
  y: number;
}  // [Same definition]

// ... Repeated 8 times
```

**Only the `ExecutionStep` type differs per traversal.**

---

### Tertiary Issue 8: No Performance Optimization

**Problem:** Current architecture doesn't allow for optimizations:

1. **No memoization of projection**: `projectStateForStep()` iterates steps[0..N] every time, O(N) per step
2. **No virtualization**: All panels render, even if off-screen
3. **No step caching**: Steps are recomputed for the same root (but memoized on deps, so OK)
4. **No tree optimization**: Full tree re-renders on every step (could optimize to just color-changing nodes)

**Impact:**
- For large trees (100+ nodes), auto-play animation will stutter
- Each step click takes ~10-50ms (depends on N and tree size)

---

### Tertiary Issue 9: Manual Tests Required

**Problem:** No unit tests for:
- Step generation correctness per algorithm
- State projection accuracy
- Panel synchronization
- Auto-play timing

**Impact:**
- Regressions can occur silently
- Changes to core logic require manual verification
- Adding a new traversal can't validate correctness automatically

---

## Adding a New Traversal: Full Change Checklist

### Prerequisite: Define the Algorithm

Before coding, document:
- **Input:** Tree structure
- **Output:** Result array (what gets "captured")
- **Process:** Step-by-step algorithm (recursive, BFS, or hybrid)
- **Code:** Actual Python implementation to display
- **Example:** Trace on [1,2,3,4,5,6,7] tree

**Example: Adding "Spiral Order Traversal"**
```
Algorithm: Level-order traversal, alternating left-to-right and right-to-left per level
Result: [1, 3, 6, 7, 5, 4, 2, ...]
Python Code: (40 lines)
```

### Step 1: Create Feature Module Folder

```bash
mkdir -p frontend/src/features/spiralorder
touch frontend/src/features/spiralorder/{types.ts,constants.ts,engine.ts,selectors.ts,useSpiralOrderTraversal.ts}
mkdir -p frontend/src/features/spiralorder/components
```

### Step 2: Define Types

**File:** `frontend/src/features/spiralorder/types.ts`

```typescript
export type SpiralOrderOperationType = 
  | "start_level"
  | "traverse_forward"  // Left-to-right pass
  | "traverse_backward" // Right-to-left pass
  | "end_level"
  | "finish";

export type NodeVisualState = 
  | "unvisited"
  | "exploring_left"
  | "current"
  | "exploring_right"
  | "completed";

export interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export interface NodePosition {
  x: number;
  y: number;
}

export interface CallStackFrame {
  nodeVal: number;
  depth: number;
  id: number;
  state: "pending" | "executing" | "returned";
}

export interface ExecutionStep {
  type: SpiralOrderOperationType;
  node: TreeNode | null;
  value: number | undefined;
  operation: string;
  level: number;
  direction: "forward" | "backward";  // ← Custom field for spiral
  queueBefore: number[];
  queueAfter: number[];
  dequeued?: number;
  enqueued?: number[];
  captured?: boolean;
  callStack: CallStackFrame[];
  nodeStates: Record<number, NodeVisualState>;
}

export interface SpiralOrderTraversalState {
  currentStep: number;
  result: number[];
  visitedNodes: Set<number>;
  currentNode: number | null;
  executionSteps: ExecutionStep[];
  nodeStates: Record<number, NodeVisualState>;
}

export type TreePresetKey = 
  | "complete"
  | "left_skewed"
  | "right_skewed"
  | "sparse_random"
  | "custom_empty";
```

### Step 3: Create Constants File

**File:** `frontend/src/features/spiralorder/constants.ts`

```typescript
import type { TreeNode, TreePresetKey } from "./types";

export const SPIRAL_CODE_LINES = [
  "from collections import deque",
  "",
  "class Solution:",
  "    def spiralOrder(self, root):",
  "        if not root:",
  "            return []",
  "",
  "        result = []",
  "        queue = deque([root])",
  "        left_to_right = True",
  "",
  "        while queue:",
  "            level_size = len(queue)",
  "            level_nodes = []",
  "",
  "            for i in range(level_size):",
  "                node = queue.popleft()",
  "                level_nodes.append(node.data)",
  "",
  "                if node.left:",
  "                    queue.append(node.left)",
  "                if node.right:",
  "                    queue.append(node.right)",
  "",
  "            if left_to_right:",
  "                result.extend(level_nodes)",
  "            else:",
  "                result.extend(reversed(level_nodes))",
  "",
  "            left_to_right = not left_to_right",
  "",
  "        return result",
] as const;

export const OPERATION_TO_LINE_MAP = {
  start_level: 12,
  traverse_forward: 16,
  traverse_backward: 16,
  end_level: 25,
  finish: 31,
} as const;

export const SPIRAL_LINE_GUIDE: Record<number, { meaning: string; why: string; next: string }> = {
  12: {
    meaning: "Enter the next level of the tree.",
    why: "Spiral order processes tree level-by-level.",
    next: "Process all nodes in this level according to direction.",
  },
  16: {
    meaning: "Traverse nodes in current direction.",
    why: "Alternates between left-to-right and right-to-left.",
    next: "Add nodes to result, enqueue children.",
  },
  25: {
    meaning: "Toggle direction for next level.",
    why: "Spiral order changes direction after each level.",
    next: "Process next level in opposite direction.",
  },
};

// Tree presets (same for all)
export const SPIRAL_TREE_PRESETS: Record<TreePresetKey, TreeNode> = {
  complete: { /* tree structure */ },
  left_skewed: { /* tree structure */ },
  right_skewed: { /* tree structure */ },
  sparse_random: { /* tree structure */ },
  custom_empty: { /* empty tree */ },
};
```

### Step 4: Create Engine

**File:** `frontend/src/features/spiralorder/engine.ts`

```typescript
import type { CallStackFrame, ExecutionStep, NodeVisualState, TreeNode } from "./types";

interface InternalFrame {
  nodeVal: number;
  depth: number;
  id: number;
}

function cloneNodeStates(states: Record<number, NodeVisualState>): Record<number, NodeVisualState> {
  return { ...states };
}

function getCallStackSnapshot(stack: InternalFrame[], activeId: number): CallStackFrame[] {
  return stack.map((frame) => ({
    nodeVal: frame.nodeVal,
    depth: frame.depth,
    id: frame.id,
    state: frame.id === activeId ? "executing" : "pending",
  }));
}

function initializeNodeStates(node: TreeNode | null, states: Record<number, NodeVisualState>): void {
  if (node === null) return;
  states[node.val] = "unvisited";
  initializeNodeStates(node.left, states);
  initializeNodeStates(node.right, states);
}

function pushStep(
  steps: ExecutionStep[],
  type: ExecutionStep["type"],
  node: TreeNode | null,
  operation: string,
  level: number,
  direction: "forward" | "backward",
  queueBefore: number[],
  queueAfter: number[],
  extras: Pick<ExecutionStep, "dequeued" | "enqueued" | "captured">,
  callStack: CallStackFrame[],
  nodeStates: Record<number, NodeVisualState>,
): void {
  steps.push({
    type,
    node,
    value: node?.val,
    operation,
    level,
    direction,
    queueBefore,
    queueAfter,
    dequeued: extras.dequeued,
    enqueued: extras.enqueued,
    captured: extras.captured,
    callStack,
    nodeStates: cloneNodeStates(nodeStates),
  });
}

function queueValues(queue: TreeNode[]): number[] {
  return queue.map((n) => n.val);
}

export function generateSpiralOrderExecutionSteps(root: TreeNode | null): {
  executionSteps: ExecutionStep[];
  initialNodeStates: Record<number, NodeVisualState>;
} {
  const executionSteps: ExecutionStep[] = [];
  const nodeStates: Record<number, NodeVisualState> = {};
  const callStack: InternalFrame[] = [];
  let frameCounter = 0;

  initializeNodeStates(root, nodeStates);
  const initialNodeStates = cloneNodeStates(nodeStates);

  if (root === null) {
    pushStep(
      executionSteps,
      "finish",
      null,
      "Tree is empty; spiral order is []",
      0,
      "forward",
      [],
      [],
      {},
      [],
      nodeStates,
    );
    return { executionSteps, initialNodeStates };
  }

  const queue: TreeNode[] = [root];
  let level = 0;
  let leftToRight = true;

  while (queue.length > 0) {
    const levelSize = queue.length;
    const frameId = frameCounter++;
    const direction = leftToRight ? "forward" : "backward";

    callStack.push({ nodeVal: queue[0].val, depth: level, id: frameId });

    pushStep(
      executionSteps,
      "start_level",
      queue[0],
      `Enter level ${level} (direction: ${direction})`,
      level,
      direction,
      queueValues(queue),
      queueValues(queue),
      {},
      getCallStackSnapshot(callStack, frameId),
      nodeStates,
    );

    // Process level
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      const queueAfter = queueValues(queue);

      nodeStates[node.val] = "current";

      pushStep(
        executionSteps,
        "traverse_" + direction as  "traverse_forward" | "traverse_backward",
        node,
        `Traverse node ${node.val} (${direction})`,
        level,
        direction,
        [node.val, ...queueAfter],  // Include just-dequeued
        queueAfter,
        { dequeued: node.val, captured: true },
        getCallStackSnapshot(callStack, frameId),
        nodeStates,
      );

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    nodeStates[queue[0]?.val ?? -1] = "completed";

    pushStep(
      executionSteps,
      "end_level",
      queue[0] ?? null,
      `End level ${level}, toggle direction`,
      level,
      direction,
      queueValues(queue),
      queueValues(queue),
      {},
      getCallStackSnapshot(callStack, frameId),
      nodeStates,
    );

    leftToRight = !leftToRight;
    level++;

    callStack.pop();
  }

  pushStep(
    executionSteps,
    "finish",
    null,
    "Traversal complete",
    level,
    "forward",
    [],
    [],
    {},
    [],
    nodeStates,
  );

  return { executionSteps, initialNodeStates };
}
```

### Step 5: Create Selectors

**File:** `frontend/src/features/spiralorder/selectors.ts`

```typescript
import { OPERATION_TO_LINE_MAP } from "./constants";
import type { ExecutionStep } from "./types";

export function getPhaseLabel(step: ExecutionStep | undefined): string {
  if (!step) return "Enter Level";

  switch (step.type) {
    case "start_level":
      return `Start Level ${step.level}`;
    case "traverse_forward":
      return "Traverse (L→R)";
    case "traverse_backward":
      return "Traverse (R←L)";
    case "end_level":
      return "End Level";
    case "finish":
      return "Complete";
    default:
      return "Unknown";
  }
}

export function getCodeLineForStep(step: ExecutionStep | undefined): number {
  if (!step) return 0;
  return OPERATION_TO_LINE_MAP[step.type];
}

export function getOperationBadge(step: ExecutionStep | undefined): string {
  if (!step) return "READY";
  return step.type.toUpperCase().split("_")[0];
}
```

### Step 6: Create Hook

**File:** `frontend/src/features/spiralorder/useSpiralOrderTraversal.ts`

Copy `useInorderTraversal.ts` and:
1. Replace all imports (`inorder` → `spiralorder`)
2. Replace function names (`InorderTraversal` → `SpiralOrderTraversal`)
3. Replace constant names (`INORDER_TREE_PRESETS` → `SPIRAL_TREE_PRESETS`)
4. Keep all logic identical

### Step 7: Create Components Folder

Copy all 8 component files from `inorder/components/`:

```bash
cp frontend/src/features/inorder/components/*.tsx frontend/src/features/spiralorder/components/
```

Then update imports in each:
- `inorder/selectors` → `spiralorder/selectors`
- `useinorderTraversal` → `useSpiralOrderTraversal`

### Step 8: Update `ResultPanel` if Custom

If spiral order shows last 2-level results, extend `ResultPanel.tsx`:

```typescript
// Only in spiralorder/components/ResultPanel.tsx
export function ResultPanel({
  level,
  lastLevelNodes,    // ← Custom prop
  ...rest
}) {
  return (
    <section>
      {/* ... existing code ... */}
      <div>
        <p>Current Level: {level}</p>
        <div>{lastLevelNodes.map(n => ...)}</div>
      </div>
    </section>
  );
}
```

### Step 9: Create Page Route

**File:** `frontend/src/app/(app)/problems/binary-tree/spiral-order-traversal/page.tsx`

```typescript
"use client";

import dynamic from "next/dynamic";

const SpiralOrderLayout = dynamic(() =>
  import("@/features/spiralorder/components/SpiralOrderLayout").then(
    (module) => module.SpiralOrderLayout,
  ),
);

export default function SpiralOrderPage() {
  return <SpiralOrderLayout />;
}
```

### Step 10: Update App Layout Router

**File:** `frontend/src/app/(app)/layout.tsx`

Add to route detection:

```typescript
const isTraversalPage = pathname.includes("/problems/binary-tree/") && (
  pathname.includes("inorder-traversal") ||
  pathname.includes("preorder-traversal") ||
  // ... other existing traversals ...
  pathname.includes("spiral-order-traversal")  // ← Add this
);
```

### Step 11: Create Guide Page (Optional)

**File:** `frontend/src/app/(app)/problems/binary-tree/spiral-order-guide/page.tsx`

Copy from `inorder-guide/page.tsx` and update:
- Guide content
- Python code examples
- Explanations

### Step 12: Register Guide Data (If Adding to Study Mode)

**File:** `frontend/src/features/binary-tree/problemData.ts`

```typescript
export const binaryTreeProblemData = {
  // ... existing entries ...
  "spiral-order": {
    slug: "spiral-order",
    title: "Spiral Order Traversal",
    intuition: "Level-order traversal alternating direction: L→R, R←L, etc.",
    pythonCode: `...`,
  },
};
```

### Step 13: Test & Validate

```bash
cd frontend
npm run dev
# Visit: http://localhost:3000/problems/binary-tree/spiral-order-traversal
# Verify:
#   - Tree renders
#   - Steps progress correctly
#   - Result array shows [1, 3, 6, 7, 5, 4, 2]
#   - Code highlighting works
#   - Auto-play works
```

### Step 14: Run Lint & Build

```bash
npm run lint
npm run build
```

---

## Component API Reference

### Layout Components

#### InorderLayout.tsx
```typescript
// Props: None (uses hook internally)

// Returns:
//   <section> with:
//   - ProblemFocusHeader
//   - Grid of 4 panels + controls
//   - Lazy-loaded TreeSetupModal
//   - Full-bleed gradient background
```

### Shared Panel Components

#### CodePanel.tsx
```typescript
interface CodePanelProps {
  currentCodeLine: number              // Line # to highlight in yellow
  executionLineNumbers: number[]       // All relevant lines (with orange bg)
}

// Renders:
//   - Snippet or Full view toggle
//   - Python code with tokenized syntax highlighting
//   - Line numbers and execution context
```

#### TreePanel.tsx
```typescript
interface TreePanelProps {
  root: TreeNode
  currentOperation: string
  operationBadge: string
  nodeStates: Record<number, NodeVisualState>
  activeStep: ExecutionStep | undefined
  customNodePositions: Record<number, NodePosition>
  onOpenTreeSetup: () => void
}

// Renders:
//   - SVG tree visualization
//   - Node colors per nodeStates
//   - Operation badges on nodes
//   - "Setup" button
//   - Handles node positioning and scaling
```

#### ResultPanel.tsx
```typescript
interface ResultPanelProps {
  currentNode: number | null
  currentPhase: string
  result: number[]
  currentStep: number
  totalSteps: number
  currentOperation: string
}

// Renders:
//   - Current node display
//   - Current phase display
//   - Result array as colored pills
//   - Completion message
```

#### CallStackPanel.tsx
```typescript
interface CallStackPanelProps {
  activeCallStack: CallStackFrame[]
}

// Renders:
//   - Stack frames indented by depth
//   - Frame state badges (pending/executing/returned)
//   - Frame node value
//   - "Live" indicator
```

#### ExplanationPanel.tsx
```typescript
interface ExplanationPanelProps {
  currentStep: number
  totalSteps: number
  result: number[]
  activeStep: ExecutionStep | undefined
  currentCodeLine: number
}

// Renders:
//   - Step title and description
//   - Why this operation matters
//   - What happens next
//   - Current result snapshot
//   - Node state color legend
```

#### ControlsBar.tsx
```typescript
interface ControlsBarProps {
  isAtStart: boolean
  isAtEnd: boolean
  controlMode: "manual" | "auto"
  setControlMode: (mode) => void
  isPlaying: boolean
  autoPlaySpeedMs: number
  setAutoPlaySpeedMs: (speed) => void
  playTraversal: () => void
  pauseTraversal: () => void
  nextStep: () => void
  previousStep: () => void
  resetTraversal: () => void
}

// Renders:
//   - Manual/Auto toggle
//   - Previous/Next buttons
//   - Play/Pause button
//   - Speed selector (0.5x, 1x, 1.5x, 2x)
//   - Reset button
```

### Modal Components

#### TreeSetupModal.tsx
```typescript
interface TreeSetupModalProps {
  root: TreeNode
  selectedPreset: TreePresetKey
  presets: Record<TreePresetKey, TreeNode>
  customNodePositions: Record<number, NodePosition>
  onClose: () => void
  onApply: (root, positions, preset) => void
  onApplyAndRun: (root, positions, preset) => void  // Applies & sets step=1
}

// Renders:
//   - Preset selector
//   - Tree visualization with draggable nodes
//   - Add/edit/remove node controls
//   - Position auto-layout
//   - Validation warnings
```

---

## Performance Audit Notes

### Bottleneck 1: Step Projection O(N)

**Location:** `projectStateForStep(currentStep, executionSteps, initialNodeStates)`

```typescript
function projectStateForStep(...) {
  const result: number[] = [];
  const visitedNodes = new Set<number>();

  // ← This loop is O(currentStep)
  for (let index = 0; index < currentStep; index += 1) {
    const step = executionSteps[index];
    if (step.type === "visit" && typeof step.value === "number") {
      result.push(step.value);
      visitedNodes.add(step.value);
    }
  }
  // ...
}
```

**Problem:** On every step, we iterate from 0 to currentStep. For step 200 out of 200, that's 200 iterations.

**Impact:** 
- For 7-node tree: ~35 steps, negligible (~0.1ms per click)
- For 20-node tree: ~200 steps, still OK (~2-5ms per click)
- For 100-node tree: ~5000 steps, could stutter (~50-100ms per click)

**Could be optimized:** Cache previous projectState and merge only new steps (O(1) per step).

---

### Bottleneck 2: Tree Rendering

**Location:** `TreePanel.tsx` SVG rendering

```typescript
// Every time nodeStates changes, the entire SVG re-renders
<svg>
  {nodes.map(node => (
    <circle
      key={node.value}
      fill={stateStyles[nodeStates[node.value]].fill}
      stroke={stateStyles[nodeStates[node.value]].stroke}
    />
  ))}
  {edges.map(edge => (
    <line /* ... */ />
  ))}
</svg>
```

**Problem:** Entire tree SVG re-renders even if only 1 node changed color.

**Impact:**
- For 100-node tree: ~100 circles + ~100 lines re-rendered per step
- Chrome can handle this (~16ms threshold for 60fps)
- But with other panels rendering + auto-play, total frame time could exceed 16ms

**Could be optimized:** Use `react-spring` or Canvas instead of SVG; memoize nodes/edges that didn't change.

---

### Bottleneck 3: Auto-Play Re-renders

**Location:** useEffect interval in hook

```typescript
useEffect(() => {
  const intervalId = window.setInterval(() => {
    setCurrentStep(previous => previous + 1);
  }, autoPlaySpeedMs);
  // ...
}, [autoPlaySpeedMs]);
```

**Problem:** Each interval tick triggers full re-render of all 6 components.

**Impact:**
- 900ms interval = ~1.1 re-renders per second
- Each re-render includes: CodePanel, TreePanel, ResultPanel, CallStackPanel, ExplanationPanel, ControlsBar
- Total JS work: projection calculation + syntax highlighting + SVG rendering

**Could be optimized:**
- Memoize panels to prevent re-render if props didn't change (already done with React.memo)
- Use requestAnimationFrame instead of setInterval for animation smoothness

---

### Bottleneck 4: Large ExecutionStep Arrays

**Location:** Pre-computed `generateXxxExecutionSteps()`

**Problem:** Each step object clones the entire `nodeStates` map:

```typescript
function pushStep(...) {
  steps.push({
    // ...
    nodeStates: cloneNodeStates(nodeStates),  // ← Full copy of Record<number, NodeVisualState>
  });
}
```

**Memory Impact:**
- For 100-node tree with 5000 steps: 5000 × 100 Record entries = 500,000 objects in memory
- Could be ~20-30MB of memory just for nodeStates copies across all steps

**Could be optimized:**
- Store only the *changes* to nodeStates, not full copies
- Use immutable data structures like Immer
- Or compute nodeStates on-demand from step.type

---

### Non-Issue: Memoization Effectiveness

**Good news:** The codebase already uses smart memoization:

```typescript
const { executionSteps, initialNodeStates } = useMemo(
  () => generateInorderExecutionSteps(root),
  [root],  // ← Only recompute if root changes
);

const projectedState = useMemo(
  () => projectStateForStep(currentStep, executionSteps, initialNodeStates),
  [currentStep, executionSteps, initialNodeStates],  // ← Recompute on step change
);
```

This is effective and prevents unnecessary re-computation.

---

## Recommended Improvement Areas

**This section intentionally left blank for the user to fill in after review.**

### Possible Directions (Not Prescriptive):

1. **Unified Step Engine Architecture**
   - Single `generateExecutionSteps()` function parameterized by algorithm type
   - Algorithm-agnostic step structure with discriminated unions
   - Centralized step generation library

2. **Shared Component Library**
   - Move generic panels to `src/components/traversal-panels/`
   - Parameterize algorithm-specific sections
   - Reduce component duplication from 8 to 1

3. **Performance Optimization**
   - Cache step projections incrementally
   - Memoize node state diffs instead of full copies
   - Use Canvas or optimized SVG for tree rendering

4. **Testing Infrastructure**
   - Unit tests for engine correctness
   - Integration tests for panel synchronization
   - Visual regression tests via Playwright

5. **Type Safety**
   - Discriminated union for ExecutionStep across all algorithms
   - Shared types exported from central location
   - Compiler-checked type safety for panel props

---

**End of Architectural Analysis**  
Generated on: April 7, 2026  
Total documented pain points: 9 critical + tertiary issues  
Estimated cloned code: ~2,500 lines across features/


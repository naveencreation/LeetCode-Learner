# Tree Problem Creation Strict Standard

This file is the single source of truth for adding a new tree problem.
If any rule here is missed, the problem is considered incomplete.

## 1) Mandatory Outputs

Every new tree problem must include both:

1. Visualizer page (interactive problem runtime)
2. Read Here guide page (teaching page)

No exceptions.

## 2) Naming Rules (Mandatory)

Given:

- Problem slug: `<problem-slug>`
- Feature key: `<featurekey>` (short folder name, lowercase)
- Layout component: `<ProblemLayout>`
- Hook: `use<Problem>Traversal`

Use these conventions exactly:

1. Visualizer route:
   - `src/app/(app)/problems/binary-tree/<problem-slug>/page.tsx`
2. Read Here route:
   - `src/app/(app)/problems/binary-tree/<guide-slug>/page.tsx`
   - Prefer `<featurekey>-guide` unless product naming requires otherwise
3. Feature folder:
   - `src/features/<featurekey>/`

## 3) Required File Set

Create all files below for each new feature:

1. `src/features/<featurekey>/types.ts`
2. `src/features/<featurekey>/constants.ts`
3. `src/features/<featurekey>/engine.ts`
4. `src/features/<featurekey>/selectors.ts`
5. `src/features/<featurekey>/use<Problem>Traversal.ts`
6. `src/features/<featurekey>/components/<ProblemLayout>.tsx`
7. `src/features/<featurekey>/components/CodePanel.tsx`
8. `src/features/<featurekey>/components/ExplanationPanel.tsx`
9. `src/features/<featurekey>/components/ResultPanel.tsx`
10. `src/features/<featurekey>/components/TreePanel.tsx`
11. `src/features/<featurekey>/components/TreeSetupModal.tsx`

You may reuse shared components from `src/features/shared/components/`, but do not skip core feature files.

## 4) Visualizer Page Contract

### 4.1 Route Page

The route page must only render the feature layout:

```tsx
import { <ProblemLayout> } from "@/features/<featurekey>/components/<ProblemLayout>";

export default function <ProblemPageName>() {
  return <<ProblemLayout> />;
}
```

### 4.2 Hook Contract

The feature hook must wrap `useGenericTraversal` and expose these minimum fields consumed by layout panels:

1. root
2. selectedPreset
3. presets
4. customNodePositions
5. executionSteps
6. totalSteps
7. currentStep
8. result
9. visitedNodes
10. currentNode
11. nodeStates
12. currentOperation
13. currentPhase
14. currentCodeLine
15. operationBadge
16. activeStep
17. executedStep
18. activeCallStack
19. isAtStart
20. isAtEnd
21. controlMode
22. setControlMode
23. isPlaying
24. autoPlaySpeedMs
25. setAutoPlaySpeedMs
26. playTraversal
27. pauseTraversal
28. nextStep
29. previousStep
30. resetTraversal
31. applyTreeConfiguration

### 4.3 Layout Contract

Layout must use shell composition already used in existing problems:

1. TraversalShell wrapper
2. UnifiedControlsBar for playback controls
3. UnifiedCallStackPanel for recursion stack
4. CodePanel + TreePanel + ResultPanel + ExplanationPanel
5. guideHref must point to the Read Here route

## 5) Read Here Guide Contract

Each guide page must include all sections below:

1. Problem statement
2. Why this traversal/strategy
3. Intuition
4. Dry run with sample tree
5. Time and space complexity
6. Common mistakes
7. Interview insights
8. CTA links:
   - Back to visualizer page
   - Back to problems list

Guide page must remain readable on mobile and desktop.

## 6) Registration and Routing

When adding a new problem, update these registries:

1. Add entry in `src/features/binary-tree/problemData.ts`
   - slug
   - title
   - intuition
   - pythonCode
2. Ensure dynamic problem route can resolve slug
3. Ensure guideHref in layout points to the guide page

## 7) Strict Acceptance Checklist (DoD)

A new tree problem is complete only if all checks pass:

1. Visualizer route compiles and renders
2. Read Here route compiles and renders
3. Hook uses useGenericTraversal and returns full contract
4. Layout uses shared shell + controls + callstack components
5. Problem added to problemData registry
6. Guide page includes all required teaching sections
7. TypeScript check passes
8. No runtime crash on first load
9. Mobile layout usable (panels readable, no clipped critical actions)

## 8) Copy Templates

### 8.1 Visualizer Route Template

```tsx
import { <ProblemLayout> } from "@/features/<featurekey>/components/<ProblemLayout>";

export default function <ProblemPageName>() {
  return <<ProblemLayout> />;
}
```

### 8.2 Layout Template (Skeleton)

```tsx
"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { TraversalShell } from "@/features/shared/components/TraversalShell";
import { UnifiedControlsBar } from "@/features/shared/components/UnifiedControlsBar";
import { UnifiedCallStackPanel } from "@/features/shared/components/UnifiedCallStackPanel";
import { use<Problem>Traversal } from "../use<Problem>Traversal";
import { CodePanel } from "./CodePanel";
import { ExplanationPanel } from "./ExplanationPanel";
import { ResultPanel } from "./ResultPanel";
import { TreePanel } from "./TreePanel";

const TreeSetupModal = dynamic(() =>
  import("./TreeSetupModal").then((m) => m.TreeSetupModal),
);

export function <ProblemLayout>() {
  const [isTreeSetupOpen, setIsTreeSetupOpen] = useState(false);
  const state = use<Problem>Traversal();

  return (
    <TraversalShell
      title="<Problem Title>"
      subtitle="<One-line teaching subtitle>"
      guideHref="/problems/binary-tree/<guide-slug>"
      left={<CodePanel currentCodeLine={state.currentCodeLine} executionLineNumbers={[]} />}
      middleTop={<TreePanel root={state.root} nodeStates={state.nodeStates} currentOperation={state.currentOperation} activeStep={state.activeStep} customNodePositions={state.customNodePositions} onOpenTreeSetup={() => setIsTreeSetupOpen(true)} />}
      middleBottom={<ResultPanel currentNode={state.currentNode} currentPhase={state.currentPhase} result={state.result} currentStep={state.currentStep} totalSteps={state.totalSteps} currentOperation={state.currentOperation} />}
      middleFooter={<UnifiedControlsBar isAtStart={state.isAtStart} isAtEnd={state.isAtEnd} controlMode={state.controlMode} setControlMode={state.setControlMode} isPlaying={state.isPlaying} autoPlaySpeedMs={state.autoPlaySpeedMs} setAutoPlaySpeedMs={state.setAutoPlaySpeedMs} playTraversal={state.playTraversal} pauseTraversal={state.pauseTraversal} nextStep={state.nextStep} previousStep={state.previousStep} resetTraversal={state.resetTraversal} />}
      rightTop={<UnifiedCallStackPanel activeCallStack={state.activeCallStack} title="Recursion Stack" />}
      rightBottom={<ExplanationPanel currentStep={state.currentStep} totalSteps={state.totalSteps} result={state.result} activeStep={state.executedStep} currentCodeLine={state.currentCodeLine} />}
      modal={isTreeSetupOpen ? <TreeSetupModal root={state.root} selectedPreset={state.selectedPreset} presets={state.presets} customNodePositions={state.customNodePositions} onClose={() => setIsTreeSetupOpen(false)} onApply={(nextRoot, nextPos, preset) => nextRoot ? state.applyTreeConfiguration(nextRoot, nextPos, preset, false) : undefined} onApplyAndRun={(nextRoot, nextPos, preset) => nextRoot ? state.applyTreeConfiguration(nextRoot, nextPos, preset, true) : undefined} /> : null}
    />
  );
}
```

### 8.3 Read Here Page Template (Skeleton)

```tsx
"use client";

import Link from "next/link";

export default function <ProblemGuidePage>() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-8 flex flex-wrap items-center gap-3">
        <Link href="/problems/binary-tree/<problem-slug>">Open Visualizer</Link>
        <Link href="/problems">Back to Problems</Link>
      </header>

      <section><h1><Problem Title></h1><p>Problem statement...</p></section>
      <section><h2>Why This Works</h2><p>Intuition...</p></section>
      <section><h2>Dry Run</h2><p>Step-by-step...</p></section>
      <section><h2>Complexity</h2><p>Time/Space...</p></section>
      <section><h2>Common Mistakes</h2><p>Top pitfalls...</p></section>
      <section><h2>Interview Notes</h2><p>How to explain...</p></section>
    </main>
  );
}
```

## 9) Enforcement Rule

When adding any new tree problem, this file must be read first.
If implementation deviates from this standard, fix the implementation before merge.

## 10) Automated Validation Script

Run this checker for every new tree problem before merge:

```bash
npm run tree:problem:validate -- --feature <featurekey> --problem-slug <problem-slug> --guide-slug <guide-slug>
```

Example:

```bash
npm run tree:problem:validate -- --feature inorder --problem-slug inorder-traversal --guide-slug inorder-guide
```

Validation covers:

1. Required feature file set exists
2. Visualizer route exists
3. Read Here route exists
4. Hook uses `useGenericTraversal`
5. Layout includes required shared shell/controls markers
6. `problemData.ts` contains the problem slug
7. Guide page includes required teaching markers

If validation fails, treat it as a blocker for new problem merge.

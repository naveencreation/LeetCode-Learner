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

## In Progress


## Upcoming


# Tree Problem Implementation Standard

This document defines the minimum quality standard for all future tree problems.
Any new tree feature should match or exceed the implementation quality of inorder traversal.

## 1) Product Goal

- Teach tree concepts clearly with step-by-step visual execution.
- Keep UI intuitive for beginners and powerful for advanced users.
- Maintain consistent design language across all tree modules.

## 2) Required UX Pattern

- Use the same core panel structure:
  - Code panel
  - Tree structure panel
  - Traversal progress panel
  - Recursion stack panel
  - Explanation panel
  - Controls bar
- Keep panel spacing, border radius, shadows, typography, and badge styles consistent.
- Avoid introducing one-off visual patterns for single modules.

## 3) Tree Setup Modal Standard

- Tree setup must open from tree panel, not inline.
- Keep two modes:
  - Beginner: essential controls only
  - Advanced: full editing controls
- Keep right-side live tree preview fixed.
- Keep left-side controls scrollable with themed scrollbar.
- Use dedicated in-app confirm dialog for unsaved close behavior (no browser alert/confirm).

### Required Setup Capabilities

- Presets/templates
- Add node by parent + side
- Drag-and-drop positioning in preview
- Auto layout styles
- Rename node value
- Remove subtree
- Structural validation before apply
- Visual warning hints for layout issues

### Node Limits

- Beginner mode max nodes: 10
- Advanced mode max nodes: 20
- Show helper text: Best learning experience: up to 10 nodes.
- Show clear limit-reached message and disable Add action when cap is hit.

## 4) Controls Bar Standard

- Support manual stepping and auto-play mode.
- Include Play/Pause and speed control in auto mode.
- Use consistent icon set (Lucide) and avoid emoji icons.
- Keep button size, spacing, and interaction states consistent.

## 5) Code Panel Standard

- Include Snippet and Full Code view toggle.
- Snippet mode must be execution-path aware, not only local line window.
- Active-line highlight must be clear but not flashy.
- Ensure full code is always scroll-accessible.
- Keep code theme consistent with approved design direction.

## 6) Visual Quality Rules

- Prefer restrained, enterprise-premium styling over flashy effects.
- Use semantic color roles consistently (info, success, warning, error, active).
- Keep micro-interactions subtle and purposeful.
- Maintain readability at common laptop resolutions.

## 7) Engineering Rules

- Keep TypeScript strict-safe.
- Reuse shared primitives from global styles where possible.
- Do not duplicate style logic across modules when a shared class/pattern exists.
- Preserve keyboard accessibility and predictable focus states.

## 8) Validation Checklist (Before Merge)

- No new lint errors.
- Existing known warnings only in legacy prototype script.
- Manual QA completed:
  - Tree setup flow (open, edit, apply, apply-and-run, unsaved close)
  - Manual mode controls
  - Auto mode controls
  - Snippet and Full code behavior
  - Responsive checks on common viewport sizes

## 9) Expansion Rule for Future Tree Problems

For each new tree problem (for example top view, bottom view, level order, zigzag, etc.):

- Start from this standard.
- Reuse shared components/patterns wherever possible.
- Only problem-specific logic should differ; UX quality should remain consistent.

## 10) Micro-Level UI/UX Implementation Checklist

These are mandatory polish details for all tree modules.

### A) Panel Surface Consistency

- Use shared panel primitives from global styles (`traversal-panel`, `traversal-panel-header`, `traversal-panel-title`, `traversal-pill`, `traversal-kbd`).
- Keep panel corner radius, border, and shadow consistent across code/tree/result/stack/explanation panels.
- Keep panel header spacing and title size consistent.

### B) Spacing Rhythm

- Follow one spacing rhythm only (`1.5`, `2`, `2.5`, `3` style increments used in current app).
- Keep inline control gaps consistent in each row.
- Avoid cramped 3-control rows; use equal grid distribution where possible.

### C) Button and Toggle Standards

- Primary control height should be consistent inside a panel.
- Use one icon family only (Lucide).
- No emoji icons in action buttons.
- Ensure disabled states reduce contrast and show `not-allowed` cursor when applicable.
- Add subtle directional hover motion for next/previous where used.
- Segmented toggles must keep consistent shape, padding, and active-state treatment.

### D) Form Ergonomics

- Inputs/selects/buttons in the same row must align vertically.
- Keep focus ring and focus border behavior consistent across all form controls.
- Show clear inline helper text when the action has constraints.
- For limit rules (like node count), show both current value and max value.

### E) Status and Feedback

- Use semantic status chips with consistent color intent:
  - Info
  - Success
  - Warning
  - Error
- Messages must be action-oriented and concise.
- Error surfaces should tell user exactly what to do next.

### F) Tree Setup Modal Micro Rules

- Left control area scrolls; right preview remains fixed.
- Scrollbar must use themed style (`ui-scrollbar`) and match app look.
- Unsaved changes confirmation must be in-app UI (never native browser confirm).
- Advanced features should be collapsed by default unless context requires otherwise.

### G) Code Panel Micro Rules

- Snippet and Full Code toggle must remain visible and clear.
- Snippet mode must represent execution-path relevance.
- Active line must be obvious but not visually loud.
- Line numbers should be readable but lower emphasis than code text.
- Full code must remain fully scroll-accessible.

### H) Motion and Transition Rules

- Keep transitions short and subtle.
- Use motion to indicate state change, not decoration.
- Avoid multiple competing animations in a single panel at once.

### I) Accessibility and Keyboard

- Tab order must follow visual order.
- Enter/Escape behaviors must be predictable in modals/dialogs.
- Keep focus indicators visible and consistent.
- Maintain readable contrast for text and controls.

### J) Responsive Micro QA

- Validate at least these widths: 1366, 1536, 1920.
- Ensure no panel clipping at common laptop heights.
- Ensure control rows wrap gracefully without overlap.
- Confirm all important actions remain reachable without layout break.

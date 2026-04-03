# Problems Page Consistency Checklist

Use this checklist as a strict gate before merging any `Problems` page UI changes.
The target is consistency with inorder traversal page standards.

## A) Panel System

- [ ] All top-level cards/containers use shared panel primitives (`traversal-panel`, `traversal-panel-header`, `traversal-panel-title`, `traversal-pill`, `traversal-kbd`) where applicable.
- [ ] Border, radius, and shadow look consistent with inorder page.
- [ ] No ad-hoc one-off card style when a shared primitive can be used.

## B) Typography and Hierarchy

- [ ] Page title weight/size matches app-level hierarchy.
- [ ] Small metadata/helper text uses consistent contrast and spacing.
- [ ] Section headers and labels are visually predictable.

## C) Controls and Actions

- [ ] Expand/Collapse/Random controls use consistent button or pill language.
- [ ] Hover, active, and focus states are consistent with inorder controls.
- [ ] Action spacing is balanced and does not crowd adjacent content.

## D) Stats and Progress

- [ ] Stats cards align to same visual rhythm (padding, title style, value prominence).
- [ ] Progress bars and counters are aligned and readable.
- [ ] Numeric text uses tabular style where beneficial.

## E) Accordion Sections

- [ ] Disclosure icon style is consistent (single icon family).
- [ ] Expanded/collapsed states are clear and animated subtly.
- [ ] Header row supports quick scanning of title and solved/total values.
- [ ] Internal section body spacing is consistent across all sections.

## F) Problem Rows

- [ ] Problem items have consistent row height and number badge style.
- [ ] Linked and non-linked rows share visual language.
- [ ] Hover effect is subtle and consistent with app design.

## G) Responsive and Scroll

- [ ] Layout remains usable at common laptop widths (1366, 1536, 1920).
- [ ] No clipping or overlap in long sections.
- [ ] Utility actions remain discoverable during long scrolling.

## H) Accessibility

- [ ] Focus states are visible on all interactive elements.
- [ ] Button labels and ARIA metadata are meaningful.
- [ ] Color contrast remains readable in muted text and counters.

## I) Validation

- [ ] No new lint or type errors.
- [ ] Existing legacy warnings only (if any) remain unchanged.
- [ ] Manual QA done for expand/collapse and section navigation.

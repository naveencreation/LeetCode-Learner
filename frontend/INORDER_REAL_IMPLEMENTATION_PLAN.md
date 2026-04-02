# Inorder Real Implementation Plan (Inorder Only)

## Goal
Upgrade the Inorder Traversal module from a fixed-demo tree into an editable learning system with:
- multiple tree structure presets
- custom node insertion
- manual node positioning
- traversal behavior on any valid tree

## Scope (This phase)
1. Dynamic tree source for inorder engine (no hardcoded tree in renderer)
2. Preset selector (balanced, left skewed, right skewed, sparse)
3. Custom node insertion (parent + side + value)
4. Manual position updates (node value + x/y)
5. Reset positions to auto layout
6. Regenerate traversal timeline on every valid structure change

## Architecture
1. Tree data model:
- TreeNode { val, left, right }
- Positions map: Record<number, { x: number; y: number }>

2. Traversal runtime:
- executionSteps generated from current tree
- node state, stack, result projected from current step index

3. UI layers:
- TreePanel: draws dynamic nodes/edges from current tree
- TreeSetupPanel: preset + insertion + positioning controls
- ControlsBar: traversal controls

## Validation rules
1. Node values must be unique
2. Parent node must exist
3. Side must be available before insertion
4. Position values must be finite numbers

## Implementation tasks
1. Add inorder preset trees and helpers
2. Extend hook with editable tree + positions state
3. Add mutation helpers (add node, apply preset, update position)
4. Replace hardcoded TreePanel geometry with dynamic geometry
5. Add TreeSetupPanel and wire controls to hook
6. Keep existing traversal UX behavior and panels intact

## Done criteria
1. User can switch presets and see traversal adapt
2. User can insert a node and run traversal immediately
3. User can adjust node position manually and see it update
4. Inorder traversal still works step-by-step without regressions
5. Build compiles with no diagnostics errors in changed files

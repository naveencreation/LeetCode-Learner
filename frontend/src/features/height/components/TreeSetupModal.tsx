import { useEffect, useRef, useState } from "react";

import { cloneTree } from "../constants";
import type { NodePosition, TreeNode, TreePresetKey } from "../types";

type LayoutStyle = "balanced" | "compact";

interface TreeSetupModalProps {
  root: TreeNode | null;
  selectedPreset: TreePresetKey;
  presets: Record<TreePresetKey, { label: string; create: () => TreeNode | null }>;
  customNodePositions: Record<number, NodePosition>;
  onClose: () => void;
  onApply: (
    root: TreeNode | null,
    positions: Record<number, NodePosition>,
    preset: TreePresetKey,
  ) => void;
  onApplyAndRun: (
    root: TreeNode | null,
    positions: Record<number, NodePosition>,
    preset: TreePresetKey,
  ) => void;
}

function collectValues(node: TreeNode | null, values: Set<number>): void {
  if (!node) {
    return;
  }

  values.add(node.val);
  collectValues(node.left, values);
  collectValues(node.right, values);
}

function findNodeByValue(node: TreeNode | null, value: number): TreeNode | null {
  if (!node) {
    return null;
  }

  if (node.val === value) {
    return node;
  }

  return findNodeByValue(node.left, value) ?? findNodeByValue(node.right, value);
}

function replaceNodeValue(node: TreeNode | null, fromValue: number, toValue: number): boolean {
  if (!node) {
    return false;
  }

  if (node.val === fromValue) {
    node.val = toValue;
    return true;
  }

  return (
    replaceNodeValue(node.left, fromValue, toValue) ||
    replaceNodeValue(node.right, fromValue, toValue)
  );
}

function removeChildSubtree(parent: TreeNode, side: "left" | "right"): TreeNode | null {
  const removed = parent[side];
  parent[side] = null;
  return removed;
}

function collectSubtreeValues(node: TreeNode | null, values: Set<number>): void {
  if (!node) {
    return;
  }

  values.add(node.val);
  collectSubtreeValues(node.left, values);
  collectSubtreeValues(node.right, values);
}

function validateDraftTree(
  root: TreeNode | null,
  draftPositions: Record<number, NodePosition>,
): { valid: boolean; message: string | null } {
  const seenValues = new Set<number>();
  const seenNodes = new WeakSet<TreeNode>();
  const errors: string[] = [];

  function dfs(node: TreeNode | null): void {
    if (!node) {
      return;
    }

    if (seenNodes.has(node)) {
      errors.push(`Cycle/shared reference detected near node ${node.val}.`);
      return;
    }

    seenNodes.add(node);

    if (seenValues.has(node.val)) {
      errors.push(`Duplicate node value ${node.val} detected.`);
    }
    seenValues.add(node.val);

    if (node.left === node || node.right === node) {
      errors.push(`Node ${node.val} cannot reference itself as a child.`);
    }

    if (node.left && node.right && node.left === node.right) {
      errors.push(`Node ${node.val} has invalid child links (left and right are same node).`);
    }

    dfs(node.left);
    dfs(node.right);
  }

  dfs(root);

  const danglingPositions = Object.keys(draftPositions)
    .map((key) => Number(key))
    .filter((value) => Number.isFinite(value) && !seenValues.has(value));

  if (danglingPositions.length > 0) {
    errors.push(`Position map contains orphan node values: ${danglingPositions.join(", ")}.`);
  }

  if (errors.length > 0) {
    return {
      valid: false,
      message: errors[0],
    };
  }

  return { valid: true, message: null };
}

function collectNodesAndEdges(
  node: TreeNode | null,
  depth: number,
  nodes: Array<{ value: number; depth: number }>,
  edges: Array<[number, number]>,
): void {
  if (!node) {
    return;
  }

  nodes.push({ value: node.val, depth });

  if (node.left) {
    edges.push([node.val, node.left.val]);
    collectNodesAndEdges(node.left, depth + 1, nodes, edges);
  }

  if (node.right) {
    edges.push([node.val, node.right.val]);
    collectNodesAndEdges(node.right, depth + 1, nodes, edges);
  }
}

function assignLayoutOrderIndex(
  node: TreeNode | null,
  map: Record<number, number>,
  counter: { value: number },
): void {
  if (!node) {
    return;
  }

  assignLayoutOrderIndex(node.left, map, counter);
  map[node.val] = counter.value;
  counter.value += 1;
  assignLayoutOrderIndex(node.right, map, counter);
}

function buildAutoPositions(
  root: TreeNode | null,
  style: LayoutStyle = "balanced",
): Record<number, NodePosition> {
  const nodes: Array<{ value: number; depth: number }> = [];
  const edges: Array<[number, number]> = [];
  collectNodesAndEdges(root, 0, nodes, edges);

  const layoutOrderIndex: Record<number, number> = {};
  assignLayoutOrderIndex(root, layoutOrderIndex, { value: 0 });

  const nodeCount = nodes.length;
  const maxDepth = nodes.reduce((max, node) => Math.max(max, node.depth), 0);

  const viewWidth = 420;
  const viewHeight = 290;
  const minX = style === "compact" ? 56 : 42;
  const maxX = viewWidth - (style === "compact" ? 56 : 42);
  const minY = style === "compact" ? 56 : 45;
  const maxY = viewHeight - (style === "compact" ? 44 : 38);

  const xStep = nodeCount > 1 ? (maxX - minX) / (nodeCount - 1) : 0;
  const yStep = maxDepth > 0 ? (maxY - minY) / maxDepth : 0;

  const positions: Record<number, NodePosition> = {};
  nodes.forEach((node) => {
    const depthCompression = style === "compact" ? 0.86 ** node.depth : 1;
    positions[node.value] = {
      x: minX + layoutOrderIndex[node.value] * xStep,
      y: minY + node.depth * yStep * depthCompression,
    };
  });

  return positions;
}

function getConnectorPoints(
  from: { x: number; y: number },
  to: { x: number; y: number },
  nodeRadius = 18,
) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.hypot(dx, dy) || 1;
  const ux = dx / distance;
  const uy = dy / distance;

  return {
    x1: from.x + ux * nodeRadius,
    y1: from.y + uy * nodeRadius,
    x2: to.x - ux * nodeRadius,
    y2: to.y - uy * nodeRadius,
  };
}

function edgeKey(from: number, to: number): string {
  return `${from}-${to}`;
}

function nodePairKey(a: number, b: number): string {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

function orientation(
  p: { x: number; y: number },
  q: { x: number; y: number },
  r: { x: number; y: number },
): number {
  return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
}

function segmentsIntersect(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  q1: { x: number; y: number },
  q2: { x: number; y: number },
): boolean {
  const o1 = orientation(p1, p2, q1);
  const o2 = orientation(p1, p2, q2);
  const o3 = orientation(q1, q2, p1);
  const o4 = orientation(q1, q2, p2);
  return o1 * o2 < 0 && o3 * o4 < 0;
}

function buildTreeSignature(node: TreeNode | null): string {
  if (!node) {
    return "#";
  }

  return `${node.val}(${buildTreeSignature(node.left)})(${buildTreeSignature(node.right)})`;
}

function buildPositionsSignature(positions: Record<number, NodePosition>): string {
  return Object.entries(positions)
    .map(([value, point]) => ({
      value: Number(value),
      x: Number(point.x),
      y: Number(point.y),
    }))
    .filter(
      (entry) =>
        Number.isFinite(entry.value) && Number.isFinite(entry.x) && Number.isFinite(entry.y),
    )
    .sort((a, b) => a.value - b.value)
    .map((entry) => `${entry.value}:${entry.x.toFixed(2)}:${entry.y.toFixed(2)}`)
    .join("|");
}

export function TreeSetupModal({
  root,
  selectedPreset,
  presets,
  customNodePositions,
  onClose,
  onApply,
  onApplyAndRun,
}: TreeSetupModalProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [draftRoot, setDraftRoot] = useState<TreeNode | null>(cloneTree(root));
  const [draftPreset, setDraftPreset] = useState<TreePresetKey>(selectedPreset);
  const [draftPositions, setDraftPositions] = useState<Record<number, NodePosition>>({
    ...customNodePositions,
  });
  const [error, setError] = useState<string | null>(null);

  const [parentValue, setParentValue] = useState("1");
  const [side, setSide] = useState<"left" | "right">("left");
  const [newValue, setNewValue] = useState("");

  const [positionNodeValue, setPositionNodeValue] = useState("");
  const [positionX, setPositionX] = useState("190");
  const [positionY, setPositionY] = useState("52");
  const [draggingNodeValue, setDraggingNodeValue] = useState<number | null>(null);

  const [editFromValue, setEditFromValue] = useState("");
  const [editToValue, setEditToValue] = useState("");

  const [removeParentValue, setRemoveParentValue] = useState("");
  const [removeSide, setRemoveSide] = useState<"left" | "right">("left");
  const [layoutStyle, setLayoutStyle] = useState<LayoutStyle>("balanced");
  const [setupMode, setSetupMode] = useState<"beginner" | "advanced">("beginner");
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const isBeginnerMode = setupMode === "beginner";
  const maxNodesAllowed = isBeginnerMode ? 10 : 20;

  const currentNodeCount = (() => {
    const values = new Set<number>();
    collectValues(draftRoot, values);
    return values.size;
  })();

  const isNodeLimitReached = currentNodeCount >= maxNodesAllowed;

  const previewEdges: Array<[number, number]> = [];
  collectNodesAndEdges(draftRoot, 0, [], previewEdges);

  const autoPositions = buildAutoPositions(draftRoot);
  const previewPositions: Record<number, NodePosition> = {
    ...autoPositions,
    ...draftPositions,
  };

  const viewWidth = 420;
  const viewHeight = 290;
  const nodeRadius = 18;

  const offCanvasNodes = new Set<number>(
    Object.entries(previewPositions)
      .filter(([, point]) => {
        return (
          point.x < nodeRadius ||
          point.y < nodeRadius ||
          point.x > viewWidth - nodeRadius ||
          point.y > viewHeight - nodeRadius
        );
      })
      .map(([value]) => Number(value)),
  );

  const overlappingPairs = new Set<string>();
  const positionEntries = Object.entries(previewPositions).map(([value, point]) => ({
    value: Number(value),
    point,
  }));

  for (let i = 0; i < positionEntries.length; i += 1) {
    for (let j = i + 1; j < positionEntries.length; j += 1) {
      const a = positionEntries[i];
      const b = positionEntries[j];
      const distance = Math.hypot(a.point.x - b.point.x, a.point.y - b.point.y);
      if (distance < 42) {
        overlappingPairs.add(nodePairKey(a.value, b.value));
      }
    }
  }

  const overlappingNodes = new Set<number>();
  Array.from(overlappingPairs).forEach((pair) => {
    const [a, b] = pair.split("-").map(Number);
    overlappingNodes.add(a);
    overlappingNodes.add(b);
  });

  const crossingEdges = new Set<string>();
  for (let i = 0; i < previewEdges.length; i += 1) {
    for (let j = i + 1; j < previewEdges.length; j += 1) {
      const [a1, a2] = previewEdges[i];
      const [b1, b2] = previewEdges[j];

      if (a1 === b1 || a1 === b2 || a2 === b1 || a2 === b2) {
        continue;
      }

      const p1 = previewPositions[a1];
      const p2 = previewPositions[a2];
      const q1 = previewPositions[b1];
      const q2 = previewPositions[b2];

      if (!p1 || !p2 || !q1 || !q2) {
        continue;
      }

      if (segmentsIntersect(p1, p2, q1, q2)) {
        crossingEdges.add(edgeKey(a1, a2));
        crossingEdges.add(edgeKey(b1, b2));
      }
    }
  }

  const hasWarnings =
    offCanvasNodes.size > 0 || overlappingPairs.size > 0 || crossingEdges.size > 0;

  const hasUnsavedChanges =
    draftPreset !== selectedPreset ||
    buildTreeSignature(draftRoot) !== buildTreeSignature(root) ||
    buildPositionsSignature(draftPositions) !== buildPositionsSignature(customNodePositions);

  const getSvgPoint = (event: MouseEvent): NodePosition | null => {
    const svgElement = svgRef.current;
    if (!svgElement) {
      return null;
    }

    const ctm = svgElement.getScreenCTM();
    if (!ctm) {
      return null;
    }

    const point = svgElement.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;

    const transformed = point.matrixTransform(ctm.inverse());
    return { x: transformed.x, y: transformed.y };
  };

  useEffect(() => {
    if (draggingNodeValue === null) {
      return;
    }

    const onMouseMove = (event: MouseEvent) => {
      const svgPoint = getSvgPoint(event);
      if (!svgPoint) {
        return;
      }

      const boundedX = Math.max(24, Math.min(396, svgPoint.x));
      const boundedY = Math.max(24, Math.min(266, svgPoint.y));

      setDraftPositions((previous) => ({
        ...previous,
        [draggingNodeValue]: {
          x: Number(boundedX.toFixed(1)),
          y: Number(boundedY.toFixed(1)),
        },
      }));

      setPositionNodeValue(String(draggingNodeValue));
      setPositionX(String(Number(boundedX.toFixed(1))));
      setPositionY(String(Number(boundedY.toFixed(1))));
    };

    const onMouseUp = () => {
      setDraggingNodeValue(null);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [draggingNodeValue]);

  const handlePresetChange = (preset: TreePresetKey) => {
    setDraftPreset(preset);
    setDraftRoot(presets[preset].create());
    setDraftPositions({});
    setError(null);
  };

  const handleAddNode = () => {
    if (isNodeLimitReached) {
      setError(
        `Node limit reached for ${isBeginnerMode ? "Beginner" : "Advanced"} mode (${maxNodesAllowed} nodes).`,
      );
      return;
    }

    const value = Number(newValue);

    if (draftRoot === null) {
      if (!Number.isFinite(value)) {
        setError("Root node value must be a valid number.");
        return;
      }

      setDraftRoot({
        val: value,
        left: null,
        right: null,
      });
      setParentValue(String(value));
      setNewValue("");
      setError(null);
      return;
    }

    const parent = Number(parentValue);

    if (!Number.isFinite(parent) || !Number.isFinite(value)) {
      setError("Parent and new node value must be valid numbers.");
      return;
    }

    const existingValues = new Set<number>();
    collectValues(draftRoot, existingValues);

    if (existingValues.has(value)) {
      setError(`Node value ${value} already exists.`);
      return;
    }

    const cloned = cloneTree(draftRoot);
    if (!cloned) {
      setError("Unable to clone current tree.");
      return;
    }
    const parentNode = findNodeByValue(cloned, parent);

    if (!parentNode) {
      setError(`Parent node ${parent} was not found.`);
      return;
    }

    if (parentNode[side] !== null) {
      setError(`Parent node ${parent} already has a ${side} child.`);
      return;
    }

    parentNode[side] = {
      val: value,
      left: null,
      right: null,
    };

    setDraftRoot(cloned as TreeNode);
    setNewValue("");
    setError(null);
  };

  const handleSetPosition = () => {
    const nodeValue = Number(positionNodeValue);
    const x = Number(positionX);
    const y = Number(positionY);

    if (!Number.isFinite(nodeValue) || !Number.isFinite(x) || !Number.isFinite(y)) {
      setError("Node, x and y must be valid numbers.");
      return;
    }

    setDraftPositions((previous) => ({
      ...previous,
      [nodeValue]: { x, y },
    }));
    setError(null);
  };

  const handleRenameNode = () => {
    if (!draftRoot) {
      setError("Tree is empty. Add a root node first.");
      return;
    }

    const fromValue = Number(editFromValue);
    const toValue = Number(editToValue);

    if (!Number.isFinite(fromValue) || !Number.isFinite(toValue)) {
      setError("Rename values must be valid numbers.");
      return;
    }

    const allValues = new Set<number>();
    collectValues(draftRoot, allValues);

    if (!allValues.has(fromValue)) {
      setError(`Node ${fromValue} was not found.`);
      return;
    }

    if (fromValue !== toValue && allValues.has(toValue)) {
      setError(`Node value ${toValue} already exists.`);
      return;
    }

    const cloned = cloneTree(draftRoot);
    if (!cloned) {
      setError("Unable to clone current tree.");
      return;
    }
    if (!replaceNodeValue(cloned, fromValue, toValue)) {
      setError(`Failed to rename node ${fromValue}.`);
      return;
    }

    setDraftRoot(cloned as TreeNode);
    setDraftPositions((previous) => {
      if (!(fromValue in previous) || fromValue === toValue) {
        return previous;
      }

      const next = { ...previous };
      const fromPosition = next[fromValue];
      delete next[fromValue];
      if (fromPosition) {
        next[toValue] = fromPosition;
      }
      return next;
    });

    setError(null);
  };

  const handleRemoveSubtree = () => {
    if (!draftRoot) {
      setError("Tree is empty. Nothing to remove.");
      return;
    }

    const parentValueNumber = Number(removeParentValue);
    if (!Number.isFinite(parentValueNumber)) {
      setError("Parent value must be a valid number.");
      return;
    }

    const cloned = cloneTree(draftRoot);
    if (!cloned) {
      setError("Unable to clone current tree.");
      return;
    }

    if (cloned.val === parentValueNumber) {
      const target = removeSide === "left" ? cloned.left : cloned.right;
      if (!target) {
        setError(`Root node ${parentValueNumber} has no ${removeSide} subtree.`);
        return;
      }

      const removedValues = new Set<number>();
      collectSubtreeValues(target, removedValues);
      removeChildSubtree(cloned, removeSide);

      setDraftRoot(cloned);
      setDraftPositions((previous) => {
        const next = { ...previous };
        removedValues.forEach((value) => {
          delete next[value];
        });
        return next;
      });

      setError(null);
      return;
    }

    const parentNode = findNodeByValue(cloned, parentValueNumber);
    if (!parentNode) {
      setError(`Parent node ${parentValueNumber} was not found.`);
      return;
    }

    const target = parentNode[removeSide];
    if (!target) {
      setError(`Node ${parentValueNumber} has no ${removeSide} subtree.`);
      return;
    }

    const removedValues = new Set<number>();
    collectSubtreeValues(target, removedValues);
    removeChildSubtree(parentNode, removeSide);

    setDraftRoot(cloned);
    setDraftPositions((previous) => {
      const next = { ...previous };
      removedValues.forEach((value) => {
        delete next[value];
      });
      return next;
    });

    setError(null);
  };

  const handleApplyAction = (
    applyHandler: (
      root: TreeNode | null,
      positions: Record<number, NodePosition>,
      preset: TreePresetKey,
    ) => void,
  ) => {
    const validation = validateDraftTree(draftRoot, draftPositions);
    if (!validation.valid) {
      setError(validation.message ?? "Tree configuration is invalid.");
      return;
    }

    applyHandler(draftRoot, draftPositions, draftPreset);
    onClose();
  };

  const handleApply = () => {
    handleApplyAction(onApply);
  };

  const handleApplyAndRun = () => {
    handleApplyAction(onApplyAndRun);
  };

  const handleAutoLayout = () => {
    const nextPositions = buildAutoPositions(draftRoot, layoutStyle);
    setDraftPositions(nextPositions);
    setError(null);
  };

  const handleRequestClose = () => {
    if (!hasUnsavedChanges) {
      onClose();
      return;
    }

    setShowDiscardConfirm(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/55 p-4 backdrop-blur-[2px]">
      {showDiscardConfirm ? (
        <div className="absolute inset-0 z-[1] flex items-center justify-center bg-slate-950/35 p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.35)]">
            <h4 className="text-sm font-extrabold uppercase tracking-[0.03em] text-slate-800">
              Discard Unsaved Changes?
            </h4>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              You have unapplied edits in Tree Setup. If you close now, those changes will be lost.
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDiscardConfirm(false)}
                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Continue Editing
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDiscardConfirm(false);
                  onClose();
                }}
                className="rounded-md bg-rose-600 px-3 py-1.5 text-sm font-extrabold text-white transition hover:bg-rose-700"
              >
                Discard And Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex max-h-[92vh] w-full max-w-[1120px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.35)]">
        <div className="flex items-center justify-between border-b px-5 py-3.5">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Tree Setup</h3>
            <p className="text-xs font-semibold text-slate-500">
              Build your tree visually, validate it, then apply or run.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 p-0.5">
              <button
                type="button"
                onClick={() => setSetupMode("beginner")}
                className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.04em] transition ${
                  setupMode === "beginner"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                Beginner
              </button>
              <button
                type="button"
                onClick={() => setSetupMode("advanced")}
                className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.04em] transition ${
                  setupMode === "advanced"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                Advanced
              </button>
            </div>
            <button
              type="button"
              onClick={handleRequestClose}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>

        <div className="grid flex-1 min-h-0 items-stretch gap-3 overflow-hidden p-4 lg:grid-cols-[minmax(410px,1fr)_minmax(470px,1.2fr)]">
          <div className="ui-scrollbar grid min-h-0 content-start gap-2.5 overflow-y-auto pb-3 pr-1">
            <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
              {isBeginnerMode
                ? "Beginner mode: 1) Build tree, 2) Auto layout or drag nodes, 3) Apply and Run."
                : "Advanced mode: includes manual coordinates, rename, and subtree removal tools."}
            </p>

            <p className="rounded-lg border border-teal-100 bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-800">
              Best learning experience: up to 10 nodes.
              <span className="ml-1 text-teal-700">
                Current: {currentNodeCount} / Limit: {maxNodesAllowed}
              </span>
            </p>

            {isNodeLimitReached ? (
              <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
                Node limit reached for {isBeginnerMode ? "Beginner" : "Advanced"} mode ({maxNodesAllowed}).
                Remove or rename existing nodes, or switch mode to continue.
              </p>
            ) : null}

            <section className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <h4 className="mb-1.5 text-xs font-extrabold uppercase tracking-[0.04em] text-slate-600">
                Build Tree
              </h4>
              <p className="mb-2 text-xs font-semibold text-slate-500">
                Pick a template first. If tree is empty, add a node to create the root.
              </p>

              <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.04em] text-slate-500">
                  Preset Template
                </p>
                <select
                  value={draftPreset}
                  onChange={(event) => handlePresetChange(event.target.value as TreePresetKey)}
                  className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-teal-500"
                >
                  {Object.entries(presets).map(([key, preset]) => (
                    <option key={key} value={key}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-2 rounded-lg border border-slate-200 bg-white p-2.5">
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.04em] text-slate-500">
                  Add Child Node
                </p>
              <div className="grid grid-cols-12 gap-1.5">
                <input
                  value={parentValue}
                  onChange={(event) => setParentValue(event.target.value)}
                  placeholder={draftRoot ? "Parent" : "Parent (after root)"}
                  disabled={!draftRoot}
                  className="col-span-12 h-9 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-teal-500 sm:col-span-4"
                />
                <select
                  value={side}
                  onChange={(event) => setSide(event.target.value as "left" | "right")}
                  disabled={!draftRoot}
                  className="col-span-12 h-9 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-teal-500 sm:col-span-3"
                >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
                <input
                  value={newValue}
                  onChange={(event) => setNewValue(event.target.value)}
                  placeholder="Value"
                  className="col-span-8 h-9 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-teal-500 sm:col-span-3"
                />
                <button
                  type="button"
                  onClick={handleAddNode}
                  disabled={isNodeLimitReached}
                  className="col-span-4 h-9 rounded-md bg-teal-600 px-3 text-sm font-extrabold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-teal-300 sm:col-span-2"
                >
                  Add
                </button>
              </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <h4 className="mb-1.5 text-xs font-extrabold uppercase tracking-[0.04em] text-slate-600">
                Layout
              </h4>
              <div className="grid grid-cols-12 gap-1.5">
                <select
                  value={layoutStyle}
                  onChange={(event) => setLayoutStyle(event.target.value as LayoutStyle)}
                  className="col-span-8 h-9 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500"
                >
                  <option value="balanced">Balanced Layout</option>
                  <option value="compact">Compact Layout</option>
                </select>
                <button
                  type="button"
                  onClick={handleAutoLayout}
                  className="col-span-4 h-9 rounded-md bg-emerald-600 px-3 text-sm font-extrabold text-white transition hover:bg-emerald-700"
                >
                  Auto Layout
                </button>
              </div>
              <p className="mt-1.5 text-xs font-semibold text-slate-500">
                Use drag-and-drop for quick edits. Auto Layout cleans up spacing.
              </p>

              {setupMode === "advanced" ? (
                <details className="mt-2 rounded-lg border border-slate-200 bg-white p-2.5">
                  <summary className="cursor-pointer text-[11px] font-bold uppercase tracking-[0.04em] text-slate-600">
                    Advanced: Manual Position Controls
                  </summary>
                  <div className="mt-2 grid grid-cols-12 gap-1.5">
                    <input
                      value={positionNodeValue}
                      onChange={(event) => setPositionNodeValue(event.target.value)}
                      placeholder="Node"
                      className="col-span-12 h-9 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-sky-500 sm:col-span-3"
                    />
                    <input
                      value={positionX}
                      onChange={(event) => setPositionX(event.target.value)}
                      placeholder="X"
                      className="col-span-6 h-9 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-sky-500 sm:col-span-3"
                    />
                    <input
                      value={positionY}
                      onChange={(event) => setPositionY(event.target.value)}
                      placeholder="Y"
                      className="col-span-6 h-9 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-sky-500 sm:col-span-3"
                    />
                    <button
                      type="button"
                      onClick={handleSetPosition}
                      className="col-span-6 h-9 rounded-md bg-sky-600 px-3 text-sm font-extrabold text-white transition hover:bg-sky-700 sm:col-span-2"
                    >
                      Apply
                    </button>
                    <button
                      type="button"
                      onClick={() => setDraftPositions({})}
                      className="col-span-6 h-9 rounded-md border border-slate-300 bg-white px-3 text-sm font-extrabold text-slate-700 transition hover:bg-slate-100 sm:col-span-2"
                    >
                      Reset
                    </button>
                  </div>
                </details>
              ) : null}
            </section>

            {setupMode === "advanced" ? (
              <details className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <summary className="cursor-pointer text-xs font-extrabold uppercase tracking-[0.04em] text-slate-600">
                  Node Actions (Advanced)
                </summary>

                <div className="mt-2 grid gap-2 rounded-lg border border-slate-200 bg-white p-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.04em] text-slate-500">
                    Rename Node
                  </p>
                  <div className="grid grid-cols-12 gap-2">
                    <input
                      value={editFromValue}
                      onChange={(event) => setEditFromValue(event.target.value)}
                      placeholder="Current"
                      className="col-span-12 h-9 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-indigo-500 sm:col-span-4"
                    />
                    <input
                      value={editToValue}
                      onChange={(event) => setEditToValue(event.target.value)}
                      placeholder="New"
                      className="col-span-12 h-9 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-indigo-500 sm:col-span-4"
                    />
                    <button
                      type="button"
                      onClick={handleRenameNode}
                      className="col-span-12 h-9 rounded-md bg-indigo-600 px-3 text-sm font-extrabold text-white transition hover:bg-indigo-700 sm:col-span-4"
                    >
                      Rename
                    </button>
                  </div>
                </div>

                <div className="mt-2 grid gap-2 rounded-lg border border-slate-200 bg-white p-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.04em] text-slate-500">
                    Remove Subtree
                  </p>
                  <div className="grid grid-cols-12 gap-2">
                    <input
                      value={removeParentValue}
                      onChange={(event) => setRemoveParentValue(event.target.value)}
                      placeholder="Parent"
                      className="col-span-12 h-9 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-rose-500 sm:col-span-4"
                    />
                    <select
                      value={removeSide}
                      onChange={(event) => setRemoveSide(event.target.value as "left" | "right")}
                      className="col-span-12 h-9 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-rose-500 sm:col-span-4"
                    >
                      <option value="left">Remove Left</option>
                      <option value="right">Remove Right</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleRemoveSubtree}
                      className="col-span-12 h-9 rounded-md bg-rose-600 px-3 text-sm font-extrabold text-white transition hover:bg-rose-700 sm:col-span-4"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </details>
            ) : null}

            {error ? (
              <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
                {error}
              </p>
            ) : null}
          </div>

          <section className="flex min-h-0 flex-col rounded-xl border border-slate-200 bg-slate-50 p-3.5">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-[0.04em] text-slate-600">
                Live Tree Preview
              </h4>
              <div className="flex items-center gap-1.5">
                <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-[0.04em] text-slate-600">
                  Draft
                </span>
                {hasUnsavedChanges ? (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.04em] text-amber-700">
                    Unsaved Changes
                  </span>
                ) : (
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.04em] text-emerald-700">
                    In Sync
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white p-2">
              <svg ref={svgRef} viewBox="0 0 420 290" className="h-full min-h-[280px] w-full">
                <defs>
                  <marker
                    id="setup-tree-arrow"
                    markerWidth="8"
                    markerHeight="8"
                    refX="7"
                    refY="4"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >
                    <path d="M0,0 L8,4 L0,8 z" fill="#94a3b8" />
                  </marker>
                </defs>

                {previewEdges.map(([from, to]) => {
                  const connector = getConnectorPoints(previewPositions[from], previewPositions[to]);
                  const isCrossingEdge = crossingEdges.has(edgeKey(from, to));

                  return (
                    <line
                      key={`${from}-${to}`}
                      x1={connector.x1}
                      y1={connector.y1}
                      x2={connector.x2}
                      y2={connector.y2}
                      stroke={isCrossingEdge ? "#f59e0b" : "#cbd5e1"}
                      strokeWidth={isCrossingEdge ? "2.8" : "2.1"}
                      markerEnd="url(#setup-tree-arrow)"
                    />
                  );
                })}

                {Object.entries(previewPositions)
                  .sort((a, b) => Number(a[0]) - Number(b[0]))
                  .map(([value, point]) => {
                    const numericValue = Number(value);
                    const isOffCanvas = offCanvasNodes.has(numericValue);
                    const isOverlapping = overlappingNodes.has(numericValue);

                    const haloFill = isOffCanvas
                      ? "rgba(244,63,94,0.18)"
                      : isOverlapping
                        ? "rgba(245,158,11,0.16)"
                        : "rgba(16,185,129,0.16)";
                    const nodeFill = isOffCanvas
                      ? "#fecdd3"
                      : isOverlapping
                        ? "#fde68a"
                        : "#86efac";
                    const nodeStroke = isOffCanvas
                      ? "#e11d48"
                      : isOverlapping
                        ? "#d97706"
                        : "#22c55e";

                    return (
                      <g
                        key={value}
                        onMouseDown={() => {
                          setDraggingNodeValue(numericValue);
                          setError(null);
                        }}
                        className="cursor-grab active:cursor-grabbing"
                      >
                        <circle cx={point.x} cy={point.y} r="24" fill={haloFill} />
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="18"
                          fill={nodeFill}
                          stroke={nodeStroke}
                          strokeWidth="2"
                        />
                        <text
                          x={point.x}
                          y={point.y + 4}
                          textAnchor="middle"
                          className="fill-emerald-900 text-sm font-extrabold"
                        >
                          {value}
                        </text>
                      </g>
                    );
                  })}
              </svg>
            </div>

            <p className="mt-2 text-xs font-semibold text-slate-500">
              Preview updates instantly as you change preset, add nodes, or apply positions.
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Drag nodes directly in the preview to reposition them.
            </p>

            {hasWarnings ? (
              <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs font-semibold text-amber-900">
                <p className="mb-1 font-extrabold uppercase tracking-[0.03em]">Layout Warnings</p>
                <ul className="grid gap-1">
                  {offCanvasNodes.size > 0 ? (
                    <li>
                      Off-canvas nodes: {Array.from(offCanvasNodes).sort((a, b) => a - b).join(", ")}
                    </li>
                  ) : null}
                  {overlappingPairs.size > 0 ? (
                    <li>
                      Overlapping pairs: {Array.from(overlappingPairs).sort().join(", ")}
                    </li>
                  ) : null}
                  {crossingEdges.size > 0 ? (
                    <li>
                      Crossing edges detected on: {Array.from(crossingEdges).sort().join(", ")}
                    </li>
                  ) : null}
                </ul>
              </div>
            ) : null}
          </section>
        </div>

        <div className="shrink-0 flex items-center justify-end gap-2 border-t bg-slate-50/80 px-5 py-3.5">
          <button
            type="button"
            onClick={handleRequestClose}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="rounded-md border border-teal-300 bg-white px-3 py-1.5 text-sm font-extrabold text-teal-700 transition hover:bg-teal-50"
          >
            Apply Only
          </button>
          <button
            type="button"
            onClick={handleApplyAndRun}
            className="rounded-md bg-teal-600 px-3 py-1.5 text-sm font-extrabold text-white transition hover:bg-teal-700"
          >
            Apply and Run
          </button>
        </div>
      </div>
    </div>
  );
}




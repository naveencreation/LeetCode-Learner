"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Info, X } from "lucide-react";
import {
  createLinkedList,
  linkedListPresets,
  type LinkedListPresetKey,
  type ListNode,
} from "@/features/shared/linked-list-types";

interface ListSetupModalProps {
  selectedPreset: LinkedListPresetKey;
  currentValues: number[];
  onClose: () => void;
  onApply: (head: ListNode | null, preset: LinkedListPresetKey) => void;
  onApplyAndRun: (head: ListNode | null, preset: LinkedListPresetKey) => void;
}

type LayoutStyle = "balanced" | "compact";

interface NodePosition {
  x: number;
  y: number;
}

interface PendingDestructiveAction {
  kind: "remove-head" | "remove-tail" | "clear-list" | "remove-value";
  value?: number;
}

function InfoTip({ text, size = 14 }: { text: string; size?: number }) {
  const iconRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const handleEnter = () => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setPos({ top: rect.top - 8, left: rect.left + rect.width / 2 });
    }
    setShow(true);
  };

  return (
    <div
      ref={iconRef}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setShow(false)}
      className="inline-flex"
    >
      <Info size={size} className="cursor-help text-slate-400 transition hover:text-slate-600" />
      {show
        ? createPortal(
            <div
              style={{ top: pos.top, left: pos.left }}
              className="animate-fade-in pointer-events-none fixed z-[9999] w-56 -translate-x-1/2 -translate-y-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-600 shadow-lg"
            >
              {text}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

const presetKeys = (Object.keys(linkedListPresets) as LinkedListPresetKey[])
  .filter((key) => key !== "custom");
const DEFAULT_CUSTOM_INPUT = "1, 2, 3, 4, 5";
const MAX_LIST_NODES = 15;

const SVG_NODE_W = 44;
const SVG_NODE_H = 30;
const SVG_GAP = 24;
const SVG_PAD_X = 24;
const SVG_ROW_Y = 66;
const SVG_NULL_W = 50;
const SVG_NULL_H = 24;
const SVG_MIN_WIDTH = 420;
const SVG_VIEW_HEIGHT = 170;

const POSITION_MIN_X = 32;
const POSITION_MAX_X = 1400;
const POSITION_MIN_Y = 28;
const POSITION_MAX_Y = 146;

function clampPosition(point: NodePosition): NodePosition {
  return {
    x: Number(Math.max(POSITION_MIN_X, Math.min(POSITION_MAX_X, point.x)).toFixed(1)),
    y: Number(Math.max(POSITION_MIN_Y, Math.min(POSITION_MAX_Y, point.y)).toFixed(1)),
  };
}

function buildPositionsSignature(positions: Record<number, NodePosition>): string {
  return Object.entries(positions)
    .map(([value, point]) => ({
      value: Number(value),
      x: Number(point.x),
      y: Number(point.y),
    }))
    .filter((entry) => Number.isFinite(entry.value) && Number.isFinite(entry.x) && Number.isFinite(entry.y))
    .sort((a, b) => a.value - b.value)
    .map((entry) => `${entry.value}:${entry.x.toFixed(1)}:${entry.y.toFixed(1)}`)
    .join("|");
}

function buildLinkedListAutoPositions(
  values: number[],
  layoutStyle: LayoutStyle,
): Record<number, NodePosition> {
  if (values.length === 0) {
    return {};
  }

  const xStart = layoutStyle === "compact" ? 62 : 72;
  const xStep = layoutStyle === "compact" ? 74 : 96;
  const baseY = 88;

  return values.reduce<Record<number, NodePosition>>((acc, value, index) => {
    const yOffset = layoutStyle === "compact" ? (index % 2 === 0 ? -12 : 12) : 0;
    acc[value] = {
      x: xStart + index * xStep,
      y: baseY + yOffset,
    };
    return acc;
  }, {});
}

function buildLinkedListSafeSpreadPositions(
  values: number[],
  layoutStyle: LayoutStyle,
): Record<number, NodePosition> {
  if (values.length === 0) {
    return {};
  }

  const xStart = layoutStyle === "compact" ? 58 : 68;
  const safeStep = layoutStyle === "compact"
    ? Math.max(SVG_NODE_W + 40, 84)
    : Math.max(SVG_NODE_W + 56, 104);
  const baseY = 88;

  return values.reduce<Record<number, NodePosition>>((acc, value, index) => {
    const yOffset = layoutStyle === "compact" ? (index % 2 === 0 ? -10 : 10) : 0;
    acc[value] = clampPosition({
      x: xStart + index * safeStep,
      y: baseY + yOffset,
    });
    return acc;
  }, {});
}

function getConnectorPoints(
  from: { x: number; y: number },
  to: { x: number; y: number },
  nodeRadius = 20,
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

function parseDraftValues(input: string): number[] | null {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  const parts = trimmed.split(/[,\s]+/).filter(Boolean);
  const values: number[] = [];
  const seen = new Set<number>();

  for (const part of parts) {
    const num = Number(part);
    if (!Number.isFinite(num) || !Number.isInteger(num)) {
      return null;
    }
    if (seen.has(num)) {
      return null;
    }
    seen.add(num);
    values.push(num);
  }

  if (values.length === 0 || values.length > MAX_LIST_NODES) {
    return null;
  }

  return values;
}

function LinkedListSetupPreview({
  values,
  isCustom,
  positions,
  svgRef,
  onStartDrag,
  offCanvasNodes,
  overlappingNodes,
}: {
  values: number[];
  isCustom: boolean;
  positions: Record<number, NodePosition>;
  svgRef: React.RefObject<SVGSVGElement | null>;
  onStartDrag: (value: number) => void;
  offCanvasNodes: Set<number>;
  overlappingNodes: Set<number>;
}) {
  const fallbackCenterY = SVG_ROW_Y + SVG_NODE_H / 2;
  const lastValue = values.length > 0 ? values[values.length - 1] : null;
  const lastPoint = lastValue !== null ? positions[lastValue] : null;

  const nullCenterX = Math.max(
    SVG_PAD_X + SVG_NULL_W / 2,
    (lastPoint?.x ?? SVG_PAD_X) + SVG_GAP + SVG_NODE_W / 2,
  );
  const nullCenterY = lastPoint?.y ?? fallbackCenterY;
  const nullX = nullCenterX - SVG_NULL_W / 2;

  const maxNodeX = values.length > 0
    ? Math.max(...values.map((value) => positions[value]?.x ?? 0))
    : 0;
  const viewWidth = Math.max(SVG_MIN_WIDTH, Math.max(maxNodeX, nullCenterX) + SVG_PAD_X + SVG_NULL_W / 2);

  const lineStroke = isCustom ? "#8b5cf6" : "#0f766e";
  const baseNodeFill = isCustom ? "#f5f3ff" : "#ecfeff";
  const baseNodeStroke = isCustom ? "#a78bfa" : "#5eead4";
  const baseValueFill = isCustom ? "#5b21b6" : "#134e4a";

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-2">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${viewWidth} ${SVG_VIEW_HEIGHT}`}
        className="h-[162px] min-w-[420px] w-full"
        preserveAspectRatio="xMinYMid meet"
      >
        <defs>
          <marker
            id="list-setup-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L8,4 L0,8 z" fill={lineStroke} />
          </marker>
        </defs>

        <rect
          x="0"
          y="0"
          width={viewWidth}
          height={SVG_VIEW_HEIGHT}
          fill="#f8fafc"
          stroke="#e2e8f0"
          strokeDasharray="4 4"
          rx="12"
        />

        {values.map((value, index) => {
          const point = positions[value];
          if (!point) {
            return null;
          }

          const nodeX = point.x - SVG_NODE_W / 2;
          const nodeY = point.y - SVG_NODE_H / 2;
          const isOffCanvas = offCanvasNodes.has(value);
          const isOverlapping = overlappingNodes.has(value);

          const nodeFill = isOffCanvas
            ? "#fecdd3"
            : isOverlapping
              ? "#fde68a"
              : baseNodeFill;
          const nodeStroke = isOffCanvas
            ? "#e11d48"
            : isOverlapping
              ? "#d97706"
              : baseNodeStroke;
          const valueFill = isOffCanvas
            ? "#881337"
            : isOverlapping
              ? "#78350f"
              : baseValueFill;

          const nextValue = values[index + 1];
          const nextPoint = nextValue !== undefined ? positions[nextValue] : null;
          return (
            <g
              key={`${value}-${index}`}
              onMouseDown={(event) => {
                event.preventDefault();
                onStartDrag(value);
              }}
              className="cursor-grab active:cursor-grabbing"
            >
              {(isOffCanvas || isOverlapping) ? (
                <rect
                  x={nodeX - 4}
                  y={nodeY - 4}
                  width={SVG_NODE_W + 8}
                  height={SVG_NODE_H + 8}
                  rx="12"
                  fill="none"
                  stroke={isOffCanvas ? "#f43f5e" : "#f59e0b"}
                  strokeWidth="2"
                  strokeDasharray={isOffCanvas ? "3 2" : "2 2"}
                />
              ) : null}
              <rect
                x={nodeX}
                y={nodeY}
                width={SVG_NODE_W}
                height={SVG_NODE_H}
                rx="10"
                fill={nodeFill}
                stroke={nodeStroke}
                strokeWidth="2"
              />
              <text
                x={point.x}
                y={point.y + 0.5}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-extrabold"
                fill={valueFill}
              >
                {value}
              </text>

              {nextPoint ? (
                <line
                  x1={getConnectorPoints(point, nextPoint, SVG_NODE_W / 2).x1}
                  y1={getConnectorPoints(point, nextPoint, SVG_NODE_W / 2).y1}
                  x2={getConnectorPoints(point, nextPoint, SVG_NODE_W / 2).x2}
                  y2={getConnectorPoints(point, nextPoint, SVG_NODE_W / 2).y2}
                  stroke={lineStroke}
                  strokeWidth="2"
                  markerEnd="url(#list-setup-arrow)"
                />
              ) : index === values.length - 1 ? (
                <line
                  x1={point.x + SVG_NODE_W / 2 + 4}
                  y1={point.y}
                  x2={nullX - 6}
                  y2={nullCenterY}
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeDasharray="5 3"
                  markerEnd="url(#list-setup-arrow)"
                />
              ) : null}
            </g>
          );
        })}

        <rect
          x={nullX}
          y={nullCenterY - SVG_NULL_H / 2}
          width={SVG_NULL_W}
          height={SVG_NULL_H}
          rx="8"
          fill="#ffffff"
          stroke="#cbd5e1"
          strokeDasharray="4 3"
        />
        <text
          x={nullCenterX}
          y={nullCenterY + 0.5}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-[10px] font-bold"
          fill="#64748b"
        >
          null
        </text>
      </svg>
    </div>
  );
}

export function ListSetupModal({
  selectedPreset,
  currentValues,
  onClose,
  onApply,
  onApplyAndRun,
}: ListSetupModalProps) {
  const initialIsCustom = selectedPreset === "custom";
  const initialPreset = selectedPreset === "custom" ? "medium" : selectedPreset;
  const initialCustomInput = initialIsCustom
    ? (currentValues.length > 0 ? currentValues.join(", ") : DEFAULT_CUSTOM_INPUT)
    : DEFAULT_CUSTOM_INPUT;

  const [activePreset, setActivePreset] = useState<LinkedListPresetKey>(initialPreset);
  const [customInput, setCustomInput] = useState(initialCustomInput);
  const [isCustom, setIsCustom] = useState(initialIsCustom);
  const [error, setError] = useState<string | null>(null);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [pendingDestructiveAction, setPendingDestructiveAction] =
    useState<PendingDestructiveAction | null>(null);
  const [quickAddValue, setQuickAddValue] = useState("");
  const [insertAfterValue, setInsertAfterValue] = useState("");
  const [insertValue, setInsertValue] = useState("");
  const [layoutStyle, setLayoutStyle] = useState<LayoutStyle>("balanced");
  const [draftPositions, setDraftPositions] = useState<Record<number, NodePosition>>({});
  const [positionNodeValue, setPositionNodeValue] = useState("");
  const [positionX, setPositionX] = useState("");
  const [positionY, setPositionY] = useState("");
  const [renameFromValue, setRenameFromValue] = useState("");
  const [renameToValue, setRenameToValue] = useState("");
  const [quickRemoveValue, setQuickRemoveValue] = useState("");
  const [draggingNodeValue, setDraggingNodeValue] = useState<number | null>(null);
  const presetSelectRef = useRef<HTMLSelectElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const hasPositionOverrides = useMemo(
    () => buildPositionsSignature(draftPositions).length > 0,
    [draftPositions],
  );

  const hasUnsavedChanges = (
    isCustom
      ? !initialIsCustom || customInput.trim() !== initialCustomInput.trim()
      : initialIsCustom || activePreset !== initialPreset
  ) || hasPositionOverrides;

  const customPreviewValues = useMemo(
    () => parseDraftValues(customInput),
    [customInput],
  );

  const presetPreviewValues = useMemo(() => {
    const head = linkedListPresets[activePreset].create();
    const values: number[] = [];
    let n = head;
    while (n) {
      values.push(n.val);
      n = n.next;
    }
    return values;
  }, [activePreset]);

  const modeBadgeLabel = isCustom ? "Custom Draft" : linkedListPresets[activePreset].label;
  const activePreviewValues = useMemo(
    () => (isCustom ? (customPreviewValues ?? []) : presetPreviewValues),
    [isCustom, customPreviewValues, presetPreviewValues],
  );
  const autoPreviewPositions = useMemo(
    () => buildLinkedListAutoPositions(activePreviewValues, layoutStyle),
    [activePreviewValues, layoutStyle],
  );
  const mergedPreviewPositions = useMemo(() => {
    const merged: Record<number, NodePosition> = { ...autoPreviewPositions };
    for (const value of activePreviewValues) {
      if (draftPositions[value]) {
        merged[value] = draftPositions[value];
      }
    }
    return merged;
  }, [autoPreviewPositions, draftPositions, activePreviewValues]);
  const isCustomPreviewInvalid = isCustom
    && customInput.trim().length > 0
    && customPreviewValues === null;
  const draftNodeCount = activePreviewValues.length;

  const offCanvasNodes = useMemo(() => {
    const flagged = new Set<number>();
    const nodeHalfW = SVG_NODE_W / 2;
    const nodeHalfH = SVG_NODE_H / 2;

    const lastValue = activePreviewValues.length > 0 ? activePreviewValues[activePreviewValues.length - 1] : null;
    const lastPoint = lastValue !== null ? mergedPreviewPositions[lastValue] : null;
    const nullCenterX = Math.max(
      SVG_PAD_X + SVG_NULL_W / 2,
      (lastPoint?.x ?? SVG_PAD_X) + SVG_GAP + SVG_NODE_W / 2,
    );
    const maxNodeX = activePreviewValues.length > 0
      ? Math.max(...activePreviewValues.map((value) => mergedPreviewPositions[value]?.x ?? 0))
      : 0;
    const previewWidth = Math.max(
      SVG_MIN_WIDTH,
      Math.max(maxNodeX, nullCenterX) + SVG_PAD_X + SVG_NULL_W / 2,
    );

    for (const value of activePreviewValues) {
      const point = mergedPreviewPositions[value];
      if (!point) {
        continue;
      }

      const isOffCanvas =
        point.x - nodeHalfW < 0
        || point.x + nodeHalfW > previewWidth
        || point.y - nodeHalfH < 0
        || point.y + nodeHalfH > SVG_VIEW_HEIGHT;

      if (isOffCanvas) {
        flagged.add(value);
      }
    }

    return flagged;
  }, [activePreviewValues, mergedPreviewPositions]);

  const overlappingPairs = useMemo(() => {
    const pairs = new Set<string>();
    const threshold = SVG_NODE_W + 6;

    for (let i = 0; i < activePreviewValues.length; i += 1) {
      const aValue = activePreviewValues[i];
      const aPoint = mergedPreviewPositions[aValue];
      if (!aPoint) {
        continue;
      }

      for (let j = i + 1; j < activePreviewValues.length; j += 1) {
        const bValue = activePreviewValues[j];
        const bPoint = mergedPreviewPositions[bValue];
        if (!bPoint) {
          continue;
        }

        const distance = Math.hypot(aPoint.x - bPoint.x, aPoint.y - bPoint.y);
        if (distance < threshold) {
          const [left, right] = aValue < bValue ? [aValue, bValue] : [bValue, aValue];
          pairs.add(`${left}-${right}`);
        }
      }
    }

    return pairs;
  }, [activePreviewValues, mergedPreviewPositions]);

  const overlappingNodes = useMemo(() => {
    const nodes = new Set<number>();
    for (const pair of overlappingPairs) {
      const [left, right] = pair.split("-").map(Number);
      nodes.add(left);
      nodes.add(right);
    }
    return nodes;
  }, [overlappingPairs]);

  const hasLayoutWarnings = offCanvasNodes.size > 0 || overlappingPairs.size > 0;

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      presetSelectRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  const requestClose = useCallback(() => {
    if (!hasUnsavedChanges) {
      onClose();
      return;
    }
    setShowDiscardConfirm(true);
  }, [hasUnsavedChanges, onClose]);

  const getSvgPoint = useCallback((event: MouseEvent): NodePosition | null => {
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
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (pendingDestructiveAction) {
          setPendingDestructiveAction(null);
          return;
        }
        if (showDiscardConfirm) {
          setShowDiscardConfirm(false);
          return;
        }
        requestClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [requestClose, showDiscardConfirm, pendingDestructiveAction]);

  useEffect(() => {
    if (draggingNodeValue === null) {
      return;
    }

    const onMouseMove = (event: MouseEvent) => {
      const svgPoint = getSvgPoint(event);
      if (!svgPoint) {
        return;
      }

      setDraftPositions((previous) => ({
        ...previous,
        [draggingNodeValue]: clampPosition(svgPoint),
      }));
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
  }, [draggingNodeValue, getSvgPoint]);

  const handleStartDrag = useCallback((value: number) => {
    if (!activePreviewValues.includes(value)) {
      return;
    }

    setDraggingNodeValue(value);
    setError(null);
  }, [activePreviewValues]);

  const parseCustom = useCallback((): number[] | null => {
    const trimmed = customInput.trim();
    if (!trimmed) {
      setError(null);
      return [];
    }
    const parts = trimmed.split(/[,\s]+/).filter(Boolean);
    const values: number[] = [];
    const seen = new Set<number>();
    for (const part of parts) {
      const num = Number(part);
      if (!Number.isFinite(num) || !Number.isInteger(num)) {
        setError(`"${part}" is not a valid integer.`);
        return null;
      }
      if (seen.has(num)) {
        setError(`Duplicate value \"${num}\" is not supported.`);
        return null;
      }
      seen.add(num);
      values.push(num);
    }
    if (values.length > MAX_LIST_NODES) {
      setError("Maximum 15 nodes supported.");
      return null;
    }
    setError(null);
    return values;
  }, [customInput]);

  const getHead = useCallback((): { head: ListNode | null; preset: LinkedListPresetKey } | null => {
    if (isCustom) {
      const values = parseCustom();
      if (!values) return null;
      return { head: createLinkedList(values), preset: "custom" };
    }
    return { head: linkedListPresets[activePreset].create(), preset: activePreset };
  }, [isCustom, activePreset, parseCustom]);

  const getWorkingValuesForQuickAction = useCallback((): number[] | null => {
    if (!isCustom) {
      return [...presetPreviewValues];
    }

    const trimmed = customInput.trim();
    if (!trimmed) {
      return [];
    }

    const parsed = parseDraftValues(customInput);
    if (!parsed) {
      setError("Fix custom input before using quick actions.");
      return null;
    }

    return [...parsed];
  }, [isCustom, presetPreviewValues, customInput]);

  const applyQuickValues = useCallback((nextValues: number[]) => {
    setIsCustom(true);
    setCustomInput(nextValues.join(", "));
    setError(null);
  }, []);

  const handleQuickAdd = useCallback((position: "head" | "tail") => {
    const baseValues = getWorkingValuesForQuickAction();
    if (!baseValues) {
      return;
    }

    const token = quickAddValue.trim();
    if (!token) {
      setError("Enter a value to add.");
      return;
    }

    const parsed = Number(token);
    if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
      setError(`"${token}" is not a valid integer.`);
      return;
    }

    if (baseValues.includes(parsed)) {
      setError(`Duplicate value \"${parsed}\" is not supported.`);
      return;
    }

    if (baseValues.length >= MAX_LIST_NODES) {
      setError("Maximum 15 nodes supported.");
      return;
    }

    const nextValues = position === "head"
      ? [parsed, ...baseValues]
      : [...baseValues, parsed];

    applyQuickValues(nextValues);
    setQuickAddValue("");
  }, [getWorkingValuesForQuickAction, quickAddValue, applyQuickValues]);

  const handleInsertAfter = useCallback(() => {
    const baseValues = getWorkingValuesForQuickAction();
    if (!baseValues) {
      return;
    }

    if (baseValues.length === 0) {
      setError("List is empty. Add a node first.");
      return;
    }

    const afterToken = insertAfterValue.trim();
    const valueToken = insertValue.trim();

    if (!afterToken || !valueToken) {
      setError("Enter both After and Value fields.");
      return;
    }

    const afterParsed = Number(afterToken);
    const valueParsed = Number(valueToken);

    if (!Number.isFinite(afterParsed) || !Number.isInteger(afterParsed)) {
      setError(`"${afterToken}" is not a valid integer.`);
      return;
    }
    if (!Number.isFinite(valueParsed) || !Number.isInteger(valueParsed)) {
      setError(`"${valueToken}" is not a valid integer.`);
      return;
    }

    if (!baseValues.includes(afterParsed)) {
      setError(`Node ${afterParsed} is not in the current list.`);
      return;
    }
    if (baseValues.includes(valueParsed)) {
      setError(`Duplicate value "${valueParsed}" is not supported.`);
      return;
    }
    if (baseValues.length >= MAX_LIST_NODES) {
      setError("Maximum 15 nodes supported.");
      return;
    }

    const insertIndex = baseValues.indexOf(afterParsed) + 1;
    const nextValues = [
      ...baseValues.slice(0, insertIndex),
      valueParsed,
      ...baseValues.slice(insertIndex),
    ];

    applyQuickValues(nextValues);
    setInsertAfterValue("");
    setInsertValue("");
  }, [getWorkingValuesForQuickAction, insertAfterValue, insertValue, applyQuickValues]);

  const handleRenameNode = useCallback(() => {
    const baseValues = getWorkingValuesForQuickAction();
    if (!baseValues) {
      return;
    }

    if (baseValues.length === 0) {
      setError("List is empty. Add a node first.");
      return;
    }

    const fromToken = renameFromValue.trim();
    const toToken = renameToValue.trim();

    if (!fromToken || !toToken) {
      setError("Enter both Current and New values.");
      return;
    }

    const fromParsed = Number(fromToken);
    const toParsed = Number(toToken);

    if (!Number.isFinite(fromParsed) || !Number.isInteger(fromParsed)) {
      setError(`"${fromToken}" is not a valid integer.`);
      return;
    }
    if (!Number.isFinite(toParsed) || !Number.isInteger(toParsed)) {
      setError(`"${toToken}" is not a valid integer.`);
      return;
    }

    if (!baseValues.includes(fromParsed)) {
      setError(`Node ${fromParsed} is not in the current list.`);
      return;
    }
    if (fromParsed === toParsed) {
      setError("Current and new values must be different.");
      return;
    }
    if (baseValues.includes(toParsed)) {
      setError(`Duplicate value "${toParsed}" is not supported.`);
      return;
    }

    const nextValues = baseValues.map((value) => (value === fromParsed ? toParsed : value));
    applyQuickValues(nextValues);
    setRenameFromValue("");
    setRenameToValue("");
  }, [getWorkingValuesForQuickAction, renameFromValue, renameToValue, applyQuickValues]);

  const handleRemoveHead = useCallback(() => {
    const baseValues = getWorkingValuesForQuickAction();
    if (!baseValues) {
      return;
    }

    if (baseValues.length === 0) {
      setError("List is already empty.");
      return;
    }

    setPendingDestructiveAction({ kind: "remove-head" });
  }, [getWorkingValuesForQuickAction]);

  const handleRemoveTail = useCallback(() => {
    const baseValues = getWorkingValuesForQuickAction();
    if (!baseValues) {
      return;
    }

    if (baseValues.length === 0) {
      setError("List is already empty.");
      return;
    }

    setPendingDestructiveAction({ kind: "remove-tail" });
  }, [getWorkingValuesForQuickAction]);

  const handleRemoveByValue = useCallback(() => {
    const baseValues = getWorkingValuesForQuickAction();
    if (!baseValues) {
      return;
    }

    const token = quickRemoveValue.trim();
    if (!token) {
      setError("Enter a value to remove.");
      return;
    }

    const parsed = Number(token);
    if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
      setError(`"${token}" is not a valid integer.`);
      return;
    }

    if (!baseValues.includes(parsed)) {
      setError(`Node ${parsed} is not in the current list.`);
      return;
    }

    setPendingDestructiveAction({ kind: "remove-value", value: parsed });
  }, [getWorkingValuesForQuickAction, quickRemoveValue]);

  const handleClearList = useCallback(() => {
    const baseValues = getWorkingValuesForQuickAction();
    if (!baseValues) {
      return;
    }

    if (baseValues.length === 0) {
      setError("List is already empty.");
      return;
    }

    setPendingDestructiveAction({ kind: "clear-list" });
  }, [getWorkingValuesForQuickAction]);

  const executePendingDestructiveAction = useCallback(() => {
    if (!pendingDestructiveAction) {
      return;
    }

    const baseValues = getWorkingValuesForQuickAction();
    if (!baseValues) {
      setPendingDestructiveAction(null);
      return;
    }

    switch (pendingDestructiveAction.kind) {
      case "remove-head": {
        if (baseValues.length === 0) {
          setError("List is already empty.");
          break;
        }
        applyQuickValues(baseValues.slice(1));
        break;
      }
      case "remove-tail": {
        if (baseValues.length === 0) {
          setError("List is already empty.");
          break;
        }
        applyQuickValues(baseValues.slice(0, -1));
        break;
      }
      case "clear-list": {
        if (baseValues.length === 0) {
          setError("List is already empty.");
          break;
        }
        applyQuickValues([]);
        break;
      }
      case "remove-value": {
        if (pendingDestructiveAction.value === undefined) {
          setError("Missing value for remove action.");
          break;
        }
        if (!baseValues.includes(pendingDestructiveAction.value)) {
          setError(`Node ${pendingDestructiveAction.value} is not in the current list.`);
          break;
        }
        applyQuickValues(baseValues.filter((value) => value !== pendingDestructiveAction.value));
        setQuickRemoveValue("");
        break;
      }
      default:
        break;
    }

    setPendingDestructiveAction(null);
  }, [pendingDestructiveAction, getWorkingValuesForQuickAction, applyQuickValues]);

  const destructiveConfirmText =
    pendingDestructiveAction?.kind === "clear-list"
      ? "This will remove every node from the current draft list."
      : pendingDestructiveAction?.kind === "remove-head"
        ? "This will remove the current head node from the draft list."
        : pendingDestructiveAction?.kind === "remove-tail"
          ? "This will remove the current tail node from the draft list."
          : pendingDestructiveAction?.kind === "remove-value"
            ? `This will remove node ${pendingDestructiveAction.value} from the draft list.`
            : "";

  const handleReverseDraft = useCallback(() => {
    const baseValues = getWorkingValuesForQuickAction();
    if (!baseValues) {
      return;
    }

    if (baseValues.length < 2) {
      setError("Need at least 2 nodes to reorder.");
      return;
    }

    applyQuickValues([...baseValues].reverse());
  }, [getWorkingValuesForQuickAction, applyQuickValues]);

  const handleSortDraft = useCallback((direction: "asc" | "desc") => {
    const baseValues = getWorkingValuesForQuickAction();
    if (!baseValues) {
      return;
    }

    if (baseValues.length < 2) {
      setError("Need at least 2 nodes to reorder.");
      return;
    }

    const sorted = [...baseValues].sort((a, b) => (direction === "asc" ? a - b : b - a));
    applyQuickValues(sorted);
  }, [getWorkingValuesForQuickAction, applyQuickValues]);

  const handleAutoLayout = useCallback(() => {
    if (activePreviewValues.length === 0) {
      setError("Add at least one node to compute layout.");
      return;
    }

    setDraftPositions(buildLinkedListAutoPositions(activePreviewValues, layoutStyle));
    setError(null);
  }, [activePreviewValues, layoutStyle]);

  const handleFixLayoutWarnings = useCallback(() => {
    if (activePreviewValues.length === 0) {
      setError("Add at least one node to fix layout.");
      return;
    }
    if (!hasLayoutWarnings) {
      setError("No layout warnings to fix.");
      return;
    }

    setDraftPositions(buildLinkedListSafeSpreadPositions(activePreviewValues, layoutStyle));
    setError(null);
  }, [activePreviewValues, hasLayoutWarnings, layoutStyle]);

  const handleResetPositionOverrides = useCallback(() => {
    setDraftPositions({});
    setError(null);
  }, []);

  const handleSetPositionOverride = useCallback(() => {
    if (activePreviewValues.length === 0) {
      setError("Add at least one node to set positions.");
      return;
    }

    const nodeToken = positionNodeValue.trim();
    const xToken = positionX.trim();
    const yToken = positionY.trim();

    if (!nodeToken || !xToken || !yToken) {
      setError("Enter node, x, and y values.");
      return;
    }

    const node = Number(nodeToken);
    const x = Number(xToken);
    const y = Number(yToken);

    if (!Number.isFinite(node) || !Number.isInteger(node)) {
      setError(`"${nodeToken}" is not a valid node value.`);
      return;
    }
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      setError("Position x and y must be valid numbers.");
      return;
    }
    if (!activePreviewValues.includes(node)) {
      setError(`Node ${node} is not in the current list.`);
      return;
    }

    setDraftPositions((previous) => ({
      ...previous,
      [node]: clampPosition({ x, y }),
    }));
    setError(null);
    setPositionNodeValue("");
    setPositionX("");
    setPositionY("");
  }, [activePreviewValues, positionNodeValue, positionX, positionY]);

  const handleApply = () => {
    const result = getHead();
    if (result) {
      onApply(result.head, result.preset);
      onClose();
    }
  };

  const handleApplyAndRun = () => {
    const result = getHead();
    if (result) {
      onApplyAndRun(result.head, result.preset);
      onClose();
    }
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-[2px]"
      onClick={(e) => {
        if (e.target === backdropRef.current && !showDiscardConfirm && !pendingDestructiveAction) {
          requestClose();
        }
      }}
    >
      {pendingDestructiveAction ? (
        <div className="animate-fade-in absolute inset-0 z-[2] flex items-center justify-center bg-slate-950/40 p-4">
          <div className="animate-scale-in w-full max-w-md rounded-xl border border-slate-200 bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.35)]">
            <h4 className="text-sm font-extrabold uppercase tracking-[0.03em] text-slate-800">
              Confirm Destructive Action
            </h4>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              {destructiveConfirmText}
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDestructiveAction(null)}
                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executePendingDestructiveAction}
                className="rounded-md bg-rose-600 px-3 py-1.5 text-sm font-extrabold text-white transition hover:bg-rose-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showDiscardConfirm ? (
        <div className="animate-fade-in absolute inset-0 z-[1] flex items-center justify-center bg-slate-950/35 p-4">
          <div className="animate-scale-in w-full max-w-md rounded-xl border border-slate-200 bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.35)]">
            <h4 className="text-sm font-extrabold uppercase tracking-[0.03em] text-slate-800">
              Discard Unsaved Changes?
            </h4>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              You have unapplied list changes. If you close now, those edits will be lost.
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
                Discard and Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div
        className="animate-scale-in relative flex max-h-[92vh] w-full max-w-[1080px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between border-b border-slate-200 px-5 py-3.5">
          <h2 className="text-[15px] font-extrabold text-slate-900">Select Linked List</h2>
          <button
            type="button"
            onClick={requestClose}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="grid min-h-0 flex-1 gap-3 overflow-y-auto px-5 py-4 lg:overflow-hidden lg:grid-cols-[minmax(360px,1fr)_minmax(440px,1.15fr)]">
          <section className="ui-scrollbar space-y-4 lg:min-h-0 lg:overflow-y-auto lg:pr-1">
            <section className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-extrabold uppercase tracking-[0.04em] text-slate-600">
                    Build List
                  </h4>
                  <InfoTip text={`Pick a preset or use quick actions. Current draft: ${draftNodeCount} / ${MAX_LIST_NODES} nodes.`} />
                </div>
                <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.03em] text-slate-600">
                  {draftNodeCount} / {MAX_LIST_NODES} Nodes
                </span>
              </div>

              <div className="grid gap-2">
                <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.04em] text-slate-500">
                    Preset Template
                  </p>
                  <select
                    ref={presetSelectRef}
                    value={activePreset}
                    onChange={(event) => {
                      setActivePreset(event.target.value as LinkedListPresetKey);
                      setIsCustom(false);
                      setError(null);
                    }}
                    className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-teal-500"
                  >
                    {presetKeys.map((key) => (
                      <option key={key} value={key}>
                        {linkedListPresets[key].label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[10px] font-semibold text-slate-400">
                    Choosing a preset switches to preset mode.
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                  <div className="mb-1 flex items-center gap-1">
                    <p className="text-[11px] font-bold uppercase tracking-[0.04em] text-slate-500">
                      Layout & Positions
                    </p>
                    <InfoTip text="Switch layout mode, auto-organize, or add manual node position overrides." size={12} />
                  </div>
                  <div className="grid grid-cols-12 gap-1.5">
                    <select
                      value={layoutStyle}
                      onChange={(event) => setLayoutStyle(event.target.value as LayoutStyle)}
                      className="col-span-12 h-9 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 sm:col-span-5"
                    >
                      <option value="balanced">Balanced Layout</option>
                      <option value="compact">Compact Layout</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAutoLayout}
                      className="col-span-6 h-9 rounded-md bg-emerald-600 px-3 text-sm font-extrabold text-white transition hover:bg-emerald-700 sm:col-span-4"
                    >
                      Re-organize
                    </button>
                    <button
                      type="button"
                      onClick={handleResetPositionOverrides}
                      className="col-span-6 h-9 rounded-md bg-slate-600 px-3 text-sm font-extrabold text-white transition hover:bg-slate-700 sm:col-span-3"
                    >
                      Reset Pos
                    </button>

                    <input
                      type="text"
                      value={positionNodeValue}
                      onChange={(event) => {
                        setPositionNodeValue(event.target.value);
                        setError(null);
                      }}
                      placeholder="Node"
                      className="col-span-12 h-9 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 sm:col-span-4"
                    />
                    <input
                      type="text"
                      value={positionX}
                      onChange={(event) => {
                        setPositionX(event.target.value);
                        setError(null);
                      }}
                      placeholder="x"
                      className="col-span-6 h-9 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 sm:col-span-3"
                    />
                    <input
                      type="text"
                      value={positionY}
                      onChange={(event) => {
                        setPositionY(event.target.value);
                        setError(null);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          handleSetPositionOverride();
                        }
                      }}
                      placeholder="y"
                      className="col-span-6 h-9 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 sm:col-span-3"
                    />
                    <button
                      type="button"
                      onClick={handleSetPositionOverride}
                      className="col-span-12 h-9 rounded-md bg-lime-600 px-3 text-sm font-extrabold text-white transition hover:bg-lime-700 sm:col-span-2"
                    >
                      Set
                    </button>
                  </div>
                  <p className="mt-1 text-[10px] font-semibold text-slate-400">
                    Position range x: {POSITION_MIN_X}-{POSITION_MAX_X}, y: {POSITION_MIN_Y}-{POSITION_MAX_Y}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                  <div className="mb-1 flex items-center gap-1">
                    <p className="text-[11px] font-bold uppercase tracking-[0.04em] text-slate-500">
                      Add Node Quickly
                    </p>
                    <InfoTip text="Press Enter to add at tail. Press Shift+Enter to add at head." size={12} />
                  </div>
                  <div className="grid grid-cols-12 gap-1.5">
                    <input
                      type="text"
                      value={quickAddValue}
                      onChange={(event) => {
                        setQuickAddValue(event.target.value);
                        setError(null);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          if (event.shiftKey) {
                            handleQuickAdd("head");
                            return;
                          }
                          handleQuickAdd("tail");
                        }
                      }}
                      placeholder="Value"
                      className="col-span-12 h-9 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-teal-500 sm:col-span-4"
                    />
                    <button
                      type="button"
                      onClick={() => handleQuickAdd("head")}
                      disabled={draftNodeCount >= MAX_LIST_NODES}
                      className="col-span-6 h-9 rounded-md bg-teal-600 px-3 text-sm font-extrabold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-teal-300 sm:col-span-4"
                    >
                      + Head
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAdd("tail")}
                      disabled={draftNodeCount >= MAX_LIST_NODES}
                      className="col-span-6 h-9 rounded-md bg-sky-600 px-3 text-sm font-extrabold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-300 sm:col-span-4"
                    >
                      + Tail
                    </button>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                  <div className="mb-1 flex items-center gap-1">
                    <p className="text-[11px] font-bold uppercase tracking-[0.04em] text-slate-500">
                      Insert After Node
                    </p>
                    <InfoTip text="Press Enter in either field to insert quickly." size={12} />
                  </div>
                  <div className="grid grid-cols-12 gap-1.5">
                    <input
                      type="text"
                      value={insertAfterValue}
                      onChange={(event) => {
                        setInsertAfterValue(event.target.value);
                        setError(null);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          handleInsertAfter();
                        }
                      }}
                      placeholder="After"
                      className="col-span-12 h-9 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-cyan-500 sm:col-span-4"
                    />
                    <input
                      type="text"
                      value={insertValue}
                      onChange={(event) => {
                        setInsertValue(event.target.value);
                        setError(null);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          handleInsertAfter();
                        }
                      }}
                      placeholder="Value"
                      className="col-span-12 h-9 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-cyan-500 sm:col-span-4"
                    />
                    <button
                      type="button"
                      onClick={handleInsertAfter}
                      disabled={draftNodeCount >= MAX_LIST_NODES}
                      className="col-span-12 h-9 rounded-md bg-cyan-600 px-3 text-sm font-extrabold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-cyan-300 sm:col-span-4"
                    >
                      Insert
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="mb-2 flex items-center gap-1.5">
                <h4 className="text-xs font-extrabold uppercase tracking-[0.04em] text-slate-600">
                  Edit List
                </h4>
                <InfoTip text="Remove actions require confirmation. Rename and remove-value support Enter key submission." />
              </div>

              <div className="grid gap-2">
                <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                  <div className="mb-1 flex items-center gap-1">
                    <p className="text-[11px] font-bold uppercase tracking-[0.04em] text-slate-500">
                      Rename Node
                    </p>
                    <InfoTip text="Press Enter in either field to rename." size={12} />
                  </div>
                  <div className="grid grid-cols-12 gap-1.5">
                    <input
                      type="text"
                      value={renameFromValue}
                      onChange={(event) => {
                        setRenameFromValue(event.target.value);
                        setError(null);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          handleRenameNode();
                        }
                      }}
                      placeholder="Current"
                      className="col-span-12 h-9 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-indigo-500 sm:col-span-4"
                    />
                    <input
                      type="text"
                      value={renameToValue}
                      onChange={(event) => {
                        setRenameToValue(event.target.value);
                        setError(null);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          handleRenameNode();
                        }
                      }}
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

                <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                  <div className="mb-1 flex items-center gap-1">
                    <p className="text-[11px] font-bold uppercase tracking-[0.04em] text-slate-500">
                      Remove Node
                    </p>
                    <InfoTip text="All remove actions ask for confirmation before mutating the draft." size={12} />
                  </div>
                  <div className="grid grid-cols-12 gap-1.5">
                    <input
                      type="text"
                      value={quickRemoveValue}
                      onChange={(event) => {
                        setQuickRemoveValue(event.target.value);
                        setError(null);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          handleRemoveByValue();
                        }
                      }}
                      placeholder="Value"
                      className="col-span-12 h-9 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-rose-500 sm:col-span-4"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveByValue}
                      className="col-span-12 h-9 rounded-md bg-rose-600 px-3 text-sm font-extrabold text-white transition hover:bg-rose-700 sm:col-span-8"
                    >
                      Remove Value
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveHead}
                      className="col-span-6 h-9 rounded-md bg-amber-600 px-3 text-sm font-extrabold text-white transition hover:bg-amber-700 sm:col-span-4"
                    >
                      Remove Head
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveTail}
                      className="col-span-6 h-9 rounded-md bg-orange-600 px-3 text-sm font-extrabold text-white transition hover:bg-orange-700 sm:col-span-4"
                    >
                      Remove Tail
                    </button>
                    <button
                      type="button"
                      onClick={handleClearList}
                      className="col-span-12 h-9 rounded-md bg-slate-700 px-3 text-sm font-extrabold text-white transition hover:bg-slate-800 sm:col-span-4"
                    >
                      Clear List
                    </button>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.04em] text-slate-500">
                    Reorder Draft
                  </p>
                  <div className="grid grid-cols-12 gap-1.5">
                    <button
                      type="button"
                      onClick={handleReverseDraft}
                      disabled={draftNodeCount < 2}
                      className="col-span-12 h-9 rounded-md bg-indigo-600 px-3 text-sm font-extrabold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300 sm:col-span-4"
                    >
                      Reverse
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSortDraft("asc")}
                      disabled={draftNodeCount < 2}
                      className="col-span-6 h-9 rounded-md bg-violet-600 px-3 text-sm font-extrabold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300 sm:col-span-4"
                    >
                      Sort Asc
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSortDraft("desc")}
                      disabled={draftNodeCount < 2}
                      className="col-span-6 h-9 rounded-md bg-fuchsia-600 px-3 text-sm font-extrabold text-white transition hover:bg-fuchsia-700 disabled:cursor-not-allowed disabled:bg-fuchsia-300 sm:col-span-4"
                    >
                      Sort Desc
                    </button>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.04em] text-slate-500">
                    Manual List Editor
                  </p>
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => {
                      setCustomInput(e.target.value);
                      setIsCustom(true);
                      setError(null);
                    }}
                    onFocus={() => setIsCustom(true)}
                    placeholder="e.g. 1, 2, 3, 4, 5"
                    className={`w-full rounded-lg border px-3 py-2 text-[13px] font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 ${
                      isCustom
                        ? "border-violet-400 ring-1 ring-violet-400"
                        : "border-slate-200 focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                    }`}
                  />
                  <p className="mt-1 text-[10px] font-semibold text-slate-400">
                    Use unique integers only. Maximum 15 nodes.
                  </p>
                </div>
              </div>
            </section>

            {error ? (
              <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] font-semibold text-rose-700">
                {error}
              </p>
            ) : null}
          </section>

          <section className="flex min-h-0 flex-col rounded-xl border border-slate-200 bg-slate-50 p-3.5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[11px] font-extrabold uppercase tracking-[0.04em] text-slate-600">
                Live List Preview
              </h3>
              <div className="flex flex-wrap items-center justify-end gap-1.5">
                <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.04em] text-slate-600">
                  Draft
                </span>
                {offCanvasNodes.size > 0 ? (
                  <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.04em] text-rose-700">
                    Off-canvas: {offCanvasNodes.size}
                  </span>
                ) : null}
                {overlappingPairs.size > 0 ? (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.04em] text-amber-700">
                    Overlap: {overlappingPairs.size}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="mt-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.03em] ${
                    hasUnsavedChanges
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {hasUnsavedChanges ? "Unsaved Changes" : "In Sync"}
                </span>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.03em] ${
                    isCustom
                      ? "border-violet-200 bg-violet-50 text-violet-700"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  {isCustom ? "Custom Mode" : "Preset Mode"}
                </span>
                <span className="rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.03em] text-teal-700">
                  {modeBadgeLabel}
                </span>
              </div>
              <p className="mt-1.5 text-[11px] font-semibold text-slate-500">
                {isCustom
                  ? `Draft nodes: ${customPreviewValues?.length ?? 0} / 15`
                  : `Preset nodes: ${presetPreviewValues.length} / 15`}
              </p>
            </div>

            <div className="mt-3 flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white p-2">
              {isCustomPreviewInvalid ? (
                <div className="flex h-full items-center justify-center rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] font-semibold text-rose-700">
                  Enter valid unique integers to render the preview.
                </div>
              ) : activePreviewValues.length > 0 ? (
                <LinkedListSetupPreview
                  values={activePreviewValues}
                  isCustom={isCustom}
                  positions={mergedPreviewPositions}
                  svgRef={svgRef}
                  onStartDrag={handleStartDrag}
                  offCanvasNodes={offCanvasNodes}
                  overlappingNodes={overlappingNodes}
                />
              ) : (
                <div className="flex h-full items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-500">
                  Add at least one value to preview the list.
                </div>
              )}
            </div>

            <p className="mt-2 text-[11px] font-semibold text-slate-500">
              Preview updates instantly while you switch presets or edit custom input.
            </p>
            <p className="mt-1 text-[11px] font-semibold text-slate-500">
              Drag nodes in the preview to set custom positions.
            </p>

            {hasLayoutWarnings ? (
              <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs font-semibold text-amber-900">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="font-extrabold uppercase tracking-[0.03em]">Layout Warnings</p>
                  <button
                    type="button"
                    onClick={handleFixLayoutWarnings}
                    className="rounded-md bg-amber-600 px-2.5 py-1 text-[11px] font-extrabold text-white transition hover:bg-amber-700"
                  >
                    Fix Layout
                  </button>
                </div>
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
                </ul>
                <p className="mt-1 text-[11px] font-semibold text-amber-800">
                  Fix Layout applies safe spacing for the current layout mode.
                </p>
              </div>
            ) : null}
          </section>
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50/80 px-5 py-3">
          <button
            type="button"
            onClick={requestClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-[12px] font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-[12px] font-extrabold text-teal-700 transition hover:bg-teal-100"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={handleApplyAndRun}
            className="rounded-lg bg-gradient-to-r from-teal-700 to-teal-400 px-4 py-2 text-[12px] font-extrabold text-white transition hover:from-teal-700 hover:to-teal-500"
          >
            Apply & Run
          </button>
        </div>
      </div>
    </div>
  );
}

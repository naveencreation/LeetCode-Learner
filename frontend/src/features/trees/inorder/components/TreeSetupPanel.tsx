import { useState } from "react";

import type { TreePresetKey } from "../types";

interface TreeSetupPanelProps {
  selectedPreset: TreePresetKey;
  presetOptions: Array<{ key: TreePresetKey; label: string }>;
  onPresetChange: (preset: TreePresetKey) => void;
  onAddNode: (parentValue: number, side: "left" | "right", newValue: number) => boolean;
  onSetPosition: (nodeValue: number, x: number, y: number) => void;
  onResetPositions: () => void;
  errorMessage: string | null;
}

export function TreeSetupPanel({
  selectedPreset,
  presetOptions,
  onPresetChange,
  onAddNode,
  onSetPosition,
  onResetPositions,
  errorMessage,
}: TreeSetupPanelProps) {
  const [parentValue, setParentValue] = useState("1");
  const [side, setSide] = useState<"left" | "right">("left");
  const [newValue, setNewValue] = useState("");

  const [positionNodeValue, setPositionNodeValue] = useState("");
  const [positionX, setPositionX] = useState("190");
  const [positionY, setPositionY] = useState("52");

  const handleAddNode = () => {
    const parent = Number(parentValue);
    const value = Number(newValue);

    if (!Number.isFinite(parent) || !Number.isFinite(value)) {
      return;
    }

    const isAdded = onAddNode(parent, side, value);
    if (isAdded) {
      setNewValue("");
    }
  };

  const handleSetPosition = () => {
    const nodeValue = Number(positionNodeValue);
    const x = Number(positionX);
    const y = Number(positionY);

    if (!Number.isFinite(nodeValue) || !Number.isFinite(x) || !Number.isFinite(y)) {
      return;
    }

    onSetPosition(nodeValue, x, y);
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-2 shadow-[0_2px_10px_rgba(17,24,39,0.06)]">
      <div className="mb-1.5 flex items-center justify-between">
        <h3 className="text-[12px] font-extrabold uppercase tracking-[0.03em] text-slate-700">
          Tree Setup
        </h3>
      </div>

      <div className="grid gap-1.5 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-1.5">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.03em] text-slate-600">
            Preset
          </p>
          <select
            value={selectedPreset}
            onChange={(event) => onPresetChange(event.target.value as TreePresetKey)}
            className="h-8 w-full rounded-md border border-slate-300 bg-white px-2 text-xs font-semibold text-slate-800 outline-none focus:border-teal-500"
          >
            {presetOptions.map((preset) => (
              <option key={preset.key} value={preset.key}>
                {preset.label}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-1.5">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.03em] text-slate-600">
            Add Node
          </p>
          <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-1">
            <input
              value={parentValue}
              onChange={(event) => setParentValue(event.target.value)}
              placeholder="Parent"
              className="h-8 rounded-md border border-slate-300 bg-white px-2 text-xs font-semibold text-slate-800 outline-none focus:border-teal-500"
            />
            <select
              value={side}
              onChange={(event) => setSide(event.target.value as "left" | "right")}
              className="h-8 rounded-md border border-slate-300 bg-white px-2 text-xs font-semibold text-slate-800 outline-none focus:border-teal-500"
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
            <input
              value={newValue}
              onChange={(event) => setNewValue(event.target.value)}
              placeholder="Value"
              className="h-8 rounded-md border border-slate-300 bg-white px-2 text-xs font-semibold text-slate-800 outline-none focus:border-teal-500"
            />
            <button
              type="button"
              onClick={handleAddNode}
              className="h-8 rounded-md bg-teal-600 px-2 text-[11px] font-extrabold text-white hover:bg-teal-700"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="mt-1.5 rounded-lg border border-slate-200 bg-slate-50 p-1.5">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.03em] text-slate-600">
          Position Node
        </p>
        <div className="grid grid-cols-[1fr_1fr_1fr_auto_auto] gap-1">
          <input
            value={positionNodeValue}
            onChange={(event) => setPositionNodeValue(event.target.value)}
            placeholder="Node"
            className="h-8 rounded-md border border-slate-300 bg-white px-2 text-xs font-semibold text-slate-800 outline-none focus:border-teal-500"
          />
          <input
            value={positionX}
            onChange={(event) => setPositionX(event.target.value)}
            placeholder="X"
            className="h-8 rounded-md border border-slate-300 bg-white px-2 text-xs font-semibold text-slate-800 outline-none focus:border-teal-500"
          />
          <input
            value={positionY}
            onChange={(event) => setPositionY(event.target.value)}
            placeholder="Y"
            className="h-8 rounded-md border border-slate-300 bg-white px-2 text-xs font-semibold text-slate-800 outline-none focus:border-teal-500"
          />
          <button
            type="button"
            onClick={handleSetPosition}
            className="h-8 rounded-md bg-sky-600 px-2 text-[11px] font-extrabold text-white hover:bg-sky-700"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={onResetPositions}
            className="h-8 rounded-md border border-slate-300 bg-white px-2 text-[11px] font-extrabold text-slate-700 hover:bg-slate-100"
          >
            Reset
          </button>
        </div>
      </div>

      {errorMessage ? (
        <p className="mt-1.5 rounded-md border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700">
          {errorMessage}
        </p>
      ) : null}
    </section>
  );
}

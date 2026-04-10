import { useState } from "react";

import { cloneTree } from "../constants";
import type { NodePosition, TreeNode, TreePresetKey } from "../types";

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

export function TreeSetupModal({
  root,
  selectedPreset,
  presets,
  customNodePositions,
  onClose,
  onApply,
  onApplyAndRun,
}: TreeSetupModalProps) {
  const [draftRoot, setDraftRoot] = useState<TreeNode | null>(cloneTree(root));
  const [draftPreset, setDraftPreset] = useState<TreePresetKey>(selectedPreset);
  const [draftPositions, setDraftPositions] = useState<Record<number, NodePosition>>({
    ...customNodePositions,
  });
  const [error, setError] = useState<string | null>(null);

  const [parentValue, setParentValue] = useState("1");
  const [side, setSide] = useState<"left" | "right">("left");
  const [newValue, setNewValue] = useState("");

  const handlePresetChange = (preset: TreePresetKey) => {
    setDraftPreset(preset);
    const presetRoot = presets[preset].create();
    setDraftRoot(presetRoot);
    setParentValue(presetRoot ? String(presetRoot.val) : "");
    setDraftPositions({});
    setError(null);
  };

  const handleAddNode = () => {
    const value = Number(newValue);

    if (!Number.isFinite(value)) {
      setError("New node value must be a valid number.");
      return;
    }

    if (!draftRoot) {
      const newRoot: TreeNode = {
        val: value,
        left: null,
        right: null,
      };
      setDraftRoot(newRoot);
      setParentValue(String(value));
      setNewValue("");
      setError(null);
      return;
    }

    const parent = Number(parentValue);
    if (!Number.isFinite(parent)) {
      setError("Parent node value must be a valid number.");
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

    setDraftRoot(cloned);
    setNewValue("");
    setError(null);
  };

  const handleApplyAction = (
    applyHandler: (root: TreeNode | null, positions: Record<number, NodePosition>, preset: TreePresetKey) => void,
  ) => {
    applyHandler(draftRoot, draftPositions, draftPreset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Tree Setup</h3>
            <p className="text-sm text-slate-500">Select a preset or build your own tree</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <div className="space-y-4">
          {/* Preset Selection */}
          <div>
            <label className="text-xs font-bold uppercase text-slate-600">Select Preset</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {Object.entries(presets).map(([key, preset]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handlePresetChange(key as TreePresetKey)}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                    draftPreset === key
                      ? "border-teal-500 bg-teal-50 text-teal-900"
                      : "border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Add Node */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <label className="text-xs font-bold uppercase text-slate-600">Add Node</label>
            <div className="mt-2 grid grid-cols-4 gap-2">
              <input
                type="number"
                placeholder="Parent"
                value={parentValue}
                onChange={(e) => setParentValue(e.target.value)}
                disabled={!draftRoot}
                className="col-span-1 rounded-md border border-slate-300 px-2 py-1 text-sm"
              />
              <select
                value={side}
                onChange={(e) => setSide(e.target.value as "left" | "right")}
                className="col-span-1 rounded-md border border-slate-300 px-2 py-1 text-sm"
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
              <input
                type="number"
                placeholder="Value"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="col-span-1 rounded-md border border-slate-300 px-2 py-1 text-sm"
              />
              <button
                type="button"
                onClick={handleAddNode}
                className="col-span-1 rounded-md bg-teal-600 text-white text-sm font-bold hover:bg-teal-700"
              >
                {draftRoot ? "Add" : "Create Root"}
              </button>
            </div>
            {!draftRoot ? (
              <p className="mt-2 text-xs text-slate-600">
                Tree is empty. Enter a value and use Create Root to start a custom tree.
              </p>
            ) : null}
          </div>

          {/* Error Display */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-2 text-sm font-semibold text-red-900">
              ❌ {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => handleApplyAction(onApply)}
              className="flex-1 rounded-lg bg-slate-700 px-4 py-2 text-white font-bold hover:bg-slate-800"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => handleApplyAction(onApplyAndRun)}
              className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-white font-bold hover:bg-emerald-700"
            >
              Apply & Run
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

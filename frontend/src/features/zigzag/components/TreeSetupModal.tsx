import { useState } from "react";

import { cloneTree } from "../constants";
import type { TreeNode, TreePresetKey } from "../types";

interface NodePosition {
  x: number;
  y: number;
}

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

export function TreeSetupModal({
  selectedPreset,
  presets,
  onClose,
  onApply,
  onApplyAndRun,
}: TreeSetupModalProps) {
  const [draftPreset, setDraftPreset] = useState<TreePresetKey>(selectedPreset);

  const handleApply = () => {
    const newRoot = presets[draftPreset].create();
    onApply(cloneTree(newRoot), {}, draftPreset);
    onClose();
  };

  const handleApplyAndRun = () => {
    const newRoot = presets[draftPreset].create();
    onApplyAndRun(cloneTree(newRoot), {}, draftPreset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white shadow-xl">
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">Select Tree Configuration</h2>
          <p className="mt-1 text-sm text-slate-600">Choose a preset tree or start fresh</p>
        </div>

        {/* Preset List */}
        <div className="max-h-64 overflow-y-auto px-6 py-4">
          <div className="space-y-2">
            {Object.entries(presets).map(([key, preset]) => (
              <label
                key={key}
                className="flex items-center rounded-lg border border-slate-200 p-3 hover:bg-slate-50 cursor-pointer transition"
              >
                <input
                  type="radio"
                  name="preset"
                  value={key}
                  checked={draftPreset === key}
                  onChange={(e) => setDraftPreset(e.target.value as TreePresetKey)}
                  className="h-4 w-4 border-slate-300 text-purple-600"
                />
                <span className="ml-3 font-medium text-slate-900">{preset.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-slate-200 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-slate-100 text-slate-900 font-medium hover:bg-slate-200 transition"
          >
            Apply
          </button>
          <button
            onClick={handleApplyAndRun}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
          >
            Apply & Run
          </button>
        </div>
      </div>
    </div>
  );
}

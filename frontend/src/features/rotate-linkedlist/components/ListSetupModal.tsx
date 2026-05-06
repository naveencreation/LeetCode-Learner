"use client";

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { X, Info } from "lucide-react";
import {
  createLinkedList,
  linkedListPresets,
  type LinkedListPresetKey,
  type ListNode,
} from "@/features/shared/linked-list-types";

interface ListSetupModalProps {
  selectedPreset: LinkedListPresetKey;
  currentValues: number[];
  currentK: number;
  onClose: () => void;
  onApply: (head: ListNode | null, preset: LinkedListPresetKey, k: number) => void;
  onApplyAndRun: (head: ListNode | null, preset: LinkedListPresetKey, k: number) => void;
}

const presetKeys = (Object.keys(linkedListPresets) as LinkedListPresetKey[]).filter(
  (key) => key !== "custom"
);
const DEFAULT_CUSTOM_INPUT = "1, 2, 3, 4, 5";
const MAX_LIST_NODES = 10;

export function ListSetupModal({
  selectedPreset,
  currentValues,
  currentK,
  onClose,
  onApply,
  onApplyAndRun,
}: ListSetupModalProps) {
  const [preset, setPreset] = useState<LinkedListPresetKey>(selectedPreset);
  const [customInput, setCustomInput] = useState(currentValues.join(", ") || DEFAULT_CUSTOM_INPUT);
  const [k, setK] = useState(currentK);
  const [error, setError] = useState<string | null>(null);

  const nodeCount = useMemo(() => {
    if (preset === "custom") {
      const values = customInput.split(",").map((s) => s.trim()).filter((s) => s !== "").map((s) => parseInt(s, 10));
      return values.filter((v) => !isNaN(v)).length;
    }
    const presetFn = linkedListPresets[preset]?.create;
    if (!presetFn) return 0;
    let count = 0;
    let curr = presetFn();
    while (curr !== null) { count++; curr = curr.next; }
    return count;
  }, [preset, customInput]);

  const buildList = (): ListNode | null => {
    if (preset === "custom") {
      const values = customInput.split(",").map((s) => s.trim()).filter((s) => s !== "").map((s) => parseInt(s, 10));
      if (values.length === 0) return null;
      if (values.length > MAX_LIST_NODES) return null;
      return createLinkedList(values);
    }
    const presetFn = linkedListPresets[preset]?.create;
    return presetFn ? presetFn() : null;
  };

  const handleApply = (run = false) => {
    setError(null);
    const head = buildList();
    if (preset === "custom" && head === null) {
      setError("Please enter valid numbers separated by commas");
      return;
    }
    const finalPreset = preset;
    if (run) onApplyAndRun(head, finalPreset, k);
    else onApply(head, finalPreset, k);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Configure Input List</h2>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"><X size={20} /></button>
        </div>

        <div className="mb-4">
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">K (rotations)<Info size={14} className="text-slate-400" /></label>
          <input type="number" value={k} onChange={(e) => setK(parseInt(e.target.value) || 0)} min={0} className="w-full rounded-lg border border-slate-200 p-3 text-sm font-mono focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200" />
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2">
          {presetKeys.map((key) => {
            const isActive = preset === key;
            return (
              <button key={key} type="button" onClick={() => { setPreset(key); setError(null); }}
                className={`rounded-lg border px-3 py-2 text-left text-sm transition ${isActive ? "border-sky-500 bg-sky-50 text-sky-800 shadow-sm" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>
                <span className="font-semibold">{linkedListPresets[key].label}</span>
              </button>
            );
          })}
        </div>

        <div className="mb-4">
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">Custom Input <span className="text-[10px] font-normal text-slate-400">(comma-separated)</span></label>
          <textarea value={customInput} onChange={(e) => { setCustomInput(e.target.value); setPreset("custom"); setError(null); }}
            placeholder="e.g., 1, 2, 3, 4, 5" className="w-full rounded-lg border border-slate-200 p-3 text-sm font-mono focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200" rows={2} />
          <p className="mt-1 text-[10px] text-slate-500">Nodes: {nodeCount} / {MAX_LIST_NODES}</p>
        </div>

        {error && <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">{error}</div>}

        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Cancel</button>
          <button type="button" onClick={() => handleApply(false)} className="flex-1 rounded-lg border border-sky-500 bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600">Apply</button>
          <button type="button" onClick={() => handleApply(true)} className="flex-1 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">Apply & Run</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

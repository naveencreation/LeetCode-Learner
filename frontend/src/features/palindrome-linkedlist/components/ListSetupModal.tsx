"use client";

import { useMemo, useRef, useState } from "react";
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
  onClose: () => void;
  onApply: (head: ListNode | null, preset: LinkedListPresetKey) => void;
  onApplyAndRun: (head: ListNode | null, preset: LinkedListPresetKey) => void;
}

const presetKeys = (Object.keys(linkedListPresets) as LinkedListPresetKey[]).filter(
  (key) => key !== "custom"
);
const DEFAULT_CUSTOM_INPUT = "1, 2, 3, 2, 1";
const MAX_LIST_NODES = 15;

function InfoTip({ text, size = 14 }: { text: string; size?: number }) {
  const iconRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const handleEnter = () => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 6, left: rect.left + rect.width / 2 - 120 });
    }
    setShow(true);
  };

  return (
    <div className="relative inline-block">
      <div
        ref={iconRef}
        onMouseEnter={handleEnter}
        onMouseLeave={() => setShow(false)}
        className="inline-flex cursor-help text-slate-400 hover:text-sky-500 transition"
      >
        <Info size={size} />
      </div>
      {show &&
        createPortal(
          <div
            className="fixed z-[9999] w-[240px] rounded-lg border border-sky-200 bg-white px-3 py-2 text-[11px] font-medium leading-relaxed text-slate-700 shadow-lg"
            style={{ top: pos.top, left: pos.left }}
          >
            {text}
          </div>,
          document.body
        )}
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
  const [preset, setPreset] = useState<LinkedListPresetKey>(selectedPreset);
  const [customInput, setCustomInput] = useState(currentValues.join(", ") || DEFAULT_CUSTOM_INPUT);
  const [error, setError] = useState<string | null>(null);

  const nodeCount = useMemo(() => {
    if (preset === "custom") {
      const values = customInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "")
        .map((s) => parseInt(s, 10));
      return values.filter((v) => !isNaN(v)).length;
    }
    const presetFn = linkedListPresets[preset]?.create;
    if (!presetFn) return 0;
    let count = 0;
    let curr = presetFn();
    while (curr !== null) { count++; curr = curr.next; }
    return count;
  }, [preset, customInput]);

  const buildList = (): { head: ListNode | null; isCustom: boolean } => {
    if (preset === "custom") {
      const values = customInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "")
        .map((s) => parseInt(s, 10));

      if (values.length === 0) return { head: null, isCustom: true };
      if (values.length > MAX_LIST_NODES) return { head: null, isCustom: true };

      return { head: createLinkedList(values), isCustom: true };
    }

    const presetFn = linkedListPresets[preset]?.create;
    return { head: presetFn ? presetFn() : null, isCustom: false };
  };

  const handleApply = (run = false) => {
    setError(null);
    const { head, isCustom } = buildList();

    if (isCustom && head === null) {
      setError("Please enter valid numbers separated by commas");
      return;
    }

    const finalPreset = isCustom ? "custom" : preset;
    if (run) onApplyAndRun(head, finalPreset);
    else onApply(head, finalPreset);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Configure Input List</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2">
          {presetKeys.map((key) => {
            const isActive = preset === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => { setPreset(key); setError(null); }}
                className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                  isActive
                    ? "border-sky-500 bg-sky-50 text-sky-800 shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className="font-semibold">{linkedListPresets[key].label}</span>
              </button>
            );
          })}
        </div>

        <div className="mb-4">
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            Custom Input
            <InfoTip text="Enter comma-separated numbers. Max 15 nodes." />
          </label>
          <textarea
            value={customInput}
            onChange={(e) => { setCustomInput(e.target.value); setPreset("custom"); setError(null); }}
            placeholder="e.g., 1, 2, 3, 2, 1"
            className="w-full rounded-lg border border-slate-200 p-3 text-sm font-mono focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
            rows={2}
          />
          <p className="mt-1 text-[10px] text-slate-500">Nodes: {nodeCount} / {MAX_LIST_NODES}</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleApply(false)}
            className="flex-1 rounded-lg border border-sky-500 bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => handleApply(true)}
            className="flex-1 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Apply & Run
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

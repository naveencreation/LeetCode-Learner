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
const DEFAULT_CUSTOM_INPUT = "1, 2, 3, 4, 5";
const MAX_LIST_NODES = 15;

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

export function ListSetupModal({
  selectedPreset,
  currentValues,
  onClose,
  onApply,
  onApplyAndRun,
}: ListSetupModalProps) {
  const [preset, setPreset] = useState<LinkedListPresetKey>(selectedPreset);
  const [customInput, setCustomInput] = useState(currentValues.join(", "));
  const [error, setError] = useState<string | null>(null);

  const handleApply = () => {
    setError(null);
    let head: ListNode | null = null;

    if (preset === "custom") {
      const values = customInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "")
        .map((s) => parseInt(s, 10));

      if (values.some(isNaN)) {
        setError("Please enter valid numbers separated by commas");
        return;
      }

      if (values.length === 0) {
        setError("Please enter at least one number");
        return;
      }

      if (values.length > MAX_LIST_NODES) {
        setError(`Maximum ${MAX_LIST_NODES} nodes allowed`);
        return;
      }

      head = createLinkedList(values);
    } else {
      head = linkedListPresets[preset].create();
    }

    onApply(head, preset);
  };

  const handleApplyAndRun = () => {
    setError(null);
    let head: ListNode | null = null;

    if (preset === "custom") {
      const values = customInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "")
        .map((s) => parseInt(s, 10));

      if (values.some(isNaN)) {
        setError("Please enter valid numbers separated by commas");
        return;
      }

      if (values.length === 0) {
        setError("Please enter at least one number");
        return;
      }

      if (values.length > MAX_LIST_NODES) {
        setError(`Maximum ${MAX_LIST_NODES} nodes allowed`);
        return;
      }

      head = createLinkedList(values);
    } else {
      head = linkedListPresets[preset].create();
    }

    onApplyAndRun(head, preset);
  };

  const nodeCount = useMemo(() => {
    if (preset === "custom") {
      const values = customInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "")
        .map((s) => parseInt(s, 10));
      return values.filter((v) => !isNaN(v)).length;
    }
    const list = linkedListPresets[preset].create();
    let count = 0;
    let current = list;
    while (current) {
      count++;
      current = current.next;
    }
    return count;
  }, [preset, customInput]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Select List Configuration</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Preset Lists
          </label>
          <div className="grid grid-cols-3 gap-2">
            {presetKeys.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setPreset(key)}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                  preset === key
                    ? "border-sky-500 bg-sky-50 text-sky-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {linkedListPresets[key].label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPreset("custom")}
              className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                preset === "custom"
                  ? "border-sky-500 bg-sky-50 text-sky-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              Custom
            </button>
          </div>
        </div>

        {preset === "custom" && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Custom List Values
            </label>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g., 1, 2, 3, 4, 5"
              className="w-full rounded-lg border border-slate-200 p-3 text-sm font-mono focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
              rows={3}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-slate-500">
                Nodes: {nodeCount} / {MAX_LIST_NODES}
              </span>
              <InfoTip text="Enter comma-separated values (e.g., 1, 2, 3, 4, 5)" />
            </div>
          </div>
        )}

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
            onClick={handleApply}
            className="flex-1 rounded-lg border border-sky-500 bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={handleApplyAndRun}
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

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import {
  createLinkedList,
  linkedListPresets,
  type LinkedListPresetKey,
  type ListNode,
} from "@/features/shared/linked-list-types";

interface ListSetupModalProps {
  selectedPreset: LinkedListPresetKey;
  onClose: () => void;
  onApply: (head: ListNode | null, preset: LinkedListPresetKey) => void;
  onApplyAndRun: (head: ListNode | null, preset: LinkedListPresetKey) => void;
}

const presetKeys = Object.keys(linkedListPresets) as LinkedListPresetKey[];

export function ListSetupModal({
  selectedPreset,
  onClose,
  onApply,
  onApplyAndRun,
}: ListSetupModalProps) {
  const [activePreset, setActivePreset] = useState<LinkedListPresetKey>(selectedPreset);
  const [customInput, setCustomInput] = useState("1, 2, 3, 4, 5");
  const [isCustom, setIsCustom] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const parseCustom = useCallback((): number[] | null => {
    const trimmed = customInput.trim();
    if (!trimmed) {
      setError("Please enter at least one number.");
      return null;
    }
    const parts = trimmed.split(/[,\s]+/).filter(Boolean);
    const values: number[] = [];
    for (const part of parts) {
      const num = Number(part);
      if (!Number.isFinite(num) || !Number.isInteger(num)) {
        setError(`"${part}" is not a valid integer.`);
        return null;
      }
      values.push(num);
    }
    if (values.length === 0) {
      setError("Please enter at least one number.");
      return null;
    }
    if (values.length > 15) {
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
      return { head: createLinkedList(values), preset: "medium" };
    }
    return { head: linkedListPresets[activePreset].create(), preset: activePreset };
  }, [isCustom, activePreset, parseCustom]);

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
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
    >
      <div
        className="animate-scale-in w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5">
          <h2 className="text-[15px] font-extrabold text-slate-900">Select Linked List</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-5 py-4">
          {/* Presets */}
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-500">
              Presets
            </p>
            <div className="flex flex-wrap gap-2">
              {presetKeys.map((key) => {
                const preset = linkedListPresets[key];
                const isActive = !isCustom && activePreset === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setActivePreset(key);
                      setIsCustom(false);
                      setError(null);
                    }}
                    className={`rounded-lg border px-3 py-2 text-[12px] font-extrabold transition ${
                      isActive
                        ? "border-teal-400 bg-teal-50 text-teal-700 ring-1 ring-teal-400"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Preview of selected preset */}
            {!isCustom && (
              <div className="mt-2 flex flex-wrap items-center gap-1 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 font-mono text-[12px] text-slate-600">
                {(() => {
                  const head = linkedListPresets[activePreset].create();
                  const vals: number[] = [];
                  let n = head;
                  while (n) { vals.push(n.val); n = n.next; }
                  return vals.map((v, i) => (
                    <span key={i}>
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 bg-white text-[11px] font-bold text-slate-800">
                        {v}
                      </span>
                      {i < vals.length - 1 && <span className="mx-0.5 text-slate-400">→</span>}
                    </span>
                  ));
                })()}
                <span className="ml-0.5 text-[10px] text-slate-400">→ null</span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">or</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Custom input */}
          <div>
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">
              Custom List (comma-separated)
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
            {error && (
              <p className="mt-1 text-[11px] font-semibold text-red-500">{error}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
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

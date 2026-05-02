"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

function parseDraftValues(input: string): number[] | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const parts = trimmed.split(/[,\s]+/).filter(Boolean);
  const values: number[] = [];
  const seen = new Set<number>();

  for (const part of parts) {
    const num = Number(part);
    if (!Number.isFinite(num) || !Number.isInteger(num)) return null;
    if (seen.has(num)) return null;
    seen.add(num);
    values.push(num);
  }

  if (values.length === 0 || values.length > MAX_LIST_NODES) return null;
  return values;
}

function MiniChainPreview({ values }: { values: number[] }) {
  if (values.length === 0) return null;
  
  return (
    <div className="flex items-center gap-1">
      {values.map((val, i) => (
        <div key={val} className="flex items-center">
          <div className="flex h-6 w-8 items-center justify-center rounded border border-violet-200 bg-violet-50 text-[10px] font-bold text-violet-700">
            {val}
          </div>
          {i < values.length - 1 && (
            <span className="mx-0.5 text-[10px] text-slate-400">→</span>
          )}
        </div>
      ))}
      <span className="ml-1 text-[10px] text-slate-400">→ null</span>
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
  const [activePreset, setActivePreset] = useState<LinkedListPresetKey>(selectedPreset);
  const [customInput, setCustomInput] = useState(DEFAULT_CUSTOM_INPUT);
  const [isCustom, setIsCustom] = useState(false);

  const backdropRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const customValues = useMemo(() => parseDraftValues(customInput), [customInput]);
  const previewValues = isCustom
    ? (customValues ?? [])
    : linkedListToArray(linkedListPresets[activePreset].create());

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleApply = () => {
    const values = isCustom 
      ? customValues 
      : linkedListToArray(linkedListPresets[activePreset].create());
    if (!values || values.length === 0) return;
    
    const head = createLinkedList(values);
    onApply(head, isCustom ? "medium" : activePreset);
    onClose();
  };

  const handleApplyAndRun = () => {
    const values = isCustom 
      ? customValues 
      : linkedListToArray(linkedListPresets[activePreset].create());
    if (!values || values.length === 0) return;
    
    const head = createLinkedList(values);
    onApplyAndRun(head, isCustom ? "medium" : activePreset);
    onClose();
  };

  const isValid = (isCustom && customValues && customValues.length > 0) || 
    (!isCustom && linkedListPresets[activePreset].create);

  return createPortal(
    <div
      ref={backdropRef}
      className="animate-fade-in fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      <div
        ref={cardRef}
        className="animate-scale-in w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-extrabold text-slate-800">Select Linked List</h2>
            <InfoTip text="Choose a preset or enter custom values (max 15 nodes, unique integers)" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {/* Presets */}
          <div className="mb-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
              Presets
            </p>
            <div className="grid grid-cols-2 gap-2">
              {presetKeys.map((key) => {
                const preset = linkedListPresets[key];
                const isSelected = !isCustom && activePreset === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setActivePreset(key);
                      setIsCustom(false);
                    }}
                    className={`rounded-lg border px-3 py-2 text-left transition ${
                      isSelected
                        ? "border-violet-300 bg-violet-50 text-violet-900"
                        : "border-slate-200 bg-white text-slate-700 hover:border-violet-200 hover:bg-violet-50/50"
                    }`}
                  >
                    <span className="text-xs font-bold">{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Input */}
          <div className="mb-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
              Custom List
            </p>
            <div
              className={`rounded-lg border bg-white p-3 transition ${
                isCustom ? "border-violet-300 ring-1 ring-violet-200" : "border-slate-200"
              }`}
            >
              <input
                type="text"
                value={customInput}
                onChange={(e) => {
                  setCustomInput(e.target.value);
                  setIsCustom(true);
                }}
                onFocus={() => setIsCustom(true)}
                placeholder="1, 2, 3, 4, 5"
                className="w-full rounded border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none"
              />
              <p className="mt-1.5 text-[10px] text-slate-500">
                Enter comma-separated integers (max 15, unique values)
              </p>
              {isCustom && customValues && (
                <div className="mt-2">
                  <MiniChainPreview values={customValues} />
                </div>
              )}
              {isCustom && customInput.trim() && !customValues && (
                <p className="mt-1 text-[10px] font-medium text-rose-600">
                  Invalid input. Use unique integers only.
                </p>
              )}
            </div>
          </div>

          {/* Preview */}
          {!isCustom && previewValues.length > 0 && (
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="mb-1 text-[10px] font-bold uppercase text-slate-500">Preview</p>
              <MiniChainPreview values={previewValues} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={!isValid}
            className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-bold text-violet-700 transition hover:bg-violet-100 disabled:opacity-50"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={handleApplyAndRun}
            disabled={!isValid}
            className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-violet-700 disabled:opacity-50"
          >
            Apply & Run
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function linkedListToArray(head: ListNode | null): number[] {
  const result: number[] = [];
  let current = head;
  while (current !== null) {
    result.push(current.val);
    current = current.next;
  }
  return result;
}

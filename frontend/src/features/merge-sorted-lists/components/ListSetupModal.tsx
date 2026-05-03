"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, Info } from "lucide-react";
import {
  createLinkedList,
  linkedListPresets,
  type LinkedListPresetKey,
  type ListNode,
} from "@/features/shared/linked-list-types";

interface ListSetupModalProps {
  selectedPreset1: string;
  selectedPreset2: string;
  currentValues1: number[];
  currentValues2: number[];
  onClose: () => void;
  onApply: (list1: ListNode | null, list2: ListNode | null, preset1: string, preset2: string) => void;
  onApplyAndRun: (list1: ListNode | null, list2: ListNode | null, preset1: string, preset2: string) => void;
}

const presetKeys = (Object.keys(linkedListPresets) as LinkedListPresetKey[]).filter(
  (key) => key !== "custom"
);
const DEFAULT_CUSTOM_INPUT_1 = "1, 3, 5";
const DEFAULT_CUSTOM_INPUT_2 = "2, 4, 6";
const MAX_LIST_NODES = 15;

function InfoTip({ text, size = 14 }: { text: string; size?: number }) {
  const iconRef = useRef<HTMLDivElement | null>(null);
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
  selectedPreset1,
  selectedPreset2,
  currentValues1,
  currentValues2,
  onClose,
  onApply,
  onApplyAndRun,
}: ListSetupModalProps) {
  const [preset1, setPreset1] = useState<LinkedListPresetKey>(selectedPreset1 as LinkedListPresetKey);
  const [preset2, setPreset2] = useState<LinkedListPresetKey>(selectedPreset2 as LinkedListPresetKey);
  const [customInput1, setCustomInput1] = useState(DEFAULT_CUSTOM_INPUT_1);
  const [customInput2, setCustomInput2] = useState(DEFAULT_CUSTOM_INPUT_2);

  const parsedNode1 = preset1 === "custom" ? createLinkedList(parseDraftValues(customInput1) ?? []) : linkedListPresets[preset1].create();
  const parsedNode2 = preset2 === "custom" ? createLinkedList(parseDraftValues(customInput2) ?? []) : linkedListPresets[preset2].create();

  const values1 = currentValues1;
  const values2 = currentValues2;

  const handleApply = () => {
    const list1 = preset1 === "custom" ? createLinkedList(parseDraftValues(customInput1) ?? []) : linkedListPresets[preset1].create();
    const list2 = preset2 === "custom" ? createLinkedList(parseDraftValues(customInput2) ?? []) : linkedListPresets[preset2].create();
    onApply(list1, list2, preset1, preset2);
  };

  const handleApplyAndRun = () => {
    const list1 = preset1 === "custom" ? createLinkedList(parseDraftValues(customInput1) ?? []) : linkedListPresets[preset1].create();
    const list2 = preset2 === "custom" ? createLinkedList(parseDraftValues(customInput2) ?? []) : linkedListPresets[preset2].create();
    onApplyAndRun(list1, list2, preset1, preset2);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <X size={20} />
        </button>

        <h2 className="mb-6 text-xl font-bold text-slate-900">Configure Lists</h2>

        <div className="space-y-6">
          {/* List 1 Configuration */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-violet-700">List 1</h3>
              <InfoTip text="First sorted list to merge" />
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {presetKeys.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPreset1(key)}
                  className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${
                    preset1 === key
                      ? "border-violet-500 bg-violet-50 text-violet-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {linkedListPresets[key].label}
                </button>
              ))}
            </div>

            {preset1 === "custom" && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600">Custom Values (comma-separated)</label>
                <input
                  type="text"
                  value={customInput1}
                  onChange={(e) => setCustomInput1(e.target.value)}
                  placeholder="1, 3, 5, 7"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
            )}

            {preset1 !== "custom" && (
              <MiniChainPreview values={currentValues1} />
            )}
          </div>

          {/* List 2 Configuration */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-emerald-700">List 2</h3>
              <InfoTip text="Second sorted list to merge" />
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {presetKeys.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPreset2(key)}
                  className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${
                    preset2 === key
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {linkedListPresets[key].label}
                </button>
              ))}
            </div>

            {preset2 === "custom" && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600">Custom Values (comma-separated)</label>
                <input
                  type="text"
                  value={customInput2}
                  onChange={(e) => setCustomInput2(e.target.value)}
                  placeholder="2, 4, 6, 8"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            )}

            {preset2 !== "custom" && (
              <MiniChainPreview values={currentValues2} />
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={handleApplyAndRun}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-violet-700"
          >
            Apply & Run
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

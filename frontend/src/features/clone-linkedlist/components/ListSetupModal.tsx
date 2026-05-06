"use client";

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { createLinkedList, type ListNode } from "@/features/shared/linked-list-types";

interface ListSetupModalProps {
  currentValues: number[];
  currentRandomMap: Record<number, number | null>;
  onClose: () => void;
  onApply: (head: ListNode | null, randomMap: Record<number, number | null>) => void;
  onApplyAndRun: (head: ListNode | null, randomMap: Record<number, number | null>) => void;
}

const DEFAULT_CUSTOM_INPUT = "7, 13, 11";
const MAX_LIST_NODES = 10;

export function ListSetupModal({
  currentValues,
  currentRandomMap,
  onClose,
  onApply,
  onApplyAndRun,
}: ListSetupModalProps) {
  const [customInput, setCustomInput] = useState(currentValues.join(", ") || DEFAULT_CUSTOM_INPUT);
  const [randomInput, setRandomInput] = useState(() => {
    const entries = Object.entries(currentRandomMap).map(([k, v]) => `${k}:${v ?? "null"}`);
    return entries.join(", ");
  });
  const [error, setError] = useState<string | null>(null);

  const nodeCount = useMemo(() => {
    const values = customInput.split(",").map((s) => s.trim()).filter((s) => s !== "").map((s) => parseInt(s, 10));
    return values.filter((v) => !isNaN(v)).length;
  }, [customInput]);

  const buildList = (): { head: ListNode | null; randomMap: Record<number, number | null> } => {
    const values = customInput.split(",").map((s) => s.trim()).filter((s) => s !== "").map((s) => parseInt(s, 10));
    if (values.length === 0) return { head: null, randomMap: {} };
    if (values.length > MAX_LIST_NODES) return { head: null, randomMap: {} };

    const map: Record<number, number | null> = {};
    randomInput.split(",").forEach((entry) => {
      const [k, v] = entry.split(":").map((s) => s.trim());
      const idx = parseInt(k, 10);
      if (!isNaN(idx) && idx >= 0 && idx < values.length) {
        map[idx] = v === "null" || v === "" ? null : parseInt(v, 10);
      }
    });

    return { head: createLinkedList(values), randomMap: map };
  };

  const handleApply = (run = false) => {
    setError(null);
    const { head, randomMap } = buildList();
    if (head === null) {
      setError("Please enter valid numbers separated by commas");
      return;
    }
    if (run) onApplyAndRun(head, randomMap);
    else onApply(head, randomMap);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Configure Input List</h2>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"><X size={20} /></button>
        </div>

        <div className="mb-4">
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">Custom Input <span className="text-[10px] font-normal text-slate-400">(comma-separated)</span></label>
          <textarea value={customInput} onChange={(e) => { setCustomInput(e.target.value); setError(null); }}
            placeholder="e.g., 7, 13, 11" className="w-full rounded-lg border border-slate-200 p-3 text-sm font-mono focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200" rows={2} />
          <p className="mt-1 text-[10px] text-slate-500">Nodes: {nodeCount} / {MAX_LIST_NODES}</p>
        </div>

        <div className="mb-4">
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">Random Pointers <span className="text-[10px] font-normal text-slate-400">(index:target, e.g. 0:null, 1:0)</span></label>
          <textarea value={randomInput} onChange={(e) => { setRandomInput(e.target.value); setError(null); }}
            placeholder="e.g., 0:null, 1:0, 2:null" className="w-full rounded-lg border border-slate-200 p-3 text-sm font-mono focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200" rows={2} />
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

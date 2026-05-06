"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { createLinkedList, type ListNode } from "@/features/shared/linked-list-types";

interface ListSetupModalProps {
  onClose: () => void;
  onApply: (list1: ListNode | null, list2: ListNode | null) => void;
  onApplyAndRun: (list1: ListNode | null, list2: ListNode | null) => void;
}

const DEFAULT_LIST1 = "2, 4, 3";
const DEFAULT_LIST2 = "5, 6, 4";
const MAX_LIST_NODES = 10;

export function ListSetupModal({
  onClose,
  onApply,
  onApplyAndRun,
}: ListSetupModalProps) {
  const [list1Input, setList1Input] = useState(DEFAULT_LIST1);
  const [list2Input, setList2Input] = useState(DEFAULT_LIST2);
  const [error, setError] = useState<string | null>(null);

  const handleApply = () => {
    setError(null);
    const values1 = list1Input
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "")
      .map((s) => parseInt(s, 10));

    const values2 = list2Input
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "")
      .map((s) => parseInt(s, 10));

    if (values1.some(isNaN) || values2.some(isNaN)) {
      setError("Please enter valid numbers separated by commas");
      return;
    }

    if (values1.length === 0 || values2.length === 0) {
      setError("Please enter at least one number for each list");
      return;
    }

    if (values1.length > MAX_LIST_NODES || values2.length > MAX_LIST_NODES) {
      setError(`Maximum ${MAX_LIST_NODES} nodes allowed per list`);
      return;
    }

    const list1 = createLinkedList(values1);
    const list2 = createLinkedList(values2);
    onApply(list1, list2);
  };

  const handleApplyAndRun = () => {
    setError(null);
    const values1 = list1Input
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "")
      .map((s) => parseInt(s, 10));

    const values2 = list2Input
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "")
      .map((s) => parseInt(s, 10));

    if (values1.some(isNaN) || values2.some(isNaN)) {
      setError("Please enter valid numbers separated by commas");
      return;
    }

    if (values1.length === 0 || values2.length === 0) {
      setError("Please enter at least one number for each list");
      return;
    }

    if (values1.length > MAX_LIST_NODES || values2.length > MAX_LIST_NODES) {
      setError(`Maximum ${MAX_LIST_NODES} nodes allowed per list`);
      return;
    }

    const list1 = createLinkedList(values1);
    const list2 = createLinkedList(values2);
    onApplyAndRun(list1, list2);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Configure Input Lists</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            List 1 Values
          </label>
          <textarea
            value={list1Input}
            onChange={(e) => setList1Input(e.target.value)}
            placeholder="e.g., 2, 4, 3"
            className="w-full rounded-lg border border-slate-200 p-3 text-sm font-mono focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
            rows={2}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            List 2 Values
          </label>
          <textarea
            value={list2Input}
            onChange={(e) => setList2Input(e.target.value)}
            placeholder="e.g., 5, 6, 4"
            className="w-full rounded-lg border border-slate-200 p-3 text-sm font-mono focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
            rows={2}
          />
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

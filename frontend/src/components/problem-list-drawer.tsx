"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { BookOpen, ChevronLeft, ChevronRight, Play, Search, X } from "lucide-react";
import {
  getGuideHref,
  getPlatformLink,
  getProblemHref,
  sections,
  topicConfigurations,
} from "@/app/(app)/problems/page";
import { GFGIcon, LeetCodeIcon } from "@/components/dsa-icons";

interface ProblemListDrawerProps {
  open: boolean;
  onClose: () => void;
  topicKey: string;
  currentHref: string;
}

export function ProblemListDrawer({
  open,
  onClose,
  topicKey,
  currentHref,
}: ProblemListDrawerProps) {
  const [query, setQuery] = useState("");
  const activeRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const topicConfig = topicConfigurations.find((t) => t.key === topicKey);

  const problems = topicConfig
    ? sections
        .filter((s) => topicConfig.matches(s.name))
        .flatMap((s) =>
          s.problems.map((p) => ({
            sectionName: s.name,
            name: p,
            href: getProblemHref(s.name, p),
            guideHref: getGuideHref(p),
            platform: getPlatformLink(p),
          })),
        )
    : [];

  const filtered = query.trim()
    ? problems.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()),
      )
    : problems;

  const currentIndex = problems.findIndex((p) => p.href === currentHref);
  const prevProblem = currentIndex > 0 ? problems[currentIndex - 1] : null;
  const nextProblem =
    currentIndex < problems.length - 1 ? problems[currentIndex + 1] : null;

  // Scroll active into view when drawer opens
  useEffect(() => {
    if (open && activeRef.current && listRef.current) {
      requestAnimationFrame(() => {
        activeRef.current?.scrollIntoView({ block: "center", behavior: "instant" });
      });
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const liveCount = problems.filter((p) => Boolean(p.href)).length;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex justify-end">
      {/* Backdrop */}
      <div
        className="animate-fade-in absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <aside
        className="relative z-10 flex h-full w-full max-w-[380px] flex-col border-l border-slate-200 bg-white shadow-[-4px_0_24px_rgba(15,23,42,0.12)]"
        style={{ animation: "slideInRight 250ms cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="min-w-0">
            <h2 className="text-sm font-extrabold text-slate-900">
              Problem List
            </h2>
            <p className="mt-0.5 text-[11px] font-medium text-slate-500">
              {liveCount} of {problems.length} problems live
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* Search */}
        <div className="border-b border-slate-100 px-4 py-2.5">
          <label className="relative block">
            <Search
              size={14}
              strokeWidth={2}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search problems..."
              className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-300 focus:ring-2 focus:ring-teal-100"
            />
          </label>
        </div>

        {/* Problem list */}
        <div ref={listRef} className="ui-scrollbar min-h-0 flex-1 overflow-y-auto px-2 py-2">
          {filtered.map((item, index) => {
            const isActive = item.href === currentHref;
            const globalIndex = problems.indexOf(item);

            return (
              <div
                key={`${item.sectionName}-${item.name}`}
                ref={isActive ? activeRef : undefined}
                className={`group mb-1 flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 transition ${
                  isActive
                    ? "border border-teal-200 bg-teal-50"
                    : "border border-transparent hover:border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span
                  className={`inline-flex h-6 min-w-6 items-center justify-center rounded-md text-[10px] font-bold tabular-nums ${
                    isActive
                      ? "border border-teal-300 bg-teal-100 text-teal-700"
                      : item.href
                        ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border border-slate-200 bg-slate-50 text-slate-500"
                  }`}
                >
                  {globalIndex + 1}
                </span>

                <div className="min-w-0 flex-1">
                  {item.href ? (
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`block truncate text-[13px] font-semibold ${
                        isActive ? "text-teal-800" : "text-slate-800"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <span className="block truncate text-[13px] font-semibold text-slate-400">
                      {item.name}
                    </span>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  {item.href && !isActive ? (
                    <Link
                      href={item.href}
                      onClick={onClose}
                      title="Open Visualizer"
                      className="inline-flex h-6 items-center gap-0.5 rounded-md border border-emerald-200 bg-emerald-50 px-1.5 text-[10px] font-semibold text-emerald-700 opacity-0 transition group-hover:opacity-100"
                    >
                      <Play size={10} strokeWidth={2.5} />
                    </Link>
                  ) : null}
                  {item.guideHref ? (
                    <Link
                      href={item.guideHref}
                      onClick={onClose}
                      title="Read Guide"
                      className="inline-flex h-6 items-center gap-0.5 rounded-md border border-sky-200 bg-sky-50 px-1.5 text-[10px] font-semibold text-sky-700 opacity-0 transition group-hover:opacity-100"
                    >
                      <BookOpen size={10} strokeWidth={2.5} />
                    </Link>
                  ) : null}
                  {item.platform ? (
                    <a
                      href={item.platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Solve on ${item.platform.platform === "leetcode" ? "LeetCode" : "GeeksforGeeks"}`}
                      className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 bg-slate-50 opacity-0 transition group-hover:opacity-100"
                    >
                      {item.platform.platform === "leetcode" ? (
                        <LeetCodeIcon size={11} />
                      ) : (
                        <GFGIcon size={11} />
                      )}
                    </a>
                  ) : null}
                  {!item.href ? (
                    <span className="rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-400">
                      Soon
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
              <p className="text-xs font-semibold text-slate-500">No matching problems</p>
            </div>
          )}
        </div>

        {/* Prev / Next footer */}
        <div className="flex items-center justify-between border-t border-slate-200 px-3 py-2.5">
          {prevProblem?.href ? (
            <Link
              href={prevProblem.href}
              onClick={onClose}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <ChevronLeft size={12} strokeWidth={2.5} />
              Prev
            </Link>
          ) : (
            <span />
          )}

          <span className="text-[10px] font-bold tabular-nums text-slate-400">
            {currentIndex >= 0 ? `${currentIndex + 1} / ${problems.length}` : ""}
          </span>

          {nextProblem?.href ? (
            <Link
              href={nextProblem.href}
              onClick={onClose}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Next
              <ChevronRight size={12} strokeWidth={2.5} />
            </Link>
          ) : (
            <span />
          )}
        </div>
      </aside>
    </div>,
    document.body,
  );
}

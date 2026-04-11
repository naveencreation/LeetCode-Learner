"use client";

import { useMemo, useRef, useState } from "react";
import { ZIGZAG_CODE_LINES, ZIGZAG_LINE_LABELS } from "../constants";

interface CodePanelProps {
  currentCodeLine: number;
  executionLineNumbers: number[];
}

const PYTHON_KEYWORDS = new Set([
  "class", "def", "if", "is", "None", "return", "for", "in", "pass", "print",
  "and", "or", "not", "True", "False", "while", "else", "elif",
]);

function renderTokenizedCode(line: string): Array<{ text: string; className: string }> {
  if (!line) {
    return [{ text: " ", className: "text-transparent" }];
  }
  const trimmed = line.trim();
  if (!trimmed) {
    return [{ text: " ", className: "text-transparent" }];
  }

  const commentIndex = line.indexOf("#");
  const codePart = commentIndex >= 0 ? line.slice(0, commentIndex) : line;
  const commentPart = commentIndex >= 0 ? line.slice(commentIndex) : "";

  const tokens: Array<{ text: string; className: string }> = [];
  const regex = /("[^"]*"|'[^']*'|\b\d+\b|\b[A-Za-z_][A-Za-z0-9_]*\b|\s+|[^\w\s])/g;

  for (const chunk of codePart.matchAll(regex)) {
    const value = chunk[0];
    if (/^\s+$/.test(value)) {
      tokens.push({ text: value, className: "text-inherit" });
      continue;
    }
    if (/^"[^"]*"$|^'[^']*'$/.test(value)) {
      tokens.push({ text: value, className: "text-[#ce9178]" });
      continue;
    }
    if (/^\d+$/.test(value)) {
      tokens.push({ text: value, className: "text-[#b5cea8]" });
      continue;
    }
    if (PYTHON_KEYWORDS.has(value)) {
      tokens.push({ text: value, className: "text-[#569cd6]" });
    } else {
      tokens.push({ text: value, className: "text-[#d4d4d4]" });
    }
  }

  if (commentPart) {
    tokens.push({ text: commentPart, className: "text-[#6a9955]" });
  }

  return tokens;
}

export function CodePanel({ currentCodeLine, executionLineNumbers }: CodePanelProps) {
  const [viewMode, setViewMode] = useState<"snippet" | "full">("snippet");
  const preRef = useRef<HTMLPreElement>(null);
  const contextRadius = viewMode === "snippet" ? 6 : 100;

  const visibleLines = useMemo(() => {
    const target = currentCodeLine;
    if (target <= 0) {
      return ZIGZAG_CODE_LINES.map((line, index) => ({ line, index }));
    }
    const minLine = Math.max(0, target - contextRadius);
    const maxLine = Math.min(ZIGZAG_CODE_LINES.length - 1, target + contextRadius);
    const result: Array<{ line: string; index: number }> = [];
    if (minLine > 0) result.push({ line: "...", index: -1 });
    for (let i = minLine; i <= maxLine; i++) {
      result.push({ line: ZIGZAG_CODE_LINES[i], index: i });
    }
    if (maxLine < ZIGZAG_CODE_LINES.length - 1) result.push({ line: "...", index: -2 });
    return result;
  }, [currentCodeLine, contextRadius]);

  const statusLine = currentCodeLine > 0 ? currentCodeLine : "—";
  const statusLabel = currentCodeLine > 0 ? (ZIGZAG_LINE_LABELS[currentCodeLine] ?? "Code") : "Not started";

  return (
    <section className="flex h-full flex-col gap-1.5 overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-bold text-slate-800">Code (Python)</h3>
        <div className="flex gap-1">
          <button onClick={() => setViewMode("snippet")} className={`rounded-md px-2 py-1 text-[11px] font-semibold transition ${viewMode === "snippet" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>Snippet</button>
          <button onClick={() => setViewMode("full")} className={`rounded-md px-2 py-1 text-[11px] font-semibold transition ${viewMode === "full" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>Full Code</button>
        </div>
      </div>
      <div className="min-h-0 overflow-hidden rounded-[10px] border border-[#3c3c3c] bg-[#1e1e1e] p-2">
        <pre ref={preRef} className="ui-scrollbar h-full min-h-0 overflow-auto p-0 text-[12px] leading-[1.68] text-[#d4d4d4]">
          <code>
            {visibleLines.map(({ line, index }, rowIndex) => {
              if (index < 0) {
                return (
                  <div key={`ellipsis-${rowIndex}`} className="grid grid-cols-[1.6rem_1fr] items-start gap-2 rounded-md px-1.5 py-1 text-[#6e7681]">
                    <span className="select-none text-right font-bold">...</span>
                    <span className="whitespace-pre font-[var(--font-geist-mono)] font-medium tracking-[0.01em]">...</span>
                  </div>
                );
              }
              const isActive = currentCodeLine === index;
              return (
                <div key={`${index}-${line}`} className={`group grid grid-cols-[1.6rem_1fr] items-start gap-2 rounded-md px-1.5 py-1 transition-all ${isActive ? "relative border border-[#264f78] bg-[#2a2d2e] text-[#ffffff]" : "border border-transparent text-[#d4d4d4]"}`}>
                  {isActive ? <span aria-hidden="true" className="absolute left-0 top-0 h-full w-[2px] rounded-l-md bg-[#264f78]" /> : null}
                  <span className={`select-none text-right font-bold ${isActive ? "text-[#c6c6c6]" : "text-[#858585] group-hover:text-[#a5a5a5]"}`}>{isActive ? "●" : index + 1}</span>
                  <span className="whitespace-pre font-[var(--font-geist-mono)] font-medium tracking-[0.01em]">
                    {renderTokenizedCode(line).map((token, tokenIndex) => (
                      <span key={`${index}-${token.text}-${tokenIndex}`} className={token.className}>{token.text}</span>
                    ))}
                  </span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>
      <div className="rounded-lg border border-slate-200 bg-slate-100 px-2 py-1.5 text-[11px] font-bold text-slate-700">
        Current Line ({statusLine}): {statusLabel}
      </div>
    </section>
  );
}

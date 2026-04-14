import { useMemo, useRef, useState } from "react";
import { CopyCodeButton } from "@/features/shared/components/CopyCodeButton";

import { BSTDLL_CODE_LINES, BSTDLL_LINE_LABELS } from "../constants";

interface CodePanelProps {
  currentCodeLine: number;
  executionLineNumbers: number[];
}

const PYTHON_KEYWORDS = new Set([
  "class",
  "def",
  "if",
  "is",
  "None",
  "return",
  "for",
  "in",
  "pass",
  "print",
]);

function renderTokenizedCode(line: string): Array<{ text: string; className: string }> {
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

    if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) {
      if (PYTHON_KEYWORDS.has(value)) {
        tokens.push({ text: value, className: "text-[#569cd6]" });
      } else if (value === "self") {
        tokens.push({ text: value, className: "text-[#9cdcfe]" });
      } else if (/^[A-Z]/.test(value)) {
        tokens.push({ text: value, className: "text-[#4ec9b0]" });
      } else {
        tokens.push({ text: value, className: "text-[#d4d4d4]" });
      }
      continue;
    }

    tokens.push({ text: value, className: "text-[#d4d4d4]" });
  }

  if (commentPart) {
    tokens.push({ text: commentPart, className: "text-[#6a9955]" });
  }

  return tokens;
}

export function CodePanel({ currentCodeLine, executionLineNumbers }: CodePanelProps) {
  const [viewMode, setViewMode] = useState<"snippet" | "full">("snippet");
  const preRef = useRef<HTMLPreElement | null>(null);

  const statusLine = currentCodeLine + 1;
  const statusLabel = BSTDLL_LINE_LABELS[currentCodeLine] ?? "Context Line";

  const snippetLineIndices = useMemo(() => {
    const contextRadius = 1;
    const lineSet = new Set<number>([currentCodeLine]);

    executionLineNumbers.forEach((lineNumber) => {
      for (let offset = -contextRadius; offset <= contextRadius; offset += 1) {
        const index = lineNumber + offset;
        if (index >= 0 && index < BSTDLL_CODE_LINES.length) {
          lineSet.add(index);
        }
      }
    });

    return Array.from(lineSet).sort((a, b) => a - b);
  }, [currentCodeLine, executionLineNumbers]);

  const visibleLines = useMemo(() => {
    if (viewMode === "full") {
      return BSTDLL_CODE_LINES.map((line, index) => ({ line, index }));
    }

    const rows: Array<{ line: string; index: number }> = [];

    if (snippetLineIndices.length === 0) {
      return BSTDLL_CODE_LINES.map((line, index) => ({ line, index }));
    }

    let previousIndex = -1;
    snippetLineIndices.forEach((index) => {
      if (previousIndex >= 0 && index - previousIndex > 1) {
        rows.push({ line: "...", index: -1000 - index });
      }

      rows.push({ line: BSTDLL_CODE_LINES[index], index });
      previousIndex = index;
    });

    return rows;
  }, [viewMode, snippetLineIndices]);

  const handleViewModeChange = (mode: "snippet" | "full") => {
    const panel = preRef.current;
    const previousScroll = panel?.scrollTop ?? 0;

    setViewMode(mode);

    requestAnimationFrame(() => {
      if (!preRef.current) {
        return;
      }

      if (mode === "full") {
        preRef.current.scrollTop = previousScroll;
      } else {
        preRef.current.scrollTop = 0;
      }
    });
  };

  return (
    <section className="traversal-panel grid h-full min-h-0 grid-rows-[auto_1fr_auto] gap-2 p-2.5">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">
          Python Code
        </h2>
        <div className="flex items-center gap-1.5">
          <div className="inline-flex items-center rounded-full border border-slate-300 bg-slate-100 p-0.5">
          <button
            type="button"
            onClick={() => handleViewModeChange("snippet")}
            className={`rounded-full px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.04em] transition ${
              viewMode === "snippet"
                ? "bg-slate-800 text-white"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            Snippet
          </button>
          <button
            type="button"
            onClick={() => handleViewModeChange("full")}
            className={`rounded-full px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.04em] transition ${
              viewMode === "full"
                ? "bg-slate-800 text-white"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            Full Code
          </button>
        </div>
          <CopyCodeButton codeLines={BSTDLL_CODE_LINES} />
        </div>
      </div>

      <div className="min-h-0 overflow-hidden rounded-[10px] border border-[#3c3c3c] bg-[#1e1e1e] p-2">
        <pre
          ref={preRef}
          className="ui-scrollbar h-full min-h-0 overflow-auto p-0 text-[12px] leading-[1.68] text-[#d4d4d4]"
        >
          <code>
            {visibleLines.map(({ line, index }, rowIndex) => {
              if (index < 0) {
                return (
                  <div
                    key={`ellipsis-${rowIndex}`}
                    className="grid grid-cols-[1.6rem_1fr] items-start gap-2 rounded-md px-1.5 py-1 text-[#6e7681]"
                  >
                    <span className="select-none text-right font-bold">...</span>
                    <span className="whitespace-pre font-[var(--font-geist-mono)] font-medium tracking-[0.01em]">
                      ...
                    </span>
                  </div>
                );
              }

              const isActive = currentCodeLine === index;

              return (
                <div
                  key={`${index}-${line}`}
                  className={`group grid grid-cols-[1.6rem_1fr] items-start gap-2 rounded-md px-1.5 py-1 transition-all ${
                    isActive
                      ? "relative border border-[#264f78] bg-[#2a2d2e] text-[#ffffff]"
                      : "border border-transparent text-[#d4d4d4]"
                  }`}
                >
                  {isActive ? (
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-0 h-full w-[2px] rounded-l-md bg-[#264f78]"
                    />
                  ) : null}
                  <span
                    className={`select-none text-right font-bold ${
                      isActive ? "text-[#c6c6c6]" : "text-[#858585] group-hover:text-[#a5a5a5]"
                    }`}
                  >
                    {isActive ? "●" : index + 1}
                  </span>
                  <span className="whitespace-pre font-[var(--font-geist-mono)] font-medium tracking-[0.01em]">
                    {renderTokenizedCode(line).map((token, tokenIndex) => (
                      <span key={`${index}-${token.text}-${tokenIndex}`} className={token.className}>
                        {token.text}
                      </span>
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


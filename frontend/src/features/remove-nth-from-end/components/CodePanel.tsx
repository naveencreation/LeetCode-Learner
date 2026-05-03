import { useMemo, useRef, useState } from "react";
import { CopyCodeButton } from "@/features/shared/components/CopyCodeButton";
import { SegmentedToggle } from "@/features/shared/components/SegmentedToggle";
import { PYTHON_CODE_LINES, LINE_LABELS } from "../constants";

interface CodePanelProps {
  currentCodeLine: number;
  executionLineNumbers: number[];
}

const PYTHON_KEYWORDS = new Set([
  "class", "def", "if", "is", "None", "return", "for", "in", "pass", "print",
]);

function renderTokenizedCode(line: string | undefined | null): Array<{ text: string; className: string }> {
  if (line == null) {
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

const VIEW_OPTIONS = [
  { value: "snippet" as const, label: "Snippet" },
  { value: "full" as const, label: "Full Code" },
] as const;

type ViewMode = (typeof VIEW_OPTIONS)[number]["value"];

export function CodePanel({ currentCodeLine, executionLineNumbers }: CodePanelProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("snippet");
  const preRef = useRef<HTMLPreElement | null>(null);

  const lines = PYTHON_CODE_LINES;
  const effectiveLine = currentCodeLine >= 1 ? currentCodeLine : 1;
  const statusLabel = LINE_LABELS[effectiveLine] ?? "Context Line";

  const snippetLineNumbers = useMemo(() => {
    const contextRadius = 1;
    const lineSet = new Set<number>([effectiveLine]);

    executionLineNumbers.forEach((lineNumber) => {
      if (lineNumber < 1 || lineNumber > lines.length) return;
      for (let offset = -contextRadius; offset <= contextRadius; offset += 1) {
        const candidate = lineNumber + offset;
        if (candidate >= 1 && candidate <= lines.length) {
          lineSet.add(candidate);
        }
      }
    });

    return Array.from(lineSet).sort((a, b) => a - b);
  }, [effectiveLine, executionLineNumbers, lines.length]);

  const visibleLines = useMemo(() => {
    if (viewMode === "full") {
      return lines.map((line, i) => ({ line, num: i + 1 }));
    }
    if (snippetLineNumbers.length === 0) {
      return lines.map((line, i) => ({ line, num: i + 1 }));
    }

    const rows: Array<{ line: string; num: number }> = [];
    let previousLine = -1;

    snippetLineNumbers.forEach((lineNumber) => {
      if (previousLine >= 0 && lineNumber - previousLine > 1) {
        rows.push({ line: "...", num: -1000 - lineNumber });
      }
      rows.push({ line: lines[lineNumber - 1], num: lineNumber });
      previousLine = lineNumber;
    });

    return rows;
  }, [viewMode, snippetLineNumbers, lines]);

  const handleViewModeChange = (mode: ViewMode) => {
    const panel = preRef.current;
    const previousScroll = panel?.scrollTop ?? 0;
    setViewMode(mode);
    requestAnimationFrame(() => {
      if (!preRef.current) return;
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
        <h2 className="traversal-panel-title">Remove Nth From End (Python)</h2>
        <div className="flex items-center gap-1.5">
          <SegmentedToggle
            options={VIEW_OPTIONS}
            value={viewMode}
            onChange={handleViewModeChange}
          />
          <CopyCodeButton codeLines={lines} />
        </div>
      </div>

      <div className="min-h-0 overflow-hidden rounded-[10px] border border-[#3c3c3c] bg-[#1e1e1e] p-2">
        <pre
          ref={preRef}
          className="ui-scrollbar h-full min-h-0 overflow-auto p-0 text-[12px] leading-[1.68] text-[#d4d4d4]"
        >
          <code>
            {visibleLines.map(({ line, num }, rowIndex) => {
              if (num < 0) {
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

              const isActive = num === effectiveLine;

              return (
                <div
                  key={`${num}-${line}`}
                  className={`group grid grid-cols-[1.6rem_1fr] items-start gap-2 rounded-md px-1.5 py-1 transition-all duration-200 ${
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
                    {isActive ? "●" : num}
                  </span>
                  <span className="whitespace-pre font-[var(--font-geist-mono)] font-medium tracking-[0.01em]">
                    {renderTokenizedCode(line).map((token, tokenIndex) => (
                      <span key={`${num}-${token.text}-${tokenIndex}`} className={token.className}>
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
        Current Line ({effectiveLine}): {statusLabel}
      </div>
    </section>
  );
}

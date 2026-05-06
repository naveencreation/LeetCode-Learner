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
  "not", "or", "and", "while", "else", "break", "range",
]);

function renderTokenizedCode(line: string): Array<{ text: string; className: string }> {
  const trimmed = line.trim();
  if (!trimmed) return [{ text: " ", className: "text-transparent" }];

  const commentIndex = line.indexOf("#");
  const codePart = commentIndex >= 0 ? line.slice(0, commentIndex) : line;
  const commentPart = commentIndex >= 0 ? line.slice(commentIndex) : "";

  const tokens: Array<{ text: string; className: string }> = [];
  const regex = /("[^"]*"|'[^']*'|\b\d+\b|\b[A-Za-z_][A-Za-z0-9_]*\b|\s+|[^\w\s])/g;

  for (const chunk of codePart.matchAll(regex)) {
    const value = chunk[0];
    if (/^\s+$/.test(value)) { tokens.push({ text: value, className: "text-inherit" }); continue; }
    if (/^"[^"]*"$|^'[^']*'$/.test(value)) { tokens.push({ text: value, className: "text-[#ce9178]" }); continue; }
    if (/^\d+$/.test(value)) { tokens.push({ text: value, className: "text-[#b5cea8]" }); continue; }
    if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) {
      if (PYTHON_KEYWORDS.has(value)) tokens.push({ text: value, className: "text-[#569cd6]" });
      else if (value === "self") tokens.push({ text: value, className: "text-[#9cdcfe]" });
      else if (/^[A-Z]/.test(value)) tokens.push({ text: value, className: "text-[#4ec9b0]" });
      else tokens.push({ text: value, className: "text-[#d4d4d4]" });
      continue;
    }
    tokens.push({ text: value, className: "text-[#d4d4d4]" });
  }

  if (commentPart) tokens.push({ text: commentPart, className: "text-[#6a9955]" });
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

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_1fr_auto] gap-2 p-2.5">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">Code</h2>
        <SegmentedToggle options={VIEW_OPTIONS} value={viewMode} onChange={setViewMode} />
      </div>
      <div className="h-full min-h-0 overflow-auto rounded-[10px] border border-slate-200 bg-slate-900 p-3">
        <pre ref={preRef} className="font-[var(--font-jetbrains)] text-[11px] leading-[1.6]">
          {lines.map((line, idx) => {
            const lineNum = idx + 1;
            const isCurrentLine = currentCodeLine === lineNum;
            const isExecutionLine = executionLineNumbers.includes(lineNum);
            return (
              <div key={idx} className={`flex gap-2 ${isCurrentLine ? "bg-slate-800" : ""} ${isExecutionLine && !isCurrentLine ? "bg-slate-800/40" : ""}`}>
                <span className="select-none text-slate-600 w-6 text-right">{lineNum}</span>
                <span>
                  {renderTokenizedCode(line).map((token, tIdx) => (
                    <span key={tIdx} className={token.className}>{token.text}</span>
                  ))}
                </span>
              </div>
            );
          })}
        </pre>
      </div>
      <div className="flex items-center justify-between rounded-[10px] border border-slate-200 bg-white px-3 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{LINE_LABELS[currentCodeLine] || ""}</span>
        <CopyCodeButton codeLines={lines} />
      </div>
    </section>
  );
}

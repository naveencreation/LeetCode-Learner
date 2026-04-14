import { useMemo, useRef, useState } from "react";
import { CopyCodeButton } from "@/features/shared/components/CopyCodeButton";
import { SegmentedToggle } from "@/features/shared/components/SegmentedToggle";
import { PYTHON_CODE, PYTHON_CODE_LINES, OPERATION_TO_LINE_MAP } from "../constants";

interface CodePanelProps {
  currentCodeLine: number;
  executionLineNumbers: number[];
}

const PYTHON_KEYWORDS = new Set([
  "class", "def", "if", "is", "None", "return", "for", "in", "pass", "while",
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
    if (/^\s+$/.test(value)) {
      tokens.push({ text: value, className: "text-inherit" });
    } else if (/^"[^"]*"$|^'[^']*'$/.test(value)) {
      tokens.push({ text: value, className: "text-[#ce9178]" });
    } else if (/^\d+$/.test(value)) {
      tokens.push({ text: value, className: "text-[#b5cea8]" });
    } else if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) {
      if (PYTHON_KEYWORDS.has(value)) {
        tokens.push({ text: value, className: "text-[#569cd6]" });
      } else if (value === "self") {
        tokens.push({ text: value, className: "text-[#9cdcfe]" });
      } else {
        tokens.push({ text: value, className: "text-[#dcdcaa]" });
      }
    } else {
      tokens.push({ text: value, className: "text-[#d4d4d4]" });
    }
  }

  if (commentPart) {
    tokens.push({ text: commentPart, className: "text-[#6a9955] italic" });
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
  const activeLineRef = useRef<HTMLDivElement>(null);

  const lines = PYTHON_CODE_LINES;
  const fullCode = PYTHON_CODE;

  const visibleLines = useMemo(() => {
    if (viewMode === "full") return lines.map((line, i) => ({ line, num: i + 1 }));
    const execSet = new Set(executionLineNumbers);
    return lines
      .map((line, i) => ({ line, num: i + 1 }))
      .filter((item) => execSet.has(item.num) || item.line.trim() !== "");
  }, [viewMode, executionLineNumbers, lines]);

  return (
    <div className="traversal-panel flex h-full flex-col overflow-hidden">
      <div className="traversal-panel-header px-3 py-2">
        <h2 className="traversal-panel-title">Python Code</h2>
        <div className="flex items-center gap-2">
          <SegmentedToggle
            options={VIEW_OPTIONS}
            value={viewMode}
            onChange={setViewMode}
          />
          <CopyCodeButton codeLines={lines} />
        </div>
      </div>

      <div className="ui-scrollbar min-h-0 flex-1 overflow-y-auto bg-[#1e1e1e] p-2">
        <div className="font-mono text-[12.5px] leading-[1.7]">
          {visibleLines.map((item) => {
            const isActive = item.num === currentCodeLine;
            const tokens = renderTokenizedCode(item.line);

            return (
              <div
                key={item.num}
                ref={isActive ? activeLineRef : undefined}
                className={`flex rounded-[4px] px-1 transition-colors duration-200 ${
                  isActive
                    ? "bg-[#264f78]/60 ring-1 ring-[#264f78]"
                    : "hover:bg-white/[0.03]"
                }`}
              >
                <span className="mr-3 inline-block w-6 shrink-0 select-none text-right text-[11px] tabular-nums text-[#858585]">
                  {item.num}
                </span>
                <span className="text-[#d4d4d4]">
                  {tokens.map((token, ti) => (
                    <span key={ti} className={token.className}>
                      {token.text}
                    </span>
                  ))}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

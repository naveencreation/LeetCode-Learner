import { useEffect, useMemo, useRef } from "react";

import { ZIGZAG_CODE_LINES } from "../constants";

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
  "not",
  "while",
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
        tokens.push({ text: value, className: "text-[#9cdcfe]" });
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const executableLines = useMemo(
    () => new Set(executionLineNumbers),
    [executionLineNumbers],
  );

  const currentLineRef = useRef<HTMLDivElement | null>(null);
  const statusLine = currentCodeLine + 1;

  // Auto-scroll to current line when it changes
  useEffect(() => {
    if (currentLineRef.current && scrollContainerRef.current) {
      currentLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [currentCodeLine]);

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_minmax(0,1fr)] gap-1.5 p-2">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">Algorithm Code</h2>
      </div>

      <div
        ref={scrollContainerRef}
        className="ui-scrollbar min-h-0 overflow-auto rounded-[6px] bg-[#1e1e1e] font-mono text-[11px] text-[#d4d4d4]"
      >
        <div className="p-2">
          {ZIGZAG_CODE_LINES.map((line, idx) => {
            const isCurrentLine = idx === currentCodeLine;
            const isExecutableLine = executableLines.has(idx);

            return (
              <div
                key={idx}
                ref={isCurrentLine ? currentLineRef : null}
                className={`group relative pl-2 transition-all ${
                  isCurrentLine
                    ? "bg-[#264f78] font-bold text-white"
                    : isExecutableLine
                      ? "bg-[#3e3e3e] hover:bg-[#454545]"
                      : "hover:bg-[#2d2d2d]"
                }`}
              >
                <span className="inline-block w-8 text-right pr-2 text-[#858585] text-[10px]">
                  {idx + 1}
                </span>
                <span className="whitespace-pre">
                  {renderTokenizedCode(line).map((token, tokenIdx) => (
                    <span key={tokenIdx} className={token.className}>
                      {token.text}
                    </span>
                  ))}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-100 px-2 py-1.5 text-[11px] font-bold text-slate-700">
        Current Line: {statusLine}
      </div>
    </section>
  );
}

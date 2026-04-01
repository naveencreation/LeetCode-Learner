import { INORDER_CODE_LINES, INORDER_LINE_LABELS } from "../constants";

interface CodePanelProps {
  currentCodeLine: number;
}

export function CodePanel({ currentCodeLine }: CodePanelProps) {
  const statusLine = currentCodeLine + 1;
  const statusLabel = INORDER_LINE_LABELS[currentCodeLine] ?? "Context Line";

  return (
    <section className="grid h-full min-h-0 grid-rows-[auto_1fr_auto] gap-2 rounded-xl border border-slate-200 bg-white p-2.5 shadow-[0_2px_10px_rgba(17,24,39,0.06)]">
      <div className="mb-0.5 flex items-center justify-between">
        <h2 className="text-[13px] font-extrabold uppercase tracking-[0.01em] text-slate-700">
          Python Code
        </h2>
        <span className="rounded-full bg-gradient-to-r from-[#0b4f89] to-blue-600 px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.04em] text-white">
          Execution
        </span>
      </div>

      <div className="overflow-hidden rounded-[10px] border border-[#243244] bg-gradient-to-br from-slate-900 to-[#111827] p-2">
        <pre className="overflow-auto p-0 text-[11px] leading-[1.55] text-slate-200">
          <code>
            {INORDER_CODE_LINES.map((line, index) => (
              <div
                key={`${index}-${line}`}
                className={`grid grid-cols-[1.25rem_1fr] items-start gap-2 rounded-md px-1.5 py-1 transition-colors ${
                  currentCodeLine === index
                    ? "border-l-2 border-teal-300 bg-gradient-to-r from-teal-500/25 to-transparent text-cyan-50"
                    : "text-slate-300"
                }`}
              >
                <span
                  className={`select-none text-right font-bold ${
                    currentCodeLine === index ? "text-teal-200" : "text-slate-500"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="whitespace-pre font-[var(--font-geist-mono)]">{line || " "}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-100 px-2 py-1.5 text-[11px] font-bold text-slate-700">
        Current Line ({statusLine}): {statusLabel}
      </div>
    </section>
  );
}

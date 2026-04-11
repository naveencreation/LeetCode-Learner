interface ResultPanelProps {
  currentNode: number | null;
  currentPhase: string;
  result: number[];
  nestedResult: number[][];
  currentStep: number;
  totalSteps: number;
  currentOperation: string;
}

export function ResultPanel({
  currentNode,
  currentPhase,
  result,
  nestedResult,
  currentStep,
  totalSteps,
  currentOperation,
}: ResultPanelProps) {
  const levelTintClasses = [
    "border-blue-200 bg-blue-50 text-blue-900",
    "border-amber-200 bg-amber-50 text-amber-900",
    "border-emerald-200 bg-emerald-50 text-emerald-900",
  ] as const;

  const nestedResultText =
    nestedResult.length > 0
      ? `[${nestedResult.map((level) => `[${level.join(", ")}]`).join(", ")}]`
      : "[]";

  const completionMessage =
    currentStep >= totalSteps
      ? `Perfect! Zigzag traversal complete. Result: ${nestedResultText}`
      : `Step ${currentStep + 1}: ${currentOperation}`;

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_minmax(0,1fr)] gap-1.5 p-2">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">Traversal Progress</h2>
      </div>

      <div className="ui-scrollbar min-h-0 overflow-y-auto pr-1">
        <div className="grid content-start gap-1.5">
          <div className="grid grid-cols-2 gap-1.5">
            <div className="rounded-lg border bg-gradient-to-br from-teal-700 to-teal-500 p-1.5 text-center text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.03em] text-teal-100">
                Current Node
              </p>
              <p className="mt-0.5 text-xl font-extrabold">{currentNode ?? "-"}</p>
            </div>
            <div className="rounded-lg border bg-gradient-to-br from-teal-700 to-teal-500 p-1.5 text-center text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.03em] text-teal-100">
                Phase
              </p>
              <p className="mt-0.5 truncate text-xl font-extrabold">{currentPhase}</p>
            </div>
          </div>

          <div className="grid gap-1 rounded-lg">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.03em] text-slate-700">
              Zigzag Level Output
            </p>
            <div className="grid min-h-[36px] gap-1.5 rounded-lg border border-slate-200 bg-white p-1.5">
              {nestedResult.length === 0 ? (
                <span className="text-[11px] text-slate-400">
                  Traversal result appears here...
                </span>
              ) : (
                nestedResult.map((level, levelIndex) => (
                  <div
                    key={`level-${levelIndex}`}
                    className={`flex items-center justify-between gap-2 rounded-md border px-2 py-1 ${
                      levelTintClasses[levelIndex % levelTintClasses.length]
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex min-w-8 items-center justify-center rounded-md bg-white/70 px-1.5 py-0.5 text-[10px] font-bold">
                        L{levelIndex}
                      </span>
                      <span className="text-xs font-bold">
                        [{level.join(", ")}]
                      </span>
                    </div>
                    <span className="rounded-full bg-white/80 px-1.5 py-0.5 text-[10px] font-bold">
                      {levelIndex % 2 === 0 ? "L->R" : "R->L"}
                    </span>
                  </div>
                ))
              )}
            </div>
            <div className="rounded-lg border border-teal-100 bg-teal-50 px-2 py-1.5 text-[11px] font-bold text-teal-800">
              {nestedResultText}
            </div>
          </div>

          <div className="grid gap-1 rounded-lg">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.03em] text-slate-700">
              Visit Sequence
            </p>
            <div className="flex min-h-[34px] flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-white p-1.5">
              {result.length === 0 ? (
                <span className="text-[11px] text-slate-400">Node visit chips appear here...</span>
              ) : (
                result.map((value, index) => (
                  <span
                    key={`${value}-${index}`}
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-teal-700 to-teal-400 px-2.5 py-1 text-xs font-extrabold text-white"
                  >
                    {value}
                  </span>
                ))
              )}
            </div>
          </div>

          <div
            className={`rounded-lg border px-2 py-1.5 text-[11px] leading-snug ${
              currentStep >= totalSteps
                ? "border-emerald-200 bg-emerald-50 font-bold text-emerald-900"
                : "border-amber-200 bg-amber-50 text-amber-900"
            }`}
          >
            {currentStep >= totalSteps ? "✅ " : "👉 "}
            <span className="font-bold">{completionMessage}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

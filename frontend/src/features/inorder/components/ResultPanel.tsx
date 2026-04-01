interface ResultPanelProps {
  currentNode: number | null;
  currentPhase: string;
  result: number[];
  currentStep: number;
  totalSteps: number;
  currentOperation: string;
}

export function ResultPanel({
  currentNode,
  currentPhase,
  result,
  currentStep,
  totalSteps,
  currentOperation,
}: ResultPanelProps) {
  const completionMessage =
    currentStep >= totalSteps
      ? `Perfect! Traversal complete. Result: [${result.join(", ")}]`
      : `Step ${currentStep + 1}: ${currentOperation}`;

  return (
    <section className="grid h-full min-h-0 overflow-hidden grid-rows-[auto_auto_auto_auto] content-start gap-1.5 rounded-xl border border-slate-200 bg-white p-2 shadow-[0_2px_10px_rgba(17,24,39,0.06)]">
      <div className="mb-0.5 flex items-center justify-between">
        <h2 className="text-[13px] font-extrabold uppercase tracking-[0.01em] text-slate-700">
          Traversal Progress
        </h2>
      </div>

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
          Result Array
        </p>
        <div className="flex min-h-[36px] flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-1.5">
          {result.length === 0 ? (
            <span className="text-[11px] text-slate-400">
              Traversal result appears here...
            </span>
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
    </section>
  );
}

interface ResultPanelProps {
  currentNode: number | null;
  currentPhase: string;
  result: number[];
  found: boolean;
  targetValue: number;
  currentStep: number;
  totalSteps: number;
  currentOperation: string;
}

export function ResultPanel({
  currentNode,
  currentPhase,
  result,
  found,
  targetValue,
  currentStep,
  totalSteps,
  currentOperation,
}: ResultPanelProps) {
  const completionMessage =
    currentStep >= totalSteps
      ? found
        ? `Path found for target ${targetValue}: [${result.join(", ")}]`
        : `Target ${targetValue} not found in this tree.`
      : `Step ${currentStep + 1}: ${currentOperation}`;

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_auto_auto_auto] content-start gap-1.5 p-2">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">
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
          Current Path
        </p>
        <div className="flex min-h-[36px] flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-1.5">
          {result.length === 0 ? (
            <span className="text-[11px] text-slate-400">
              Path evolves here while DFS explores...
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
          currentStep >= totalSteps && found
            ? "border-emerald-200 bg-emerald-50 font-bold text-emerald-900"
            : currentStep >= totalSteps && !found
              ? "border-rose-200 bg-rose-50 font-bold text-rose-900"
            : "border-amber-200 bg-amber-50 text-amber-900"
        }`}
      >
        {currentStep >= totalSteps ? (found ? "✅ " : "❌ ") : "👉 "}
        <span className="font-bold">{completionMessage}</span>
      </div>
    </section>
  );
}

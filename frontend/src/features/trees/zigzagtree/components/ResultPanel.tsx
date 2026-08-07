interface ResultPanelProps {
  currentNode: number | null;
  currentPhase: string;
  result: number[][] | null;
  currentStep: number;
  totalSteps: number;
  currentOperation: string;
  currentLevel?: number;
  leftToRight?: boolean;
}

export function ResultPanel({
  currentNode,
  currentPhase,
  result,
  currentStep,
  totalSteps,
  currentOperation,
  currentLevel,
  leftToRight,
}: ResultPanelProps) {
  const completionMessage =
    currentStep >= totalSteps
      ? `Complete! Zigzag result: ${JSON.stringify(result)}`
      : `Step ${currentStep}: ${currentOperation}`;

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_minmax(0,1fr)] gap-1.5 p-2">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">Traversal Progress</h2>
      </div>
      <div className="ui-scrollbar min-h-0 overflow-y-auto pr-1">
        <div className="grid content-start gap-1.5">
          <div className="grid grid-cols-2 gap-1.5">
            <div className="rounded-lg border bg-gradient-to-br from-teal-700 to-teal-500 p-1.5 text-center text-white transition-all duration-200">
              <p className="text-[10px] font-bold uppercase tracking-[0.03em] text-teal-100">Current Node</p>
              <p className="mt-0.5 text-xl font-extrabold">{currentNode ?? "-"}</p>
            </div>
            <div className="rounded-lg border bg-gradient-to-br from-teal-700 to-teal-500 p-1.5 text-center text-white transition-all duration-200">
              <p className="text-[10px] font-bold uppercase tracking-[0.03em] text-teal-100">Phase</p>
              <p className="mt-0.5 truncate text-xl font-extrabold">{currentPhase}</p>
            </div>
          </div>

          {currentLevel !== undefined && (
            <div className="grid grid-cols-2 gap-1.5">
              <div className="rounded-lg border bg-slate-50 p-1.5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.03em] text-slate-500">Level</p>
                <p className="mt-0.5 text-lg font-extrabold text-slate-700">{currentLevel}</p>
              </div>
              <div className={`rounded-lg border p-1.5 text-center ${leftToRight ? "bg-blue-50" : "bg-purple-50"}`}>
                <p className="text-[10px] font-bold uppercase tracking-[0.03em] text-slate-500">Direction</p>
                <p className={`mt-0.5 text-lg font-extrabold ${leftToRight ? "text-blue-700" : "text-purple-700"}`}>
                  {leftToRight ? "L→R" : "R→L"}
                </p>
              </div>
            </div>
          )}

          {result && result.length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.03em] text-slate-500 mb-1">Result</p>
              <div className="flex flex-wrap gap-1">
                {result.map((level, idx) => (
                  <span
                    key={idx}
                    className="animate-badge-pop inline-flex items-center justify-center rounded-full bg-gradient-to-r from-teal-700 to-teal-400 px-2.5 py-1 text-xs font-extrabold text-white"
                  >
                    [{level.join(",")}]
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-lg border border-slate-200 bg-slate-100 p-2 text-[11px] font-bold text-slate-700">
            {completionMessage}
          </div>
        </div>
      </div>
    </section>
  );
}

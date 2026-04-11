interface ResultPanelProps {
  currentNode: number | null;
  currentPhase: string;
  result: boolean | null;
  currentStep: number;
  totalSteps: number;
  currentOperation: string;
  isBalanced?: boolean;
  leftHeight?: number;
  rightHeight?: number;
  currentHeight?: number;
}

export function ResultPanel({
  currentNode,
  currentPhase,
  result,
  currentStep,
  totalSteps,
  currentOperation,
  isBalanced,
  leftHeight,
  rightHeight,
  currentHeight,
}: ResultPanelProps) {
  const completionMessage =
    currentStep >= totalSteps
      ? `Algorithm complete. Result: ${result === true ? "BALANCED" : result === false ? "UNBALANCED" : "..."}`
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
              <p className="text-[10px] font-bold uppercase tracking-[0.03em] text-teal-100">Current Node</p>
              <p className="mt-0.5 text-xl font-extrabold">{currentNode ?? "-"}</p>
            </div>
            <div className="rounded-lg border bg-gradient-to-br from-teal-700 to-teal-500 p-1.5 text-center text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.03em] text-teal-100">Phase</p>
              <p className="mt-0.5 truncate text-xl font-extrabold">{currentPhase}</p>
            </div>
          </div>

          {isBalanced !== undefined && (
            <div className={`rounded-lg border p-2 text-center ${isBalanced ? "bg-green-100 border-green-300" : "bg-red-100 border-red-300"}`}>
              <p className="text-[11px] font-bold uppercase tracking-[0.03em] text-slate-700">Status</p>
              <p className={`mt-0.5 text-lg font-extrabold ${isBalanced ? "text-green-700" : "text-red-700"}`}>
                {isBalanced ? "BALANCED" : "UNBALANCED"}
              </p>
            </div>
          )}

          {(leftHeight !== undefined || rightHeight !== undefined) && (
            <div className="grid grid-cols-2 gap-1.5">
              <div className="rounded-lg border bg-slate-50 p-1.5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.03em] text-slate-500">Left Height</p>
                <p className="mt-0.5 text-lg font-extrabold text-slate-700">{leftHeight ?? "-"}</p>
              </div>
              <div className="rounded-lg border bg-slate-50 p-1.5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.03em] text-slate-500">Right Height</p>
                <p className="mt-0.5 text-lg font-extrabold text-slate-700">{rightHeight ?? "-"}</p>
              </div>
            </div>
          )}

          {currentHeight !== undefined && (
            <div className="rounded-lg border bg-blue-50 p-1.5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.03em] text-slate-500">Current Height</p>
              <p className="mt-0.5 text-lg font-extrabold text-blue-700">{currentHeight}</p>
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

import { CheckCircle2, ArrowRight } from "lucide-react";

interface ResultPanelProps {
  currentNode: number | null;
  currentPhase: string;
  result: number[][];
  columnKeys: number[];
  currentStep: number;
  totalSteps: number;
  currentOperation: string;
}

export function ResultPanel({
  currentNode,
  currentPhase,
  result,
  columnKeys,
  currentStep,
  totalSteps,
  currentOperation,
}: ResultPanelProps) {
  const completionMessage =
    currentStep >= totalSteps
      ? `Perfect! Traversal complete. Result: ${JSON.stringify(result)}`
      : `Step ${currentStep + 1}: ${currentOperation}`;

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_minmax(0,1fr)] gap-1.5 p-2.5">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">
          Traversal Progress
        </h2>
      </div>

      <div className="ui-scrollbar min-h-0 overflow-y-auto pr-1">
        <div className="grid content-start gap-1.5">
          <div className="grid grid-cols-2 gap-1.5">
            <div className="rounded-lg border bg-gradient-to-br from-teal-700 to-teal-500 p-1.5 text-center text-white transition-all duration-200">
              <p className="text-[10px] font-bold uppercase tracking-[0.03em] text-teal-100">
                Current Node
              </p>
              <p className="mt-0.5 text-lg font-extrabold">{currentNode ?? "-"}</p>
            </div>
            <div className="rounded-lg border bg-gradient-to-br from-teal-700 to-teal-500 p-1.5 text-center text-white transition-all duration-200">
              <p className="text-[10px] font-bold uppercase tracking-[0.03em] text-teal-100">
                Phase
              </p>
              <p className="mt-0.5 truncate text-lg font-extrabold">{currentPhase}</p>
            </div>
          </div>

          <div className="grid gap-1 rounded-lg min-h-0">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.03em] text-slate-700">
              Result Columns
            </p>
            <div className="ui-scrollbar max-h-[132px] min-h-[36px] space-y-1 overflow-y-auto rounded-lg border border-slate-200 bg-white p-1.5">
              {result.length === 0 ? (
                <span className="text-[11px] text-slate-400">
                  Traversal result appears here...
                </span>
              ) : (
                result.map((column, index) => (
                  <div
                    key={`col-${columnKeys[index] ?? index}-${index}`}
                    className="flex items-center gap-1.5 rounded border border-teal-100 bg-teal-50 px-1.5 py-1"
                  >
                    <span className="rounded-full bg-teal-700 px-2 py-0.5 text-[10px] font-black text-white">
                      hd {columnKeys[index] ?? "?"}
                    </span>
                    <span className="text-xs font-extrabold text-slate-800">[{column.join(", ")}]</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div
            className={`transition-all duration-300 rounded-lg border px-2 py-1.5 text-[11px] leading-snug ${
              currentStep >= totalSteps
                ? "border-emerald-200 bg-emerald-50 font-bold text-emerald-900"
                : "border-amber-200 bg-amber-50 text-amber-900"
            }`}
          >
            {currentStep >= totalSteps ? <><CheckCircle2 size={14} className="inline shrink-0 text-emerald-600" />{" "}</> : <><ArrowRight size={14} className="inline shrink-0 text-amber-500" />{" "}</>}
            <span className="font-bold">{completionMessage}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

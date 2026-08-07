import { CheckCircle2, ArrowRight } from "lucide-react";

interface ResultPanelProps {
  currentNode: number | null;
  currentPhase: string;
  result: number[];
  currentStep: number;
  totalSteps: number;
  currentOperation: string;
  currentLevel: number;
  capturedNode: number | null;
}

export function ResultPanel({
  currentNode,
  currentPhase,
  result,
  currentStep,
  totalSteps,
  currentOperation,
  currentLevel,
  capturedNode,
}: ResultPanelProps) {
  const completionMessage =
    currentStep >= totalSteps
      ? `Perfect! Traversal complete. Result: [${result.join(", ")}]`
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

          <div className="grid grid-cols-2 gap-1.5 rounded-lg border border-slate-200 bg-white p-1.5 text-[10px]">
            <div>
              <p className="font-bold uppercase tracking-[0.03em] text-slate-500">Level</p>
              <p className="mt-0.5 text-sm font-extrabold text-slate-800">{currentLevel}</p>
            </div>
            <div>
              <p className="font-bold uppercase tracking-[0.03em] text-slate-500">Captured</p>
              <p className="mt-0.5 text-sm font-extrabold text-emerald-700">
                {capturedNode === null ? "-" : capturedNode}
              </p>
            </div>
          </div>

          <div className="grid gap-1 rounded-lg min-h-0">
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
                    className="animate-badge-pop inline-flex items-center justify-center rounded-full bg-gradient-to-r from-teal-700 to-teal-400 px-2.5 py-1 text-xs font-extrabold text-white"
                  >
                    {value}
                  </span>
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



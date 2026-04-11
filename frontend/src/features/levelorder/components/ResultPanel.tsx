import type { ExecutionStep } from "../types";

interface ResultPanelProps {
  currentNode: number | null;
  currentLevel: number | null;
  currentWidth: number;
  maxWidth: number;
  currentPhase: string;
  result: number[][];
  currentStep: number;
  totalSteps: number;
  currentOperation: string;
  activeStep: ExecutionStep | undefined;
}

export function ResultPanel({
  currentNode,
  currentLevel,
  currentWidth,
  maxWidth,
  currentPhase,
  result,
  currentStep,
  totalSteps,
  currentOperation,
  activeStep,
}: ResultPanelProps) {
  const completionMessage =
    currentStep >= totalSteps
      ? "Perfect! Traversal complete. Level-order list is ready."
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
            <div className="rounded-lg border bg-gradient-to-br from-teal-700 to-teal-500 p-1.5 text-center text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.03em] text-teal-100">
                Current Node
              </p>
              <p className="mt-0.5 text-lg font-extrabold">{currentNode ?? "-"}</p>
            </div>
            <div className="rounded-lg border bg-gradient-to-br from-teal-700 to-teal-500 p-1.5 text-center text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.03em] text-teal-100">
                Current Width
              </p>
              <p className="mt-0.5 truncate text-lg font-extrabold">{currentWidth || 0}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <div className="rounded-lg border bg-gradient-to-br from-cyan-700 to-cyan-500 p-1.5 text-center text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.03em] text-cyan-100">
                Level
              </p>
              <p className="mt-0.5 text-lg font-extrabold">{currentLevel ?? "-"}</p>
            </div>
            <div className="rounded-lg border bg-gradient-to-br from-emerald-700 to-emerald-500 p-1.5 text-center text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.03em] text-emerald-100">
                Max Level Size
              </p>
              <p className="mt-0.5 truncate text-lg font-extrabold">{maxWidth}</p>
            </div>
          </div>

          <div className="grid gap-1 rounded-lg min-h-0">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.03em] text-slate-700">
              Level Order Result
            </p>
            <div className="flex min-h-[36px] flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-1.5">
              {result.length === 0 ? (
                <span className="text-[11px] text-slate-400">
                  Level arrays appear here...
                </span>
              ) : (
                result.map((value, index) => (
                  <span
                    key={`${value.join("-")}-${index}`}
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-teal-700 to-teal-400 px-2.5 py-1 text-xs font-extrabold text-white"
                  >
                    L{index}: [{value.join(", ")}]
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-[11px] text-slate-700">
            <span className="font-bold">Phase:</span> {currentPhase}
            {activeStep?.index !== undefined ? (
              <span className="ml-2 font-semibold">Index: {activeStep.index}</span>
            ) : null}
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

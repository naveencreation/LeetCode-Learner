import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";

interface ResultPanelProps {
  currentNode: number | null;
  currentPhase: string;
  result: number | null;
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
      ? result !== null
        ? `LCA found at node ${result}.`
        : "Traversal complete. LCA not found for current targets."
      : `Step ${currentStep + 1}: ${currentOperation}`;

  const statusBadgeClass =
    currentStep >= totalSteps
      ? result !== null
        ? "bg-gradient-to-r from-emerald-700 to-emerald-500 text-white"
        : "bg-gradient-to-r from-rose-700 to-rose-500 text-white"
      : "border border-slate-200 bg-white text-slate-500";

  const statusBadgeLabel =
    currentStep >= totalSteps
      ? result !== null
        ? "LCA Found"
        : "Not Found"
      : "Running";

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_minmax(0,1fr)] gap-1.5 p-2">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">
          LCA Output
        </h2>
      </div>

      <div className="ui-scrollbar min-h-0 overflow-y-auto pr-1">
        <div className="grid content-start gap-1.5">
          <div className="grid grid-cols-2 gap-1.5">
            <div className="rounded-lg border bg-gradient-to-br from-teal-700 to-teal-500 p-1.5 text-center text-white transition-all duration-200">
              <p className="text-[10px] font-bold uppercase tracking-[0.03em] text-teal-100">
                Current Node
              </p>
              <p className="mt-0.5 text-xl font-extrabold">{currentNode ?? "-"}</p>
            </div>
            <div className="rounded-lg border bg-gradient-to-br from-teal-700 to-teal-500 p-1.5 text-center text-white transition-all duration-200">
              <p className="text-[10px] font-bold uppercase tracking-[0.03em] text-teal-100">
                Phase
              </p>
              <p className="mt-0.5 truncate text-xl font-extrabold">{currentPhase}</p>
            </div>
          </div>

          <div className="grid gap-1 rounded-lg">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.03em] text-slate-700">
              Result Status
            </p>
            <div className="flex min-h-[36px] items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5">
              <span
                className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-[0.03em] ${statusBadgeClass}`}
              >
                {statusBadgeLabel}
              </span>
            </div>
          </div>

          <div
            className={`transition-all duration-300 rounded-lg border px-2 py-1.5 text-[11px] leading-snug ${
              currentStep >= totalSteps
                ? result !== null
                  ? "border-emerald-200 bg-emerald-50 font-bold text-emerald-900"
                  : "border-rose-200 bg-rose-50 font-bold text-rose-900"
                : "border-amber-200 bg-amber-50 text-amber-900"
            }`}
          >
            {currentStep >= totalSteps ? (result !== null ? <><CheckCircle2 size={14} className="inline shrink-0 text-emerald-600" />{" "}</> : <><XCircle size={14} className="inline shrink-0 text-rose-500" />{" "}</>) : <><ArrowRight size={14} className="inline shrink-0 text-amber-500" />{" "}</>}
            <span className="font-bold">{completionMessage}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

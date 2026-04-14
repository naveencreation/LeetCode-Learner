interface ResultPanelProps {
  inorder: number[];
  postorder: number[];
  createdOrder: number[];
  postorderPointer: number;
  currentRange: { left: number; right: number };
  inorderPivot: number | null;
  currentStep: number;
  totalSteps: number;
  currentOperation: string;
}

export function ResultPanel({
  inorder,
  postorder,
  createdOrder,
  postorderPointer,
  currentRange,
  inorderPivot,
  currentStep,
  totalSteps,
  currentOperation,
}: ResultPanelProps) {
  const completionMessage =
    currentStep >= totalSteps
      ? `Perfect! Construction complete. Root build order: [${createdOrder.join(", ")}]`
      : `Step ${currentStep + 1}: ${currentOperation}`;

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_minmax(0,1fr)] gap-1.5 p-2">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">
          Build Progress
        </h2>
      </div>

      <div className="ui-scrollbar min-h-0 overflow-y-auto pr-1">
        <div className="grid content-start gap-1.5">
          <div className="grid grid-cols-2 gap-1.5">
            <div className="rounded-lg border bg-gradient-to-br from-teal-700 to-teal-500 p-1.5 text-center text-white transition-all duration-200">
              <p className="text-[10px] font-bold uppercase tracking-[0.03em] text-teal-100">
                Post Ptr
              </p>
              <p className="mt-0.5 text-xl font-extrabold">{postorderPointer}</p>
            </div>
            <div className="rounded-lg border bg-gradient-to-br from-teal-700 to-teal-500 p-1.5 text-center text-white transition-all duration-200">
              <p className="text-[10px] font-bold uppercase tracking-[0.03em] text-teal-100">
                Inorder Pivot
              </p>
              <p className="mt-0.5 truncate text-xl font-extrabold">{inorderPivot ?? "-"}</p>
            </div>
          </div>

          <div className="grid gap-1 rounded-lg">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.03em] text-slate-700">
              Traversal Inputs
            </p>
            <div className="rounded-lg border border-slate-200 bg-white p-1.5 text-[11px] text-slate-700">
              <p>Inorder: [{inorder.join(", ")}]</p>
              <p>Postorder: [{postorder.join(", ")}]</p>
              <p>Range: [{currentRange.left}..{currentRange.right}]</p>
            </div>
          </div>

          <div className="grid gap-1 rounded-lg">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.03em] text-slate-700">
              Created Order
            </p>
            <div className="flex min-h-[36px] flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-1.5">
              {createdOrder.length === 0 ? (
                <span className="text-[11px] text-slate-400">
                  Created nodes appear here...
                </span>
              ) : (
                createdOrder.map((value, index) => (
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
            {currentStep >= totalSteps ? "✅ " : "👉 "}
            <span className="font-bold">{completionMessage}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

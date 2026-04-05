interface ResultPanelProps {
  currentNode: number | null;
  currentPhase: string;
  preResult: number[];
  inResult: number[];
  postResult: number[];
  currentStep: number;
  totalSteps: number;
  currentOperation: string;
}

export function ResultPanel({
  currentNode,
  currentPhase,
  preResult,
  inResult,
  postResult,
  currentStep,
  totalSteps,
  currentOperation,
}: ResultPanelProps) {
  const allDone = currentStep >= totalSteps;
  const isPrePhase = currentPhase === "Preorder";
  const isInPhase = currentPhase === "Inorder";
  const isPostPhase = currentPhase === "Postorder";

  const completionMessage =
    allDone
      ? `Traversal complete. Pre=[${preResult.join(", ")}], In=[${inResult.join(", ")}], Post=[${postResult.join(", ")}].`
      : `Step ${currentStep + 1}: ${currentOperation}`;

  return (
    <section className="traversal-panel ui-scrollbar grid h-full min-h-0 overflow-y-auto grid-rows-[auto_auto_auto_auto] content-start gap-1.5 p-2">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">
          Traversal Progress (3 Outputs)
        </h2>
        <div className="flex items-center gap-1">
          <span className={`rounded-full border px-1.5 py-0.5 text-[9px] font-black uppercase tracking-[0.04em] ${
            isPrePhase ? "border-cyan-200 bg-cyan-50 text-cyan-800" : "border-slate-200 bg-white text-slate-500"
          }`}>
            PRE
          </span>
          <span className={`rounded-full border px-1.5 py-0.5 text-[9px] font-black uppercase tracking-[0.04em] ${
            isInPhase ? "border-violet-200 bg-violet-50 text-violet-800" : "border-slate-200 bg-white text-slate-500"
          }`}>
            IN
          </span>
          <span className={`rounded-full border px-1.5 py-0.5 text-[9px] font-black uppercase tracking-[0.04em] ${
            isPostPhase ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-500"
          }`}>
            POST
          </span>
        </div>
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

      <div className="grid gap-1">
        <TraversalArrayRow label="Pre" values={preResult} tone="from-teal-700 to-teal-400" emphasis={isPrePhase} />
        <TraversalArrayRow label="In" values={inResult} tone="from-cyan-700 to-cyan-400" emphasis={isInPhase} />
        <TraversalArrayRow label="Post" values={postResult} tone="from-violet-700 to-violet-400" emphasis={isPostPhase} />
      </div>

      <div
        className={`rounded-lg border px-2 py-1.5 text-[11px] leading-snug ${
          allDone
            ? "border-emerald-200 bg-emerald-50 font-bold text-emerald-900"
            : "border-amber-200 bg-amber-50 text-amber-900"
        }`}
      >
        {allDone ? "✅ " : "👉 "}
        <span className="font-bold">{completionMessage}</span>
      </div>
    </section>
  );
}

function TraversalArrayRow({
  label,
  values,
  tone,
  emphasis,
}: {
  label: string;
  values: number[];
  tone: string;
  emphasis: boolean;
}) {
  return (
    <div className={`grid gap-1 rounded-lg border p-1 ${emphasis ? "border-teal-200 bg-teal-50/50" : "border-transparent"}`}>
      <p className="text-[11px] font-extrabold uppercase tracking-[0.03em] text-slate-700">{label} Array ({values.length})</p>
      <div className="flex min-h-[34px] flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-1.5">
        {values.length === 0 ? (
          <span className="text-[11px] text-slate-400">No values yet...</span>
        ) : (
          values.map((value, index) => (
            <span
              key={`${label}-${value}-${index}`}
              className={`inline-flex items-center justify-center rounded-full bg-gradient-to-r ${tone} px-2.5 py-1 text-xs font-extrabold text-white ${
                index === values.length - 1 ? "ring-1 ring-slate-300 ring-offset-1" : ""
              }`}
            >
              {value}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

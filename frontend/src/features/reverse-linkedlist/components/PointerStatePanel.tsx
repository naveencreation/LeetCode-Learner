import type { ExecutionStep } from "../types";

interface PointerStatePanelProps {
  activeStep: ExecutionStep | undefined;
  currentStep: number;
}

const pointerConfig = [
  { key: "prev" as const, label: "prev", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" },
  { key: "curr" as const, label: "curr", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  { key: "nextSaved" as const, label: "next_node", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
];

export function PointerStatePanel({ activeStep, currentStep }: PointerStatePanelProps) {
  const pointers = activeStep?.pointers ?? { prev: null, curr: null, nextSaved: null };

  return (
    <div className="traversal-panel flex h-full flex-col overflow-hidden">
      <div className="traversal-panel-header px-3 py-2">
        <h2 className="traversal-panel-title">Pointer State</h2>
      </div>

      <div className="ui-scrollbar min-h-0 flex-1 overflow-y-auto px-3 py-2">
        {currentStep === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-center text-[12px] font-medium text-slate-400">
              Pointers are empty. Click Next to begin!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {pointerConfig.map((ptr) => {
              const val = pointers[ptr.key];
              return (
                <div
                  key={ptr.key}
                  className={`flex items-center justify-between rounded-xl border ${ptr.border} ${ptr.bg} px-3 py-2.5`}
                >
                  <span className={`text-[13px] font-extrabold ${ptr.color}`}>
                    {ptr.label}
                  </span>
                  <span className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-[14px] font-extrabold tabular-nums text-slate-800">
                    {val !== null && val !== undefined ? val : "None"}
                  </span>
                </div>
              );
            })}

            {activeStep && (
              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Current Action
                </p>
                <p className="mt-1 text-[12px] font-semibold text-slate-700">
                  {activeStep.operation}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

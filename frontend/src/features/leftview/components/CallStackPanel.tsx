interface CallStackPanelProps {
  queueBefore: number[];
  queueAfter: number[];
  currentLevel: number;
  indexInLevel: number;
  dequeuedNode: number | null;
  enqueuedNodes: number[];
}

function QueueTrack({
  values,
  enqueuedNodes,
}: {
  values: number[];
  enqueuedNodes: number[];
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.04em] text-slate-500">Queue Diagram</p>
      <div className="overflow-x-auto pb-1">
        <div className="inline-flex min-h-[66px] min-w-full items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2">
          <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.03em] text-amber-700">
            Front
          </span>

          {values.length > 0 ? (
            values.map((value, index) => {
              const isFront = index === 0;
              const isRear = index === values.length - 1;
              const isEnqueued = enqueuedNodes.includes(value);

              return (
                <div key={`queue-node-${value}-${index}`} className="inline-flex items-center gap-1">
                  <div className="relative">
                    {isRear ? (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] font-extrabold uppercase tracking-[0.03em] text-sky-600">
                        Rear
                      </span>
                    ) : null}
                    <span
                      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-1 text-[12px] font-extrabold ${
                        isEnqueued
                          ? "queue-node-in border-emerald-200 bg-emerald-50 text-emerald-700"
                          : isFront
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-slate-200 bg-white text-slate-700"
                      }`}
                    >
                      {value}
                    </span>
                  </div>
                  {index < values.length - 1 ? <span className="text-slate-300">{"->"}</span> : null}
                </div>
              );
            })
          ) : (
            <span className="text-[11px] font-semibold text-slate-400">empty</span>
          )}

          <span className="rounded-full bg-sky-100 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.03em] text-sky-700">
            Exit
          </span>
        </div>
      </div>
    </div>
  );
}

function TransitionSummary({
  queueBefore,
  queueAfter,
  dequeuedNode,
  enqueuedNodes,
}: {
  queueBefore: number[];
  queueAfter: number[];
  dequeuedNode: number | null;
  enqueuedNodes: number[];
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-1.5">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.04em] text-slate-500">Step Transition</p>
      <div className="grid grid-cols-2 gap-1.5 text-[10px] font-semibold text-slate-700">
        <span className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-1">Before: {queueBefore.length}</span>
        <span className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-1">After: {queueAfter.length}</span>
      </div>

      <div className="mt-1.5 flex flex-wrap gap-1 text-[10px] font-semibold">
        {dequeuedNode !== null ? (
          <span className="queue-chip-out rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-amber-700">
            OUT {dequeuedNode}
          </span>
        ) : (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-slate-600">OUT none</span>
        )}

        {enqueuedNodes.length > 0 ? (
          <span className="queue-chip-in rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-emerald-700">
            IN {enqueuedNodes.join(", ")}
          </span>
        ) : (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-slate-600">IN none</span>
        )}
      </div>
    </div>
  );
}

export function CallStackPanel({
  queueBefore,
  queueAfter,
  currentLevel,
  indexInLevel,
  dequeuedNode,
  enqueuedNodes,
}: CallStackPanelProps) {
  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_1fr] gap-1.5 p-2">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">
          Queue State
        </h2>
        <span className="rounded-full bg-gradient-to-r from-amber-500 to-amber-300 px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.04em] text-white shadow-sm">
          Live
        </span>
      </div>

      <div className="min-h-0 grid grid-rows-[auto_minmax(0,1fr)_auto] gap-1.5 rounded-[10px] border border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 p-1.5">
        <div className="grid grid-cols-2 gap-1.5 rounded-lg border border-slate-200 bg-white p-1.5 text-[10px] font-extrabold uppercase tracking-[0.04em] text-slate-600">
          <span>Level {currentLevel}</span>
          <span className="text-right">Index {indexInLevel}</span>
        </div>

        <QueueTrack values={queueAfter} enqueuedNodes={enqueuedNodes} />
        <TransitionSummary
          queueBefore={queueBefore}
          queueAfter={queueAfter}
          dequeuedNode={dequeuedNode}
          enqueuedNodes={enqueuedNodes}
        />
      </div>

      <style jsx>{`
        @keyframes queueNodeIn {
          0% {
            opacity: 0;
            transform: translateX(8px) scale(0.92);
          }
          70% {
            opacity: 1;
            transform: translateX(0) scale(1.04);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes queueChipIn {
          0% {
            opacity: 0;
            transform: translateY(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes queueChipOut {
          0% {
            opacity: 0;
            transform: translateY(-4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .queue-node-in {
          animation: queueNodeIn 320ms cubic-bezier(0.2, 0.9, 0.2, 1);
        }

        .queue-chip-in {
          animation: queueChipIn 240ms ease-out;
        }

        .queue-chip-out {
          animation: queueChipOut 240ms ease-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .queue-node-in,
          .queue-chip-in,
          .queue-chip-out {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}



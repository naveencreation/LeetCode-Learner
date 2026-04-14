import { LinkedListSVG } from "@/features/shared/components/LinkedListSVG";
import type { LinkedListNodeState } from "@/features/shared/linked-list-types";
import type { ExecutionStep } from "../types";

interface LinkedListPanelProps {
  originalValues: number[];
  nodeStates: Record<number, LinkedListNodeState>;
  activeStep: ExecutionStep | undefined;
  currentOperation: string;
  onOpenListSetup: () => void;
}

export function LinkedListPanel({
  originalValues,
  nodeStates,
  activeStep,
  currentOperation,
  onOpenListSetup,
}: LinkedListPanelProps) {
  const links = activeStep?.links ?? Object.fromEntries(
    originalValues.map((v, i) => [v, originalValues[i + 1] ?? null]),
  );
  const pointers = activeStep?.pointers ?? { prev: null, curr: null, nextSaved: null };

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_1fr] gap-2 p-2.5">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">Linked List</h2>
        <div className="flex items-center gap-2">
          <span className="rounded-md border border-teal-200 bg-teal-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-teal-700">
            {currentOperation}
          </span>
          <button
            type="button"
            onClick={onOpenListSetup}
            className="traversal-pill"
          >
            Select List
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[10px] border border-slate-200 bg-gradient-to-b from-[#f8faff] to-[#f0f4fb] p-3">
        <LinkedListSVG
          values={originalValues}
          nodeStates={nodeStates}
          links={links}
          pointers={pointers}
        />
      </div>
    </section>
  );
}

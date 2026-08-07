import type { ExecutionStep } from "../types";

interface ResultPanelProps {
  isPalindrome: boolean;
  currentPhase: string;
  currentStep: number;
  totalSteps: number;
  currentOperation: string;
  activeStep: ExecutionStep | undefined;
}

export function ResultPanel({
  isPalindrome,
  currentPhase,
  currentStep,
  totalSteps,
}: ResultPanelProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_1fr] gap-2 p-2.5">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">Progress</h2>
      </div>

      <div className="flex flex-col gap-2">
        <div className="relative h-2 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-sky-500 to-sky-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {currentPhase === "Result" ? (
          <div className={`rounded-[10px] border p-3 ${isPalindrome ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
            <p className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${isPalindrome ? "text-emerald-600" : "text-rose-600"}`}>
              {isPalindrome ? "Palindrome" : "Not a Palindrome"}
            </p>
            <p className={`text-sm font-semibold ${isPalindrome ? "text-emerald-800" : "text-rose-800"}`}>
              {isPalindrome ? "Yes, the linked list reads the same forwards and backwards." : "The linked list does not read the same forwards and backwards."}
            </p>
          </div>
        ) : (
          <div className="rounded-[10px] border border-slate-200 bg-white p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1">
              Processing
            </p>
            <p className="text-xs text-slate-600">
              Checking if the linked list is a palindrome...
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

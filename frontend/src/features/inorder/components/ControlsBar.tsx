import { Button } from "@/components/ui/button";

interface ControlsBarProps {
  isAtStart: boolean;
  isAtEnd: boolean;
  nextStep: () => void;
  previousStep: () => void;
  resetTraversal: () => void;
}

export function ControlsBar({
  isAtStart,
  isAtEnd,
  nextStep,
  previousStep,
  resetTraversal,
}: ControlsBarProps) {
  return (
    <div className="w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 py-2">
      <div className="flex w-full items-center justify-center gap-2">
        <Button
          variant="outline"
          className="h-8 min-w-[116px] flex-1 rounded-lg border-0 bg-slate-200 px-2.5 text-xs font-extrabold tracking-[0.01em] text-slate-900 hover:bg-slate-300"
          onClick={previousStep}
          disabled={isAtStart}
        >
          <span aria-hidden="true">⬅</span>
          <span>Previous</span>
        </Button>
        <Button
          className="h-8 min-w-[116px] flex-1 rounded-lg bg-gradient-to-r from-teal-700 to-teal-400 px-2.5 text-xs font-extrabold tracking-[0.01em] text-white hover:from-teal-700 hover:to-teal-500"
          onClick={nextStep}
          disabled={isAtEnd}
        >
          <span>Next Step</span>
          <span aria-hidden="true">➡</span>
        </Button>
        <Button
          variant="destructive"
          className="h-8 min-w-[116px] flex-1 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 px-2.5 text-xs font-extrabold tracking-[0.01em] text-white hover:from-red-600 hover:to-orange-600"
          onClick={resetTraversal}
        >
          <span aria-hidden="true">↻</span>
          <span>Reset</span>
        </Button>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";

interface ControlsBarProps {
  isAtStart: boolean;
  isAtEnd: boolean;
  controlMode: "manual" | "auto";
  setControlMode: (mode: "manual" | "auto") => void;
  isPlaying: boolean;
  autoPlaySpeedMs: number;
  setAutoPlaySpeedMs: (speedMs: number) => void;
  playTraversal: () => void;
  pauseTraversal: () => void;
  nextStep: () => void;
  previousStep: () => void;
  resetTraversal: () => void;
}

export function ControlsBar({
  isAtStart,
  isAtEnd,
  controlMode,
  setControlMode,
  isPlaying,
  autoPlaySpeedMs,
  setAutoPlaySpeedMs,
  playTraversal,
  pauseTraversal,
  nextStep,
  previousStep,
  resetTraversal,
}: ControlsBarProps) {
  return (
    <div className="w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 py-2">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-0.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
          <button
            type="button"
            onClick={() => setControlMode("manual")}
            className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.04em] transition ${
              controlMode === "manual"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Manual
          </button>
          <button
            type="button"
            onClick={() => setControlMode("auto")}
            className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.04em] transition ${
              controlMode === "auto"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Auto
          </button>
        </div>

        {controlMode === "auto" ? (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.04em] text-slate-500">Speed</span>
            <div className="relative">
              <select
                value={String(autoPlaySpeedMs)}
                onChange={(event) => setAutoPlaySpeedMs(Number(event.target.value))}
                className="h-8 min-w-[78px] appearance-none rounded-full border border-slate-300 bg-white pl-3 pr-8 text-xs font-extrabold text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition focus:border-teal-500"
              >
                <option value="1400">0.5x</option>
                <option value="900">1x</option>
                <option value="650">1.5x</option>
                <option value="450">2x</option>
              </select>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-500"
              >
                ▾
              </span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex w-full items-center justify-center gap-2">
        <Button
          variant="outline"
          className="group h-8 min-w-[116px] flex-1 rounded-lg border-0 bg-slate-200 px-2.5 text-xs font-extrabold tracking-[0.01em] text-slate-900 hover:bg-slate-300"
          onClick={previousStep}
          disabled={isAtStart || controlMode === "auto"}
        >
          <ChevronLeft
            size={14}
            strokeWidth={2}
            className="transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          <span>Previous</span>
        </Button>
        {controlMode === "manual" ? (
          <Button
            className="group h-8 min-w-[116px] flex-1 rounded-lg bg-gradient-to-r from-teal-700 to-teal-400 px-2.5 text-xs font-extrabold tracking-[0.01em] text-white hover:from-teal-700 hover:to-teal-500"
            onClick={nextStep}
            disabled={isAtEnd}
          >
            <span>Next Step</span>
            <ChevronRight
              size={14}
              strokeWidth={2}
              className="transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Button>
        ) : (
          <Button
            className="h-8 min-w-[116px] flex-1 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-500 px-2.5 text-xs font-extrabold tracking-[0.01em] text-white hover:from-cyan-700 hover:to-teal-600"
            onClick={isPlaying ? pauseTraversal : playTraversal}
            disabled={isAtEnd}
          >
            <span>{isPlaying ? "Pause" : "Play"}</span>
            {isPlaying ? (
              <Pause size={14} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Play size={14} strokeWidth={2} aria-hidden="true" />
            )}
          </Button>
        )}
        <Button
          variant="destructive"
          className="h-8 min-w-[116px] flex-1 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 px-2.5 text-xs font-extrabold tracking-[0.01em] text-white hover:from-red-600 hover:to-orange-600"
          onClick={resetTraversal}
        >
          <RotateCcw size={14} strokeWidth={2} aria-hidden="true" />
          <span>Reset</span>
        </Button>
      </div>
    </div>
  );
}

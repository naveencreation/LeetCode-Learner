"use client";

import { useState, useEffect, useCallback } from "react";

interface Step {
  line: number;
  slow: number;
  fast: number;
  both: boolean;
  condFast: boolean;
  condNext: boolean;
  badges: { slow: string; fast: string };
  done?: boolean;
}

const steps: Step[] = [
  { line: 3, slow: 0, fast: 0, both: true, condFast: true, condNext: true, badges: { slow: "Node(1)", fast: "Node(1)" } },
  { line: 4, slow: 1, fast: 2, both: false, condFast: true, condNext: true, badges: { slow: "Node(2)", fast: "Node(3)" } },
  { line: 3, slow: 1, fast: 2, both: false, condFast: true, condNext: true, badges: { slow: "Node(2)", fast: "Node(3)" } },
  { line: 4, slow: 2, fast: 4, both: false, condFast: true, condNext: true, badges: { slow: "Node(3)", fast: "Node(5)" } },
  { line: 5, slow: 2, fast: 4, both: false, condFast: true, condNext: false, badges: { slow: "Node(3)", fast: "Node(5)" } },
  { line: 3, slow: 2, fast: 4, both: false, condFast: true, condNext: false, badges: { slow: "Node(3)", fast: "Node(5)" } },
  { line: 6, slow: 2, fast: 4, both: false, condFast: false, condNext: false, done: true, badges: { slow: "Node(3)", fast: "null" } },
];

const codeLines = [
  "def find_middle(head):",
  "  # Initialize both pointers at head",
  "  slow = head",
  "  fast = head",
  "",
  "  # Move until fast reaches end",
  "  while fast and fast.next:",
  "    slow = slow.next      # Move 1 step",
  "    fast = fast.next.next # Move 2 steps",
  "",
  "  # slow is now at middle",
  "  return slow",
];

export function TortoiseHareVis() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const totalSteps = steps.length;
  const step = steps[currentStep];

  const updateVis = useCallback(() => {
    // Animation is handled by React state
  }, []);

  const stepNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const stepPrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const resetVis = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    updateVis();
  }, [currentStep, updateVis]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        if (currentStep < totalSteps - 1) {
          setCurrentStep((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, totalSteps]);

  const togglePlay = () => setIsPlaying((prev) => !prev);

  // Node values
  const nodes = [1, 2, 3, 4, 5];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8">
      {/* Code Panel */}
      <div className="rounded-2xl border border-[var(--l-border)] bg-[var(--l-code-bg)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--l-border)] bg-[var(--l-surface)]">
          <span className="font-[var(--font-jetbrains)] text-sm font-semibold text-[var(--l-text)]">
            find_middle.py
          </span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[var(--l-error)]" />
            <span className="w-3 h-3 rounded-full bg-[var(--l-warning)]" />
            <span className="w-3 h-3 rounded-full bg-[var(--l-success)]" />
          </div>
        </div>
        <div className="p-5 font-[var(--font-jetbrains)] text-sm leading-relaxed">
          {codeLines.map((line, i) => (
            <div
              key={i}
              className={`flex items-start gap-4 py-1 px-2 rounded ${
                i + 1 === step.line
                  ? "bg-[oklch(65%_0.22_280_/_0.15)] border-l-2 border-[var(--l-primary)]"
                  : ""
              }`}
            >
              <span className="text-[var(--l-muted)] w-6 text-right select-none">
                {i + 1}
              </span>
              <span className={i + 1 === step.line ? "text-[var(--l-text)]" : "text-[var(--l-text-2)]"}>
                {line || "\u00A0"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Visualization Panel */}
      <div className="rounded-2xl border border-[var(--l-border)] bg-gradient-to-br from-[var(--l-surface)] to-[var(--l-surface-2)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--l-border)]">
          <span className="font-[var(--font-space-grotesk)] text-sm font-semibold text-[var(--l-text)]">
            Tortoise & Hare Visualization
          </span>
          <div className="flex items-center gap-3">
            {/* Slow Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[oklch(78%_0.18_85_/_0.15)] border border-[oklch(78%_0.18_85_/_0.3)]">
              <span className="w-2 h-2 rounded-full bg-[oklch(85%_0.18_85)]" />
              <span className="font-[var(--font-jetbrains)] text-xs text-[var(--l-text)]">
                slow = {step.badges.slow}
              </span>
            </div>
            {/* Fast Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[oklch(65%_0.22_280_/_0.15)] border border-[oklch(65%_0.22_280_/_0.3)]">
              <span className="w-2 h-2 rounded-full bg-[var(--l-primary)]" />
              <span className="font-[var(--font-jetbrains)] text-xs text-[var(--l-text)]">
                fast = {step.badges.fast}
              </span>
            </div>
          </div>
        </div>

        {/* Linked List Visualization */}
        <div className="p-8">
          <div className="flex items-center justify-center gap-4">
            {nodes.map((value, i) => {
              const isSlow = step.slow === i;
              const isFast = step.fast === i;
              const isBoth = step.both && isSlow;

              return (
                <div key={i} className="relative">
                  {/* Pointer Labels */}
                  {(isSlow || isFast) && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-1">
                      {isBoth ? (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[oklch(85%_0.18_85)] to-[var(--l-primary)] text-[var(--l-bg)]">
                          slow & fast
                        </span>
                      ) : (
                        <>
                          {isSlow && (
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[oklch(85%_0.18_85)] text-[var(--l-bg)]">
                              slow
                            </span>
                          )}
                          {isFast && (
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[var(--l-primary)] text-[var(--l-bg)]">
                              fast
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* Node */}
                  <div
                    className={`w-16 h-16 rounded-xl flex items-center justify-center font-[var(--font-jetbrains)] text-lg font-bold transition-all duration-300 ${
                      isBoth
                        ? "bg-gradient-to-br from-[oklch(85%_0.18_85)] to-[var(--l-primary)] text-[var(--l-bg)] shadow-[0_0_20px_oklch(65%_0.22_280_/_0.5)]"
                        : isSlow
                        ? "bg-[oklch(85%_0.18_85_/_0.2)] border-2 border-[oklch(85%_0.18_85)] text-[var(--l-text)]"
                        : isFast
                        ? "bg-[oklch(65%_0.22_280_/_0.2)] border-2 border-[var(--l-primary)] text-[var(--l-text)]"
                        : "bg-[var(--l-surface-2)] border border-[var(--l-border)] text-[var(--l-text-2)]"
                    }`}
                  >
                    {value}
                  </div>

                  {/* Next Arrow */}
                  {i < nodes.length - 1 && (
                    <div className="absolute top-1/2 -right-4 -translate-y-1/2">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--l-border-2)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="0" y1="12" x2="20" y2="12" />
                        <polyline points="14 6 20 12 14 18" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Null Terminator */}
            <div className="w-16 h-10 rounded-lg flex items-center justify-center font-[var(--font-jetbrains)] text-sm text-[var(--l-muted)] border border-dashed border-[var(--l-border-2)]">
              null
            </div>
          </div>

          {/* Conditions */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--l-surface-2)] border border-[var(--l-border)]">
              <span className="text-sm text-[var(--l-text-2)]">fast exists:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  step.condFast
                    ? "bg-[var(--l-success)] text-[var(--l-bg)]"
                    : "bg-[var(--l-error)] text-[var(--l-bg)]"
                }`}
              >
                {step.condFast ? "TRUE" : "FALSE"}
              </span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--l-surface-2)] border border-[var(--l-border)]">
              <span className="text-sm text-[var(--l-text-2)]">fast.next exists:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  step.condNext
                    ? "bg-[var(--l-success)] text-[var(--l-bg)]"
                    : "bg-[var(--l-error)] text-[var(--l-bg)]"
                }`}
              >
                {step.condNext ? "TRUE" : "FALSE"}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="px-5 py-4 border-t border-[var(--l-border)] bg-[var(--l-surface)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={stepPrev}
                disabled={currentStep === 0}
                className="p-2 rounded-lg bg-[var(--l-surface-2)] text-[var(--l-text)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--l-surface-3)] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={togglePlay}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--l-primary)] text-[var(--l-bg)] font-semibold hover:bg-[var(--l-primary-bright)] transition-colors"
              >
                {isPlaying ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                    Pause
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    Play
                  </>
                )}
              </button>
              <button
                onClick={stepNext}
                disabled={currentStep === totalSteps - 1}
                className="p-2 rounded-lg bg-[var(--l-surface-2)] text-[var(--l-text)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--l-surface-3)] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
              <button
                onClick={resetVis}
                className="p-2 rounded-lg bg-[var(--l-surface-2)] text-[var(--l-text)] hover:bg-[var(--l-surface-3)] transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
              </button>
            </div>

            {/* Step Dots */}
            <div className="flex items-center gap-2">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentStep
                      ? "bg-[var(--l-primary)] w-6"
                      : i < currentStep
                      ? "bg-[var(--l-primary-soft)]"
                      : "bg-[var(--l-border-2)]"
                  }`}
                />
              ))}
            </div>

            <span className="font-[var(--font-jetbrains)] text-sm text-[var(--l-muted)]">
              Step {currentStep + 1} / {totalSteps}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

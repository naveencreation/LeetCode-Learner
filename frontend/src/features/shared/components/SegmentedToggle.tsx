"use client";

import { useRef, useState, useLayoutEffect, useCallback } from "react";

interface SegmentedToggleOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedToggleProps<T extends string> {
  options: readonly SegmentedToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  activeClassName?: string;
  inactiveClassName?: string;
  containerClassName?: string;
}

export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  activeClassName = "bg-slate-800 text-white shadow-sm",
  inactiveClassName = "text-slate-600",
  containerClassName = "border-slate-300 bg-slate-100",
}: SegmentedToggleProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<T, HTMLButtonElement>>(new Map());

  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const updateIndicator = useCallback(() => {
    const btn = buttonRefs.current.get(value);
    const container = containerRef.current;
    if (!btn || !container) return;

    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    setIndicator({
      left: btnRect.left - containerRect.left,
      width: btnRect.width,
    });
  }, [value]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center rounded-full border p-0.5 ${containerClassName}`}
    >
      <div
        className={`absolute top-0.5 h-[calc(100%-4px)] rounded-full transition-all duration-200 ease-out ${activeClassName}`}
        style={{ left: indicator.left, width: indicator.width }}
      />

      {options.map((option) => (
        <button
          key={option.value}
          ref={(el) => {
            if (el) buttonRefs.current.set(option.value, el);
          }}
          type="button"
          onClick={() => onChange(option.value)}
          className={`relative z-[1] rounded-full px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.04em] transition-colors duration-200 ${
            value === option.value ? "text-white" : inactiveClassName
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
